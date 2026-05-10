"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BubblePlayer, { type PlayerBubble } from "@/components/BubblePlayer";
import type {
  BubbleScene,
  GeneratedBubble,
  MemoryFragment,
} from "../lib/mockGenerateBubble";

function splitMomentIntoScenes(text?: string): BubbleScene[] {
  if (!text) {
    return [];
  }

  const parts = text
    .split(/[。！？!?]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => ({
    type: "memory",
    text: part.length > 40 ? `${part.slice(0, 39)}…` : part,
    visual: "缓慢浮现的画面、贴近身体的空气",
  }));
}

function convertBubbleForPlayer(bubble: GeneratedBubble): PlayerBubble {
  if (bubble.scenes && bubble.scenes.length > 0) {
    return {
      title: bubble.title,
      emotions: bubble.emotions,
      song: bubble.song,
      scenes: bubble.scenes,
      originalText: bubble.originalText,
    };
  }

  const memoryScenes =
    bubble.memoryFragments?.map((fragment: MemoryFragment) => ({
      type: "memory" as const,
      text:
        fragment.text.length > 40
          ? `${fragment.text.slice(0, 39)}…`
          : fragment.text,
      visual: fragment.title,
    })) ?? [];

  const fallbackScenes: BubbleScene[] = [
    {
      type: "opening",
      text: bubble.opening || bubble.subtitle || "这个泡泡正在展开。",
      visual: bubble.scene?.atmosphere || "一层很轻的光、慢慢靠近的声音",
    },
    ...splitMomentIntoScenes(bubble.reconstructedMoment),
    ...memoryScenes.slice(0, 2),
  ];

  if (bubble.musicInterpretation) {
    fallbackScenes.push({
      type: "trigger",
      text:
        bubble.musicInterpretation.length > 40
          ? `${bubble.musicInterpretation.slice(0, 39)}…`
          : bubble.musicInterpretation,
      visual: bubble.song || "耳机里的声音、被牵回来的旧画面",
    });
  }

  fallbackScenes.push({
    type: "echo",
    text: bubble.echo || "那一刻还在，只是变得很轻。",
    visual: "光慢慢散开、安静落回原处",
  });

  return {
    title: bubble.title,
    emotions: bubble.emotions,
    song: bubble.song,
    scenes: fallbackScenes.slice(0, 6),
    originalText: bubble.originalText,
  };
}

function BubbleContent() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") ?? "";
  const song = searchParams.get("song") ?? "";
  const title = searchParams.get("title") ?? "";
  const [bubble, setBubble] = useState<GeneratedBubble | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

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
  }, [title, text, song]);

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 text-zinc-100">
        <div className="bubble-drift absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="bubble-float absolute bottom-10 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-fuchsia-300/16 blur-3xl" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
          <div className="bubble-surface bubble-float rounded-[2rem] border border-white/15 bg-white/[0.07] px-8 py-7">
            <p className="text-lg leading-8 text-slate-100">
              正在把这些碎片聚成一个泡泡
            </p>
            <p className="mt-3 text-sm text-slate-300/75">
              光线、声音和那一点说不清的感觉，正在慢慢靠近。
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !bubble) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-950 via-violet-950 to-rose-950 text-zinc-100">
        <div className="bubble-drift absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="bubble-float absolute bottom-10 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-fuchsia-300/16 blur-3xl" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
          <div className="bubble-surface rounded-[2rem] border border-white/15 bg-white/[0.07] px-8 py-7">
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
      </main>
    );
  }

  return <BubblePlayer bubble={convertBubbleForPlayer(bubble)} />;
}

export default function BubblePage() {
  return (
    <Suspense>
      <BubbleContent />
    </Suspense>
  );
}
