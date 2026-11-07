import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Heart,
  Smile,
  RefreshCw,
  Trash2,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  generateMoodGreeting,
  generateMoodShiftMessage,
  generateCompanionReply,
} from '../utils/aiCompanionEngine';
import {
  getDiaryMessages,
  saveDiaryMessage,
  clearDiaryMessages,
  sendDiaryChatMessage,
} from '../api/auth';

export default function DearDiaryChatbot({
  userName = 'lovely',
  todayMood = null,
  previousMood = null,
  cycleAnalysis = {},
  onOpenMoodPicker,
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const token = localStorage.getItem('baikology_token');

  // Load initial diary messages from DB / localStorage
  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      // 1. Try local cache first for instant UI response
      const cached = localStorage.getItem('baikology_diary_messages');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch (e) {
          console.error('Failed to parse cached diary messages:', e);
        }
      }

      // 2. Fetch from database if user is logged in
      if (token) {
        try {
          const res = await getDiaryMessages(token);
          if (isMounted && res.success && Array.isArray(res.data?.diaryMessages)) {
            const dbMsgs = res.data.diaryMessages;
            if (dbMsgs.length > 0) {
              setMessages(dbMsgs);
              localStorage.setItem('baikology_diary_messages', JSON.stringify(dbMsgs));
              return;
            }
          }
        } catch (err) {
          console.error('Could not fetch diary from server:', err);
        }
      }

      // 3. Fallback: if no messages exist yet, seed initial greeting
      if (isMounted) {
        setMessages((prev) => {
          if (prev.length > 0) return prev;
          const initialGreeting = {
            id: 'init-greeting',
            sender: 'ai',
            text: generateMoodGreeting(userName, todayMood, cycleAnalysis),
            moodContext: todayMood?.label || 'Calm',
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem('baikology_diary_messages', JSON.stringify([initialGreeting]));
          return [initialGreeting];
        });
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [userName, token]);

  // Track mood transitions (e.g. from Happy -> Sad or Sad -> Happy)
  const lastAcknowledgedMoodRef = useRef(todayMood?.label);

  useEffect(() => {
    if (!todayMood?.label) return;

    // Check if mood changed from a previously recorded mood
    if (
      lastAcknowledgedMoodRef.current &&
      lastAcknowledgedMoodRef.current !== todayMood.label
    ) {
      const prevMoodObj = { label: lastAcknowledgedMoodRef.current };
      const shiftMessageText = generateMoodShiftMessage(
        userName,
        prevMoodObj,
        todayMood,
        cycleAnalysis
      );

      const shiftMsg = {
        id: 'shift-' + Date.now(),
        sender: 'ai',
        text: shiftMessageText,
        moodContext: todayMood.label,
        moodShift: `${lastAcknowledgedMoodRef.current}_to_${todayMood.label}`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [...prev, shiftMsg];
        localStorage.setItem('baikology_diary_messages', JSON.stringify(updated));
        return updated;
      });

      // Persist shift question to backend
      if (token) {
        saveDiaryMessage(shiftMsg, token).catch((e) =>
          console.error('Failed to save shift msg:', e)
        );
      }
    }

    lastAcknowledgedMoodRef.current = todayMood.label;
  }, [todayMood?.label, userName, cycleAnalysis, token]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      moodContext: todayMood?.label || 'Calm',
      timestamp: new Date().toISOString(),
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    localStorage.setItem('baikology_diary_messages', JSON.stringify(updatedMessages));
    setInputText('');
    setIsTyping(true);

    try {
      if (token) {
        // Send to backend which uses GEMINI_API_KEY with empathetic context
        const response = await sendDiaryChatMessage(
          {
            text,
            currentMood: todayMood,
            previousMood,
            cycleAnalysis,
          },
          token
        );

        if (response.success && response.data?.aiReply) {
          const aiMsg = response.data.aiMessage || {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: response.data.aiReply,
            moodContext: todayMood?.label || 'Calm',
            timestamp: new Date().toISOString(),
          };

          const allMsgs = response.data.diaryMessages || [...updatedMessages, aiMsg];
          setMessages(allMsgs);
          localStorage.setItem('baikology_diary_messages', JSON.stringify(allMsgs));
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend Gemini call note, applying local companion engine fallback:', err);
    }

    // Fallback: real-time compassionate engine with gentle pacing
    setTimeout(() => {
      const aiReplyText = generateCompanionReply(
        text,
        todayMood,
        previousMood,
        cycleAnalysis,
        userName,
        updatedMessages
      );

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiReplyText,
        moodContext: todayMood?.label || 'Calm',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => {
        const next = [...prev, aiMsg];
        localStorage.setItem('baikology_diary_messages', JSON.stringify(next));
        return next;
      });
      setIsTyping(false);

      if (token) {
        saveDiaryMessage(aiMsg, token).catch((e) =>
          console.error('Failed to save AI diary reply to DB:', e)
        );
      }
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Clear your Dear Diary chat history?')) {
      const freshGreeting = {
        id: 'init-' + Date.now(),
        sender: 'ai',
        text: `Starting a fresh page in your Dear Diary, ${userName || 'lovely'} 🌸. How are you feeling right in this moment?`,
        moodContext: todayMood?.label || 'Calm',
        timestamp: new Date().toISOString(),
      };
      setMessages([freshGreeting]);
      localStorage.setItem('baikology_diary_messages', JSON.stringify([freshGreeting]));

      if (token) {
        try {
          await clearDiaryMessages(token);
          await saveDiaryMessage(freshGreeting, token);
        } catch (err) {
          console.error('Failed to clear on server:', err);
        }
      }
    }
  };

  const quickPrompts = [
    { label: 'Girl, let me vent... 💬', prompt: 'Girl, I really need to vent about something...' },
    { label: 'Wait, something good happened! ✨', prompt: 'Wait, something actually amazing happened today!' },
    { label: 'Work was so frustrating 🙄', prompt: 'Work was so frustrating today, I cannot even...' },
    { label: 'Feeling quiet & low today 🥺', prompt: 'I am just feeling quiet and low today, honestly.' },
    { label: 'Need honest advice 🤍', prompt: 'Can I get your honest opinion on something?' },
  ];

  return (
    <div className="bg-white rounded-[32px] p-5 sm:p-6 border border-[#E9DFFF] shadow-xs flex flex-col h-[520px] transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E9DFFF]/70 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F9DDE5] via-[#E9DFFF] to-[#FFF0B8] flex items-center justify-center text-lg shadow-xs">
              🌸
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white ring-1 ring-emerald-300"
              title="Listening with care"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-[#403344] font-['Nunito',sans-serif]">
                Dear Diary AI
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#E9DFFF] to-[#FFF0B8] text-[#756291] border border-[#E9DFFF] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#756291]" />
                Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-[#817583]">
              Your AI best friend • Zero judgment, just real talk 💜
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {todayMood && (
            <div
              onClick={onOpenMoodPicker}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer hover:scale-105 transition-all shadow-2xs"
              style={{
                backgroundColor: todayMood.color || '#DDF3DE',
                borderColor: (todayMood.textColor || '#2C6336') + '33',
                color: todayMood.textColor || '#2C6336',
              }}
              title="Click to update your mood"
            >
              <span>{todayMood.emoji}</span>
              <span>{todayMood.label}</span>
            </div>
          )}

          <button
            onClick={handleClearChat}
            title="Start fresh page in diary"
            className="p-1.5 rounded-xl text-[#817583] hover:text-[#403344] hover:bg-[#FFFAF5] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3.5 space-y-3 pr-1 text-xs sm:text-sm">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex gap-2.5 items-end ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#E9DFFF] flex items-center justify-center text-sm shrink-0 shadow-2xs">
                  🌸
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[76%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-xs sm:text-[13px] ${
                  isUser
                    ? 'bg-[#756291] text-white rounded-br-xs shadow-xs font-medium'
                    : 'bg-[#FFFAF5] text-[#403344] border border-[#E9DFFF] rounded-bl-xs shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1 flex items-center gap-1 ${
                    isUser ? 'text-white/70 justify-end' : 'text-[#817583] justify-start'
                  }`}
                >
                  <Clock className="w-2.5 h-2.5" />
                  <span>
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 items-end justify-start animate-in fade-in">
            <div className="w-7 h-7 rounded-xl bg-[#E9DFFF] flex items-center justify-center text-sm shrink-0">
              🌸
            </div>
            <div className="bg-[#FFFAF5] border border-[#E9DFFF] rounded-2xl rounded-bl-xs px-3.5 py-2.5 text-xs text-[#756291] flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#756291] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#756291] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#756291] animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[11px] font-medium">Baikology is listening gently...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="pt-2 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(chip.prompt);
              inputRef.current?.focus();
            }}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFFAF5] hover:bg-[#E9DFFF] text-[#756291] border border-[#E9DFFF] whitespace-nowrap transition-all hover:scale-[1.02] shrink-0"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="pt-2 border-t border-[#E9DFFF]/70 shrink-0">
        <div className="flex items-center gap-2 bg-[#FFFAF5] border border-[#E9DFFF] rounded-2xl px-3 py-1.5 focus-within:border-[#756291] focus-within:ring-2 focus-within:ring-[#756291]/20 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Spill everything, I'm listening..."
            className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-[#403344] placeholder:text-[#817583]/70 border-none outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none py-1.5"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-xl bg-[#756291] hover:bg-[#5e4b78] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
            title="Send to your diary"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-[#817583] mt-1.5">
          🔒 Private to you • Saved securely to your account profile
        </p>
      </div>
    </div>
  );
}

