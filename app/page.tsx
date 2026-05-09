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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 px-6 text-zinc-100">
      <div className="bubble-drift absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="bubble-float absolute bottom-40 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-fuchsia-300/14 blur-3xl" />
      <div className="bubble-drift absolute left-0 top-1/2 h-72 w-72 -translate-x-1/3 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl py-16 sm:py-24">
        <section className="mx-auto flex min-h-[68vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="mb-5 text-sm text-slate-500">小泡泡</p>
          <h1 className="whitespace-nowrap text-[clamp(1.7rem,8.5vw,4.5rem)] font-semibold">
            为某段感觉，留一个入口
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300/80 sm:text-lg">
            把音乐、文字和记忆碎片，聚成一个可以重返的泡泡。
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="bubble-soft rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 hover:bg-white/85"
            >
              创建一个泡泡
            </Link>
            <Link
              href="#examples"
              className="bubble-soft rounded-full border border-white/15 bg-white/[0.07] px-6 py-3 text-sm font-medium text-slate-100 hover:border-white/25 hover:bg-white/[0.1]"
            >
              看看示例泡泡
            </Link>
          </div>
        </section>

        <section id="examples" className="pt-10">
          <div className="text-center">
            <p className="text-sm text-slate-500">一些可能的入口</p>
            <h2 className="mt-3 text-2xl font-medium text-zinc-100">
              示例泡泡
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {exampleBubbles.map((bubble) => (
              <article
                key={bubble.title}
                className="bubble-surface bubble-soft rounded-[1.5rem] border border-white/15 bg-white/[0.065] p-5 hover:border-white/25 hover:bg-white/[0.09]"
              >
                <h3 className="text-xl font-medium text-zinc-100">
                  {bubble.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {bubble.intro}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {bubble.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-50"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-7 text-slate-300/80">
                  {bubble.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-medium tracking-tight text-zinc-100">
              你最近有过这样的时刻吗？
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/create?initialText=${encodeURIComponent(prompt)}`}
                className="bubble-surface bubble-soft group rounded-2xl border border-white/15 bg-white/[0.055] p-4 text-sm leading-7 text-slate-200 hover:border-white/25 hover:bg-white/[0.085] hover:text-zinc-100"
              >
                <span className="mr-2 text-slate-500 transition group-hover:text-slate-300">
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
