"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("initialText") ?? "");
  const [song, setSong] = useState("");
  const [title, setTitle] = useState("");
  const [mediaNotice, setMediaNotice] = useState("");
  const canGenerate = text.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canGenerate) {
      return;
    }

    router.push(
      `/bubble?text=${encodeURIComponent(text)}&song=${encodeURIComponent(song)}&title=${encodeURIComponent(title)}`,
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
              把那个时刻写下来
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-300/75">
              不用整理，也不用完整。写下你记得的画面、声音、某个人，或者那种说不清的感觉。
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-text"
              className="block text-lg font-medium text-zinc-100"
            >
              把那个时刻写下来
            </label>
            <p className="mt-2 text-sm leading-6 text-slate-400/80">
              先把它放下来。哪怕只是几个画面、一个声音，或者一句没说完的话。
            </p>
            <textarea
              id="bubble-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="比如：今天早上很早醒来，宿舍很安静，我明明还困却睡不着。戴上耳机听到那首歌的时候，突然想起以前很多个类似的清晨……"
              className="mt-4 min-h-[260px] w-full resize-none rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base leading-8 text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-song"
              className="block text-lg font-medium text-zinc-100"
            >
              哪首歌会把你带回去？
            </label>
            <input
              id="bubble-song"
              value={song}
              onChange={(event) => setSong(event.target.value)}
              placeholder="歌名 / 歌手 / 一段歌词"
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <label
              htmlFor="bubble-title"
              className="block text-lg font-medium text-zinc-100"
            >
              给它一个名字
            </label>
            <input
              id="bubble-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：冬天宿舍六点醒来"
              className="mt-4 w-full rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 text-base text-zinc-100 outline-none transition placeholder:text-slate-400 focus:border-white/35"
            />
          </section>

          <section className="bubble-surface rounded-2xl border border-white/15 bg-white/[0.06] p-5">
            <h2 className="text-lg font-medium text-zinc-100">可选媒体</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMediaNotice("后续接入上传。")}
                className="bubble-soft rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-slate-100 hover:border-white/25 hover:bg-white/[0.09]"
              >
                添加图片
              </button>
              <button
                type="button"
                onClick={() => setMediaNotice("后续接入上传。")}
                className="bubble-soft rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-slate-100 hover:border-white/25 hover:bg-white/[0.09]"
              >
                添加视频
              </button>
              <button
                type="button"
                onClick={() => setMediaNotice("后续接入上传。")}
                className="bubble-soft rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm text-slate-100 hover:border-white/25 hover:bg-white/[0.09]"
              >
                添加更多声音
              </button>
            </div>
            {mediaNotice && (
              <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300/80">
                {mediaNotice}
              </p>
            )}
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
