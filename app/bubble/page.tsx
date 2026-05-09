"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { GeneratedBubble } from "../lib/mockGenerateBubble";

const nodePositions = [
  "md:top-16 md:left-12",
  "md:top-44 md:right-12",
  "md:bottom-16 md:left-1/2 md:-translate-x-1/2",
  "md:bottom-28 md:left-20",
  "md:top-28 md:left-1/2 md:-translate-x-1/2",
  "md:bottom-24 md:right-16",
];

type BubbleTheme = {
  page: string;
  glowA: string;
  glowB: string;
  glowC: string;
  card: string;
  softCard: string;
  tag: string;
  dot: string;
};

const defaultTheme: BubbleTheme = {
  page: "bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950",
  glowA: "bg-cyan-300/20",
  glowB: "bg-fuchsia-300/16",
  glowC: "bg-amber-200/12",
  card: "border-white/15 bg-white/[0.07]",
  softCard: "border-white/12 bg-white/[0.045]",
  tag: "border-cyan-100/20 bg-cyan-100/10 text-cyan-50",
  dot: "bg-cyan-100/80 shadow-[0_0_24px_rgba(165,243,252,0.45)]",
};

const emotionThemes: Record<string, BubbleTheme> = {
  清晨: {
    page: "bg-gradient-to-br from-sky-950 via-cyan-950 to-amber-900",
    glowA: "bg-sky-300/20",
    glowB: "bg-amber-200/16",
    glowC: "bg-cyan-200/12",
    card: "border-sky-100/15 bg-sky-100/[0.07]",
    softCard: "border-sky-100/12 bg-sky-100/[0.045]",
    tag: "border-sky-100/25 bg-sky-100/12 text-sky-50",
    dot: "bg-sky-100/80 shadow-[0_0_24px_rgba(186,230,253,0.45)]",
  },
  空落: {
    page: "bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950",
    glowA: "bg-blue-300/16",
    glowB: "bg-cyan-200/12",
    glowC: "bg-slate-200/10",
    card: "border-blue-100/14 bg-blue-100/[0.055]",
    softCard: "border-blue-100/10 bg-blue-100/[0.035]",
    tag: "border-blue-100/20 bg-blue-100/10 text-blue-50",
    dot: "bg-blue-100/75 shadow-[0_0_24px_rgba(191,219,254,0.4)]",
  },
  怀念: {
    page: "bg-gradient-to-br from-rose-950 via-violet-950 to-slate-950",
    glowA: "bg-rose-300/18",
    glowB: "bg-violet-300/14",
    glowC: "bg-orange-200/10",
    card: "border-rose-100/15 bg-rose-100/[0.06]",
    softCard: "border-rose-100/10 bg-rose-100/[0.04]",
    tag: "border-rose-100/22 bg-rose-100/10 text-rose-50",
    dot: "bg-rose-100/80 shadow-[0_0_24px_rgba(254,205,211,0.42)]",
  },
  余温: {
    page: "bg-gradient-to-br from-orange-950 via-rose-950 to-violet-950",
    glowA: "bg-orange-300/18",
    glowB: "bg-rose-300/14",
    glowC: "bg-yellow-200/10",
    card: "border-orange-100/15 bg-orange-100/[0.06]",
    softCard: "border-orange-100/10 bg-orange-100/[0.04]",
    tag: "border-orange-100/22 bg-orange-100/10 text-orange-50",
    dot: "bg-orange-100/80 shadow-[0_0_24px_rgba(254,215,170,0.42)]",
  },
  未完成: {
    page: "bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950",
    glowA: "bg-violet-300/18",
    glowB: "bg-indigo-300/14",
    glowC: "bg-pink-200/10",
    card: "border-violet-100/15 bg-violet-100/[0.06]",
    softCard: "border-violet-100/10 bg-violet-100/[0.04]",
    tag: "border-violet-100/22 bg-violet-100/10 text-violet-50",
    dot: "bg-violet-100/80 shadow-[0_0_24px_rgba(221,214,254,0.42)]",
  },
  温柔: {
    page: "bg-gradient-to-br from-pink-950 via-rose-950 to-amber-950",
    glowA: "bg-pink-300/18",
    glowB: "bg-amber-200/14",
    glowC: "bg-rose-200/10",
    card: "border-pink-100/15 bg-pink-100/[0.06]",
    softCard: "border-pink-100/10 bg-pink-100/[0.04]",
    tag: "border-pink-100/22 bg-pink-100/10 text-pink-50",
    dot: "bg-pink-100/80 shadow-[0_0_24px_rgba(251,207,232,0.42)]",
  },
  独处: {
    page: "bg-gradient-to-br from-cyan-950 via-slate-950 to-violet-950",
    glowA: "bg-cyan-300/16",
    glowB: "bg-violet-300/12",
    glowC: "bg-sky-200/10",
    card: "border-cyan-100/14 bg-cyan-100/[0.055]",
    softCard: "border-cyan-100/10 bg-cyan-100/[0.04]",
    tag: "border-cyan-100/20 bg-cyan-100/10 text-cyan-50",
    dot: "bg-cyan-100/75 shadow-[0_0_24px_rgba(165,243,252,0.4)]",
  },
  回落: {
    page: "bg-gradient-to-br from-teal-950 via-slate-950 to-blue-950",
    glowA: "bg-teal-300/16",
    glowB: "bg-blue-300/12",
    glowC: "bg-emerald-200/10",
    card: "border-teal-100/14 bg-teal-100/[0.055]",
    softCard: "border-teal-100/10 bg-teal-100/[0.04]",
    tag: "border-teal-100/20 bg-teal-100/10 text-teal-50",
    dot: "bg-teal-100/75 shadow-[0_0_24px_rgba(153,246,228,0.4)]",
  },
  失真: {
    page: "bg-gradient-to-br from-indigo-950 via-fuchsia-950 to-cyan-950",
    glowA: "bg-fuchsia-300/16",
    glowB: "bg-cyan-300/12",
    glowC: "bg-indigo-200/10",
    card: "border-fuchsia-100/14 bg-fuchsia-100/[0.055]",
    softCard: "border-fuchsia-100/10 bg-fuchsia-100/[0.04]",
    tag: "border-fuchsia-100/20 bg-fuchsia-100/10 text-fuchsia-50",
    dot: "bg-fuchsia-100/75 shadow-[0_0_24px_rgba(245,208,254,0.4)]",
  },
  安静: {
    page: "bg-gradient-to-br from-emerald-950 via-slate-950 to-cyan-950",
    glowA: "bg-emerald-300/16",
    glowB: "bg-cyan-300/12",
    glowC: "bg-lime-200/10",
    card: "border-emerald-100/14 bg-emerald-100/[0.055]",
    softCard: "border-emerald-100/10 bg-emerald-100/[0.04]",
    tag: "border-emerald-100/20 bg-emerald-100/10 text-emerald-50",
    dot: "bg-emerald-100/75 shadow-[0_0_24px_rgba(167,243,208,0.4)]",
  },
  离开: {
    page: "bg-gradient-to-br from-blue-950 via-indigo-950 to-orange-950",
    glowA: "bg-blue-300/16",
    glowB: "bg-orange-300/12",
    glowC: "bg-indigo-200/10",
    card: "border-blue-100/14 bg-blue-100/[0.055]",
    softCard: "border-blue-100/10 bg-blue-100/[0.04]",
    tag: "border-blue-100/20 bg-blue-100/10 text-blue-50",
    dot: "bg-blue-100/75 shadow-[0_0_24px_rgba(191,219,254,0.4)]",
  },
  旧事: {
    page: "bg-gradient-to-br from-amber-950 via-rose-950 to-slate-950",
    glowA: "bg-amber-300/16",
    glowB: "bg-rose-300/12",
    glowC: "bg-yellow-200/10",
    card: "border-amber-100/14 bg-amber-100/[0.055]",
    softCard: "border-amber-100/10 bg-amber-100/[0.04]",
    tag: "border-amber-100/20 bg-amber-100/10 text-amber-50",
    dot: "bg-amber-100/75 shadow-[0_0_24px_rgba(253,230,138,0.4)]",
  },
};

function BubbleContent() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") ?? "";
  const song = searchParams.get("song") ?? "";
  const title = searchParams.get("title") ?? "";
  const time = searchParams.get("time") ?? "";
  const place = searchParams.get("place") ?? "";
  const emotionsParam = searchParams.get("emotions") ?? "";
  const emotions = emotionsParam
    .split(",")
    .map((emotion) => emotion.trim())
    .filter(Boolean);
  const [bubble, setBubble] = useState<GeneratedBubble | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const theme =
    (bubble?.emotions ?? emotions)
      .map((emotion) => emotionThemes[emotion])
      .find(Boolean) ??
    defaultTheme;

  useEffect(() => {
    const controller = new AbortController();
    const requestEmotions = emotionsParam
      .split(",")
      .map((emotion) => emotion.trim())
      .filter(Boolean);

    async function generateBubble() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/generate-bubble", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            time,
            place,
            emotions: requestEmotions,
            text,
            song,
          }),
          signal: controller.signal,
        });

        const data = (await response.json()) as
          | GeneratedBubble
          | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "生成泡泡失败，请稍后再试。",
          );
        }

        setBubble(data as GeneratedBubble);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "生成泡泡失败，请稍后再试。",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    generateBubble();

    return () => controller.abort();
  }, [title, time, place, emotionsParam, text, song]);

  if (isLoading) {
    return (
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
        <div
          className={`bubble-surface bubble-float rounded-[2rem] border px-8 py-7 ${theme.card}`}
        >
          <p className="text-lg leading-8 text-slate-100">
            正在把这些碎片聚成一个泡泡
          </p>
          <p className="mt-3 text-sm text-slate-300/75">
            光线、声音和那一点说不清的感觉，正在慢慢靠近。
          </p>
        </div>
      </div>
    );
  }

  if (error || !bubble) {
    return (
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
        <div
          className={`bubble-surface rounded-[2rem] border px-8 py-7 ${theme.card}`}
        >
          <h1 className="text-2xl font-medium text-zinc-100">
            泡泡暂时没有形成
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300/85">
            {error || "生成泡泡失败，请稍后再试。"}
          </p>
          <Link
            href="/create"
            className="bubble-soft mt-7 inline-flex rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm text-slate-100 hover:border-white/25 hover:bg-white/[0.1]"
          >
            回到创建页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col px-6 py-14 sm:px-8 sm:py-20">
      <header className="flex min-h-[72vh] flex-col items-center justify-center text-center">
        <p className="text-sm text-slate-500">你的泡泡</p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
          {bubble.title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300/80">
          {bubble.intro}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {bubble.emotions.map((emotion) => (
            <span
              key={emotion}
              className={`rounded-full border px-3 py-1 text-sm shadow-sm shadow-black/10 ${theme.tag}`}
            >
              {emotion}
            </span>
          ))}
        </div>

        <p
          className={`bubble-surface mt-8 max-w-xl rounded-2xl border px-5 py-4 text-sm leading-7 text-slate-200/85 ${theme.softCard}`}
        >
          {bubble.atmosphere}
        </p>

        <div
          className={`bubble-surface bubble-float mt-9 rounded-2xl border px-5 py-4 text-left ${theme.softCard}`}
        >
          <p className="text-xs text-slate-500">此刻的歌</p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            {bubble.song}
          </p>
        </div>
      </header>

      <section className="flex min-h-[56vh] items-center py-20">
        <div
          className={`bubble-surface w-full rounded-[2rem] border p-6 sm:p-8 ${theme.card}`}
        >
          <p className="text-sm text-slate-500">情绪画像</p>
          <p className="mt-5 text-2xl leading-10 text-slate-100 sm:text-3xl sm:leading-[3rem]">
            {bubble.emotionSummary}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="text-center">
          <p className="text-sm text-slate-500">感官碎片</p>
          <h2 className="mt-3 text-2xl font-medium text-zinc-100">
            留下来的不是情节，是细节
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {bubble.sensoryDetails.map((detail) => (
            <article
              key={detail}
              className={`bubble-surface bubble-soft rounded-2xl border p-5 text-center text-sm leading-7 text-slate-200/85 hover:border-white/25 hover:bg-white/[0.09] ${theme.softCard}`}
            >
              {detail}
            </article>
          ))}
        </div>
      </section>

      <section
        className={`bubble-surface relative min-h-[520px] overflow-hidden rounded-[2rem] border bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.07),rgba(255,255,255,0.025)_38%,transparent_70%)] px-5 py-8 ${theme.softCard}`}
      >
        <div
          className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 blur-sm ${theme.glowA}`}
        />
        <div className="absolute left-[14%] top-[38%] hidden w-[72%] rotate-[-8deg] border-t border-dashed border-white/10 md:block" />
        <div className="absolute left-[28%] top-[55%] hidden w-[44%] rotate-[18deg] border-t border-dashed border-white/10 md:block" />

        <div className="relative z-10 text-center">
          <h2 className="text-xl font-medium text-zinc-100">记忆节点</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400/80">
            点亮那些被这段感觉唤起的碎片。
          </p>
        </div>

        <div className="relative z-10 mt-8 flex flex-col gap-5 md:absolute md:inset-0 md:mt-0 md:block">
          {bubble.nodes.map((node, index) => (
            <div
              key={node.title}
              className={`relative flex gap-3 ${
                index % 2 === 0 ? "mr-6" : "ml-6"
              } md:ml-0 md:mr-0 md:absolute md:max-w-[300px] ${
                nodePositions[index % nodePositions.length]
              }`}
            >
              <span
                className={`mt-5 h-3 w-3 shrink-0 rounded-full ${theme.dot}`}
              />
              <article
                className={`bubble-surface bubble-soft w-full flex-1 rounded-2xl border p-4 backdrop-blur hover:border-white/25 hover:bg-white/[0.1] md:max-w-[260px] ${theme.card}`}
              >
                <h3 className="text-lg font-medium text-zinc-100">
                  {node.title}
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300/85">
                  {node.text}
                </p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section
        className={`bubble-surface mt-24 rounded-2xl border p-6 ${theme.softCard}`}
      >
        <h2 className="text-lg font-medium text-zinc-100">那时的我</h2>
        <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-300/80">
          {bubble.originalText || "还没有写下那段感觉。"}
        </p>
      </section>

      <section
        className={`bubble-surface mt-20 rounded-[2rem] border p-6 sm:p-8 ${theme.softCard}`}
      >
        <p className="text-sm text-slate-500">写给未来自己的话</p>
        <p className="mt-5 text-lg leading-9 text-slate-200/90">
          {bubble.letterToFutureSelf}
        </p>
      </section>

      <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/create"
          className="bubble-soft rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-medium text-slate-200 hover:border-white/20 hover:bg-white/[0.07]"
        >
          再生成一个泡泡
        </Link>
        <Link
          href="/"
          className="bubble-soft rounded-full border border-white/10 px-5 py-3 text-center text-sm font-medium text-slate-400 hover:border-white/20 hover:text-slate-200"
        >
          回到首页
        </Link>
      </div>
    </div>
  );
}

export default function BubblePage() {
  return (
    <Suspense>
      <BubbleShell />
    </Suspense>
  );
}

function BubbleShell() {
  const searchParams = useSearchParams();
  const emotions = (searchParams.get("emotions") ?? "")
    .split(",")
    .map((emotion) => emotion.trim())
    .filter(Boolean);
  const theme =
    emotions.map((emotion) => emotionThemes[emotion]).find(Boolean) ??
    defaultTheme;

  return (
    <main
      className={`relative min-h-screen overflow-hidden text-zinc-100 ${theme.page}`}
    >
      <div
        className={`bubble-drift absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl ${theme.glowA}`}
      />
      <div
        className={`bubble-float absolute bottom-10 right-0 h-96 w-96 translate-x-1/3 rounded-full blur-3xl ${theme.glowB}`}
      />
      <div
        className={`bubble-drift absolute left-0 top-1/2 h-72 w-72 -translate-x-1/3 rounded-full blur-3xl ${theme.glowC}`}
      />
      <BubbleContent />
    </main>
  );
}
