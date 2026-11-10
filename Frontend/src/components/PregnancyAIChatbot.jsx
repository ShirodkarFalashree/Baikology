
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Baby,
  Heart,
} from 'lucide-react';

import {
  sendPregnancyChatMessage,
  getPregnancyChatMessages,
  clearPregnancyChatMessages,
} from '../api/auth';

import MarkdownMessage from './MarkdownMessage';

const QUICK_PROMPTS = [
  'What happens during my current pregnancy week?',
  'What foods should I avoid during pregnancy?',
  'How can I manage pregnancy-related nausea?',
  'What should I expect at my next prenatal appointment?',
];

const createWelcomeMessage = () => ({
  id: 'pregnancy-welcome',
  sender: 'ai',
  text: `Hello! 🌸 Welcome to your **Baikology Pregnancy AI Guide**.

I'm here to help you understand your pregnancy journey with supportive, evidence-informed educational guidance.

You can ask me about:

- **Baby development** — understand pregnancy weeks and trimesters.
- **Pregnancy symptoms** — learn about common changes and general self-care.
- **Nutrition** — food safety and healthy eating during pregnancy.
- **Prenatal care** — appointments, screenings and preparation.
- **Maternal wellness** — sleep, emotional wellbeing and gentle activity.
- **Birth & postpartum** — prepare for childbirth and life after delivery.

Your questions are welcome, and there's no judgment here.

**What would you like to know today?**`,
  timestamp: new Date().toISOString(),
});

export default function PregnancyAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('baikology_token');

  // Load pregnancy-specific conversation history
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      setIsLoadingHistory(true);

      if (!token) {
        if (isMounted) {
          setMessages([createWelcomeMessage()]);
          setIsLoadingHistory(false);
        }
        return;
      }

      try {
        const response = await getPregnancyChatMessages(token);

        if (!isMounted) return;

        if (
          response.success &&
          Array.isArray(response.data?.pregnancyChatMessages) &&
          response.data.pregnancyChatMessages.length > 0
        ) {
          setMessages(response.data.pregnancyChatMessages);
        } else {
          setMessages([createWelcomeMessage()]);
        }
      } catch (error) {
        console.error('Pregnancy chat history error:', error);

        if (isMounted) {
          setMessages([createWelcomeMessage()]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Automatically scroll to the latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping, isOpen]);

  // Send a message to Pregnancy AI
  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();

    if (!text || isTyping) return;

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          id: `auth-error-${Date.now()}`,
          sender: 'ai',
          text: 'Please log in to use your Pregnancy AI Guide and save your conversation.',
          timestamp: new Date().toISOString(),
        },
      ]);
      return;
    }

    const userMessage = {
      id: `pregnancy-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await sendPregnancyChatMessage(
        { text },
        token
      );

      if (!response.success) {
        throw new Error(
          response.message || 'Unable to connect to Pregnancy AI.'
        );
      }

      const savedMessages =
        response.data?.pregnancyChatMessages;

      if (Array.isArray(savedMessages)) {
        setMessages(savedMessages);
      } else if (response.data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `pregnancy-ai-${Date.now()}`,
            sender: 'ai',
            text: response.data.reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error('Pregnancy AI returned an unexpected response.');
      }
    } catch (error) {
      console.error('Pregnancy AI error:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: `pregnancy-error-${Date.now()}`,
          sender: 'ai',
          text: `I'm temporarily unable to connect to the Pregnancy AI Guide.

Please try again shortly. If you're experiencing an urgent or concerning pregnancy symptom, contact your healthcare provider or seek medical care rather than waiting for the chatbot.

**Connection detail:** ${error.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear the pregnancy conversation
  const handleClearChat = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear your Pregnancy AI conversation history?'
    );

    if (!confirmed) return;

    if (!token) {
      setMessages([createWelcomeMessage()]);
      return;
    }

    try {
      const response = await clearPregnancyChatMessages(token);

      if (response.success) {
        setMessages([createWelcomeMessage()]);
      } else {
        window.alert(
          response.message || 'Could not clear chat history.'
        );
      }
    } catch (error) {
      console.error('Could not clear pregnancy chat:', error);
      window.alert('Unable to clear chat history. Please try again.');
    }
  };

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open Pregnancy AI Guide"
          aria-label="Open Pregnancy AI Guide"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#756291] via-[#885A82] to-[#B26E8D] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
            <Baby className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#82E6A1] ring-2 ring-[#756291]" />
          </div>

          <div className="text-left">
            <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
              Pregnancy AI
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="text-[10px] text-white/85 font-medium">
              Your pregnancy companion
            </div>
          </div>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] sm:h-[640px] max-h-[88vh] bg-white rounded-[28px] shadow-2xl border border-[#E9DFFF] flex flex-col overflow-hidden animate-in zoom-in-90 fade-in duration-200"
          style={{
            boxShadow: '0 20px 50px rgba(64, 51, 68, 0.22)',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#756291] via-[#885A82] to-[#A36688] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Baby className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                  Pregnancy AI Guide
                  <Sparkles className="w-3 h-3" />
                </h3>
                <p className="text-[11px] text-white/80 font-medium">
                  Your pregnancy wellness companion
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                disabled={isTyping || isLoadingHistory}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-40 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                aria-label="Minimize chat"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FFFAF5]/40 text-xs">
            {isLoadingHistory && (
              <div className="text-center text-xs text-[#817583] py-4">
                Loading your pregnancy conversation...
              </div>
            )}

            {!isLoadingHistory &&
              messages.map((msg, index) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col ${
                      isUser ? 'items-end' : 'items-start'
                    } space-y-1.5`}
                  >
                    {isUser ? (
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-3 leading-relaxed whitespace-pre-line bg-[#756291] text-white shadow-sm font-medium">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="w-full max-w-[95%] rounded-2xl rounded-bl-sm p-4 bg-white text-[#403344] border border-[#E9DFFF] shadow-sm">
                        <MarkdownMessage content={msg.text} />
                      </div>
                    )}
                  </div>
                );
              })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#817583] bg-white border border-[#E9DFFF] px-3.5 py-3 rounded-2xl w-fit shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#756291] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#756291] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#756291] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium ml-1">
                  Pregnancy AI is thinking...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {!isLoadingHistory && (
            <div className="px-3 py-2 bg-white border-t border-[#F4EEF8] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold uppercase text-[#817583] whitespace-nowrap pl-1">
                Ask:
              </span>

              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-full bg-[#FAF5FF] hover:bg-[#F3EBF9] border border-[#E9DFFF] text-[11px] text-[#554070] font-medium whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Message input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E9DFFF] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Ask your pregnancy question..."
              maxLength={3000}
              disabled={isTyping || isLoadingHistory}
              className="flex-1 min-w-0 px-4 py-3 rounded-full bg-[#FFFAF5] border border-[#E9DFFF] text-xs text-[#403344] focus:outline-none focus:ring-2 focus:ring-[#756291] placeholder-[#A595A8] disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping || isLoadingHistory}
              aria-label="Send message"
              className="w-11 h-11 rounded-full bg-[#756291] hover:bg-[#5e4b78] disabled:bg-[#D5CCD9] text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Disclaimer */}
          <div className="px-3 py-2 bg-[#FFFAF5] border-t border-[#F4EEF8] text-[10px] text-[#817583] text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#756291] shrink-0" />
            <span>
              Educational guidance, not medical diagnosis. Seek medical
              care for urgent symptoms.
            </span>
          </div>
        </div>
      )}
    </>
  );
}
