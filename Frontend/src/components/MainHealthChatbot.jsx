import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  BookOpen,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Heart,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import {
  sendHealthChatMessage,
  getHealthMessages,
  clearHealthMessages,
} from '../api/auth';
import { WELLNESS_ARTICLES, getArticleById } from '../data/wellnessArticles';
import MarkdownMessage from './MarkdownMessage';

export default function MainHealthChatbot({
  userName = 'friend',
  cyclePhase = '',
  onOpenArticle,
  onTopicsUpdated,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopics, setActiveTopics] = useState([]);
  const [recentTunedBanner, setRecentTunedBanner] = useState('');
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('baikology_token');

  // Load chat history & tuned topics
  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      // 1. Try local storage first for instant render
      const cached = localStorage.getItem('baikology_health_chat_messages');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0 && isMounted) {
            setMessages(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const cachedTopics = localStorage.getItem('baikology_tuned_topics');
      if (cachedTopics) {
        try {
          const parsedTopics = JSON.parse(cachedTopics);
          if (Array.isArray(parsedTopics) && isMounted) {
            setActiveTopics(parsedTopics);
            if (onTopicsUpdated) onTopicsUpdated(parsedTopics);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Fetch from backend if authenticated
      if (token) {
        try {
          const res = await getHealthMessages(token);
          if (res.success && isMounted) {
            if (res.data?.healthChatMessages && res.data.healthChatMessages.length > 0) {
              setMessages(res.data.healthChatMessages);
              localStorage.setItem(
                'baikology_health_chat_messages',
                JSON.stringify(res.data.healthChatMessages)
              );
            }
            if (res.data?.tunedTopics && res.data.tunedTopics.length > 0) {
              setActiveTopics(res.data.tunedTopics);
              localStorage.setItem(
                'baikology_tuned_topics',
                JSON.stringify(res.data.tunedTopics)
              );
              if (onTopicsUpdated) onTopicsUpdated(res.data.tunedTopics);
            }
          }
        } catch (err) {
          console.warn('Could not sync health messages from server:', err);
        }
      }

      // 3. If still empty, seed welcome message
      if (isMounted) {
        setMessages((prev) => {
          if (prev.length > 0) return prev;
          const welcome = {
            id: 'welcome-health-msg',
            sender: 'ai',
            text: `Hi ${userName || 'friend'} 🌸 I'm your Baikology Care Guide.

I'm here to provide honest, science-backed, and non-judgmental answers to any women's health question:
• **PCOS vs PCOD** symptoms, differences & lifestyle management
• **Pregnancy testing timelines**, early signs & implantation
• **Safe abortion guidance** (MTP pills, in-clinic, pain & recovery)
• **Emergency contraception** (i-Pill, Plan B, 72-hour window)
• **Severe period cramps**, endometriosis & irregular cycles

What's on your mind today? Every question is confidential.`,
            recommendedArticles: [
              'pcos-vs-pcod-differences-management',
              'early-pregnancy-signs-testing-guide',
              'safe-abortion-care-medical-recovery-rights',
            ],
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem(
            'baikology_health_chat_messages',
            JSON.stringify([welcome])
          );
          return [welcome];
        });
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [token, userName]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const quickPrompts = [
    'PCOS vs PCOD: What is the real difference?',
    'Could I be pregnant or is my period just late?',
    'How do medical abortion pills work safely?',
    'When should I take the morning-after pill?',
    'Why are my period cramps so painful?',
  ];

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    localStorage.setItem('baikology_health_chat_messages', JSON.stringify(updated));
    setInputText('');
    setIsTyping(true);

    try {
      if (token) {
        const response = await sendHealthChatMessage(
          { text, userContext: { cyclePhase } },
          token
        );

        if (response.success && response.data?.reply) {
          const aiMsg = {
            id: 'ai-' + Date.now(),
            sender: 'ai',
            text: response.data.reply,
            detectedTopics: response.data.detectedTopics || [],
            recommendedArticles: response.data.recommendedArticles || [],
            timestamp: new Date().toISOString(),
          };

          const allMsgs = response.data.healthChatMessages || [...updated, aiMsg];
          setMessages(allMsgs);
          localStorage.setItem('baikology_health_chat_messages', JSON.stringify(allMsgs));

          if (response.data.tunedTopics && response.data.tunedTopics.length > 0) {
            setActiveTopics(response.data.tunedTopics);
            localStorage.setItem(
              'baikology_tuned_topics',
              JSON.stringify(response.data.tunedTopics)
            );
            if (onTopicsUpdated) onTopicsUpdated(response.data.tunedTopics);

            // Banner feedback
            setRecentTunedBanner(`✨ Article feed tuned for your interest in ${response.data.tunedTopics.join(', ')}`);
            setTimeout(() => setRecentTunedBanner(''), 6000);
          }

          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend health chat error, falling back locally:', err);
    }

    // Local client-side fallback if backend call throws
    setTimeout(() => {
      let detected = [];
      let articles = [];
      const low = text.toLowerCase();

      let fallbackReply = `It is completely normal to have questions about women's reproductive health, cycles, and hormones. You deserve medically accurate, clear, and non-judgmental information.

### 1. Understanding What Is Happening
• Your body's reproductive cycle is orchestrated by dynamic shifts in **estrogen, progesterone, LH, and FSH**.
• Changes in cycle length, flow intensity, cramping, or physical symptoms often reflect how these hormones interact with stress, nutrition, and metabolic factors.

### 2. Practical Steps You Can Take
1. **Track Your Dates:** Keep a record of Day 1 of bleeding, symptom onset, and intensity.
2. **Prioritize Blood Sugar Balance:** Combine complex carbs with healthy proteins and fats to minimize hormonal fluctuations.
3. **Rest & Restore:** Ensure 7 to 9 hours of quality sleep to prevent elevated cortisol from disrupting ovulation.

### 3. When to Seek Professional Medical Care
Schedule an appointment with a gynecologist if:
- You experience severe pelvic pain not relieved by standard analgesics.
- Your period has been missing for **more than 90 days** without a positive pregnancy test.
- You soak through more than 1 pad or tampon per hour.

Could you tell me a little more about what specific symptoms or situation you are wondering about? 🌸`;

      if (low.includes('pcos') || low.includes('pcod')) {
        detected.push('pcos_pcod');
        articles.push('pcos-vs-pcod-differences-management');
        fallbackReply = `It is completely normal to feel confused or overwhelmed when hearing about PCOS and PCOD—understanding how they differ biologically is the best first step toward feeling in control.

### 1. Key Differences at a Glance

| Feature | **PCOD** (Polycystic Ovarian Disease) | **PCOS** (Polycystic Ovary Syndrome) |
|---|---|---|
| **What It Is** | Hormonal imbalance causing immature follicles/cysts on ovaries | Complex metabolic and endocrine syndrome involving androgens |
| **Prevalence** | Affects roughly **10% to 15%** of women; very common | Affects roughly **6% to 10%** of women |
| **Metabolic Link** | Rarely causes systemic insulin resistance | Strongly tied to **insulin resistance** and inflammation |
| **Fertility Impact** | Ovulation can often be restored naturally with nutrition and habits | Anovulation is common; often benefits from medical cycle support |

### 2. Practical Steps You Can Take
1. **Regulate Blood Sugar:** Pair carbs with protein and fiber to prevent insulin spikes that stimulate excess androgens.
2. **Inositol Support:** **Myo-Inositol & D-Chiro-Inositol** in a 40:1 ratio has strong clinical evidence for restoring regular cycles.
3. **Spearmint Tea:** 1 to 2 cups of pure spearmint tea daily can help gently lower free androgen levels.

### 3. When to Seek Professional Medical Care
Consult a gynecologist or endocrinologist if you have gone **over 90 days** without a period, or if you would like a baseline hormone blood panel (**LH/FSH, Fasting Insulin, Free Testosterone, DHEA-S**).

Are you currently navigating a recent diagnosis, or have you noticed symptoms like skipped periods or stubborn breakouts? 🌸`;
      } else if (low.includes('pregnant') || low.includes('pregnancy') || low.includes('implantation')) {
        detected.push('pregnancy');
        articles.push('early-pregnancy-signs-testing-guide');
        fallbackReply = `Wondering whether you might be pregnant can bring up intense emotions. You deserve compassionate, medically accurate facts and clear timelines to get reliable answers.

### 1. Implantation Bleeding vs. Menstrual Period

| Characteristic | **Implantation Bleeding** | **Normal Menstrual Period** |
|---|---|---|
| **Color** | Light pink or watery brown; no dark red clots | Bright to dark red; contains tissue and clots |
| **Duration** | Lasts a few hours up to **1 to 2 days** | Typically lasts **3 to 7 days** |
| **Volume** | Very light spotting only | Heavy flow requiring regular pad/tampon changes |
| **Timing** | **6 to 12 days** after fertilization | **14 days** after ovulation |

### 2. Practical Testing Guidelines
1. **14 Days Post-Sex:** Home urine pregnancy tests detect **hCG** accurately 14 days after intercourse.
2. **First Day of Missed Period:** Testing on or after your missed period yields **over 99% accuracy**.
3. **Use Morning Urine:** First-morning urine contains the highest concentration of hCG.

### 3. When to Seek Professional Medical Care
Seek prompt medical care if you get a positive test and experience sharp, one-sided pelvic pain (which can signify an **ectopic pregnancy**), or if your period is more than 3 weeks late and tests remain negative.

How many days has it been since the intercourse you are concerned about? 🌸`;
      } else if (low.includes('abortion') || low.includes('terminate') || low.includes('mtp')) {
        detected.push('abortion');
        articles.push('safe-abortion-care-medical-recovery-rights');
        fallbackReply = `Making decisions about your reproductive health is your fundamental right. You deserve compassionate, medically sound, and non-judgmental guidance so you know what is safe, expected, and normal.

### 1. How Safe Medical Abortion (MTP) Works
According to World Health Organization (**WHO**) protocols, medical abortion is safe and over **95% to 98% effective** in the first 10 to 12 weeks:
1. **Mifepristone (200 mg):** Taken first orally. It blocks **progesterone**, detaching the pregnancy lining.
2. **Misoprostol (800 mcg):** Taken 24 to 48 hours later. It gently causes the uterus to contract and empty naturally.

### 2. Expected Symptoms vs. Warning Red Flags

| Expected Symptoms | Warning Signs (Require Immediate Care) |
|---|---|
| Cramping and bleeding starting 1 to 4 hours post-Misoprostol | **Soaking more than 2 maxi pads per hour for 2 hours consecutively** |
| Passing blood clots (some up to plum-sized) | High fever over **100.4°F (38°C)** persisting over 24 hours |
| Light spotting continuing for 1 to 3 weeks | Severe, unmanageable pain not eased by painkillers |

### 3. Practical Steps for Recovery
- Take **400 to 800 mg of Ibuprofen** 30 to 60 minutes *before* Misoprostol. Avoid aspirin as it thins blood.
- Use large sanitary pads rather than tampons or cups for the first week to reduce infection risk.
- A safe medical abortion does **not** harm your future fertility.

### 4. When to Seek Professional Medical Care
Seek immediate emergency medical care if you experience heavy hemorrhaging (2+ pads/hour for 2 hours) or severe continuous fever. A follow-up ultrasound or test 3 to 4 weeks later confirms completion.

Are you looking for information before beginning, or are you currently in recovery? 💜`;
      } else if (low.includes('pill') || low.includes('contraceptive') || low.includes('ipill')) {
        detected.push('contraception');
        articles.push('emergency-contraception-morning-after-pill');
        fallbackReply = `If you recently experienced a contraceptive accident, taking quick action is wise. Emergency contraception is safe, common, and effective.

### 1. Comparison of Emergency Contraceptive Options

| Method | **Levonorgestrel (Plan B / i-Pill)** | **Ulipristal (Ella)** | **Copper IUD** |
|---|---|---|---|
| **Window** | Within **72 hours (3 days)** | Within **120 hours (5 days)** | Within **120 hours (5 days)** |
| **Efficacy** | Highest within **24 hours (~95%)** | High across 5 days | **Over 99%** effective |
| **Mechanism**| Delays ovulation | Delays ovulation | Prevents fertilization |

### 2. Practical Steps & What to Expect
1. **Take As Soon As Possible:** Efficacy is highest when taken promptly with a snack.
2. **If You Vomit Within 2 Hours:** The medication may not have absorbed; consult a pharmacist about repeat dosing.
3. **Cycle Timing:** Your next period may arrive a few days early or late due to the hormonal surge.

### 3. When to Seek Professional Medical Care
Take a home pregnancy test if your next menstrual period is **more than 7 days late**.

How many hours have passed since the intercourse took place? 🌸`;
      } else if (low.includes('cramp') || low.includes('pain') || low.includes('endometriosis')) {
        detected.push('period_health');
        articles.push('severe-period-pain-dysmenorrhea-endometriosis');
      }

      if (articles.length === 0) {
        articles.push('pcos-vs-pcod-differences-management', 'early-pregnancy-signs-testing-guide');
      }

      const aiMsg = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: fallbackReply,
        detectedTopics: detected,
        recommendedArticles: articles,
        timestamp: new Date().toISOString(),
      };

      const next = [...updated, aiMsg];
      setMessages(next);
      localStorage.setItem('baikology_health_chat_messages', JSON.stringify(next));

      if (detected.length > 0) {
        const merged = Array.from(new Set([...activeTopics, ...detected]));
        setActiveTopics(merged);
        localStorage.setItem('baikology_tuned_topics', JSON.stringify(merged));
        if (onTopicsUpdated) onTopicsUpdated(merged);
        setRecentTunedBanner(`✨ Article feed tuned for ${detected.join(', ')}`);
        setTimeout(() => setRecentTunedBanner(''), 6000);
      }

      setIsTyping(false);
    }, 500);
  };

  const handleClearChat = async () => {
    if (window.confirm('Reset health assistant conversation?')) {
      setMessages([]);
      localStorage.removeItem('baikology_health_chat_messages');
      if (token) {
        await clearHealthMessages(token).catch(console.error);
      }
      // Re-seed welcome
      const welcome = {
        id: 'welcome-health-msg-2',
        sender: 'ai',
        text: `Conversation reset. I'm right here whenever you have questions about PCOS, pregnancy, abortion, emergency contraception, or cycles! 🌸`,
        recommendedArticles: [
          'pcos-vs-pcod-differences-management',
          'early-pregnancy-signs-testing-guide',
        ],
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      localStorage.setItem('baikology_health_chat_messages', JSON.stringify([welcome]));
    }
  };

  return (
    <>
      {/* ================= FLOATING LAUNCHER BUTTON (Bottom Right Corner) ================= */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#756291] via-[#885A82] to-[#B26E8D] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 animate-in fade-in"
          title="Open Baikology Health Assistant"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#82E6A1] ring-2 ring-[#756291]" />
          </div>

          <div className="text-left">
            <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
              <span>Ask Baikology</span>
              <span className="text-[10px] bg-white/25 px-1.5 py-0.2 rounded-full font-bold">
                Health Guide
              </span>
            </div>
            <div className="text-[10px] text-white/85 font-medium">
              PCOS • Pregnancy • Abortion • Care
            </div>
          </div>
        </button>
      )}

      {/* ================= EXPANDABLE CHATBOT WINDOW (Collapsible Diagonally) ================= */}
      {isOpen && (
        <div
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] sm:h-[640px] max-h-[88vh] bg-white rounded-[32px] shadow-2xl border border-[#E9DFFF] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right transform scale-100 animate-in zoom-in-90 fade-in"
          style={{ boxShadow: '0 20px 50px rgba(64, 51, 68, 0.22)' }}
        >
          {/* Header */}
          <div className="relative px-5 py-4 bg-gradient-to-r from-[#756291] via-[#885A82] to-[#A36688] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
                🌸
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5 font-['Nunito',sans-serif]">
                  <span>Baikology Care</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25 text-white">
                    Verified
                  </span>
                </h3>
                <p className="text-[11px] text-white/80 font-medium">
                  Confidential Women's Health & Wellness Guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                title="Minimize / Collapse"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tuned Feed Banner Alert */}
          {recentTunedBanner && (
            <div className="bg-[#FAF5FF] border-b border-[#E9DFFF] px-4 py-2 flex items-center gap-2 text-xs font-semibold text-[#756291] animate-in slide-in-from-top-2 duration-200">
              <Sparkles className="w-3.5 h-3.5 text-[#756291] shrink-0" />
              <span className="truncate">{recentTunedBanner}</span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FFFAF5]/40 text-xs">
            {messages.map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {isUser ? (
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-line bg-[#756291] text-white rounded-br-xs shadow-xs font-medium">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="w-full max-w-[95%] sm:max-w-[92%] rounded-2xl p-4 bg-white text-[#403344] border border-[#E9DFFF] rounded-bl-xs shadow-xs">
                      <MarkdownMessage content={msg.text} />
                    </div>
                  )}

                  {/* Recommended Articles Mini Cards */}
                  {!isUser && msg.recommendedArticles && msg.recommendedArticles.length > 0 && (
                    <div className="w-[95%] sm:w-[90%] space-y-2 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#756291] flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#756291]" />
                        <span>Recommended Guides For You:</span>
                      </div>

                      <div className="space-y-1.5">
                        {msg.recommendedArticles.map((artId) => {
                          const art = getArticleById(artId);
                          if (!art) return null;
                          return (
                            <div
                              key={artId}
                              onClick={() => onOpenArticle && onOpenArticle(art)}
                              className="group p-2.5 rounded-xl bg-white border border-[#E9DFFF] hover:border-[#756291] shadow-xs cursor-pointer flex items-center justify-between gap-2 transition-all hover:bg-[#FAF7FD]"
                            >
                              <div className="space-y-0.5 min-w-0">
                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${art.badgeColor}`}>
                                  {art.categoryLabel}
                                </span>
                                <h5 className="font-bold text-[11px] text-[#403344] truncate group-hover:text-[#756291] transition-colors">
                                  {art.title}
                                </h5>
                                <p className="text-[10px] text-[#817583]">
                                  {art.readTime} • Read verified guide &rarr;
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#A595A8] group-hover:text-[#756291] shrink-0 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#817583] bg-white border border-[#E9DFFF] px-3.5 py-2.5 rounded-2xl w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#756291] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#756291] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#756291] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium ml-1">Analyzing medical resources...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (Horizontal Scroll) */}
          <div className="px-3 py-2 bg-white border-t border-[#F4EEF8] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold uppercase text-[#817583] whitespace-nowrap pl-1 mr-1">
              Suggested:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-[#FAF5FF] hover:bg-[#F3EBF9] border border-[#E9DFFF] text-[11px] text-[#554070] font-medium whitespace-nowrap transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E9DFFF] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about PCOS, pregnancy, abortion, contraception..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#FFFAF5] border border-[#E9DFFF] text-xs text-[#403344] focus:outline-none focus:ring-2 focus:ring-[#756291] placeholder-[#A595A8]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-[#756291] hover:bg-[#5e4b78] disabled:bg-[#D5CCD9] text-white flex items-center justify-center transition-colors shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Disclaimer Footer */}
          <div className="px-4 py-1.5 bg-[#FFFAF5] border-t border-[#F4EEF8] text-[10px] text-[#817583] text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#756291]" />
            <span>Confidential & supportive • Educational guidance, not medical diagnosis</span>
          </div>
        </div>
      )}
    </>
  );
}

