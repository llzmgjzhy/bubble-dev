"use client";

import { useMemo, useState } from "react";
import type {
  BubbleStory,
  ReplayScriptItem,
  StoryFragment,
} from "@/app/types/bubble";

type StoryReplayProps = {
  bubble: BubbleStory;
  onExit: () => void;
};

const fallbackItem: ReplayScriptItem = {
  fragmentId: "empty",
  displayText: "这段记忆还在慢慢整理。",
  duration: 2400,
};

const fragmentTypeLabel: Record<StoryFragment["type"], string> = {
  scene: "场景",
  trigger: "触发",
  feeling: "感受",
  memory: "回忆",
  echo: "回声",
};

function clampIndex(index: number, total: number) {
  return Math.min(Math.max(index, 0), Math.max(total - 1, 0));
}

function truncateText(text: string, maxLength = 220) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}……` : text;
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
  const currentReplay = replayItems[currentIndex];
  const currentFragment = bubble.storyFragments.find(
    (fragment) => fragment.id === currentReplay.fragmentId,
  );
  const backgroundImage = currentFragment?.attachedMedia?.[0]?.url;
  const isLast = currentIndex === replayItems.length - 1;
  const title = currentFragment?.title || currentReplay.displayText;
  const shouldShowReplayText = currentReplay.displayText.trim() !== title.trim();
  const bodyText = currentFragment?.text
    ? truncateText(currentFragment.text)
    : "";

  function goPrevious() {
    setCurrentIndex((index) => clampIndex(index - 1, replayItems.length));
  }

  function goNext() {
    setCurrentIndex((index) => clampIndex(index + 1, replayItems.length));
  }

  return (
    <main className="app-shell relative min-h-screen overflow-hidden bg-[#151827] text-white">
      {backgroundImage ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 scale-[1.02] bg-cover bg-center transition-transform duration-700"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[#151827]/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#151827]/25 via-transparent to-[#151827]/40" />
        </>
      ) : (
        <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-orb float-slow absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
          <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
          <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7">
        <button
          type="button"
          onClick={onExit}
          className="ghost-button bubble-soft mb-4 w-fit rounded-full px-4 py-2 text-sm"
        >
          退出回看
        </button>

        <div className="flex gap-1.5">
          {replayItems.map((item, index) => (
            <div
              key={`${item.fragmentId}-${index}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/18"
            >
              <div
                className={`h-full rounded-full bg-white/80 transition-all duration-500 ${
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

          <div className="pointer-events-none mx-auto max-w-2xl rounded-3xl border border-white/15 bg-[#151827]/45 px-6 py-6 text-left shadow-2xl shadow-[#070a18]/30 backdrop-blur-sm sm:px-8 sm:py-8">
            {currentFragment && (
              <p className="text-xs tracking-[0.22em] text-white/55">
                {fragmentTypeLabel[currentFragment.type]}
              </p>
            )}

            <h1 className="mt-4 whitespace-pre-wrap text-3xl font-medium leading-tight text-white/92 sm:text-5xl">
              {title}
            </h1>

            {shouldShowReplayText && (
              <p className="mt-5 whitespace-pre-wrap text-xl font-light leading-9 text-white/80 sm:text-2xl">
                {currentReplay.displayText}
              </p>
            )}

            {bodyText && (
              <p className="mt-6 max-w-2xl whitespace-pre-wrap text-base leading-8 text-white/72 sm:text-lg">
                {bodyText}
              </p>
            )}

            {isLast && (
              <button
                type="button"
                onClick={onExit}
                className="ghost-button pointer-events-auto bubble-soft mt-10 rounded-full px-5 py-3 text-sm"
              >
                回到故事流
              </button>
            )}
          </div>
        </section>

        <footer className="glass-panel mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xl font-medium text-white/90">{bubble.title}</p>
            <p className="mt-2 text-xs text-white/45">
              {currentIndex + 1} / {replayItems.length} · 点击左右两侧切换
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {bubble.mood.map((mood) => (
              <span
                key={mood}
                className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs text-white/70"
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
