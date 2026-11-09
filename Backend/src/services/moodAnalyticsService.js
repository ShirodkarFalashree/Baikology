
function getDateKey(date) {
  if (!date) return null;

  const value = String(date);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function getDateOffset(daysAgo, now = new Date()) {
  const date = new Date(now);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);

  return date.toISOString().slice(0, 10);
}

function countMoods(logs) {
  const counts = {};

  for (const log of logs) {
    const label = log.label?.trim();

    if (label) {
      counts[label] = (counts[label] || 0) + 1;
    }
  }

  return counts;
}

function getTopMood(counts) {
  const entries = Object.entries(counts);

  if (!entries.length) return null;

  entries.sort((a, b) => b[1] - a[1]);

  return {
    label: entries[0][0],
    count: entries[0][1],
  };
}

function analyzeMoodLogs(moodLogs = [], now = new Date()) {
  const validLogs = moodLogs
    .filter((log) => getDateKey(log.date) && log.label)
    .sort((a, b) => a.date.localeCompare(b.date));

  const today = getDateOffset(0, now);
  const last7Start = getDateOffset(6, now);
  const previous7Start = getDateOffset(13, now);
  const previous7End = getDateOffset(7, now);

  const recentLogs = validLogs.filter(
    (log) => log.date >= last7Start && log.date <= today
  );

  const previousLogs = validLogs.filter(
    (log) => log.date >= previous7Start && log.date <= previous7End
  );

  const moodDistribution = countMoods(recentLogs);
  const previousDistribution = countMoods(previousLogs);

  const topMood = getTopMood(moodDistribution);
  const previousTopMood = getTopMood(previousDistribution);

  const uniqueDays = new Set(recentLogs.map((log) => log.date));
  const notesCount = recentLogs.filter(
    (log) => log.note?.trim()
  ).length;

  const insights = [];

  if (recentLogs.length === 0) {
    insights.push(
      "No mood check-ins were recorded in the last 7 days. Add optional check-ins to start identifying your patterns."
    );
  } else {
    insights.push(
      `You recorded ${uniqueDays.size} mood check-in(s) across the last 7 days.`
    );

    if (topMood) {
      insights.push(
        `"${topMood.label}" was your most frequently recorded mood, appearing ${topMood.count} time(s).`
      );
    }

    insights.push(
      `You recorded ${Object.keys(moodDistribution).length} different mood label(s) during this period.`
    );

    if (notesCount > 0) {
      insights.push(
        `You added journal notes to ${notesCount} of your mood check-ins.`
      );
    }
  }

  let comparison = {
    available: false,
    message: "More check-ins are needed to compare the two weeks.",
  };

  if (recentLogs.length >= 3 && previousLogs.length >= 3) {
    comparison = {
      available: true,
      recentEntries: recentLogs.length,
      previousEntries: previousLogs.length,
      recentTopMood: topMood,
      previousTopMood,
      message: "Both weeks contain enough entries for a basic frequency comparison.",
    };
  }

  return {
    period: {
      startDate: last7Start,
      endDate: today,
      previousStartDate: previous7Start,
      previousEndDate: previous7End,
    },
    dataQuality: {
      totalEntries: recentLogs.length,
      daysLogged: uniqueDays.size,
      daysWithoutEntries: 7 - uniqueDays.size,
      sufficientForComparison: comparison.available,
    },
    moodDistribution,
    mostFrequentMood: topMood,
    comparison,
    journal: {
      notesCount,
      analysisAvailable: false,
      message: "Journal theme analysis will be added in the next version.",
    },
    insights,
    disclaimer:
      "These insights describe your recorded check-ins only. They are not a medical or mental-health diagnosis.",
  };
}

module.exports = { analyzeMoodLogs };
