"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type DraftImage = {
  id: string;
  url: string;
  name: string;
};

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("initialText") ?? "");
  const [song, setSong] = useState("");
  const [title, setTitle] = useState("");
  const [mediaNotice, setMediaNotice] = useState("");
  const [images, setImages] = useState<DraftImage[]>([]);
  const canGenerate = text.trim().length > 0;

  function handleImageUpload(files: FileList | null) {
    if (!files) {
      return;
    }

    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(6 - images.length, 0));

    if (imageFiles.length === 0) {
      setMediaNotice(
        images.length >= 6 ? "最多先放入 6 张图片。" : "请选择图片文件。",
      );
      return;
    }

    const nextImages = imageFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setImages((current) => [...current, ...nextImages].slice(0, 6));
    setMediaNotice("");
  }

  function removeImage(imageId: string) {
    const image = images.find((item) => item.id === imageId);

    if (image) {
      URL.revokeObjectURL(image.url);
    }

    setImages((current) => current.filter((item) => item.id !== imageId));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canGenerate) {
      return;
    }

    localStorage.setItem("bubble_draft_images", JSON.stringify(images));

    router.push(
      `/bubble?text=${encodeURIComponent(text)}&song=${encodeURIComponent(song)}&title=${encodeURIComponent(title)}`,
    );
  }

  return (
    <main className="app-shell relative overflow-hidden px-6 py-12 sm:py-16">
      <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb float-slow absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
        <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
        <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl flex-col justify-center">
        <Link
          href="/"
          className="ghost-button bubble-soft mb-10 w-fit rounded-full px-4 py-2 text-sm"
        >
          返回首页
        </Link>

        <header className="relative text-center">
          <div className="bubble-float absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 -translate-y-8 rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] blur-[1px]" />
          <div className="relative">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              把那个时刻写下来
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-white/70">
              不用整理，也不用完整。写下你记得的画面、声音、某个人，或者那种说不清的感觉。
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
          <section className="glass-panel p-5">
            <label
              htmlFor="bubble-text"
              className="block text-lg font-medium text-white/90"
            >
              把那个时刻写下来
            </label>
            <p className="mt-2 text-sm leading-6 text-white/60">
              先把它放下来。哪怕只是几个画面、一个声音，或者一句没说完的话。
            </p>
            <textarea
              id="bubble-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="比如：今天早上很早醒来，宿舍很安静，我明明还困却睡不着。戴上耳机听到那首歌的时候，突然想起以前很多个类似的清晨……"
              className="soft-input mt-4 min-h-[260px] w-full resize-none rounded-2xl px-4 py-3 text-base leading-8"
            />
          </section>

          <section className="glass-panel p-5">
            <label
              htmlFor="bubble-song"
              className="block text-lg font-medium text-white/90"
            >
              哪首歌会把你带回去？
            </label>
            <input
              id="bubble-song"
              value={song}
              onChange={(event) => setSong(event.target.value)}
              placeholder="歌名 / 歌手 / 一段歌词"
              className="soft-input mt-4 w-full rounded-2xl px-4 py-3 text-base"
            />
          </section>

          <section className="glass-panel p-5">
            <label
              htmlFor="bubble-title"
              className="block text-lg font-medium text-white/90"
            >
              给它一个名字
            </label>
            <input
              id="bubble-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：冬天宿舍六点醒来"
              className="soft-input mt-4 w-full rounded-2xl px-4 py-3 text-base"
            />
          </section>

          <section className="glass-panel p-5">
            <h2 className="text-lg font-medium text-white/90">可选媒体</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <label className="ghost-button bubble-soft cursor-pointer rounded-full px-4 py-2 text-sm">
                添加图片
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    handleImageUpload(event.target.files);
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
              </label>
              <button
                type="button"
                onClick={() => setMediaNotice("后续接入上传。")}
                className="ghost-button bubble-soft rounded-full px-4 py-2 text-sm"
              >
                添加视频
              </button>
              <button
                type="button"
                onClick={() => setMediaNotice("后续接入上传。")}
                className="ghost-button bubble-soft rounded-full px-4 py-2 text-sm"
              >
                添加更多声音
              </button>
            </div>
            {images.length > 0 && (
              <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-lg shadow-black/20"
                  >
                    <div
                      aria-label={image.name}
                      className="h-full w-full bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url(${image.url})` }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute right-1.5 top-1.5 rounded-full border border-white/20 bg-[#171827]/45 px-2 py-1 text-[10px] text-white/85 backdrop-blur-sm hover:bg-[#171827]/60"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
            {mediaNotice && (
              <p className="mt-4 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm text-white/70">
                {mediaNotice}
              </p>
            )}
          </section>

          <button
            type="submit"
            disabled={!canGenerate}
            className="soft-button bubble-soft mt-2 w-full px-6 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            生成这个泡泡
          </button>
          {!canGenerate && (
            <p className="text-center text-sm text-white/60">
              至少写下一点什么，泡泡才会开始形成。
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateForm />
    </Suspense>
  );
}
