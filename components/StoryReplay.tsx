"use client";

import { getMoodTheme } from "@/app/lib/moodTheme";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type {
  BubbleStory,
  ReplayScriptItem,
  StoryFragment,
} from "@/app/types/bubble";
import AppShell from "@/components/AppShell";

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
  const theme = getMoodTheme(bubble.mood);

  function goPrevious() {
    setCurrentIndex((index) => clampIndex(index - 1, replayItems.length));
  }

  function goNext() {
    setCurrentIndex((index) => clampIndex(index + 1, replayItems.length));
  }

  const content = (
    <>
      {backgroundImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt={currentFragment?.title ?? bubble.title}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(30,41,59,0.10)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-900/15 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-slate-900/20" />
        </>
      ) : null}

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7">
        <button
          type="button"
          onClick={onExit}
          className="mist-button-secondary mb-4 w-fit px-4 py-2 text-sm"
        >
          退出回看
        </button>

        <div className="mist-panel flex gap-1.5 px-3 py-3">
          {replayItems.map((item, index) => (
            <div
              key={`${item.fragmentId}-${index}`}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/55"
            >
              <div
                className={`h-full rounded-full bg-white/80 transition-all duration-500 ${
                  index <= currentIndex ? "w-full" : "w-0"
                }`}
                style={{
                  backgroundColor:
                    index <= currentIndex ? theme.accent : undefined,
                  boxShadow:
                    index <= currentIndex
                      ? `0 0 18px ${theme.accent}66`
                      : undefined,
                }}
              />
            </div>
          ))}
        </div>

        <section className="relative flex flex-1 items-center justify-center py-12 text-center">
          <button
            type="button"
            aria-label="上一段"
            onClick={goPrevious}
            className="mist-link-button absolute inset-y-0 left-0 z-10 w-1/2 cursor-w-resize opacity-0"
          />
          <button
            type="button"
            aria-label="下一段"
            onClick={goNext}
            className="mist-link-button absolute inset-y-0 right-0 z-10 w-1/2 cursor-e-resize opacity-0"
          />
          <span className="mist-link-button pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 text-xs opacity-70 sm:inline-flex">
            上一条
          </span>
          <span className="mist-link-button pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 text-xs opacity-70 sm:inline-flex">
            下一条
          </span>

          <div
            className="pointer-events-none mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/62 p-6 text-left shadow-2xl shadow-indigo-200/25 backdrop-blur-2xl md:p-8"
            style={{
              borderColor: `${theme.accent}55`,
              boxShadow: `0 22px 64px rgb(129 140 248 / 0.18), 0 0 42px ${theme.accent}16`,
            }}
          >
            {currentFragment && (
              <span className="mist-chip text-xs">
                {fragmentTypeLabel[currentFragment.type]}
              </span>
            )}

            <h1 className="mt-4 whitespace-pre-wrap text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              {title}
            </h1>

            {shouldShowReplayText && (
              <p className="mt-5 whitespace-pre-wrap text-xl font-light leading-9 text-slate-600 sm:text-2xl">
                {currentReplay.displayText}
              </p>
            )}

            {bodyText && (
              <p className="mt-6 max-w-2xl whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg">
                {bodyText}
              </p>
            )}

            {isLast && (
              <button
                type="button"
                onClick={onExit}
                className="mist-button-secondary pointer-events-auto mt-10 px-5 py-3 text-sm"
              >
                回到故事流
              </button>
            )}
          </div>
        </section>

        <footer className="mist-panel mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xl font-medium text-slate-900">{bubble.title}</p>
            <p className="mt-2 text-xs text-slate-500">
              {currentIndex + 1} / {replayItems.length} · 点击左右两侧切换
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {bubble.mood.map((mood) => (
              <span
                key={mood}
                className="mist-chip px-3 py-1 text-xs"
                style={{
                  borderColor: `${theme.accent}55`,
                  boxShadow: `0 0 18px ${theme.accent}14`,
                }}
              >
                {mood}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </>
  );

  if (backgroundImage) {
    return (
      <main
        className="relative min-h-screen overflow-hidden text-slate-900"
        style={{ "--mood-accent": theme.accent } as CSSProperties}
      >
        {content}
      </main>
    );
  }

  return (
    <AppShell
      variant="replay"
      style={{ "--mood-accent": theme.accent } as CSSProperties}
    >
      {content}
    </AppShell>
  );
}
