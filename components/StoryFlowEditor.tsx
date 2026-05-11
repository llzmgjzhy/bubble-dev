"use client";

import Link from "next/link";
import { useState } from "react";
import type { BubbleStory, StoryFragment } from "@/app/types/bubble";
import StoryReplay from "@/components/StoryReplay";

type StoryFlowEditorProps = {
  bubble: BubbleStory;
};

const fragmentTypeLabel: Record<StoryFragment["type"], string> = {
  scene: "场景",
  trigger: "触发",
  feeling: "感觉",
  memory: "记忆",
  echo: "回声",
};

const mediaTypeLabel: Record<
  StoryFragment["mediaSuggestion"]["type"],
  string
> = {
  image: "图片",
  video: "视频",
  music: "音乐",
  silence: "留白",
  text: "文字",
};

export default function StoryFlowEditor({ bubble }: StoryFlowEditorProps) {
  const [notice, setNotice] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isReplayMode, setIsReplayMode] = useState(false);

  function markComingSoon(action: string, fragmentTitle?: string) {
    setNotice(
      fragmentTitle
        ? `${fragmentTitle}：${action} 后续接入`
        : `${action} 后续接入`,
    );
  }

  if (isReplayMode) {
    return (
      <StoryReplay bubble={bubble} onExit={() => setIsReplayMode(false)} />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 px-5 py-8 text-zinc-50 sm:px-8 sm:py-12">
      <div className="bubble-drift pointer-events-none absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-300/16 blur-3xl" />
      <div className="bubble-float pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-fuchsia-300/14 blur-3xl" />
      <div className="bubble-drift pointer-events-none absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="flex flex-col gap-8 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-white/35">小泡泡</p>
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-white/95 sm:text-5xl">
              {bubble.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/58">
              {bubble.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {bubble.mood.map((mood) => (
                <span
                  key={mood}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/58 backdrop-blur"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReplayMode(true)}
            className="bubble-soft w-fit rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm text-white/72 hover:border-white/20 hover:bg-white/[0.1]"
          >
            进入回看模式
          </button>
        </header>

        {notice && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/64 backdrop-blur">
            {notice}
          </div>
        )}

        <section className="relative">
          <div className="absolute left-4 top-3 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-white/0 via-white/16 to-white/0 sm:left-1/2" />

          <div className="space-y-8">
            {bubble.storyFragments.map((fragment, index) => (
              <article
                key={fragment.id}
                className={`relative flex ${
                  index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
                }`}
              >
                <div className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full border border-white/30 bg-white/55 shadow-[0_0_24px_rgba(255,255,255,0.22)] sm:left-1/2" />
                <div className="ml-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-md sm:ml-0 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-white/45">
                      {fragmentTypeLabel[fragment.type]}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/50">
                      {mediaTypeLabel[fragment.mediaSuggestion.type]}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-medium text-white/92">
                    {fragment.title}
                  </h2>
                  <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-white/68">
                    {fragment.text}
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                    <p className="text-xs text-white/35">适合承载</p>
                    <p className="mt-2 text-sm leading-6 text-white/58">
                      {mediaTypeLabel[fragment.mediaSuggestion.type]}：
                      {fragment.mediaSuggestion.reason}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {fragment.userCanAdd.map((item) => (
                      <button
                        key={`${fragment.id}-${item}`}
                        type="button"
                        onClick={() => markComingSoon(`添加${item}`, fragment.title)}
                        className="bubble-soft rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/52 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/75"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/8 pt-4">
                    {["补一句", "添加图片", "添加音乐", "让 AI 帮我扩写"].map(
                      (action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => markComingSoon(action, fragment.title)}
                          className="bubble-soft rounded-full border border-white/10 px-3 py-2 text-xs text-white/48 hover:border-white/20 hover:text-white/75"
                        >
                          {action}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-md sm:p-7">
          <p className="text-sm tracking-[0.18em] text-white/35">
            AI 想轻轻问你
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bubble.followUpPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-2xl border border-white/8 bg-black/10 p-4"
              >
                <p className="text-sm leading-7 text-white/70">
                  {prompt.question}
                </p>
                {prompt.options && prompt.options.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.options.map((option) => (
                      <button
                        key={`${prompt.id}-${option}`}
                        type="button"
                        onClick={() => setSelectedPrompt(`已选择：${option}`)}
                        className="bubble-soft rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/52 hover:border-white/20 hover:bg-white/[0.08] hover:text-white/75"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPrompt && (
            <p className="mt-5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/62">
              {selectedPrompt}
            </p>
          )}
        </section>

        <footer className="mt-12 flex flex-col gap-4 pb-4">
          <button
            type="button"
            onClick={() => setIsOriginalOpen((current) => !current)}
            className="w-fit text-sm text-white/48 hover:text-white/75"
          >
            查看原始输入
          </button>
          {isOriginalOpen && (
            <p className="max-w-3xl whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/58">
              {bubble.originalText}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="bubble-soft rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-center text-sm text-white/68 hover:border-white/20 hover:bg-white/[0.09]"
            >
              再生成一个泡泡
            </Link>
            <Link
              href="/"
              className="bubble-soft rounded-full border border-white/10 px-5 py-3 text-center text-sm text-white/45 hover:border-white/20 hover:text-white/75"
            >
              回到首页
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
