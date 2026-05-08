"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [song, setSong] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    router.push(
      `/bubble?text=${encodeURIComponent(text)}&song=${encodeURIComponent(song)}`,
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          创建一个泡泡
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="那一刻像什么？"
            className="min-h-44 resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base leading-7 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500"
          />
          <input
            value={song}
            onChange={(event) => setSong(event.target.value)}
            placeholder="哪首歌最像它？"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-500"
          />
          <button
            type="submit"
            className="mt-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-300"
          >
            生成泡泡
          </button>
        </form>
      </div>
    </main>
  );
}
