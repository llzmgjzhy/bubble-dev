export type MoodTheme = {
  name: string;
  gradient: string;
  orbs: string[];
  accent: string;
};

const morningMood = ["清晨", "安静", "空落", "独处"];
const warmMood = ["怀念", "余温", "温柔"];
const dreamMood = ["失真", "漂浮", "梦感"];

const themes: Record<string, MoodTheme> = {
  morning: {
    name: "morning",
    gradient: "from-[#f5e6d3] via-[#d8e7f5] to-[#c7d2fe]",
    orbs: [
      "rgba(147,197,253,0.35)",
      "rgba(221,214,254,0.32)",
      "rgba(255,237,213,0.24)",
    ],
    accent: "#93c5fd",
  },
  warm: {
    name: "warm",
    gradient: "from-[#fed7aa] via-[#fbcfe8] to-[#fde68a]",
    orbs: [
      "rgba(251,191,120,0.34)",
      "rgba(244,114,182,0.24)",
      "rgba(253,224,171,0.22)",
    ],
    accent: "#fbbf24",
  },
  dream: {
    name: "dream",
    gradient: "from-[#ddd6fe] via-[#bae6fd] to-[#fbcfe8]",
    orbs: [
      "rgba(196,181,253,0.36)",
      "rgba(125,211,252,0.25)",
      "rgba(244,114,182,0.18)",
    ],
    accent: "#c4b5fd",
  },
  default: {
    name: "default",
    gradient: "from-[#a78bfa] via-[#60a5fa] to-[#fbbf78]",
    orbs: [
      "rgba(168,135,255,0.3)",
      "rgba(96,165,250,0.24)",
      "rgba(251,191,120,0.18)",
    ],
    accent: "#a78bfa",
  },
};

function includesAnyMood(mood: string[], candidates: string[]) {
  return mood.some((item) =>
    candidates.some((candidate) => item.includes(candidate)),
  );
}

export function getMoodTheme(mood: string[]): MoodTheme {
  if (includesAnyMood(mood, morningMood)) {
    return themes.morning;
  }

  if (includesAnyMood(mood, warmMood)) {
    return themes.warm;
  }

  if (includesAnyMood(mood, dreamMood)) {
    return themes.dream;
  }

  return themes.default;
}
