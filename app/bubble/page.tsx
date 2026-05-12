"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StoryFlowEditor from "@/components/StoryFlowEditor";
import type { BubbleStory } from "@/app/types/bubble";

type DraftImage = {
  id: string;
  url: string;
  name: string;
};

function readDraftImages(): DraftImage[] {
  try {
    const rawImages = localStorage.getItem("bubble_draft_images");

    if (!rawImages) {
      return [];
    }

    const parsedImages = JSON.parse(rawImages) as unknown;

    if (!Array.isArray(parsedImages)) {
      return [];
    }

    return parsedImages.filter(
      (image): image is DraftImage =>
        image &&
        typeof image === "object" &&
        typeof (image as DraftImage).id === "string" &&
        typeof (image as DraftImage).url === "string" &&
        typeof (image as DraftImage).name === "string",
    );
  } catch {
    return [];
  }
}

function BubbleContent() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") ?? "";
  const song = searchParams.get("song") ?? "";
  const title = searchParams.get("title") ?? "";
  const [bubble, setBubble] = useState<BubbleStory | null>(null);
  const [initialImages, setInitialImages] = useState<DraftImage[]>([]);
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

        setInitialImages(readDraftImages());
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
      <main className="app-shell relative overflow-hidden">
        <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-orb float-slow absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
          <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
          <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel bubble-float px-8 py-7">
            <p className="text-lg leading-8 text-white/90">
              正在把这些碎片整理成故事流
            </p>
            <p className="mt-3 text-sm text-white/65">
              记忆锚点、光线和声音正在慢慢浮起来。
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !bubble) {
    return (
      <main className="app-shell relative overflow-hidden">
        <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-orb float-slow absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
          <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
          <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel px-8 py-7">
            <h1 className="text-2xl font-medium text-white/90">
              泡泡暂时没有形成
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              {error || "生成泡泡失败，请稍后再试。"}
            </p>
            <Link
              href="/create"
              className="ghost-button bubble-soft mt-7 inline-flex rounded-full px-5 py-3 text-sm"
            >
              回到创建页
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <StoryFlowEditor bubble={bubble} initialImages={initialImages} />;
}

export default function BubblePage() {
  return (
    <Suspense>
      <BubbleContent />
    </Suspense>
  );
}
