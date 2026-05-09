"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const emotionOptions = [
  "清晨",
  "空落",
  "怀念",
  "余温",
  "未完成",
  "独处",
  "回落",
  "失真",
  "安静",
  "离开",
  "旧事",
  "温柔",
];

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [text, setText] = useState(searchParams.get("initialText") ?? "");
  const [song, setSong] = useState("");
  const [title, setTitle] = useState("");
  const canGenerate = text.trim().length > 0;

  function toggleEmotion(emotion: string) {
    setEmotions((current) =>
      current.includes(emotion)
        ? current.filter((item) => item !== emotion)
        : [...current, emotion],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canGenerate) {
      return;
    }

    router.push(
      `/bubble?time=${encodeURIComponent(time)}&place=${encodeURIComponent(place)}&emotions=${encodeURIComponent(emotions.join(","))}&text=${encodeURIComponent(text)}&song=${encodeURIComponent(song)}&title=${encodeURIComponent(title)}`,
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 px-6 py-12 text-zinc-100 sm:py-16">
      <div className="bubble-drift absolute left-1/2 top-12 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="bubble-float absolute bottom-20 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-fuchsia-300/14 blur-3xl" />
      <div className="bubble-drift absolute left-0 top-1/2 h-72 w-72 -translate-x-1/3 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl flex-col justify-center">
        <Link
          href="/"
          className="bubble-soft mb-10 w-fit rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-slate-200 hover:border-white/25 hover:bg-white/[0.1]"
        >
          返回首页
        </Link>

        <header className="relative text-center">
          <div className="bubble-float absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 -translate-y-8 rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] blur-[1px]" />
          <div className="relative">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              创建一个泡泡
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-300/75">
              把一段感觉、一首歌和一些画面，轻轻放进这里。
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-time"
              className="block text-lg font-medium text-zinc-100"
            >
              阶段 1：发生在什么时候？
            </label>
            <input
              id="bubble-time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              placeholder="比如：凌晨六点、返程路上、毕业前几天、一个下雨的傍晚"
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-place"
              className="block text-lg font-medium text-zinc-100"
            >
              阶段 2：那一刻你在哪里？
            </label>
            <input
              id="bubble-place"
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="宿舍、火车上、操场边、家里的房间"
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <h2 className="text-lg font-medium text-zinc-100">
              阶段 3：那种感觉更接近什么？
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400/80">
              可以多选，像是在给那段感觉找几个坐标。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {emotionOptions.map((emotion) => {
                const isSelected = emotions.includes(emotion);

                return (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => toggleEmotion(emotion)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition duration-300 ${
                      isSelected
                        ? "border-cyan-100/50 bg-white text-neutral-950"
                        : "border-white/15 bg-white/[0.06] text-slate-200 hover:border-white/30 hover:bg-white/[0.1]"
                    }`}
                  >
                    {emotion}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-text"
              className="block text-lg font-medium text-zinc-100"
            >
              阶段 4：把那段感觉写下来
            </label>
            <textarea
              id="bubble-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="不要写发生了什么，试着写那一刻你像是被什么包围着。"
              className="mt-4 min-h-[180px] w-full resize-none rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base leading-8 text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-song"
              className="block text-lg font-medium text-zinc-100"
            >
              哪首歌会把你带回那里？
            </label>
            <input
              id="bubble-song"
              value={song}
              onChange={(event) => setSong(event.target.value)}
              placeholder="歌名 / 歌手 / 一段歌词"
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
            <div className="mt-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-slate-200/85">
              {song.trim() ? `将放入：${song}` : "还没有放入音乐"}
            </div>
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-title"
              className="block text-lg font-medium text-zinc-100"
            >
              你想把这个泡泡叫做什么？
            </label>
            <p className="mt-2 text-sm leading-6 text-slate-400/80">
              也可以先空着，让它自己长出名字。
            </p>
            <input
              id="bubble-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：冬天宿舍六点醒来"
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <button
            type="submit"
            disabled={!canGenerate}
            className="bubble-soft mt-2 w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            生成这个泡泡
          </button>
          {!canGenerate && (
            <p className="text-center text-sm text-slate-500">
              至少写下一点什么，泡泡才会开始形成。
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateForm />
    </Suspense>
  );
}
