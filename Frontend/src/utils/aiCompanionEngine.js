/**
 * Baikology AI Dear Diary Companion Engine
 * Speaks like a close, emotionally intelligent, funny, caring female best friend.
 * Natural, spontaneous, non-judgmental, and emotionally connected.
 */

export function generateMoodGreeting(userName = 'lovely', mood = null, cycleAnalysis = {}) {
  const name = userName || 'lovely';
  const label = mood?.label || 'Calm';
  const emoji = mood?.emoji || '😌';

  switch (label.toLowerCase()) {
    case 'happy':
      return `Hey ${name}! ✨ Look at you checking in as ${emoji} Happy today! What's the scoop, what's got you in such a good mood? Tell me everything!`;
    case 'calm':
      return `Hey ${name} 🌸 Feeling ${emoji} Calm and grounded today? Honestly, that is such a win. How's your day treating you so far?`;
    case 'meh':
      return `Hey ${name}. Just one of those ${emoji} 'meh', in-between kind of days? Totally get it, girl. Zero pressure to be cheerful today. How are you holding up?`;
    case 'overwhelmed':
      return `Oh ${name}... you're feeling ${emoji} Overwhelmed today? 🥺 Drop your shoulders for a second. What's piling up on your plate right now? I'm listening.`;
    case 'low':
      return `Hey ${name} 🥺 I saw you checked in as feeling ${emoji} Low. I'm right here. Did something specific happen today, or is it just feeling heavy?`;
    default:
      return `Hey ${name} 🌸 I'm right here with your Dear Diary. What's on your mind today, girl?`;
  }
}

export function generateMoodShiftMessage(userName = 'lovely', prevMood, newMood, cycleAnalysis = {}) {
  const name = userName || 'lovely';
  const prevLabel = prevMood?.label || 'earlier mood';
  const prevEmoji = prevMood?.emoji || '';
  const newLabel = newMood?.label || 'new mood';
  const newEmoji = newMood?.emoji || '';

  const positiveMoods = ['happy', 'calm'];
  const difficultMoods = ['low', 'overwhelmed', 'meh'];

  const prevIsPositive = positiveMoods.includes(prevLabel.toLowerCase());
  const prevIsDifficult = difficultMoods.includes(prevLabel.toLowerCase());
  const newIsPositive = positiveMoods.includes(newLabel.toLowerCase());
  const newIsDifficult = difficultMoods.includes(newLabel.toLowerCase());

  // 1. Shifted from Positive to Difficult (Happy/Calm -> Sad/Low/Overwhelmed)
  if (prevIsPositive && newIsDifficult) {
    if (newLabel.toLowerCase() === 'overwhelmed') {
      return `Wait, ${name}... you were feeling ${prevEmoji} ${prevLabel} earlier today, and you just switched to ${newEmoji} Overwhelmed. What happened? Did everything suddenly pile up? Are you okay? 🥺`;
    }
    return `Wait, ${name}... GIRLLLL what happened? 😭 You were feeling ${prevEmoji} ${prevLabel} earlier, but now you switched to ${newEmoji} ${newLabel}. Are you okay? Did someone do something? I'm right here, talk to me.`;
  }

  // 2. Shifted from Difficult to Positive (Low/Overwhelmed -> Happy/Calm)
  if (prevIsDifficult && newIsPositive) {
    if (newLabel.toLowerCase() === 'happy') {
      return `WAIT ${name}!! You were feeling ${prevEmoji} ${prevLabel} earlier and now you're ${newEmoji} Happy?! Okay wait, tell me everything, what turned things around?! ✨🌸`;
    }
    return `So glad to see this shift, ${name}! You were feeling ${prevEmoji} ${prevLabel} earlier and now you're feeling ${newEmoji} Calm. That's such a relief. What helped your mind settle?`;
  }

  // 3. Difficult to Difficult (Low -> Overwhelmed, etc.)
  if (prevIsDifficult && newIsDifficult) {
    return `Hey ${name}, I see things are still really heavy, shifting from ${prevEmoji} ${prevLabel} to ${newEmoji} ${newLabel}. Please be gentle with yourself today. What's running through your head right now?`;
  }

  // 4. Positive to Positive (Calm -> Happy)
  if (prevIsPositive && newIsPositive) {
    return `Love seeing that energy shift to ${newEmoji} ${newLabel}, ${name}! What's been the best part of your day so far? ✨`;
  }

  return `I noticed your mood shifted from ${prevEmoji} ${prevLabel} to ${newEmoji} ${newLabel}, ${name}. How are you holding up?`;
}

function extractContextualReferents(chatHistory = []) {
  if (!Array.isArray(chatHistory)) return {};

  const recentUserTexts = chatHistory
    .filter((m) => m && (m.sender === 'user' || m.role === 'user'))
    .map((m) => (m.text || (m.parts && m.parts[0]?.text) || '').toLowerCase())
    .slice(-6);

  let referent = null;
  for (const text of recentUserTexts.reverse()) {
    if (text.includes('friend') || text.includes('bestie') || text.includes('roommate')) {
      referent = { type: 'friend', label: 'your friend' };
      break;
    }
    if (text.includes('boss') || text.includes('manager') || text.includes('lead')) {
      referent = { type: 'boss', label: 'your boss' };
      break;
    }
    if (text.includes('boyfriend') || text.includes('guy') || text.includes('partner') || text.includes('crush') || text.includes('ex')) {
      referent = { type: 'partner', label: 'him' };
      break;
    }
    if (text.includes('mom') || text.includes('mother') || text.includes('dad') || text.includes('parent')) {
      referent = { type: 'family', label: 'them' };
      break;
    }
    if (text.includes('job') || text.includes('interview') || text.includes('work')) {
      referent = { type: 'work', label: 'work' };
      break;
    }
  }

  return { referent };
}

export function generateCompanionReply(
  userText = '',
  currentMood = null,
  prevMood = null,
  cycleAnalysis = {},
  userName = 'lovely',
  chatHistory = []
) {
  const text = (userText || '').trim().toLowerCase();
  const name = userName || 'lovely';
  const { referent } = extractContextualReferents(chatHistory);

  // 1. Pronoun continuity / Resolution from prior messages
  if (
    text.includes("she didn't") ||
    text.includes("she didn't even apologize") ||
    text.includes("she ignored") ||
    text.includes("she never") ||
    text.includes("she said") ||
    text.includes("she did")
  ) {
    if (referent?.type === "friend") {
      return `Wait, she didn't even apologize after everything you told me?! Ugh, that makes my blood boil. It is so frustrating when friends act like nothing happened instead of owning up. Are you going to leave it, or do you want to talk to her?`;
    }
    return `Wait, she didn't even apologize?! Ugh, that is so unfair. It makes me so mad when people pretend nothing happened instead of just saying sorry. Are you okay, or do you want to vent more about it?`;
  }

  if (
    text.includes("he didn't") ||
    text.includes("he ignored") ||
    text.includes("he texted") ||
    text.includes("he said")
  ) {
    if (referent?.type === "partner") {
      return `Wait, he actually did that?! Men can be so frustratingly clueless sometimes. Did you call him out on it, or are you just letting him sit in silence right now?`;
    }
    return `Wait, he actually did that? That would drive me crazy too. What did he say when you confronted him?`;
  }

  // 2. Big Wins / Exciting News / Celebrations (Check early so 'job offer' isn't confused with stress)
  if (
    text.includes("won") ||
    text.includes("passed") ||
    text.includes("got the job") ||
    text.includes("job offer") ||
    text.includes("got hired") ||
    text.includes("promoted") ||
    text.includes("crush texted") ||
    text.includes("yay") ||
    text.includes("best day") ||
    text.includes("so happy") ||
    text.includes("good news") ||
    text.includes("amazing news")
  ) {
    const excitementReplies = [
      `EXCUSE ME??? THAT'S ACTUALLY AMAZING!! 🎉 Look at you shining! Girl, I am so ridiculously hyped for you right now! Tell me the whole story from start to finish!`,
      `WAIT WAIT WAIT... ARE YOU SERIOUS?! 🥹✨ Look at you go! You worked so hard for this, ${name}! How are you celebrating tonight? Tell me everything!`,
      `GIRLLLL YESSS!! 🥳 That is huge news! I'm practically doing a happy dance on my end! What was your exact reaction when you found out?`,
    ];
    return excitementReplies[Math.floor(Math.random() * excitementReplies.length)];
  }

  // 3. Unfair Expectations / Pressure from everyone
  if (
    text.includes("expecting things") ||
    text.includes("expects") ||
    text.includes("pressure") ||
    text.includes("everyone wants") ||
    text.includes("everyone keeps expecting") ||
    text.includes("carrying everyone") ||
    text.includes("too much pressure")
  ) {
    return `Ugh, that sounds like so much pressure, ${name}. Does it honestly feel like nobody is even stopping to ask what YOU actually need right now? You don't have to carry everyone else's world on your shoulders.`;
  }

  // 4. Insecurity / Falling Behind / Comparison
  if (
    text.includes("falling behind") ||
    text.includes("behind everyone") ||
    text.includes("failure") ||
    text.includes("loser") ||
    text.includes("not doing enough") ||
    text.includes("not enough") ||
    text.includes("compare myself") ||
    text.includes("everyone is ahead")
  ) {
    return `Ugh, I hate that sick feeling in the chest so much, ${name}. Did you see someone's highlight reel on Instagram or LinkedIn, or did a specific conversation trigger that? You are NOT falling behind, I promise you. Tell me what's actually running through your head right now.`;
  }

  // 5. Crying / Heartbreak / Emotional Vulnerability
  if (
    text.includes("cry") ||
    text.includes("crying") ||
    text.includes("tears") ||
    text.includes("heartbroken") ||
    text.includes("sobbing") ||
    text.includes("hurts so much") ||
    text.includes("can't stop crying")
  ) {
    return `Oh sweetheart, nooo 🥺. Please don't try to hold back the tears, just let them out. I'm right here with you on the floor, listening. What's hurting the most right now?`;
  }

  // 6. Anger / Rant / Outrage
  if (
    text.includes("angry") ||
    text.includes("pissed") ||
    text.includes("furious") ||
    text.includes("hate this") ||
    text.includes("hate them") ||
    text.includes("so annoyed") ||
    text.includes("can't stand")
  ) {
    return `Honestly? I don't blame you one bit. Go off, let it all out! What was the exact moment that pushed you over the edge today?`;
  }

  // 7. Work / Boss / Deadlines / Micromanagement
  if (
    text.includes("boss") ||
    text.includes("manager") ||
    text.includes("meeting") ||
    text.includes("office") ||
    text.includes("coworker") ||
    text.includes("yelled") ||
    text.includes("deadline") ||
    text.includes("work stress")
  ) {
    return `GIRL. That sounds infuriating. It feels like managers love projecting their own stress onto people who are actually putting in the work. What did they even say to you? Tell me everything.`;
  }

  // 8. Fights / Relationship Drama / Friends
  if (
    text.includes("fight") ||
    text.includes("argued") ||
    text.includes("argument") ||
    text.includes("friend") ||
    text.includes("best friend") ||
    text.includes("roommate") ||
    text.includes("boyfriend") ||
    text.includes("toxic")
  ) {
    return `Wait, back up. What did they actually say?? I would be so upset too! Did they even attempt to see your side of things, or were they just being defensive?`;
  }

  // 9. Period / Cramps / Physical Exhaustion
  if (
    text.includes("cramp") ||
    text.includes("cramps") ||
    text.includes("period") ||
    text.includes("bleeding") ||
    text.includes("bloated") ||
    text.includes("pms")
  ) {
    return `Ugh, period cramps are the absolute worst kind of torture. Seriously, cancel any non-essential plans tonight and curl up in bed. Have you taken anything for the pain, or can you get a heating pad? 🌸`;
  }

  // 10. Exhaustion / Burnout / Drained
  if (
    text.includes("exhausted") ||
    text.includes("tired") ||
    text.includes("drained") ||
    text.includes("no energy") ||
    text.includes("burnout") ||
    text.includes("overwhelmed")
  ) {
    return `Oh sweetheart, that sounds exhausting. Have you been able to sit down and just breathe for even five minutes today? Drop your shoulders for a second. What's draining you the most right now?`;
  }

  // 11. Overthinking / Anxiety
  if (
    text.includes("anxious") ||
    text.includes("anxiety") ||
    text.includes("panic") ||
    text.includes("overthinking") ||
    text.includes("spiral") ||
    text.includes("worried")
  ) {
    return `Okay, pause with me for a second, ${name}. We are not going down the spiral rabbit hole alone tonight. What's the specific worst-case scenario your brain is trying to convince you of right now? Let's unpack it together.`;
  }

  // 12. Loneliness / Feeling Unseen
  if (
    text.includes("lonely") ||
    text.includes("alone") ||
    text.includes("nobody cares") ||
    text.includes("no one cares") ||
    text.includes("invisible")
  ) {
    return `I'm sitting right here with you, ${name}. Loneliness can feel so heavy and hollow at the same time. You're not invisible to me. Do you want to talk about why you feel this way, or do you just want me to keep you company?`;
  }

  // 13. Conversational hooks ("guess what", "crazy day", "tell you something", "hey")
  if (
    text.includes("guess what") ||
    text.includes("tell you something") ||
    text.includes("crazy day") ||
    text.includes("so much happened") ||
    text.includes("you won't believe")
  ) {
    return `Wait wait, tell me everything!! What happened today?! I'm listening! 👀`;
  }

  if (
    text === "hey" ||
    text === "hi" ||
    text === "hello" ||
    text.startsWith("hey ") ||
    text.startsWith("hi ")
  ) {
    return `Hey ${name}! 🌸 I was hoping you'd pop into your diary today. How's your day actually going so far? Anything juicy or stressful on your mind?`;
  }

  // 14. Advice requested
  if (
    text.includes("what should i do") ||
    text.includes("what do you think") ||
    text.includes("need advice") ||
    text.includes("help me decide")
  ) {
    return `Okay, let's figure this out together, ${name}. If you strip away what everyone else wants you to do, what does your own gut tell you right now?`;
  }

  // 15. Mood-adaptive general fallbacks
  if (currentMood?.label === "Happy") {
    return `I love this energy for you so much, ${name}! ✨ Keep soaking up that good vibe today. What's been the absolute highlight of your day so far?`;
  }

  if (currentMood?.label === "Low" || currentMood?.label === "Overwhelmed") {
    return `I hear you, ${name}. Some days just feel like an uphill battle against the world. Don't feel pressured to have it all figured out right now. I'm right here whenever you want to spill more. 💜`;
  }

  if (currentMood?.label === "Meh") {
    return `Honestly, some days are just completely 'meh' and that's okay. Zero pressure to perform today. What's one little thing that could make tonight feel 5% cozier for you?`;
  }

  return `Wait, tell me more about that, ${name}. How are you really feeling about all of it right now?`;
}
