"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  BubbleAnchor,
  BubbleFlowStep,
  BubbleLink,
} from "@/app/lib/mockGenerateBubble";

export type RoomBubble = {
  title: string;
  subtitle: string;
  atmosphere: string;
  emotions: string[];
  anchors: BubbleAnchor[];
  flow: BubbleFlowStep[];
  links: BubbleLink[];
  echo: string;
  originalText: string;
};

type BubbleRoomProps = {
  bubble: RoomBubble;
};

const anchorStyles: Record<BubbleAnchor["type"], string> = {
  place: "border-cyan-100/25 bg-cyan-100/12 shadow-cyan-200/20",
  time: "border-amber-100/25 bg-amber-100/12 shadow-amber-200/20",
  body: "border-rose-100/25 bg-rose-100/12 shadow-rose-200/20",
  music: "border-fuchsia-100/25 bg-fuchsia-100/12 shadow-fuchsia-200/20",
  person: "border-pink-100/25 bg-pink-100/12 shadow-pink-200/20",
  memory: "border-violet-100/25 bg-violet-100/12 shadow-violet-200/20",
  emotion: "border-emerald-100/25 bg-emerald-100/12 shadow-emerald-200/20",
};

const fallbackAnchor: BubbleAnchor = {
  id: "opening",
  label: "入口",
  type: "memory",
  x: 50,
  y: 50,
  shortText: "这个泡泡正在等待靠近。",
  deepText: "先停在这里，让那段感觉慢慢浮起来。",
};

function clampPosition(value: number) {
  return Math.min(Math.max(value, 10), 90);
}

function createFallbackFlow(anchors: BubbleAnchor[]): BubbleFlowStep[] {
  return anchors.map((anchor, index) => ({
    anchorId: anchor.id,
    delay: 1200 + index * 900,
    text: anchor.shortText.slice(0, 36),
  }));
}

export default function BubbleRoom({ bubble }: BubbleRoomProps) {
  const anchors = useMemo(
    () => (bubble.anchors.length > 0 ? bubble.anchors : [fallbackAnchor]),
    [bubble.anchors],
  );
  const anchorById = useMemo(
    () => new Map(anchors.map((anchor) => [anchor.id, anchor])),
    [anchors],
  );
  const flow = useMemo(() => {
    const validFlow = bubble.flow.filter((step) => anchorById.has(step.anchorId));

    return validFlow.length > 0 ? validFlow : createFallbackFlow(anchors);
  }, [anchorById, anchors, bubble.flow]);
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [activeAnchorId, setActiveAnchorId] = useState(
    flow[0]?.anchorId ?? anchors[0]?.id ?? "opening",
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isEchoVisible, setIsEchoVisible] = useState(false);
  const [manualAnchorId, setManualAnchorId] = useState<string | null>(null);
  const [isTextVisible, setIsTextVisible] = useState(true);

  const activeAnchor = useMemo(
    () => anchorById.get(activeAnchorId) ?? anchors[0],
    [activeAnchorId, anchorById, anchors],
  );
  const currentFlow = flow[currentFlowIndex];
  const centerText = manualAnchorId
    ? activeAnchor?.shortText
    : isEchoVisible
      ? bubble.echo
      : currentFlow?.text || activeAnchor?.shortText || bubble.echo;
  const detailText = manualAnchorId
    ? activeAnchor?.deepText
    : isEchoVisible
      ? ""
      : activeAnchor?.shortText;

  useEffect(() => {
    if (isPaused || manualAnchorId || isEchoVisible || flow.length === 0) {
      return;
    }

    const step = flow[currentFlowIndex];
    const timeout = window.setTimeout(() => {
      setIsTextVisible(false);

      window.setTimeout(() => {
        if (currentFlowIndex >= flow.length - 1) {
          setIsEchoVisible(true);
          setIsTextVisible(true);
          return;
        }

        const nextIndex = currentFlowIndex + 1;
        setCurrentFlowIndex(nextIndex);
        setActiveAnchorId(flow[nextIndex]?.anchorId ?? activeAnchorId);
        setIsTextVisible(true);
      }, 280);
    }, step?.delay ?? 1800);

    return () => window.clearTimeout(timeout);
  }, [
    activeAnchorId,
    currentFlowIndex,
    flow,
    isEchoVisible,
    isPaused,
    manualAnchorId,
  ]);

  function handleAnchorClick(anchorId: string) {
    setManualAnchorId(anchorId);
    setActiveAnchorId(anchorId);
    setIsPaused(true);
    setIsEchoVisible(false);
    setIsTextVisible(true);

    window.setTimeout(() => {
      setManualAnchorId(null);
      setIsPaused(false);
    }, 5000);
  }

  function replayFlow() {
    setManualAnchorId(null);
    setIsPaused(false);
    setIsEchoVisible(false);
    setCurrentFlowIndex(0);
    setActiveAnchorId(flow[0]?.anchorId ?? anchors[0]?.id ?? "opening");
    setIsTextVisible(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 text-zinc-50">
      <div className="bubble-drift pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="bubble-float pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
      <div className="bubble-drift pointer-events-none absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-fuchsia-300/16 blur-3xl" />
      <div className="bubble-float pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/12 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.11),transparent_34%),radial-gradient(circle_at_22%_72%,rgba(165,243,252,0.08),transparent_28%),radial-gradient(circle_at_78%_26%,rgba(245,208,254,0.08),transparent_30%)]" />

      <section className="relative z-10 min-h-screen px-5 py-6 sm:px-8">
        <header className="pointer-events-none mx-auto flex max-w-5xl items-start justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] text-white/35">小泡泡</p>
            <h1 className="mt-3 text-2xl font-medium tracking-wide text-white/90 sm:text-3xl">
              {bubble.title}
            </h1>
          </div>
          <p className="max-w-xs text-right text-sm leading-6 text-white/45">
            {bubble.subtitle}
          </p>
        </header>

        <div className="pointer-events-none absolute inset-0 z-10">
          {bubble.emotions.map((emotion, index) => (
            <span
              key={`${emotion}-${index}`}
              className="bubble-float absolute rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/25 backdrop-blur"
              style={{
                left: `${16 + ((index * 19) % 64)}%`,
                top: `${20 + ((index * 17) % 56)}%`,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              {emotion}
            </span>
          ))}
        </div>

        <svg
          className="pointer-events-none absolute inset-x-4 bottom-28 top-24 z-10 h-[calc(100%-13rem)] w-[calc(100%-2rem)] overflow-visible sm:inset-x-8 sm:bottom-24 sm:top-24 sm:h-[calc(100%-12rem)] sm:w-[calc(100%-4rem)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {bubble.links.map((link, index) => {
            const from = anchorById.get(link.from);
            const to = anchorById.get(link.to);

            if (!from || !to) {
              return null;
            }

            const isActive =
              from.id === activeAnchor?.id || to.id === activeAnchor?.id;

            return (
              <line
                key={`${link.from}-${link.to}-${index}`}
                x1={clampPosition(from.x)}
                y1={clampPosition(from.y)}
                x2={clampPosition(to.x)}
                y2={clampPosition(to.y)}
                stroke="rgba(255,255,255,0.24)"
                strokeWidth={isActive ? 0.45 : 0.18}
                strokeDasharray="2 3"
                opacity={isActive ? 0.62 : 0.16}
              />
            );
          })}
        </svg>

        <div className="absolute inset-x-4 bottom-28 top-24 z-20 sm:inset-x-8 sm:bottom-24 sm:top-24">
          {anchors.map((anchor, index) => {
            const isActive = anchor.id === activeAnchor?.id;

            return (
              <button
                key={anchor.id}
                type="button"
                onClick={() => handleAnchorClick(anchor.id)}
                className={`bubble-soft absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-3 text-sm text-white/75 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:text-white ${
                  anchorStyles[anchor.type]
                } ${
                  isActive
                    ? "scale-125 border-white/55 bg-white/[0.22] text-white shadow-white/20"
                    : "animate-pulse"
                }`}
                style={{
                  left: `${clampPosition(anchor.x)}%`,
                  top: `${clampPosition(anchor.y)}%`,
                  animationDelay: `${index * 0.35}s`,
                }}
              >
                <span className="absolute inset-0 rounded-full bg-white/[0.08] blur-md" />
                <span className="relative">{anchor.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-5">
          <div className="bubble-surface pointer-events-auto w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.045] px-6 py-7 text-center shadow-2xl shadow-black/20 backdrop-blur-md sm:px-9 sm:py-9">
            <p className="text-sm text-white/35">
              {isEchoVisible ? "回声" : activeAnchor?.label}
            </p>
            <p
              className={`mt-4 text-2xl font-light leading-loose text-white/90 transition-opacity duration-500 sm:text-3xl ${
                isTextVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {centerText}
            </p>
            {detailText && (
              <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-white/58">
                {detailText}
              </p>
            )}

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused((current) => !current)}
                className="bubble-soft rounded-full border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {isPaused ? "继续" : "暂停"}
              </button>
              <button
                type="button"
                onClick={replayFlow}
                className="bubble-soft rounded-full border border-white/10 px-4 py-3 text-sm text-white/55 transition hover:border-white/20 hover:text-white/80"
              >
                再看一遍
              </button>
            </div>
          </div>
        </div>

        <footer className="absolute inset-x-5 bottom-5 z-40 mx-auto flex max-w-5xl flex-col gap-4 sm:inset-x-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm leading-7 text-white/48">{bubble.atmosphere}</p>
            <p className="mt-2 text-base leading-7 text-white/68">{bubble.echo}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/create"
              className="bubble-soft rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/65 hover:border-white/20 hover:bg-white/[0.09] hover:text-white/85"
            >
              再生成一个泡泡
            </Link>
            <Link
              href="/"
              className="bubble-soft rounded-full border border-white/10 px-4 py-2 text-sm text-white/45 hover:border-white/20 hover:text-white/75"
            >
              回到首页
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
