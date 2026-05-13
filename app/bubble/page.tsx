"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import BubblePreview from "@/components/BubblePreview";
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
  const [showEditor, setShowEditor] = useState(false);
  const [regenerateKey, setRegenerateKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function generateBubble() {
      setIsLoading(true);
      setError("");
      setShowEditor(false);

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
  }, [title, text, song, regenerateKey]);

  if (isLoading) {
    return (
      <AppShell variant="story">
        <div className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
          <div className="mist-panel bubble-float px-8 py-7">
            <p className="text-lg leading-8 text-slate-800">
              正在让这个泡泡形成第一层轮廓
            </p>
            <p className="mt-3 text-sm text-slate-500">
              记忆锚点、光线和声音正在慢慢浮起来。
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !bubble) {
    return (
      <AppShell variant="story">
        <div className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center px-6 text-center">
          <div className="mist-panel px-8 py-7">
            <h1 className="text-2xl font-medium text-slate-900">
              泡泡暂时没有形成
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {error || "生成泡泡失败，请稍后再试。"}
            </p>
            <Link
              href="/create"
              className="mist-button-secondary mt-7 px-5 py-3 text-sm"
            >
              回到创建页
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!showEditor) {
    return (
      <BubblePreview
        bubble={bubble}
        onContinue={() => setShowEditor(true)}
        onRegenerate={() => setRegenerateKey((key) => key + 1)}
      />
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
