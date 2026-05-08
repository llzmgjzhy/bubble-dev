import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[640px] flex-col items-center justify-center text-center">
        <p className="mb-4 text-sm text-zinc-500">小泡泡</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          小泡泡
        </h1>
        <p className="mt-5 text-lg leading-8 text-zinc-400">
          为某段感觉，留一个入口
        </p>
        <Link
          href="/create"
          className="mt-10 rounded-full bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-300"
        >
          创建一个泡泡
        </Link>
      </div>
    </main>
  );
}
