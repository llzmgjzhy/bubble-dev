"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BubbleScene } from "@/app/lib/mockGenerateBubble";

export type PlayerBubble = {
  title: string;
  emotions: string[];
  song?: string;
  scenes: BubbleScene[];
  originalText: string;
};

type BubblePlayerProps = {
  bubble: PlayerBubble;
};

const sceneBackgrounds = [
  "from-sky-950 via-violet-950 to-rose-950",
  "from-cyan-950 via-slate-950 to-amber-950",
  "from-fuchsia-950 via-indigo-950 to-cyan-950",
  "from-rose-950 via-violet-950 to-orange-950",
  "from-emerald-950 via-slate-950 to-blue-950",
  "from-neutral-950 via-slate-950 to-violet-950",
];

function clampSceneIndex(index: number, total: number) {
  return Math.min(Math.max(index, 0), Math.max(total - 1, 0));
}

export default function BubblePlayer({ bubble }: BubblePlayerProps) {
  const scenes = useMemo(
    () =>
      bubble.scenes.length > 0
        ? bubble.scenes
        : [
            {
              type: "echo" as const,
              text: "这个泡泡暂时还没有展开。",
              visual: "安静的暗色空间、一点微光",
            },
          ],
    [bubble.scenes],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScene = scenes[currentIndex];
  const isLastScene = currentIndex === scenes.length - 1;
  const background =
    sceneBackgrounds[currentIndex % sceneBackgrounds.length] ??
    sceneBackgrounds[0];

  function goPrevious() {
    setCurrentIndex((index) => clampSceneIndex(index - 1, scenes.length));
  }

  function goNext() {
    setCurrentIndex((index) => clampSceneIndex(index + 1, scenes.length));
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${background} text-zinc-50 transition-colors duration-700`}
    >
      <div className="bubble-drift pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-3xl" />
      <div className="bubble-float pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full bg-cyan-200/15 blur-3xl" />
      <div className="bubble-drift pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-fuchsia-200/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.13),transparent_34%),radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_58%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-5 py-5 sm:px-8 sm:py-7">
        <div className="flex gap-1.5">
          {scenes.map((scene, index) => (
            <div
              key={`${scene.type}-${index}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"
            >
              <div
                className={`h-full rounded-full bg-white/80 transition-all duration-500 ${
                  index < currentIndex
                    ? "w-full"
                    : index === currentIndex
                      ? "w-2/3"
                      : "w-0"
                }`}
              />
            </div>
          ))}
        </div>

        <section className="relative flex flex-1 items-center justify-center py-10 text-center">
          <button
            type="button"
            aria-label="上一幕"
            onClick={goPrevious}
            className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize"
          />
          <button
            type="button"
            aria-label="下一幕"
            onClick={goNext}
            className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize"
          />

          <div className="bubble-surface bubble-float pointer-events-none relative mx-auto flex min-h-[22rem] w-full max-w-3xl flex-col items-center justify-center rounded-[3rem] border border-white/10 bg-white/[0.045] px-7 py-12 shadow-2xl shadow-black/20 backdrop-blur-md sm:px-12">
            <div className="absolute inset-6 rounded-[2.5rem] border border-white/[0.06]" />
            {currentScene.visual && (
              <p className="relative mb-8 max-w-md text-xs leading-6 tracking-[0.24em] text-white/35">
                {currentScene.visual}
              </p>
            )}
            <p
              className={`relative max-w-2xl whitespace-pre-wrap font-light leading-loose text-white/90 ${
                isLastScene
                  ? "text-3xl sm:text-5xl"
                  : "text-3xl sm:text-6xl"
              }`}
            >
              {currentScene.text}
            </p>
          </div>
        </section>

        <footer className="relative z-20 mx-auto flex w-full max-w-3xl flex-col gap-5 pb-3">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/10 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xl font-medium text-white/90">
                {bubble.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bubble.emotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/65"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
            {bubble.song && (
              <p className="max-w-xs text-sm leading-6 text-white/55">
                {bubble.song}
              </p>
            )}
          </div>

          {isLastScene && (
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/create"
                className="bubble-soft rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-center text-sm font-medium text-white/80 hover:border-white/20 hover:bg-white/[0.1]"
              >
                再生成一个泡泡
              </Link>
              <Link
                href="/"
                className="bubble-soft rounded-full border border-white/10 px-5 py-3 text-center text-sm font-medium text-white/55 hover:border-white/20 hover:text-white/80"
              >
                回到首页
              </Link>
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}
