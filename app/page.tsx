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

const floatingWords = ["清晨", "余温", "未完成", "回落", "温柔"];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(191,219,254,0.55),transparent_32%),radial-gradient(circle_at_70%_30%,rgba(221,214,254,0.50),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(254,215,170,0.42),transparent_34%),linear-gradient(135deg,#eef3ff_0%,#f7f1ff_45%,#fff7ed_100%)] px-6 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="float-slow absolute left-[-9rem] top-[-8rem] h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="bubble-float absolute right-[-10rem] top-20 h-[28rem] w-[28rem] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="float-slow absolute bottom-[-10rem] left-[34%] h-[26rem] w-[26rem] rounded-full bg-orange-200/35 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(30,41,59,0.10)_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center overflow-hidden text-center">
          <div className="absolute inset-0">
            {exampleBubbles.map((bubble, index) => (
              <article
                key={bubble.title}
                className={`group absolute w-52 overflow-hidden rounded-[2.25rem] border border-white/35 p-5 text-left opacity-42 shadow-[0_26px_86px_rgba(129,140,248,0.20)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 hover:opacity-80 sm:w-56 ${
                  index === 0
                    ? "left-1/2 top-[9%] -translate-x-1/2 sm:left-[6%] sm:top-[18%] sm:translate-x-0"
                    : index === 1
                      ? "right-[4%] top-[18%] hidden lg:block"
                      : "bottom-[17%] left-[7%] hidden md:block"
                }`}
                style={{
                  animationDelay: `${index * 1.4}s`,
                  background:
                    "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.85), rgba(255,255,255,0.35) 45%, rgba(255,255,255,0.18) 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.65), 0 26px 86px rgba(129,140,248,0.20)",
                }}
              >
                <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-white/55 blur-2xl" />
                <div className="pointer-events-none absolute right-6 top-5 h-4 w-8 rotate-[-20deg] rounded-full bg-white/50 blur-[2px]" />
                <div className="relative">
                  <p className="text-[10px] text-slate-500/55">示例泡泡</p>
                  <h3 className="mt-2 text-base font-medium leading-snug text-slate-800/90">
                    {bubble.title}
                  </h3>
                </div>
                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {bubble.emotions.slice(0, 2).map((emotion) => (
                    <span
                      key={emotion}
                      className="rounded-full border border-white/45 bg-white/30 px-2 py-0.5 text-[10px] text-slate-500/70 backdrop-blur-md"
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
                className={`float-slow absolute hidden rounded-full border border-white/50 bg-white/35 px-3 py-1 text-xs text-slate-500/55 opacity-60 backdrop-blur-md sm:block ${
                  index === 0
                    ? "left-[18%] top-[10%]"
                    : index === 1
                      ? "right-[20%] top-[11%]"
                      : index === 2
                        ? "left-[22%] bottom-[19%]"
                        : index === 3
                          ? "right-[18%] bottom-[21%]"
                          : "right-[38%] bottom-[9%]"
                }`}
                style={{ animationDelay: `${index * 0.7}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="relative z-10 mx-auto max-w-2xl px-2">
            <p className="mb-5 text-sm tracking-[0.26em] text-slate-500">
              小泡泡
            </p>
            <h1 className="whitespace-nowrap text-[clamp(1.75rem,5.6vw,3.35rem)] font-medium leading-tight tracking-tight text-slate-950">
              为某段感觉，留一个入口
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              把音乐、文字和记忆碎片，轻轻聚成一个可以重返的泡泡。
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/create"
                className="mist-button-primary text-sm"
              >
                创建一个泡泡
              </Link>
              <Link
                href="#moments"
                className="mist-button-secondary text-sm"
              >
                看看示例
              </Link>
            </div>
          </div>
        </section>

        <section id="moments" className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-slate-500">一些可能浮起来的时刻</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
              你最近有过这样的时刻吗？
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/create?initialText=${encodeURIComponent(prompt)}`}
                className="mist-panel group p-4 text-sm leading-7 text-slate-600 transition-all duration-500 hover:-translate-y-1 hover:bg-white/70 hover:text-slate-800"
              >
                <span className="mr-2 text-slate-400 transition group-hover:text-slate-500">
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
