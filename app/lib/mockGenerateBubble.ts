export type MemoryFragment = {
  title: string;
  text: string;
};

export type BubbleScene = {
  type: "opening" | "memory" | "trigger" | "echo";
  text: string;
  visual?: string;
};

export type GenerateBubbleInput = {
  title?: string;
  text: string;
  song?: string;
};

export type GeneratedBubble = {
  title: string;
  subtitle?: string;
  emotions: string[];
  song?: string;
  scenes?: BubbleScene[];
  originalText: string;
  scene?: {
    time: string;
    place: string;
    light: string;
    atmosphere: string;
  };
  opening?: string;
  sensoryFragments?: string[];
  memoryFragments?: MemoryFragment[];
  musicInterpretation?: string;
  reconstructedMoment?: string;
  echo?: string;
};

export function mockGenerateBubble({
  title,
  text,
  song,
}: GenerateBubbleInput): GeneratedBubble {
  const trimmedText = text.trim();
  const trimmedSong = song?.trim() ?? "";
  const trimmedTitle = title?.trim();
  const generatedTitle = trimmedTitle
    ? trimmedTitle
    : trimmedText
      ? `${trimmedText.slice(0, 12)}${trimmedText.length > 12 ? "..." : ""}`
      : "未命名泡泡";

  return {
    title: generatedTitle,
    subtitle: "那一刻被轻轻保存下来",
    emotions: ["清醒过早", "空落", "旧事浮起"],
    song: trimmedSong || undefined,
    scenes: [
      {
        type: "opening",
        text: "你走进来时，声音先停在耳边。",
        visual: "灰蓝色天光、安静房间、刚醒来的身体",
      },
      {
        type: "memory",
        text: trimmedText
          ? trimmedText.slice(0, 40)
          : "那段感觉还在等待被写下。",
        visual: "一段被放慢的清晨、空气很轻",
      },
      {
        type: trimmedSong ? "trigger" : "memory",
        text: trimmedSong
          ? `${trimmedSong}像一条很窄的路，把旧日子牵回来。`
          : "有一点声音在场，但它没有急着说明自己。",
        visual: "耳机、前奏、忽然靠近的旧画面",
      },
      {
        type: "echo",
        text: "那一刻没有走远，只是变轻了。",
        visual: "光慢慢散开、房间恢复安静",
      },
    ],
    scene: {
      time: "某个时刻",
      place: "某个地方",
      light: "灰蓝色的光",
      atmosphere: "周围很安静，像有什么慢慢浮上来。",
    },
    opening: "你走进来时，声音先停在耳边。",
    sensoryFragments: ["灰蓝色的天光", "安静的空气", "耳机里的前奏"],
    memoryFragments: [
      {
        title: "第一眼",
        text: trimmedText
          ? `那段感觉还在原地：${trimmedText}`
          : "那段感觉还在等待被写下。",
      },
      {
        title: "声音",
        text: trimmedSong
          ? `${trimmedSong}像一个很轻的开关，把某些旧日子打开。`
          : "有一点声音在场，但它没有急着说明自己。",
      },
      {
        title: "停留",
        text: "这不是一件完整的事，更像一个可以重新进入的瞬间。",
      },
    ],
    musicInterpretation: trimmedSong
      ? `${trimmedSong}不是背景，它像一条回到那一刻的窄路。`
      : undefined,
    reconstructedMoment:
      "你重新回到那个时刻，周围的声音变得很轻。光线停在房间或路上的某个角落，身体还没有完全醒来，心里却先被什么碰了一下。那些并不连贯的画面慢慢靠近，像隔着一层薄薄的水面。你没有急着解释，只是在那里多停了一会儿。",
    echo: "那一刻没有走远，只是变轻了。",
    originalText: trimmedText,
  };
}
