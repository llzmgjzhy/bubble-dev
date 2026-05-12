"use client";

import Link from "next/link";
import { useState } from "react";
import type { BubbleStory, StoryFragment } from "@/app/types/bubble";
import StoryReplay from "@/components/StoryReplay";

type StoryFlowEditorProps = {
  bubble: BubbleStory;
  initialImages?: UploadedImage[];
};

type UploadedImage = {
  id: string;
  url: string;
  name: string;
};

type RefineAction = "expand" | "rewrite" | "correct" | "ask";

type FragmentInteraction = {
  action: "expand" | "correct";
  input: string;
};

type FragmentRefineResponse = {
  updatedFragment: Pick<StoryFragment, "id" | "type" | "title" | "text">;
  aiQuestion?: string;
  suggestedOptions?: string[];
};

const fragmentTypeLabel: Record<StoryFragment["type"], string> = {
  scene: "场景",
  trigger: "触发",
  feeling: "感觉",
  memory: "记忆",
  echo: "回声",
};

const mediaTypeLabel: Record<
  StoryFragment["mediaSuggestion"]["type"],
  string
> = {
  image: "图片",
  video: "视频",
  music: "音乐",
  silence: "留白",
  text: "文字",
};

export default function StoryFlowEditor({
  bubble,
  initialImages = [],
}: StoryFlowEditorProps) {
  const [editableBubble, setEditableBubble] = useState(bubble);
  const [notice, setNotice] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [interactions, setInteractions] = useState<
    Record<string, FragmentInteraction>
  >({});
  const [loadingFragmentId, setLoadingFragmentId] = useState("");
  const [fragmentQuestions, setFragmentQuestions] = useState<
    Record<string, { question: string; options: string[] }>
  >({});
  const [uploadedImages, setUploadedImages] =
    useState<UploadedImage[]>(initialImages);
  const [imagePickerFragmentId, setImagePickerFragmentId] = useState("");

  function markComingSoon(action: string, fragmentTitle?: string) {
    setNotice(
      fragmentTitle
        ? `${fragmentTitle}：${action} 后续接入`
        : `${action} 后续接入`,
    );
  }

  function handleImageUpload(files: FileList | null) {
    if (!files) {
      return;
    }

    const imageFiles = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(6 - uploadedImages.length, 0));

    if (imageFiles.length === 0) {
      setNotice(
        uploadedImages.length >= 6
          ? "最多先放入 6 张图片。"
          : "请选择图片文件。",
      );
      return;
    }

    const nextImages = imageFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setUploadedImages((current) => [...current, ...nextImages].slice(0, 6));
    setNotice("");
  }

  function handleFragmentImageUpload(fragmentId: string, files: FileList | null) {
    if (!files) {
      return;
    }

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      setNotice("请选择图片文件。");
      return;
    }

    const availableSlots = Math.max(6 - uploadedImages.length, 0);

    if (availableSlots === 0) {
      setNotice("最多先放入 6 张图片。");
      return;
    }

    const nextImages = imageFiles.slice(0, availableSlots).map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    const imageToAttach = nextImages[0];

    if (!imageToAttach) {
      return;
    }

    setUploadedImages((current) => [...current, ...nextImages].slice(0, 6));
    attachImageToFragment(fragmentId, imageToAttach);
    setNotice("");
  }

  function removeUploadedImage(imageId: string) {
    const image = uploadedImages.find((item) => item.id === imageId);

    if (image) {
      URL.revokeObjectURL(image.url);
    }

    setUploadedImages((current) =>
      current.filter((item) => item.id !== imageId),
    );
    setEditableBubble((current) => ({
      ...current,
      storyFragments: current.storyFragments.map((fragment) => ({
        ...fragment,
        attachedMedia: fragment.attachedMedia?.filter(
          (media) => media.url !== image?.url,
        ),
      })),
    }));
  }

  function openImagePicker(fragmentId: string) {
    if (uploadedImages.length === 0) {
      setNotice("先添加一些图片");
      return;
    }

    setNotice("");
    setImagePickerFragmentId((current) =>
      current === fragmentId ? "" : fragmentId,
    );
  }

  function attachImageToFragment(fragmentId: string, image: UploadedImage) {
    setEditableBubble((current) => ({
      ...current,
      storyFragments: current.storyFragments.map((fragment) =>
        fragment.id === fragmentId
          ? {
              ...fragment,
              attachedMedia: [
                {
                  type: "image",
                  url: image.url,
                  name: image.name,
                },
              ],
            }
          : fragment,
      ),
    }));
    setImagePickerFragmentId("");
  }

  function removeFragmentImage(fragmentId: string) {
    setEditableBubble((current) => ({
      ...current,
      storyFragments: current.storyFragments.map((fragment) =>
        fragment.id === fragmentId
          ? {
              ...fragment,
              attachedMedia: [],
            }
          : fragment,
      ),
    }));
  }

  function updateFragment(updatedFragment: FragmentRefineResponse["updatedFragment"]) {
    setEditableBubble((current) => ({
      ...current,
      storyFragments: current.storyFragments.map((fragment) =>
        fragment.id === updatedFragment.id
          ? {
              ...fragment,
              title: updatedFragment.title,
              text: updatedFragment.text,
            }
          : fragment,
      ),
      replayScript: current.replayScript.map((item) =>
        item.fragmentId === updatedFragment.id
          ? {
              ...item,
              displayText: updatedFragment.text.slice(0, 40),
            }
          : item,
      ),
    }));
  }

  async function refineFragment(
    fragment: StoryFragment,
    action: RefineAction,
    userInput = "",
  ) {
    if (loadingFragmentId) {
      return;
    }

    setLoadingFragmentId(fragment.id);
    setNotice("");

    try {
      const response = await fetch("/api/refine-fragment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bubbleTitle: editableBubble.title,
          originalText: editableBubble.originalText,
          fragment: {
            id: fragment.id,
            type: fragment.type,
            title: fragment.title,
            text: fragment.text,
          },
          userInput,
          action,
        }),
      });

      const data = (await response.json()) as
        | FragmentRefineResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "这一段暂时没有补上，请稍后再试。",
        );
      }

      const result = data as FragmentRefineResponse;
      updateFragment(result.updatedFragment);

      if (action === "ask") {
        setFragmentQuestions((current) => ({
          ...current,
          [fragment.id]: {
            question: result.aiQuestion || "这一段还有哪个细节更清楚一点？",
            options: result.suggestedOptions ?? [],
          },
        }));
      } else {
        setFragmentQuestions((current) => {
          const next = { ...current };
          delete next[fragment.id];
          return next;
        });
        setInteractions((current) => {
          const next = { ...current };
          delete next[fragment.id];
          return next;
        });
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "这一段暂时没有补上，请稍后再试。",
      );
    } finally {
      setLoadingFragmentId("");
    }
  }

  function openInteraction(fragmentId: string, action: "expand" | "correct") {
    setInteractions((current) => ({
      ...current,
      [fragmentId]: {
        action,
        input: "",
      },
    }));
  }

  function updateInteractionInput(fragmentId: string, input: string) {
    setInteractions((current) => ({
      ...current,
      [fragmentId]: {
        ...(current[fragmentId] ?? { action: "expand" }),
        input,
      },
    }));
  }

  function submitInteraction(fragment: StoryFragment) {
    const interaction = interactions[fragment.id];
    const userInput = interaction?.input.trim() ?? "";

    if (!interaction || !userInput) {
      return;
    }

    refineFragment(fragment, interaction.action, userInput);
  }

  if (isReplayMode) {
    return (
      <StoryReplay
        bubble={editableBubble}
        onExit={() => setIsReplayMode(false)}
      />
    );
  }

  return (
    <main className="app-shell relative min-h-screen overflow-hidden bg-[#151827] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-orb float-slow absolute left-[-8rem] top-[-5rem] h-80 w-80 rounded-full bg-[rgba(168,135,255,0.35)] opacity-35 blur-3xl" />
        <div className="ambient-orb bubble-float absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-[rgba(96,165,250,0.28)] opacity-35 blur-3xl" />
        <div className="ambient-orb float-slow absolute bottom-[-8rem] left-[35%] h-96 w-96 rounded-full bg-[rgba(251,191,120,0.22)] opacity-35 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="flex flex-col gap-8 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] text-white/50">小泡泡</p>
            <h1 className="mt-4 text-4xl font-medium tracking-tight text-white/95 sm:text-5xl">
              {editableBubble.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
              {editableBubble.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {editableBubble.mood.map((mood) => (
                <span
                  key={mood}
                  className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs text-white/70 backdrop-blur"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReplayMode(true)}
            className="ghost-button bubble-soft w-fit rounded-full px-5 py-3 text-sm"
          >
            进入回看模式
          </button>
        </header>

        {notice && (
          <div className="glass-panel mb-8 px-4 py-3 text-sm text-white/70">
            {notice}
          </div>
        )}

        <section className="glass-panel mb-12 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-white/90">
                放入一些画面
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                这些图片不会立刻上传云端，只用于当前故事流预览。
              </p>
            </div>
            <label className="ghost-button bubble-soft w-fit cursor-pointer rounded-full px-4 py-2 text-sm">
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
          </div>

          {uploadedImages.length > 0 && (
            <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-lg shadow-black/25"
                >
                  <div
                    aria-label={image.name}
                    className="h-full w-full bg-cover bg-center"
                    role="img"
                    style={{ backgroundImage: `url(${image.url})` }}
                  />
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(image.id)}
                    className="absolute right-1.5 top-1.5 rounded-full border border-white/20 bg-[#171827]/45 px-2 py-1 text-[10px] text-white/85 backdrop-blur-sm hover:bg-[#171827]/60"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="relative">
          <div className="absolute left-4 top-3 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-white/0 via-white/22 to-white/0 sm:left-1/2" />

          <div className="space-y-8">
            {editableBubble.storyFragments.map((fragment, index) => {
              const interaction = interactions[fragment.id];
              const question = fragmentQuestions[fragment.id];
              const isLoading = loadingFragmentId === fragment.id;

              return (
              <article
                key={fragment.id}
                className={`relative flex ${
                  index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
                }`}
              >
                <div className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full border border-white/30 bg-white/55 shadow-[0_0_24px_rgba(255,255,255,0.22)] sm:left-1/2" />
                <div className="glass-panel ml-10 w-full max-w-xl p-5 sm:ml-0 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/60">
                      {fragmentTypeLabel[fragment.type]}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-xs text-white/65">
                      {mediaTypeLabel[fragment.mediaSuggestion.type]}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-medium text-white/92">
                    {fragment.title}
                  </h2>
                  <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-white/74">
                    {fragment.text}
                  </p>

                  {fragment.attachedMedia?.[0] && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-2xl shadow-[#070a18]/25">
                      <div
                        aria-label={
                          fragment.attachedMedia[0].name ?? fragment.title
                        }
                        className="aspect-video w-full bg-cover bg-center"
                        role="img"
                        style={{
                          backgroundImage: `url(${fragment.attachedMedia[0].url})`,
                        }}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                        <p className="truncate text-xs text-white/60">
                          {fragment.attachedMedia[0].name ?? "已放入图片"}
                        </p>
                        <div className="flex gap-3">
                          <label className="shrink-0 cursor-pointer text-xs text-white/60 hover:text-white/85">
                            更换图片
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(event) => {
                                handleFragmentImageUpload(
                                  fragment.id,
                                  event.target.files,
                                );
                                event.target.value = "";
                              }}
                              className="sr-only"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeFragmentImage(fragment.id)}
                            className="shrink-0 text-xs text-white/60 hover:text-white/85"
                          >
                            移除图片
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3">
                    <p className="text-xs text-white/50">适合承载</p>
                    <p className="mt-2 text-sm leading-6 text-white/68">
                      {mediaTypeLabel[fragment.mediaSuggestion.type]}：
                      {fragment.mediaSuggestion.reason}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {fragment.userCanAdd.map((item) => (
                      <button
                        key={`${fragment.id}-${item}`}
                        type="button"
                        onClick={() => markComingSoon(`添加${item}`, fragment.title)}
                        className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs"
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={Boolean(loadingFragmentId)}
                        onClick={() => openInteraction(fragment.id, "expand")}
                        className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        补充这一段
                      </button>
                      <button
                        type="button"
                        disabled={Boolean(loadingFragmentId)}
                        onClick={() => refineFragment(fragment, "rewrite")}
                        className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        换种表达
                      </button>
                      <button
                        type="button"
                        disabled={Boolean(loadingFragmentId)}
                        onClick={() => openInteraction(fragment.id, "correct")}
                        className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        这个不准确
                      </button>
                      <button
                        type="button"
                        disabled={Boolean(loadingFragmentId)}
                        onClick={() => refineFragment(fragment, "ask")}
                        className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        问我一个问题
                      </button>
                      <label className="ghost-button bubble-soft cursor-pointer rounded-full px-3 py-2 text-xs">
                        添加图片
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(event) => {
                            handleFragmentImageUpload(
                              fragment.id,
                              event.target.files,
                            );
                            event.target.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
                      {uploadedImages.length > 0 && (
                        <button
                          type="button"
                          onClick={() => openImagePicker(fragment.id)}
                          className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs"
                        >
                          从已添加图片中选择
                        </button>
                      )}
                    </div>

                    {imagePickerFragmentId === fragment.id && (
                      <div className="glass-panel mt-4 p-3">
                        <p className="text-xs text-white/55">
                          选择一张图放进这一段
                        </p>
                        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                          {uploadedImages.map((image) => (
                            <button
                              key={`${fragment.id}-${image.id}`}
                              type="button"
                              onClick={() =>
                                attachImageToFragment(fragment.id, image)
                              }
                              className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] shadow-lg shadow-black/20 transition hover:scale-[1.03] hover:border-white/30"
                            >
                              <span
                                aria-label={image.name}
                                className="block h-full w-full bg-cover bg-center"
                                role="img"
                                style={{
                                  backgroundImage: `url(${image.url})`,
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {interaction && (
                      <div className="glass-panel mt-4 p-3">
                        <textarea
                          value={interaction.input}
                          onChange={(event) =>
                            updateInteractionInput(
                              fragment.id,
                              event.target.value,
                            )
                          }
                          placeholder={
                            interaction.action === "expand"
                              ? "补充一点你想起的细节"
                              : "哪里不准确？你记得的其实是……"
                          }
                          className="soft-input min-h-24 w-full resize-none rounded-2xl px-4 py-3 text-sm leading-7"
                        />
                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setInteractions((current) => {
                                const next = { ...current };
                                delete next[fragment.id];
                                return next;
                              })
                            }
                            className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs"
                          >
                            先不补
                          </button>
                          <button
                            type="button"
                            disabled={!interaction.input.trim() || isLoading}
                            onClick={() => submitInteraction(fragment)}
                            className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            {isLoading ? "正在靠近…" : "放进这一段"}
                          </button>
                        </div>
                      </div>
                    )}

                    {question && (
                      <div className="glass-panel mt-4 p-4">
                        <p className="text-sm leading-7 text-white/72">
                          {question.question}
                        </p>
                        {question.options.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {question.options.map((option) => (
                              <button
                                key={`${fragment.id}-${option}`}
                                type="button"
                                disabled={Boolean(loadingFragmentId)}
                                onClick={() =>
                                  refineFragment(fragment, "expand", option)
                                }
                                className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-35"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {isLoading && (
                      <p className="mt-3 text-xs text-white/55">
                        AI 正在轻轻整理这一段。
                      </p>
                    )}
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </section>

        <section className="glass-panel mt-16 p-5 sm:p-7">
          <p className="text-sm tracking-[0.18em] text-white/50">
            AI 想轻轻问你
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {editableBubble.followUpPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-2xl border border-white/15 bg-white/[0.08] p-4"
              >
                <p className="text-sm leading-7 text-white/76">
                  {prompt.question}
                </p>
                {prompt.options && prompt.options.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prompt.options.map((option) => (
                      <button
                        key={`${prompt.id}-${option}`}
                        type="button"
                        onClick={() => setSelectedPrompt(`已选择：${option}`)}
                        className="ghost-button bubble-soft rounded-full px-3 py-2 text-xs"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedPrompt && (
            <p className="glass-panel mt-5 px-4 py-3 text-sm text-white/70">
              {selectedPrompt}
            </p>
          )}
        </section>

        <footer className="mt-12 flex flex-col gap-4 pb-4">
          <button
            type="button"
            onClick={() => setIsOriginalOpen((current) => !current)}
            className="w-fit text-sm text-white/60 hover:text-white/85"
          >
            查看原始输入
          </button>
          {isOriginalOpen && (
            <p className="max-w-3xl whitespace-pre-wrap rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-sm leading-7 text-white/68">
              {editableBubble.originalText}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="ghost-button bubble-soft rounded-full px-5 py-3 text-center text-sm"
            >
              再生成一个泡泡
            </Link>
            <Link
              href="/"
              className="ghost-button bubble-soft rounded-full px-5 py-3 text-center text-sm"
            >
              回到首页
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
