"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockGenerateBubble } from "../lib/mockGenerateBubble";

function BubbleContent() {
  const searchParams = useSearchParams();
  const text = searchParams.get("text") ?? "";
  const song = searchParams.get("song") ?? "";
  const bubble = mockGenerateBubble(text, song);

  return (
    <div className="mx-auto flex min-h-screen max-w-[720px] flex-col py-16">
      <header className="text-center">
        <p className="text-sm text-zinc-500">你的泡泡</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {bubble.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-400">
          {bubble.intro}
        </p>
      </header>

      <section className="mt-8 flex flex-wrap justify-center gap-2">
        {bubble.emotions.map((emotion) => (
          <span
            key={emotion}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
          >
            {emotion}
          </span>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-zinc-500">音乐</p>
        <p className="mt-2 text-lg font-medium text-zinc-100">{bubble.song}</p>
      </section>

      <section className="mt-5 grid gap-4">
        {bubble.nodes.map((node) => (
          <article
            key={node.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="text-lg font-medium text-zinc-100">
              {node.title}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-zinc-300">
              {node.text}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-medium text-zinc-100">那时的我</h2>
        <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-zinc-300">
          {bubble.originalText || "还没有写下那段感觉。"}
        </p>
      </section>

      <div className="mt-8 flex justify-center">
        <Link
          href="/create"
          className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-white"
        >
          返回创建页
        </Link>
      </div>
    </div>
  );
}

export default function BubblePage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 text-zinc-100">
      <Suspense>
        <BubbleContent />
      </Suspense>
    </main>
  );
}
