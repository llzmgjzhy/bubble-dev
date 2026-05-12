"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";

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
    <AppShell variant="create">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="mist-button-secondary mb-10 w-fit px-4 py-2 text-sm"
        >
          返回首页
        </Link>

        <header className="relative text-center">
          <div className="bubble-float absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 -translate-y-8 rounded-full border border-white/60 bg-white/30 blur-[1px]" />
          <div className="relative">
            <p className="mb-4 text-sm tracking-[0.26em] text-slate-500">
              小泡泡
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              把那个时刻写下来
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-600">
              不用整理，也不用完整。写下你记得的画面、声音、某个人，或者那种说不清的感觉。
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mist-panel-strong mx-auto mt-10 max-w-3xl p-8"
        >
          <div>
            <label htmlFor="bubble-text" className="block text-lg font-medium text-slate-900">
              把那个时刻写下来
            </label>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              先把它放下来，哪怕只是几个画面、一句没说完的话。
            </p>
            <textarea
              id="bubble-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="比如：今天早上很早醒来，宿舍很安静，我明明还困却睡不着。戴上耳机听到那首歌的时候，突然想起以前很多个类似的清晨……"
              className="mt-4 min-h-[250px] w-full resize-y rounded-[28px] border border-slate-300/70 bg-white/80 px-6 py-5 text-base leading-8 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_45px_rgba(100,116,139,0.12)] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-200/40"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="bubble-song" className="block text-base font-medium text-slate-900">
                哪首歌会把你带回去？
              </label>
              <input
                id="bubble-song"
                value={song}
                onChange={(event) => setSong(event.target.value)}
                placeholder="歌名 / 歌手 / 一段歌词"
                className="mist-input mt-3"
              />
            </div>

            <div>
              <label htmlFor="bubble-title" className="block text-base font-medium text-slate-900">
                给它一个名字
              </label>
              <input
                id="bubble-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例如：冬天宿舍六点醒来"
                className="mist-input mt-3"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-white/70 pt-5">
            <h2 className="text-base font-medium text-slate-900">可选媒体</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <label className="mist-button-secondary cursor-pointer text-sm">
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
                className="mist-button-secondary text-sm"
              >
                添加视频
              </button>
              <button
                type="button"
                onClick={() => setMediaNotice("后续接入上传。")}
                className="mist-button-secondary text-sm"
              >
                添加更多声音
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="mist-panel relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-white/70 p-0"
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
                      className="mist-link-button absolute right-1.5 top-1.5 bg-white/70 px-2 py-1 text-[10px]"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}

            {mediaNotice && (
              <p className="mist-panel mt-4 px-4 py-3 text-sm text-slate-600">
                {mediaNotice}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 md:items-end">
            <button
              type="submit"
              disabled={!canGenerate}
              className="mist-button-primary w-full md:w-auto"
            >
              生成这个泡泡
            </button>
            {!canGenerate && (
              <p className="text-sm text-slate-500">
                至少写下一点什么，泡泡才会开始形成。
              </p>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateForm />
    </Suspense>
  );
}
