/**
 * Baikology Cycle Intelligence Engine
 *
 * Analyses user questionnaire profile data (last period date, duration, regularity, symptoms)
 * and calculates current cycle day, biological phase, next period prediction,
 * ovulation window, and personalized recommendations.
 */

export function parsePeriodDuration(durationStr) {
  if (!durationStr) return 5;
  if (durationStr.includes('1–2')) return 2;
  if (durationStr.includes('3–4')) return 4;
  if (durationStr.includes('5–6')) return 5;
  if (durationStr.includes('7+')) return 7;
  return 5;
}

export function parseCycleLength(regularityStr) {
  if (!regularityStr) return 28;
  if (regularityStr.includes('Slightly irregular')) return 29;
  if (regularityStr.includes('Very irregular')) return 30;
  if (regularityStr.includes('Changes frequently')) return 28;
  return 28;
}

export function formatDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Main cycle analysis function
 */
export function analyzeCycle(questionnaire = {}) {
  const lastPeriodDateStr = questionnaire?.lastPeriodDate || '';
  const bleedDuration = parsePeriodDuration(questionnaire?.periodDuration);
  const cycleLength = parseCycleLength(questionnaire?.cycleRegularity);
  const symptoms = Array.isArray(questionnaire?.periodSymptoms) ? questionnaire.periodSymptoms : [];
  const flow = questionnaire?.flowIntensity || 'Moderate';
  const crampIntensity = questionnaire?.crampIntensity || 'Mild';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastPeriodDateStr) {
    // Default fallback when user has not yet entered last period date
    return {
      hasCycleData: false,
      cycleDay: 14,
      cycleLength: 28,
      bleedDuration,
      phase: 'ovulatory',
      phaseName: 'Ovulatory Window',
      phaseHeadline: 'Higher energy • More sociable',
      phaseDescription:
        'Hormones follow a rhythmic conversation between your brain and ovaries. Add your last period start date anytime to unlock precision daily insights.',
      phaseColor: '#756291',
      phaseBg: '#FFF0B8',
      phaseTextColor: '#826500',
      nextPeriodDate: null,
      nextPeriodDateFormatted: 'In ~14 days',
      daysUntilNextPeriod: 14,
      ovulationDate: null,
      ovulationDateFormatted: 'Estimated day 14',
      daysUntilOvulation: 0,
      fertileWindowStartFormatted: 'Days 10–16',
      fertileWindowEndFormatted: 'Day 16',
      isFertileToday: true,
      symptomsAdvice: getPersonalizedAdvice(symptoms, crampIntensity, 'ovulatory'),
    };
  }

  // Parse last period date
  const [year, month, day] = lastPeriodDateStr.split('-').map(Number);
  const lastPeriodDate = new Date(year, month - 1, day);
  lastPeriodDate.setHours(0, 0, 0, 0);

  // Difference in calendar days from last period to today
  const diffTime = today.getTime() - lastPeriodDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Determine current cycle iteration and day
  let cycleDay = 1;
  let currentCycleStart = new Date(lastPeriodDate);

  if (diffDays >= 0) {
    const cycleIndex = Math.floor(diffDays / cycleLength);
    cycleDay = (diffDays % cycleLength) + 1;
    currentCycleStart = new Date(lastPeriodDate.getTime() + cycleIndex * cycleLength * 86400000);
  } else {
    // Date is in future (e.g. expected next period was picked)
    cycleDay = 1;
  }

  // Predict Next Period
  const nextPeriodDate = new Date(currentCycleStart.getTime() + cycleLength * 86400000);
  const daysUntilNextPeriod = Math.max(1, Math.ceil((nextPeriodDate.getTime() - today.getTime()) / 86400000));

  // Predict Ovulation Date (~14 days before next period in standard luteal phase)
  const ovulationDate = new Date(currentCycleStart.getTime() + (cycleLength - 14) * 86400000);
  const fertileWindowStart = new Date(ovulationDate.getTime() - 4 * 86400000);
  const fertileWindowEnd = new Date(ovulationDate.getTime() + 1 * 86400000);

  const isFertileToday = today >= fertileWindowStart && today <= fertileWindowEnd;
  const daysUntilOvulation = Math.ceil((ovulationDate.getTime() - today.getTime()) / 86400000);

  // Determine Current Biological Phase
  let phase = 'follicular';
  let phaseName = 'Follicular Phase';
  let phaseHeadline = 'Rising vitality • Mental clarity & optimism';
  let phaseDescription =
    'Estrogen is climbing as your body prepares a follicle. You might notice your mental stamina, social confidence, and creativity feeling refreshed.';
  let phaseColor = '#2C6336';
  let phaseBg = '#DDF3DE';
  let phaseTextColor = '#2C6336';

  if (cycleDay <= bleedDuration) {
    phase = 'menstrual';
    phaseName = 'Menstrual Phase';
    phaseHeadline = 'Restorative • Gentle inward energy';
    phaseDescription =
      'Progesterone and estrogen are at baseline. Your body directs vital energy inward. Resting, staying cozy, and warm hydration are biologically supportive right now.';
    phaseColor = '#9F1239';
    phaseBg = '#F9DDE5';
    phaseTextColor = '#9F1239';
  } else if (cycleDay >= cycleLength - 16 && cycleDay <= cycleLength - 12) {
    phase = 'ovulatory';
    phaseName = 'Ovulatory Window';
    phaseHeadline = 'Peak estrogen • Maximum sociability & glow';
    phaseDescription =
      'Estrogen peaks alongside an LH surge. Verbal fluency, physical energy, and collaboration feel most natural during this peak window.';
    phaseColor = '#826500';
    phaseBg = '#FFF0B8';
    phaseTextColor = '#826500';
  } else if (cycleDay > cycleLength - 12) {
    phase = 'luteal';
    phaseName = 'Luteal Phase';
    phaseHeadline = 'Nourishing tempo • Focus on grounded comfort';
    phaseDescription =
      'Progesterone dominates to sustain the uterine environment. Your metabolic burn slightly elevates; gentler pacing and nutrient-rich warm meals bring ease.';
    phaseColor = '#6B21A8';
    phaseBg = '#F3E8FF';
    phaseTextColor = '#6B21A8';
  }

  return {
    hasCycleData: true,
    cycleDay,
    cycleLength,
    bleedDuration,
    phase,
    phaseName,
    phaseHeadline,
    phaseDescription,
    phaseColor,
    phaseBg,
    phaseTextColor,
    lastPeriodDate,
    lastPeriodDateFormatted: formatDate(lastPeriodDate),
    nextPeriodDate,
    nextPeriodDateFormatted: formatDate(nextPeriodDate),
    daysUntilNextPeriod,
    ovulationDate,
    ovulationDateFormatted: formatDate(ovulationDate),
    daysUntilOvulation,
    fertileWindowStartFormatted: formatShortDate(fertileWindowStart),
    fertileWindowEndFormatted: formatShortDate(fertileWindowEnd),
    isFertileToday,
    currentCycleStart,
    symptomsAdvice: getPersonalizedAdvice(symptoms, crampIntensity, phase),
  };
}

/**
 * Returns science-grounded self-care guidance tailored to questionnaire symptoms and current phase
 */
function getPersonalizedAdvice(symptoms, crampIntensity, phase) {
  const tips = [];

  if (phase === 'menstrual') {
    tips.push({
      icon: '☕',
      title: 'Warmth & Circulation',
      text: 'A warm compress or chamomile tea eases uterine contractions by increasing local blood flow.',
    });
    if (symptoms.includes('Cramps') || crampIntensity === 'Severe' || crampIntensity === 'Very severe') {
      tips.push({
        icon: '🌿',
        title: 'Cramp Soothing',
        text: 'Magnesium glycinate or gentle lower-back stretches support natural smooth-muscle relaxation.',
      });
    }
    tips.push({
      icon: '💧',
      title: 'Hydration & Iron',
      text: 'Electrolytes and iron-rich foods (lentils, spinach, seeds) replenish what leaves during your bleed.',
    });
  } else if (phase === 'follicular') {
    tips.push({
      icon: '💡',
      title: 'Creative Problem Solving',
      text: 'Rising estradiol sharpens mental recall. Great time for deep-work projects and brainstorming.',
    });
    tips.push({
      icon: '🏃‍♀️',
      title: 'Active Movement',
      text: 'Muscle recovery is optimal in this phase; cardio or resistance sessions feel energizing.',
    });
    tips.push({
      icon: '🥗',
      title: 'Fresh & Vibrant Nutrition',
      text: 'Fermented foods and leafy greens assist liver metabolism as estrogen increases.',
    });
  } else if (phase === 'ovulatory') {
    tips.push({
      icon: '✨',
      title: 'Social & Collaborative Peak',
      text: 'Communication neurotransmitters are heightened. Enjoy shared conversations and presentation tasks.',
    });
    tips.push({
      icon: '💧',
      title: 'Hydration Boost',
      text: 'Cervical fluid production increases; prioritize continuous water intake throughout the day.',
    });
    tips.push({
      icon: '🥑',
      title: 'Healthy Fats',
      text: 'Avocado, olive oil, and nuts provide necessary fatty acid building blocks for peak endocrine function.',
    });
  } else {
    // Luteal Phase
    tips.push({
      icon: '🧘‍♀️',
      title: 'Pacing & Boundaries',
      text: 'Protect your evenings. Winding down without late screens prevents progesterone-related sleep disruption.',
    });
    if (symptoms.includes('Bloating') || symptoms.includes('Food cravings')) {
      tips.push({
        icon: '🍠',
        title: 'Complex Carbohydrates',
        text: 'Sweet potatoes, oats, and bananas stabilize blood sugar and prevent serotonin dips that cause mood swings.',
      });
    }
    tips.push({
      icon: '🌙',
      title: 'Tender Self-Compassion',
      text: 'Emotional sensitivity in this phase is biological, not a personal flaw. Honor your need for quiet.',
    });
  }

  return tips;
}

/**
 * Generates an accurate calendar month grid mapped with real cycle phases and daily mood check-ins
 */
export function generateMonthCalendar(targetYear, targetMonth, cycleAnalysis, moodLogs = []) {
  // targetMonth is 0-indexed (0 = Jan, 11 = Dec)
  const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
  const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);

  // Day of week: 0 = Sun, 1 = Mon ... 6 = Sat
  // Let's use Mon as 0:
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Sunday is 6

  const totalDays = lastDayOfMonth.getDate();
  const calendarCells = [];

  // Index mood logs by date key 'YYYY-MM-DD'
  const moodMap = {};
  if (Array.isArray(moodLogs)) {
    moodLogs.forEach((log) => {
      if (log && log.date) {
        let key = '';
        if (typeof log.date === 'string') {
          key = log.date.split('T')[0];
        } else if (log.date instanceof Date) {
          const y = log.date.getFullYear();
          const m = String(log.date.getMonth() + 1).padStart(2, '0');
          const d = String(log.date.getDate()).padStart(2, '0');
          key = `${y}-${m}-${d}`;
        }
        if (key) {
          moodMap[key] = log;
        }
      }
    });
  }

  // Pad empty cells before 1st of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push({ isPadding: true, dayNum: '', key: `pad-${i}` });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    hasCycleData,
    lastPeriodDate,
    cycleLength = 28,
    bleedDuration = 5,
  } = cycleAnalysis;

  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const cellDate = new Date(targetYear, targetMonth, dayNum);
    cellDate.setHours(0, 0, 0, 0);

    const isToday = cellDate.getTime() === today.getTime();

    // Generate dateKey YYYY-MM-DD
    const y = cellDate.getFullYear();
    const m = String(cellDate.getMonth() + 1).padStart(2, '0');
    const d = String(cellDate.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${d}`;

    const mood = moodMap[dateKey] || null;

    let dayCycleDay = null;
    let phaseType = 'none';

    if (hasCycleData && lastPeriodDate) {
      const diffTime = cellDate.getTime() - lastPeriodDate.getTime();
      const diffDays = Math.floor(diffTime / 86400000);

      // Map to 1..cycleLength
      dayCycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;

      if (dayCycleDay <= bleedDuration) {
        phaseType = 'menstrual';
      } else if (dayCycleDay >= cycleLength - 16 && dayCycleDay <= cycleLength - 12) {
        phaseType = dayCycleDay === cycleLength - 14 ? 'ovulation-peak' : 'ovulation-window';
      } else if (dayCycleDay < cycleLength - 16) {
        phaseType = 'follicular';
      } else {
        phaseType = 'luteal';
      }
    }

    calendarCells.push({
      isPadding: false,
      dayNum,
      date: cellDate,
      dateKey,
      isToday,
      cycleDay: dayCycleDay,
      phaseType,
      mood,
    });
  }

  return calendarCells;
}

