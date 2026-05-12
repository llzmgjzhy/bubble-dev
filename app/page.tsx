import Link from "next/link";

const exampleBubbles = [
  {
    title: "冬天宿舍六点醒来",
    intro: "一首歌把清晨轻轻推开。",
    emotions: ["清晨", "空落", "独处"],
    text: "窗外还没亮，房间里只有被窝和耳机里的回声。",
  },
  {
    title: "返程后的耳机里",
    intro: "回来的路上，心还停在别处。",
    emotions: ["回落", "余温", "漂浮"],
    text: "车窗反着光，城市慢慢靠近，身体却还没回来。",
  },
  {
    title: "毕业前的傍晚",
    intro: "有些告别在真正发生前就开始了。",
    emotions: ["未完成", "怀念", "离开"],
    text: "操场的风很慢，谁都没有认真说再见。",
  },
];

const prompts = [
  "凌晨醒来，明明很困却睡不着",
  "听到某首歌，突然想起一段很远的日子",
  "旅行回来后，感觉现实有点失真",
  "快要离开一个地方，却还没准备好",
  "某个普通傍晚，突然觉得很空",
  "想把一段关系留在一个不会被打扰的地方",
];

const floatingWords = ["清晨", "余温", "旧事", "回落", "未完成", "温柔"];

export default function Home() {
  return (
    <main className="app-shell relative overflow-hidden px-6">
      <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb float-slow absolute left-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
        <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
        <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl py-12 sm:py-20">
        <section className="relative mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center text-center">
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {exampleBubbles.map((bubble, index) => (
              <article
                key={bubble.title}
                className={`glass-panel float-slow absolute w-56 p-4 text-left opacity-75 ${
                  index === 0
                    ? "left-2 top-[15%]"
                    : index === 1
                      ? "right-2 top-[22%]"
                      : "bottom-[13%] left-[8%]"
                }`}
                style={{ animationDelay: `${index * 1.4}s` }}
              >
                <p className="text-[11px] text-white/45">示例泡泡</p>
                <h3 className="mt-2 text-base font-medium text-white/86">
                  {bubble.title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-white/58">
                  {bubble.intro}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {bubble.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/58"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0">
            {floatingWords.map((word, index) => (
              <span
                key={word}
                className={`float-slow absolute rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/40 backdrop-blur-sm ${
                  index === 0
                    ? "left-[10%] top-[7%]"
                    : index === 1
                      ? "right-[14%] top-[8%]"
                      : index === 2
                        ? "left-[20%] bottom-[23%]"
                        : index === 3
                          ? "right-[18%] bottom-[20%]"
                          : index === 4
                            ? "left-[45%] top-[15%]"
                            : "right-[35%] bottom-[9%]"
                }`}
                style={{ animationDelay: `${index * 0.7}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="relative z-10 mx-auto max-w-2xl px-2">
            <p className="mb-5 text-sm tracking-[0.26em] text-white/58">
              小泡泡
            </p>
            <h1 className="whitespace-nowrap text-[clamp(1.75rem,5.6vw,3.35rem)] font-medium leading-tight tracking-tight text-white/94">
              为某段感觉，留一个入口
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
              把音乐、文字和记忆碎片，轻轻聚成一个可以重返的泡泡。
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/create"
                className="soft-button bubble-soft px-7 py-3 text-sm font-medium shadow-[0_18px_48px_rgba(168,135,255,0.18)]"
              >
                创建一个泡泡
              </Link>
              <Link
                href="#moments"
                className="ghost-button bubble-soft px-6 py-3 text-sm font-medium"
              >
                找一个入口
              </Link>
            </div>
          </div>
        </section>

        <section id="moments" className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-white/58">一些可能浮起来的时刻</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-white/90 sm:text-3xl">
              你最近有过这样的时刻吗？
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/create?initialText=${encodeURIComponent(prompt)}`}
                className="glass-panel bubble-soft group p-4 text-sm leading-7 text-white/72 hover:border-white/25 hover:bg-white/[0.1] hover:text-white/90"
              >
                <span className="mr-2 text-white/55 transition group-hover:text-white/75">
                  ·
                </span>
                {prompt}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
