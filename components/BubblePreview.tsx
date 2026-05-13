"use client";

import { getMoodTheme } from "@/app/lib/moodTheme";
import type { BubbleStory, ReplayScriptItem } from "@/app/types/bubble";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import AppShell from "@/components/AppShell";

type BubblePreviewProps = {
  bubble: BubbleStory;
  onContinue: () => void;
  onRegenerate?: () => void;
};

type PreviewItem = ReplayScriptItem & {
  fallbackTitle: string;
};

const fallbackItem: PreviewItem = {
  fragmentId: "empty",
  displayText: "这个泡泡还在慢慢成形。",
  duration: 4000,
  fallbackTitle: "慢慢浮现",
};

const fragmentTypeLabel = {
  scene: "场景",
  trigger: "触发",
  feeling: "感受",
  memory: "回忆",
  echo: "回声",
} as const;

function truncateText(text: string, maxLength = 120) {
  return text.length > maxLength ? `${text.slice(0, maxLength)}……` : text;
}

function getPreviewItems(bubble: BubbleStory): PreviewItem[] {
  const source =
    bubble.replayScript.length > 0
      ? bubble.replayScript
      : bubble.storyFragments.map((fragment) => ({
          fragmentId: fragment.id,
          displayText: fragment.title,
          duration: 4000,
        }));

  return source.slice(0, 6).map((item) => {
    const fragment = bubble.storyFragments.find(
      (candidate) => candidate.id === item.fragmentId,
    );

    return {
      ...item,
      fallbackTitle: fragment?.title ?? item.displayText,
      duration: 4000,
    };
  });
}

export default function BubblePreview({
  bubble,
  onContinue,
  onRegenerate,
}: BubblePreviewProps) {
  const theme = getMoodTheme(bubble.mood);
  const previewItems = useMemo(() => {
    const items = getPreviewItems(bubble);
    return items.length > 0 ? items : [fallbackItem];
  }, [bubble]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const currentItem = previewItems[currentIndex] ?? fallbackItem;
  const currentFragment = bubble.storyFragments.find(
    (fragment) => fragment.id === currentItem.fragmentId,
  );
  const backgroundImage = currentFragment?.attachedMedia?.[0]?.url;
  const title = currentFragment?.title ?? currentItem.fallbackTitle;
  const bodyText = currentFragment?.text
    ? truncateText(currentFragment.text)
    : "";
  const motionSeed = currentIndex % 3;
  const orbShift =
    motionSeed === 0
      ? ["-left-24 top-12 opacity-65", "-right-24 top-36 opacity-55", "bottom-[-8rem] left-[30%] opacity-50"]
      : motionSeed === 1
        ? ["left-[8%] top-24 opacity-55", "right-[-8rem] top-20 opacity-65", "bottom-[-7rem] left-[48%] opacity-45"]
        : ["left-[-7rem] top-[28%] opacity-50", "right-[8%] top-[34%] opacity-52", "bottom-[-9rem] left-[18%] opacity-60"];

  useEffect(() => {
    if (hasEnded || isPaused) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCurrentIndex((index) => {
        if (index >= previewItems.length - 1) {
          setHasEnded(true);
          return index;
        }

        return index + 1;
      });
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [currentIndex, hasEnded, isPaused, previewItems.length]);

  function goPrevious() {
    setHasEnded(false);
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function goNext() {
    if (hasEnded) {
      return;
    }

    setCurrentIndex((index) => {
      if (index >= previewItems.length - 1) {
        setHasEnded(true);
        return index;
      }

      return index + 1;
    });
  }

  function replay() {
    setCurrentIndex(0);
    setHasEnded(false);
    setIsPaused(false);
  }

  const previewContent = (
    <>
      {backgroundImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentItem.fragmentId}
            src={backgroundImage}
            alt={title}
            className="bubble-preview-image pointer-events-none absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
          />
          <div className="pointer-events-none absolute inset-0 bg-[rgba(248,250,252,0.14)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/45 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-white/55" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`float-slow absolute h-80 w-80 rounded-full blur-3xl transition-opacity duration-700 ${orbShift[0]}`}
            style={{ backgroundColor: theme.orbs[0] }}
          />
          <div
            className={`bubble-float absolute h-96 w-96 rounded-full blur-3xl transition-opacity duration-700 ${orbShift[1]}`}
            style={{ backgroundColor: theme.orbs[1] }}
          />
          <div
            className={`float-slow absolute h-96 w-96 rounded-full blur-3xl transition-opacity duration-700 ${orbShift[2]}`}
            style={{ backgroundColor: theme.orbs[2] }}
          />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-6 sm:px-8 sm:py-8">
        <div className="mist-panel mx-auto w-full max-w-4xl px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="truncate text-sm font-semibold text-slate-800">
              {bubble.title}
            </p>
            <p className="text-xs text-slate-500">
              {hasEnded ? "已形成轮廓" : `${currentIndex + 1} / ${previewItems.length}`}
            </p>
          </div>
          <div className="flex gap-1.5">
            {previewItems.map((item, index) => (
              <div
                key={`${item.fragmentId}-${index}`}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/45"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index <= currentIndex ? "w-full" : "w-0"
                  }`}
                  style={{
                    backgroundColor:
                      index <= currentIndex ? theme.accent : undefined,
                    boxShadow:
                      index <= currentIndex
                        ? `0 0 18px ${theme.accent}55`
                        : undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <section className="relative flex flex-1 items-start justify-center pt-[18vh] text-left">
          <button
            type="button"
            onClick={goPrevious}
            className="mist-link-button absolute inset-y-0 left-0 z-10 w-1/2 cursor-w-resize opacity-0"
            aria-label="查看上一段泡泡预览"
          />
          <button
            type="button"
            onClick={goNext}
            className="mist-link-button absolute inset-y-0 right-0 z-10 w-1/2 cursor-e-resize opacity-0"
            aria-label="查看下一段泡泡预览"
          />

          <div
            key={hasEnded ? "ended" : currentIndex}
            className="bubble-preview-rise relative mx-auto max-w-2xl overflow-hidden rounded-[2.25rem] border border-white/55 bg-white/54 p-6 text-slate-900 shadow-2xl shadow-indigo-200/20 backdrop-blur-2xl transition-all duration-700 md:p-8"
            style={{
              borderColor: `${theme.accent}3d`,
              boxShadow: `0 28px 90px rgb(116 128 180 / 0.16), 0 0 54px ${theme.accent}14, inset 0 1px 1px rgb(255 255 255 / 0.62)`,
            }}
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/45 blur-3xl" />
            <div className="relative">
            {hasEnded ? (
              <>
                <p className="mist-chip w-fit text-xs">泡泡轮廓</p>
                <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
                  这个泡泡有了第一层轮廓
                </h1>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  它还不是完整的。也许还缺一张画面、一首真正的歌，或者一句你刚刚想起来但还没说出口的话。
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "给某个片段放一张图",
                    "让 AI 问你一个问题",
                    "把不准确的地方改掉",
                  ].map((hint) => (
                    <span key={hint} className="mist-chip text-xs">
                      {hint}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onContinue}
                    className="mist-button-primary text-sm shadow-[0_18px_48px_rgba(15,23,42,0.24)]"
                  >
                    继续补全这个泡泡
                  </button>
                  <button
                    type="button"
                    onClick={replay}
                    className="mist-button-secondary text-sm"
                  >
                    再看一遍
                  </button>
                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="mist-button-secondary text-sm"
                    >
                      重新生成
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {currentFragment && (
                  <p className="mist-chip w-fit text-xs">
                    {fragmentTypeLabel[currentFragment.type]}
                  </p>
                )}
                <h1 className="mt-5 text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-5 whitespace-pre-wrap text-xl font-light leading-9 text-slate-600 sm:text-2xl">
                  {currentItem.displayText}
                </p>
                {bodyText && (
                  <p className="mt-6 whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg">
                    {bodyText}
                  </p>
                )}
              </>
            )}
            </div>
          </div>
        </section>

        <footer
          className={`mist-panel mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-4 transition-all duration-700 sm:flex-row sm:items-center sm:justify-between ${
            hasEnded ? "opacity-100" : "opacity-55 hover:opacity-90"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {bubble.mood.map((mood) => (
              <span key={mood} className="mist-chip text-xs">
                {mood}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              className="mist-button-secondary text-sm"
            >
              {isPaused ? "继续" : "暂停"}
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="mist-button-primary text-sm"
            >
              继续补全这个泡泡
            </button>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                className="mist-button-secondary text-sm"
              >
                重新生成
              </button>
            )}
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
        {previewContent}
      </main>
    );
  }

  return (
    <AppShell
      variant="replay"
      style={{ "--mood-accent": theme.accent } as CSSProperties}
    >
      {previewContent}
    </AppShell>
  );
}
