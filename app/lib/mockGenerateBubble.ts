export type BubbleNode = {
  title: string;
  text: string;
};

export type GeneratedBubble = {
  title: string;
  intro: string;
  emotions: string[];
  song: string;
  nodes: BubbleNode[];
  originalText: string;
};

export function mockGenerateBubble(
  text: string,
  song: string,
): GeneratedBubble {
  const trimmedText = text.trim();
  const trimmedSong = song.trim();
  const title = trimmedText
    ? `${trimmedText.slice(0, 12)}${trimmedText.length > 12 ? "..." : ""}`
    : "未命名泡泡";

  return {
    title,
    intro: "慢慢靠近那段感觉",
    emotions: ["清晨", "空落", "独处"],
    song: trimmedSong || "还没有选择一首歌",
    nodes: [
      {
        title: "入口",
        text: trimmedText || "这段记忆还在等待被写下。",
      },
      {
        title: "回声",
        text: "有些感觉不会立刻说清，只会在心里轻轻停留。",
      },
      {
        title: "停靠",
        text: "把它放进这里，等某天再回来看看。",
      },
    ],
    originalText: trimmedText,
  };
}
