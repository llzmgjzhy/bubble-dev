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

export default function Home() {
  return (
    <main className="app-shell relative min-h-screen overflow-hidden bg-[#151827] px-6 text-white">
      <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb float-slow absolute left-[-8rem] top-[-6rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
        <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
        <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl py-16 sm:py-24">
        <section className="mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="mb-5 text-sm text-white/60">小泡泡</p>
          <h1 className="whitespace-nowrap text-[clamp(1.7rem,8.5vw,4.5rem)] font-semibold">
            为某段感觉，留一个入口
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            把音乐、文字和记忆碎片，聚成一个可以重返的泡泡。
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="soft-button bubble-soft px-6 py-3 text-sm font-medium"
            >
              创建一个泡泡
            </Link>
            <Link
              href="#examples"
              className="ghost-button bubble-soft rounded-full px-6 py-3 text-sm font-medium"
            >
              看看示例泡泡
            </Link>
          </div>
        </section>

        <section id="examples" className="pt-10">
          <div className="text-center">
            <p className="text-sm text-white/60">一些可能的入口</p>
            <h2 className="mt-3 text-2xl font-medium text-white/90">
              示例泡泡
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {exampleBubbles.map((bubble) => (
              <article
                key={bubble.title}
                className="glass-panel bubble-soft p-5 hover:border-white/25 hover:bg-white/[0.1]"
              >
                <h3 className="text-xl font-medium text-white/90">
                  {bubble.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  {bubble.intro}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {bubble.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs text-white/75"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-white/70">
                  {bubble.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-medium tracking-tight text-white/90">
              你最近有过这样的时刻吗？
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/create?initialText=${encodeURIComponent(prompt)}`}
                className="glass-panel bubble-soft group p-4 text-sm leading-7 text-white/75 hover:border-white/25 hover:bg-white/[0.1] hover:text-white/90"
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
