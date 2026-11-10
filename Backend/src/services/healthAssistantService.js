/**
 * Baikology — Main Health & Wellness AI Assistant
 *
 * Dedicated to answering sensitive women's health questions:
 * PCOS, PCOD, pregnancy, abortion, contraception, period pain, and hormones.
 *
 * Adheres strictly to the Baikology AI Companion System Instructions:
 * - Empathetic, supportive health educator tone
 * - Markdown formatted with numbered headings, bold terms, and comparison tables
 * - Dedicated "When to Seek Professional Medical Care" section
 * - Clear follow-up questions
 */

const TOPIC_RULES = [
  {
    topic: "pcos_pcod",
    label: "PCOS & PCOD",
    keywords: [
      "pcos", "pcod", "polycystic", "cysts", "ovarian cyst",
      "facial hair", "hirsutism", "insulin resistance", "metformin",
      "inositol", "spearmint", "high testosterone", "androgen"
    ],
    articleIds: ["pcos-vs-pcod-differences-management"]
  },
  {
    topic: "pregnancy",
    label: "Pregnancy & Testing",
    keywords: [
      "pregnant", "pregnancy", "implantation", "hcg", "morning sickness",
      "pregnancy test", "missed period", "unprotected sex", "conception",
      "first trimester", "two lines", "faint line"
    ],
    articleIds: ["early-pregnancy-signs-testing-guide"]
  },
  {
    topic: "abortion",
    label: "Safe Abortion Care",
    keywords: [
      "abortion", "terminate", "termination", "mtp", "mifepristone",
      "misoprostol", "abortion pill", "medical abortion", "unwanted pregnancy",
      "clinic abortion", "abortion rights", "bleeding after abortion"
    ],
    articleIds: ["safe-abortion-care-medical-recovery-rights"]
  },
  {
    topic: "contraception",
    label: "Emergency Contraception & Pills",
    keywords: [
      "ipill", "i-pill", "unwanted 72", "unwanted-72", "plan b", "morning after",
      "emergency pill", "emergency contraceptive", "condom broke", "birth control",
      "copper iud", "levonorgestrel"
    ],
    articleIds: ["emergency-contraception-morning-after-pill"]
  },
  {
    topic: "period_health",
    label: "Period Pain & Cramps",
    keywords: [
      "cramp", "cramps", "period pain", "severe pain", "endometriosis",
      "dysmenorrhea", "heavy bleeding", "blood clots", "irregular period",
      "late period", "brown discharge", "pelvic pain"
    ],
    articleIds: [
      "severe-period-pain-dysmenorrhea-endometriosis",
      "irregular-periods-causes-testing-guide"
    ]
  },
  {
    topic: "hormonal_health",
    label: "Hormonal Health & Skin",
    keywords: [
      "acne", "jawline acne", "cystic acne", "estrogen", "progesterone",
      "luteal", "hormonal imbalance", "mood swings", "pms", "pmdd"
    ],
    articleIds: ["hormonal-acne-jawline-breakouts-cycle"]
  },
  {
    topic: "nutrition",
    label: "Nutrition & Seed Cycling",
    keywords: [
      "seed cycling", "diet", "nutrition", "flax", "pumpkin seed",
      "sunflower seed", "sesame", "supplements", "bloating"
    ],
    articleIds: ["nutrition-seed-cycling-hormonal-balance"]
  }
];

/**
 * Detect topics from text
 */
function detectTopicsFromText(text = "") {
  const normalized = text.toLowerCase();
  const detected = [];
  const recommendedArticleIds = [];

  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      detected.push(rule.topic);
      recommendedArticleIds.push(...rule.articleIds);
    }
  }

  return {
    topics: Array.from(new Set(detected)),
    recommendedArticleIds: Array.from(new Set(recommendedArticleIds))
  };
}

/**
 * High-quality fallback engine following the exact Baikology AI System Instructions:
 * - Empathetic opening
 * - Numbered headings & bullet points
 * - Markdown comparison tables
 * - Practical step-by-step guidance
 * - Dedicated "When to Seek Professional Medical Care"
 * - Short relevant follow-up question
 */
function generateLocalHealthResponse(userMessage = "", userName = "friend", detectedTopics = []) {
  const text = (userMessage || "").toLowerCase();

  // 1. PCOS vs PCOD
  if (text.includes("pcos") || text.includes("pcod")) {
    return `It is completely normal to feel confused or overwhelmed when hearing about PCOS and PCOD—they sound almost identical, but understanding how they differ biologically is the best first step toward feeling in control of your health.

### 1. Key Differences at a Glance

| Feature | **PCOD** (Polycystic Ovarian Disease) | **PCOS** (Polycystic Ovary Syndrome) |
|---|---|---|
| **What It Is** | A hormonal imbalance causing immature eggs to form fluid-filled sacs (cysts) | A deeper metabolic and endocrine syndrome involving elevated androgens |
| **Prevalence** | Affects roughly **10% to 15%** of women; very common | Affects roughly **6% to 10%** of women |
| **Metabolic Impact** | Rarely affects insulin or causes systemic metabolic complications | Strongly linked to **insulin resistance**, weight fluctuations, and inflammation |
| **Fertility Impact** | Ovulation can often be restored naturally with nutrition and lifestyle modifications | Chronic anovulation (missed egg release); often requires medical ovulation support |
| **Reversibility** | Readily manageable and often reversible with targeted lifestyle changes | A chronic condition that can be managed successfully throughout life |

### 2. Practical Steps You Can Take
1. **Stabilize Blood Sugar:** Combine complex carbohydrates with a quality protein source and healthy fats (e.g., eggs, avocados, chia seeds) to prevent insulin spikes that trigger androgen production.
2. **Supportive Supplementation:** Talk to your physician about **Myo-Inositol & D-Chiro-Inositol** in a 40:1 ratio, which has strong clinical evidence for restoring cycle regularity.
3. **Gentle Strength Training:** Resistance exercises help muscle cells absorb glucose directly without requiring high insulin levels.
4. **Targeted Herbal Teas:** 1 to 2 cups of pure **spearmint tea** daily has been demonstrated in small trials to help moderate circulating free androgens.

### 3. When to Seek Professional Medical Care
Schedule an appointment with a gynecologist or endocrinologist if:
- You have gone **more than 90 days** without a menstrual period.
- You experience sudden, severe pelvic pain or rapidly progressing facial hair and scalp hair loss.
- You would like to request baseline blood testing (**LH/FSH ratio, Fasting Insulin, Free Testosterone, DHEA-S, and Lipid Panel**) alongside a pelvic ultrasound.

Are you currently navigating a recent diagnosis, or have you noticed specific cycle symptoms like skipped periods or sudden breakouts? 🌸`;
  }

  // 2. Pregnancy & Testing
  if (text.includes("pregnant") || text.includes("pregnancy") || text.includes("implantation") || text.includes("missed period")) {
    return `Wondering whether you might be pregnant can bring up intense emotions—whether you are hoping for a pregnancy or feeling anxious about an unintended one. You are not alone, and clear timelines will help you get accurate answers.

### 1. Implantation Bleeding vs. Menstrual Period

| Characteristic | **Implantation Bleeding** | **Normal Menstrual Period** |
|---|---|---|
| **Color & Consistency** | Light pink or watery brown; never contains dark red clots | Bright red to dark red; contains mucosal tissue and clots |
| **Duration** | Lasts a few hours up to **1 to 2 days** | Typically lasts **3 to 7 days** |
| **Flow Volume** | Very light spotting (only visible on wiping or a pantyliner) | Heavy flow requiring regular pad or tampon changes |
| **Timing** | Occurs approximately **6 to 12 days** after fertilization | Occurs **14 days** after ovulation if no pregnancy occurred |

### 2. Testing Timeline & Practical Steps
1. **The 14-Day Rule:** Home urine pregnancy tests detect human Chorionic Gonadotropin (**hCG**). It takes 10 to 14 days after conception for hCG to reach detectable levels in urine.
2. **First Day of Missed Period:** Testing on or after the day your period is expected yields **over 99% accuracy**.
3. **Use First-Morning Urine:** Your first urination of the morning has the highest concentration of hCG.
4. **Handling Faint Lines:** If you see a very faint second line, re-test **48 hours later**, as hCG levels typically double every 48 hours in early viable pregnancies.

### 3. When to Seek Professional Medical Care
Seek medical care if:
- You receive a positive test and experience sharp, one-sided abdominal or shoulder pain (which can indicate an **ectopic pregnancy** requiring immediate medical attention).
- Your period is more than 2 to 3 weeks late and pregnancy tests remain negative.
- You need a quantitative serum beta-hCG blood test for definitive confirmation.

How many days has it been since the intercourse you are concerned about, or have you already taken a home test? 🌸`;
  }

  // 3. Safe Abortion
  if (text.includes("abortion") || text.includes("terminate") || text.includes("mtp") || text.includes("mifepristone") || text.includes("misoprostol")) {
    return `Making decisions about your reproductive health is your fundamental right. You deserve compassionate, medically sound, and non-judgmental guidance so you know exactly what is safe, effective, and expected.

### 1. How Safe Medical Abortion (MTP) Works

According to World Health Organization (**WHO**) protocols, medical abortion is safe and over **95% to 98% effective** within the first 10 to 12 weeks of pregnancy using two medications:

1. **Mifepristone (200 mg):** Taken first orally. It blocks the hormone **progesterone**, which is required for a pregnancy to develop, causing the uterine lining to detach. Most women feel completely fine after this first pill.
2. **Misoprostol (800 mcg):** Taken 24 to 48 hours later (either dissolved in the cheeks buccally or placed vaginally). It causes the uterus to contract and empty naturally.

### 2. What Is Expected vs. Warning Red Flags

| Expected Symptoms | Warning Signs (Require Medical Help) |
|---|---|
| Cramping and bleeding starting 1 to 4 hours after Misoprostol | **Soaking more than 2 maxi pads per hour for 2 hours consecutively** |
| Passing blood clots (some up to the size of a lemon or plum) | Fever over **100.4°F (38°C)** persisting longer than 24 hours |
| Mild nausea, brief chills, or temporary low-grade temperature | Severe, unmanageable abdominal pain not eased by painkillers |
| Light spotting continuing for 1 to 3 weeks post-procedure | Foul-smelling vaginal discharge or severe dizziness |

### 3. Practical Steps for Recovery & Pain Relief
- **Pain Management:** Take **400 mg to 800 mg of Ibuprofen** 30 to 60 minutes *before* taking Misoprostol. Avoid aspirin as it can increase bleeding.
- **Physical Care:** Use large sanitary napkins/pads (avoid tampons or menstrual cups for the first week to minimize infection risks) and keep a hot water bottle on your lower abdomen.
- **Fertility & Health:** A safe abortion does **not** harm your future fertility or ability to have healthy children in the future.

### 4. When to Seek Professional Medical Care
Seek prompt or emergency medical care immediately if you experience heavy hemorrhaging (soaking 2 pads/hour for 2 hours), high continuous fever, or severe fainting. Otherwise, a routine follow-up ultrasound or pregnancy test 3 to 4 weeks later confirms completion.

Are you looking for information before beginning a procedure, or are you currently recovering from one? 💜`;
  }

  // 4. Emergency Contraception
  if (text.includes("ipill") || text.includes("unwanted 72") || text.includes("plan b") || text.includes("morning after") || text.includes("emergency pill") || text.includes("condom broke")) {
    return `If you recently experienced unprotected sex or a contraceptive accident, taking quick action is wise. Emergency contraception is a safe, proactive measure designed to prevent an unintended pregnancy.

### 1. Comparison of Emergency Contraceptive Options

| Method | **Levonorgestrel (Plan B / i-Pill / Unwanted-72)** | **Ulipristal Acetate (Ella)** | **Copper IUD** |
|---|---|---|---|
| **Time Window** | Effective up to **72 hours (3 days)** | Effective up to **120 hours (5 days)** | Effective up to **120 hours (5 days)** |
| **Maximum Efficacy** | Highest within the first **24 hours (~95%)** | Consistently high across 5 days | **Over 99%** effective regardless of weight |
| **How It Works** | Delays or inhibits ovulation | Delays ovulation even close to LH surge | Prevents fertilization and implantation |
| **Availability** | Available over-the-counter without prescription | Prescription required in most regions | Requires doctor or clinic insertion |

### 2. Practical Steps & What to Expect
1. **Take It Immediately:** Efficacy decreases with each passing 12-hour window. Take the pill as soon as possible with a small snack to reduce nausea.
2. **If You Vomit Within 2 Hours:** The medication may not have been fully absorbed; consult a pharmacist about whether to take another dose.
3. **Expected Side Effects:** Mild headache, breast tenderness, fatigue, and temporary spotting can occur.
4. **Cycle Changes:** Your next menstrual cycle may arrive a few days earlier or up to a week later than usual due to the hormonal shift.

### 3. When to Seek Professional Medical Care
- Take a home pregnancy test if your next menstrual period is **more than 7 days late**.
- Consult a doctor promptly if you develop severe, sharp lower pelvic pain in the weeks following the emergency pill.

How many hours have passed since the unprotected intercourse took place? 🌸`;
  }

  // 5. Severe Period Pain & Endometriosis
  if (text.includes("cramp") || text.includes("cramps") || text.includes("pain") || text.includes("endometriosis") || text.includes("heavy bleeding")) {
    return `Please know that debilitating period pain is not something you simply have to endure or dismiss as 'normal.' Your pain is real, and identifying its origin is essential for long-term comfort.

### 1. Primary Dysmenorrhea vs. Endometriosis

| Feature | **Normal Cramps (Primary Dysmenorrhea)** | **Suspected Endometriosis** |
|---|---|---|
| **Underlying Cause** | High levels of uterine **prostaglandins** contracting muscle | Endometrial-like tissue growing outside the uterus, causing chronic lesions |
| **Onset & Timing** | Starts 1 day before bleeding and eases by day 2 or 3 | Often begins several days before bleeding and persists throughout or after |
| **Response to Painkillers** | Readily responsive to heating pads and NSAIDs (Ibuprofen) | Minimal to no relief from standard over-the-counter pain relievers |
| **Associated Symptoms** | Mild lower back ache and fatigue | Pain during intercourse, painful bowel movements, chronic pelvic soreness |

### 2. Practical Steps for Immediate Relief
1. **Targeted Heat Therapy:** Apply a continuous hot water bottle or heating patch (~40°C) across your pelvic region; heat relaxes uterine muscle spasms as effectively as oral analgesics.
2. **Anti-Prostaglandin Medication:** Take **Ibuprofen (400 mg)** with food at the very first sign of spotting or cramping, before prostaglandins peak.
3. **Magnesium Glycinate:** 300 to 400 mg daily in the second half (luteal phase) of your cycle helps relax smooth muscle fibers.
4. **Gentle Anti-Inflammatory Sips:** Fresh ginger tea inhibits the enzymes that synthesize inflammatory prostaglandins.

### 3. When to Seek Professional Medical Care
Schedule an evaluation with a gynecologist if:
- Cramping causes nausea, vomiting, or prevents you from attending work or school.
- You experience pain with intercourse or painful bowel movements during your period.
- Bleeding is so heavy that you soak through a standard pad every hour.

Does your pain typically ease after the first day or two of bleeding, or does it persist throughout your cycle? 🌸`;
  }

  // 6. General / Comprehensive Health Fallback
  return `Thank you for sharing your question with me. Women's reproductive and hormonal health can be complex, and you deserve clear, honest, and medically grounded answers without judgment.

### 1. Understanding Women's Health Categories We Cover
- **Menstrual & Cycle Health:** Irregular cycles, delayed periods, heavy bleeding, and severe cramps.
- **Hormonal Conditions:** PCOS, PCOD, insulin sensitivity, thyroid interactions, and hormonal acne.
- **Pregnancy & Contraception:** Implantation vs. periods, hCG testing timelines, and emergency contraception (i-Pill, Plan B).
- **Safe Abortion Care:** Medical abortion (MTP) protocols, expected bleeding, recovery, and red flags.
- **Holistic Wellness:** Cycle tracking, luteal phase mood variations, and phase-based nutrition.

### 2. Practical General Guidelines
1. **Track Your Baseline:** Keeping a log of your cycle start dates, flow intensity, and symptoms gives valuable patterns for both yourself and your physician.
2. **Notice Hormone Shifts:** Energy and mood changes throughout the month are driven by estrogen and progesterone shifts, not a personal failing.
3. **Listen to Your Body:** Any pain or irregularity that disrupts your daily routine deserves clinical attention.

### 3. When to Seek Professional Medical Care
Always reach out to a healthcare professional if you experience severe sudden pelvic pain, unexplained heavy hemorrhaging, high fever, or if your period has been missing for over 90 days without a positive pregnancy test.

Could you tell me a little more about the specific symptoms or situation you are wondering about today? 🌸`;
}

/**
 * System instruction for Groq AI incorporating exact Baikology AI Companion System Instructions
 */
function buildHealthSystemInstruction({ userName = "friend", userContext = {} }) {
  return `
# Baikology AI Companion – System Instructions

You are Baikology AI, a compassionate, knowledgeable and non-judgmental women's health education companion.

Your purpose is to help women understand their bodies, reproductive health, menstrual cycles, hormonal conditions, pregnancy, abortion care and emotional wellness.

## PERSONALITY
- Be warm, empathetic, reassuring and respectful.
- Communicate like a knowledgeable, supportive health educator.
- Never shame, judge, frighten or dismiss the user.
- Address the user's actual concern before providing additional information.
- Use simple, conversational English.
- Avoid sounding robotic, overly clinical or unnecessarily verbose.

## RESPONSE FORMATTING

Always structure informative responses using Markdown.

1. Start with a short, empathetic introduction relevant to the user's concern.
2. Divide longer answers into clearly numbered sections using headings (e.g. ### 1. Understanding What Is Happening).
3. Use bullet points for explanations and actionable recommendations.
4. Bold important medical terms, symptoms, timelines and precautions.
5. Use Markdown tables when comparing conditions, symptoms or possible causes (e.g., PCOS vs PCOD, Implantation Bleeding vs Period, Plan B vs Ella).
6. Explain medical terminology in simple language.
7. Give practical, step-by-step recommendations wherever appropriate.
8. Include a dedicated section explaining when professional medical help is needed (### When to Seek Professional Medical Care).
9. End with a short, relevant follow-up question when additional context would help.

Avoid:
- Large uninterrupted paragraphs.
- Unstructured walls of text.
- Excessive emojis.
- Repeating the same advice.
- Making unsupported medical claims.

## MEDICAL SAFETY
- You provide health education, not medical diagnosis or treatment.
- Never claim that a user definitely has a medical condition based on symptoms.
- Never prescribe medication or recommend changing prescribed treatment.
- Clearly distinguish established medical facts from possibilities.
- Use verified medical sources and evidence-based information.
- Explain when symptoms require routine, prompt or emergency medical assessment.
- Never delay emergency care by continuing a lengthy conversation.

## TOPIC COVERAGE
You should understand:
- Menstrual health and irregular periods.
- PCOS and PCOD.
- Hormonal health and thyroid-related menstrual changes.
- Pregnancy and pregnancy testing.
- Contraception and fertility.
- Abortion information and aftercare.
- Vaginal and reproductive health.
- PMS, PMDD and emotional wellness.

## PERSONALIZATION
- Preferred Name: ${userName || "friend"}
- User Context / Cycle Phase: ${userContext?.cyclePhase || "Not specified"}
- Use relevant information voluntarily provided by the user.
- Never assume that asking about a condition means the user has it.
- Ask relevant follow-up questions when necessary.
- Keep educational content recommendations separate from medical diagnoses.
- Respect user privacy and consent.

## RESPONSE OBJECTIVE

Every response should help the user:
1. Understand what might be happening.
2. Learn the relevant health information.
3. Know what practical steps they can take.
4. Recognize when to seek professional care.

Your answers should be detailed enough to be genuinely useful, but never overwhelm the user.
`.trim();
}

/**
 * Main chat handler for Health Assistant
 */
async function generateHealthAssistantReply({
  userMessage,
  userName = "friend",
  userContext = {},
  chatHistory = []
}) {
  const { topics, recommendedArticleIds } = detectTopicsFromText(userMessage);

  const apiKey = process.env.GROQ_API_KEY;
  const preferredModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  const modelsToTry = [preferredModel, "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];

  if (!apiKey) {
    console.warn("[Baikology Care] GROQ_API_KEY missing. Serving local health engine.");
    const reply = generateLocalHealthResponse(userMessage, userName, topics);
    return {
      reply,
      detectedTopics: topics,
      recommendedArticleIds
    };
  }

  const systemPrompt = buildHealthSystemInstruction({ userName, userContext });

  // Format messages
  const messages = [{ role: "system", content: systemPrompt }];

  if (Array.isArray(chatHistory)) {
    const recent = chatHistory
      .filter((m) => m && (m.sender === "user" || m.sender === "ai" || m.role === "assistant" || m.role === "user"))
      .slice(-6)
      .map((m) => ({
        role: m.sender === "user" || m.role === "user" ? "user" : "assistant",
        content: (m.text || m.content || "").slice(0, 3000)
      }));
    messages.push(...recent);
  }

  messages.push({
    role: "user",
    content: (userMessage || "").trim().slice(0, 3000)
  });

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      let response;
      try {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.65,
            max_tokens: 800
          }),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      const data = await response.json();
      if (response.ok && data?.choices?.[0]?.message?.content) {
        console.log(`[Baikology Care] Reply generated using ${model}`);
        return {
          reply: data.choices[0].message.content.trim(),
          detectedTopics: topics,
          recommendedArticleIds
        };
      }
    } catch (err) {
      console.warn(`[Baikology Care] Attempt with ${model} failed (${err.message}). Trying next.`);
    }
  }

  console.warn("[Baikology Care] All remote models failed. Falling back to local medical engine.");
  const reply = generateLocalHealthResponse(userMessage, userName, topics);
  return {
    reply,
    detectedTopics: topics,
    recommendedArticleIds
  };
}

module.exports = {
  generateHealthAssistantReply,
  detectTopicsFromText,
  buildHealthSystemInstruction,
  TOPIC_RULES
};
