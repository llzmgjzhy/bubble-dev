"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StoryFlowEditor from "@/components/StoryFlowEditor";
import type { BubbleStory } from "@/app/types/bubble";

function BubbleContent() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") ?? "";
  const song = searchParams.get("song") ?? "";
  const title = searchParams.get("title") ?? "";
  const [bubble, setBubble] = useState<BubbleStory | null>(null);
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

        const data = (await response.json()) as BubbleStory | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in data && data.error
              ? data.error
              : "生成泡泡失败，请稍后再试。",
          );
        }

        setBubble(data as BubbleStory);
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
              正在把这些碎片整理成故事流
            </p>
            <p className="mt-3 text-sm text-slate-300/75">
              记忆锚点、光线和声音正在慢慢浮起来。
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

  return <StoryFlowEditor bubble={bubble} />;
}

export default function BubblePage() {
  return (
    <Suspense>
      <BubbleContent />
    </Suspense>
  );
}
