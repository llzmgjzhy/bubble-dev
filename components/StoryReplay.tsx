"use client";

import { useMemo, useState } from "react";
import type { BubbleStory, ReplayScriptItem } from "@/app/types/bubble";

type StoryReplayProps = {
  bubble: BubbleStory;
  onExit: () => void;
};

const fallbackItem: ReplayScriptItem = {
  fragmentId: "empty",
  displayText: "这段记忆还在慢慢整理。",
  duration: 2400,
};

function clampIndex(index: number, total: number) {
  return Math.min(Math.max(index, 0), Math.max(total - 1, 0));
}

export default function StoryReplay({
  bubble,
  onExit,
}: StoryReplayProps) {
  const replayItems = useMemo(
    () =>
      bubble.replayScript.length > 0 ? bubble.replayScript : [fallbackItem],
    [bubble.replayScript],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = replayItems[currentIndex];
  const isLast = currentIndex === replayItems.length - 1;

  function goPrevious() {
    setCurrentIndex((index) => clampIndex(index - 1, replayItems.length));
  }

  function goNext() {
    setCurrentIndex((index) => clampIndex(index + 1, replayItems.length));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 text-zinc-50">
      <div className="bubble-drift pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="bubble-float pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-cyan-300/16 blur-3xl" />
      <div className="bubble-drift pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 rounded-full bg-fuchsia-300/14 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_24%_70%,rgba(253,230,138,0.08),transparent_28%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7">
        <button
          type="button"
          onClick={onExit}
          className="bubble-soft mb-4 w-fit rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/60 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white/82"
        >
          退出回看
        </button>

        <div className="flex gap-1.5">
          {replayItems.map((item, index) => (
            <div
              key={`${item.fragmentId}-${index}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/12"
            >
              <div
                className={`h-full rounded-full bg-white/72 transition-all duration-500 ${
                  index <= currentIndex ? "w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        <section className="relative flex flex-1 items-center justify-center py-12 text-center">
          <button
            type="button"
            aria-label="上一段"
            onClick={goPrevious}
            className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize"
          />
          <button
            type="button"
            aria-label="下一段"
            onClick={goNext}
            className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize"
          />

          <div className="bubble-surface pointer-events-none mx-auto max-w-3xl rounded-[3rem] border border-white/10 bg-white/[0.045] px-7 py-14 shadow-2xl shadow-black/20 backdrop-blur-md sm:px-12 sm:py-16">
            <p className="whitespace-pre-wrap text-3xl font-light leading-loose text-white/90 sm:text-5xl">
              {currentItem.displayText}
            </p>

            {isLast && (
              <button
                type="button"
                onClick={onExit}
                className="pointer-events-auto bubble-soft mt-10 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.1]"
              >
                回到故事流
              </button>
            )}
          </div>
        </section>

        <footer className="mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/10 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xl font-medium text-white/88">{bubble.title}</p>
          <div className="flex flex-wrap gap-2">
            {bubble.mood.map((mood) => (
              <span
                key={mood}
                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/55"
              >
                {mood}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
