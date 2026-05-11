export type MemoryFragment = {
  title: string;
  text: string;
};

export type BubbleScene = {
  type: "opening" | "memory" | "trigger" | "echo";
  text: string;
  visual?: string;
};

export type BubbleAnchor = {
  id: string;
  label: string;
  type: "place" | "time" | "body" | "music" | "person" | "memory" | "emotion";
  x: number;
  y: number;
  shortText: string;
  deepText: string;
};

export type BubbleFlowStep = {
  anchorId: string;
  delay: number;
  text: string;
};

export type BubbleLink = {
  from: string;
  to: string;
  reason: string;
};

export type GenerateBubbleInput = {
  title?: string;
  text: string;
  song?: string;
};

export type GeneratedBubble = {
  title: string;
  subtitle?: string;
  atmosphere?: string;
  emotions: string[];
  song?: string;
  anchors?: BubbleAnchor[];
  flow?: BubbleFlowStep[];
  links?: BubbleLink[];
  echo?: string;
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
    atmosphere: "周围很安静，像有什么在光里慢慢浮上来。",
    emotions: ["清醒过早", "空落", "旧事浮起"],
    song: trimmedSong || undefined,
    anchors: [
      {
        id: "early-light",
        label: "早光",
        type: "time",
        x: 24,
        y: 28,
        shortText: "天还没完全亮，身体先醒了。",
        deepText:
          "那一点灰蓝色的光停在房间里，像把时间放慢。醒来并不突然，只是周围太安静，连心里浮起的旧事都显得清楚。",
      },
      {
        id: "quiet-room",
        label: "房间",
        type: "place",
        x: 70,
        y: 34,
        shortText: "房间很轻，声音都被放低了。",
        deepText:
          "空间没有催促你去做什么。床、墙面、空气和没有说出口的话，都停在原来的位置，像一个可以短暂停靠的地方。",
      },
      {
        id: "body-awake",
        label: "未醒",
        type: "body",
        x: 42,
        y: 58,
        shortText: "还困着，却睡不回去了。",
        deepText:
          "身体还在被子和清晨之间，意识却已经先走远。那种半醒的重量，让很多画面从很深的地方慢慢靠近。",
      },
      {
        id: "song-thread",
        label: trimmedSong ? "那首歌" : "声音",
        type: trimmedSong ? "music" : "memory",
        x: 78,
        y: 68,
        shortText: trimmedSong
          ? `${trimmedSong}像一根线，把旧日子牵回来。`
          : "有一点声音，在安静里慢慢出现。",
        deepText: trimmedSong
          ? "它不是背景，更像一个轻轻打开的入口。前奏响起时，一些相似的清晨、房间和心跳，被悄悄带回同一个地方。"
          : "声音不需要很大，只要出现一点，就足够让空气变得有方向，让某些画面从边缘浮起来。",
      },
      {
        id: "old-days",
        label: "旧日子",
        type: "memory",
        x: 20,
        y: 74,
        shortText: "很多相似的时刻叠在一起。",
        deepText:
          "它们不是完整的故事，更像几块浮在水面的碎片。你看见它们靠近，又没有急着把它们说清楚。",
      },
    ],
    flow: [
      {
        anchorId: "early-light",
        delay: 1200,
        text: "光先醒来，房间还没有声音。",
      },
      {
        anchorId: "body-awake",
        delay: 2600,
        text: "身体还困着，心却已经浮起。",
      },
      {
        anchorId: "quiet-room",
        delay: 3600,
        text: "安静把所有东西都放轻了。",
      },
      {
        anchorId: "song-thread",
        delay: 4700,
        text: trimmedSong ? "那首歌把旧日子牵回来。" : "有一点声音慢慢靠近。",
      },
      {
        anchorId: "old-days",
        delay: 5800,
        text: "很多清晨叠在同一层空气里。",
      },
    ],
    links: [
      {
        from: "early-light",
        to: "body-awake",
        reason: "过早醒来的光牵动身体感",
      },
      {
        from: "quiet-room",
        to: "old-days",
        reason: "安静的空间让旧事浮起",
      },
      {
        from: "song-thread",
        to: "old-days",
        reason: "声音把记忆带回相似时刻",
      },
    ],
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
