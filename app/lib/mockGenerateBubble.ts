export type BubbleNode = {
  title: string;
  text: string;
};

export type GenerateBubbleInput = {
  title?: string;
  text: string;
  song?: string;
  time?: string;
  place?: string;
  emotions?: string[];
};

export type GeneratedBubble = {
  title: string;
  intro: string;
  atmosphere: string;
  emotionSummary: string;
  sensoryDetails: string[];
  emotions: string[];
  song?: string;
  nodes: BubbleNode[];
  letterToFutureSelf: string;
  originalText: string;
};

export function mockGenerateBubble({
  title,
  text,
  song,
  time,
  place,
  emotions,
}: GenerateBubbleInput): GeneratedBubble {
  const trimmedText = text.trim();
  const trimmedSong = song?.trim() ?? "";
  const trimmedTitle = title?.trim();
  const trimmedTime = time?.trim();
  const trimmedPlace = place?.trim();
  const selectedEmotions =
    emotions?.map((emotion) => emotion.trim()).filter(Boolean) ?? [];
  const generatedEmotions =
    selectedEmotions.length > 0 ? selectedEmotions : ["清晨", "空落", "独处"];
  const generatedTitle = trimmedTitle
    ? trimmedTitle
    : trimmedText
      ? `${trimmedText.slice(0, 12)}${trimmedText.length > 12 ? "..." : ""}`
      : "未命名泡泡";
  const timeText = trimmedTime || "某个不太确定的时刻";
  const placeText = trimmedPlace || "一个安静的地方";
  const firstEmotion = generatedEmotions[0] ?? "安静";
  const secondEmotion = generatedEmotions[1] ?? "空落";

  return {
    title: generatedTitle,
    intro: "慢慢靠近那段感觉",
    atmosphere: `这是一个发生在${timeText}、停留在${placeText}里的${firstEmotion}时刻。`,
    emotionSummary: `这段记忆像是在${secondEmotion}里轻轻回落，不急着解释，只把当时的光、声音和身体感留住。`,
    sensoryDetails: [
      trimmedTime ? `${trimmedTime}的时间感` : "灰蓝色的天光",
      trimmedPlace ? `${trimmedPlace}里的空气` : "安静的房间",
      trimmedSong ? `${trimmedSong}响起的瞬间` : "耳机里的前奏",
    ],
    emotions: generatedEmotions,
    song: trimmedSong || "还没有选择一首歌",
    nodes: [
      {
        title: "最初的入口",
        text: trimmedText
          ? `那一刻先不是故事，而是一种把你包住的感觉：${trimmedText}`
          : "这段记忆还在等待被写下。",
      },
      {
        title: "身体的回声",
        text: `它更靠近“${firstEmotion}”，也带着一点“${secondEmotion}”。有些感觉不会立刻说清，只会在心里轻轻停留。`,
      },
      {
        title: "可以停靠的地方",
        text: `把${placeText}和这首歌放在一起，等某天再回来看看，当时的你究竟在保存什么。`,
      },
    ],
    letterToFutureSelf:
      "以后再想起这里，不必急着判断当时的自己。能把那一刻留下来，已经说明你认真经过了它。",
    originalText: trimmedText,
  };
}
