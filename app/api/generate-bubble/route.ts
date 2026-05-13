import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ProxyAgent } from "undici";
import type { BubbleStory } from "@/app/types/bubble";

type GenerateBubbleInput = {
  title?: string;
  text: string;
  song?: string;
};

const openaiBaseUrl =
  process.env.OPENAI_BASE_URL || "https://apinebula.com/v1";
const openaiModel = process.env.OPENAI_MODEL || "gpt-5.5";
const proxyUrl = process.env.OPENAI_PROXY_URL;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: openaiBaseUrl,
  maxRetries: 0,
  defaultHeaders: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Accept: "application/json",
  },
  fetchOptions: proxyUrl
    ? {
        dispatcher: new ProxyAgent(proxyUrl),
      }
    : undefined,
});

const bubbleSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    mood: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
    storyFragments: {
      type: "array",
      minItems: 5,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          type: {
            type: "string",
            enum: ["scene", "trigger", "feeling", "memory", "echo"],
          },
          title: { type: "string" },
          text: { type: "string" },
          mediaSuggestion: {
            type: "object",
            additionalProperties: false,
            properties: {
              type: {
                type: "string",
                enum: ["image", "video", "music", "silence", "text"],
              },
              reason: { type: "string" },
              visualPrompt: { type: "string" },
              audioPrompt: { type: "string" },
            },
            required: ["type", "reason", "visualPrompt", "audioPrompt"],
          },
          userCanAdd: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["id", "type", "title", "text", "mediaSuggestion", "userCanAdd"],
      },
    },
    followUpPrompts: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          targetFragmentId: { type: "string" },
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["id", "targetFragmentId", "question", "options"],
      },
    },
    replayScript: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          fragmentId: { type: "string" },
          displayText: { type: "string" },
          duration: { type: "number" },
        },
        required: ["fragmentId", "displayText", "duration"],
      },
    },
    originalText: { type: "string" },
  },
  required: [
    "title",
    "subtitle",
    "mood",
    "storyFragments",
    "followUpPrompts",
    "replayScript",
    "originalText",
  ],
} as const;

function normalizeRequestBody(body: unknown): GenerateBubbleInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const data = body as Record<string, unknown>;

  if (typeof data.text !== "string" || data.text.trim().length === 0) {
    return null;
  }

  return {
    title: typeof data.title === "string" ? data.title : undefined,
    text: data.text,
    song: typeof data.song === "string" ? data.song : undefined,
  };
}

function buildPrompt(input: GenerateBubbleInput) {
  return `
你是一个“AI 记忆故事流共创助手”。

你的任务不是写一段文案，也不是做心理分析。
用户会给你一段模糊、碎片化、说不清的情绪记忆。
你要帮用户把它整理成一条可以继续生长的多模态故事流。

你需要：
- 提取记忆中的场景、触发器、身体感、情绪、回忆和余波
- 把它们组织成 storyFragments
- 为每个片段建议最适合的媒体承载方式
- 用 followUpPrompts 帮用户继续找回和补全
- 用 replayScript 支持生成后的泡泡预览体验

写作原则：
- 克制
- 具体
- 有画面
- 有留白
- 不鸡汤
- 不心理分析
- 不要说“这说明”“这体现”“你可能”
- 不要编造过多具体事实，但可以基于用户输入合理补全氛围
- 不要替用户编造过度具体的人名、地点、事件
- 可以合理补全氛围、光线、声音、身体感
- 帮助用户表达说不清的东西

禁止使用以下口吻或短语：
- “这说明”
- “这体现”
- “你可能”

字段要求：
- title 不超过 12 个字
- subtitle 不超过 24 字
- mood 返回 3-5 个细腻情绪词
- storyFragments 返回 5-7 个，形成自然故事流
- storyFragment.id 使用简短英文或拼音 slug，必须唯一
- storyFragment.type 只能是 "scene" | "trigger" | "feeling" | "memory" | "echo"
- 每个 storyFragment.title 不超过 12 字
- 每个 storyFragment.text 不超过 120 字，具体、有画面，不要分析口吻
- mediaSuggestion 表示这个片段适合用什么模态承载
- mediaSuggestion.type 只能是 "image" | "video" | "music" | "silence" | "text"
- mediaSuggestion.reason 简短说明为什么适合这个模态
- mediaSuggestion.visualPrompt 如果不适用，返回空字符串
- mediaSuggestion.audioPrompt 如果不适用，返回空字符串
- userCanAdd 是用户可补充内容，例如 ["图片", "一句话"]、["音乐"]、["视频"]
- followUpPrompts 返回 3-5 个，帮助用户继续补全故事
- followUpPrompts.targetFragmentId 必须对应 storyFragments 里的 id
- followUpPrompts.question 要温和、具体，不像问卷
- followUpPrompts.options 如果没有合适选项，返回空数组
- replayScript 是生成后预览体验的脚本，不是摘要
- replayScript 的顺序应该对应 storyFragments 的情绪流动：场景出现 → 触发物进入 → 感觉浮现 → 旧事连接 → 余波收束
- replayScript.fragmentId 必须对应 storyFragments 里的 id
- replayScript.displayText 不超过 32 字
- replayScript.displayText 要像一条在泡泡里慢慢浮现的短句
- replayScript.displayText 不要使用分析语气，不要复述 fragment.title
- replayScript.displayText 要有画面、声音、身体感或时间感
- replayScript.displayText 不要写成鸡汤，不要写成诗歌堆砌
- replayScript.displayText 要克制、具体、有留白
- replayScript.duration 使用毫秒数，建议 1800 到 5000
- originalText 保存用户原文

replayScript.displayText 示例：
不好的："这是一个关于清晨和回忆的片段。"
好的：
- "宿舍还没完全亮起来。"
- "身体还困着，意识却先醒了。"
- "前奏响起时，旧日子慢慢靠近。"
- "那些相似的清晨，被轻轻连在一起。"

输出 JSON 结构：
{
  "title": string,
  "subtitle": string,
  "mood": string[],
  "storyFragments": [
    {
      "id": string,
      "type": "scene" | "trigger" | "feeling" | "memory" | "echo",
      "title": string,
      "text": string,
      "mediaSuggestion": {
        "type": "image" | "video" | "music" | "silence" | "text",
        "reason": string,
        "visualPrompt": string,
        "audioPrompt": string
      },
      "userCanAdd": string[]
    }
  ],
  "followUpPrompts": [
    {
      "id": string,
      "targetFragmentId": string,
      "question": string,
      "options": string[]
    }
  ],
  "replayScript": [
    {
      "fragmentId": string,
      "displayText": string,
      "duration": number
    }
  ],
  "originalText": string
}

输出必须是合法 JSON，不要 markdown，不要解释。

用户输入：
${JSON.stringify(input, null, 2)}
`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const input = normalizeRequestBody(body);

  if (!input) {
    return NextResponse.json(
      { error: "Invalid request body. text is required." },
      { status: 400 },
    );
  }

  try {
    const response = await openai.responses.create({
      model: openaiModel,
      instructions:
        "You produce only valid JSON that matches the provided schema. Do not include markdown fences.",
      input: buildPrompt(input),
      text: {
        format: {
          type: "json_schema",
          name: "generated_bubble",
          strict: true,
          schema: bubbleSchema,
        },
      },
    });

    const content = response.output_text;

    if (!content) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 502 },
      );
    }

    const bubble = JSON.parse(content) as BubbleStory;

    return NextResponse.json(bubble);
  } catch (error) {
    console.error("Failed to generate bubble:", error);

    return NextResponse.json(
      {
        error: "Failed to generate bubble.",
        debug: {
          baseURL: openaiBaseUrl,
          model: openaiModel,
          usingProxy: Boolean(proxyUrl),
        },
      },
      { status: 502 },
    );
  }
}
