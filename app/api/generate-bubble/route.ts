import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ProxyAgent } from "undici";
import type { GenerateBubbleInput, GeneratedBubble } from "@/app/lib/mockGenerateBubble";

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
    emotions: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
    song: { type: "string" },
    scenes: {
      type: "array",
      minItems: 4,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: {
            type: "string",
            enum: ["opening", "memory", "trigger", "echo"],
          },
          text: { type: "string" },
          visual: { type: "string" },
        },
        required: ["type", "text", "visual"],
      },
    },
    originalText: { type: "string" },
  },
  required: [
    "title",
    "subtitle",
    "emotions",
    "song",
    "scenes",
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
你是一个“情绪记忆泡泡生成器”。

你的任务不是分析用户，也不是总结情绪，而是根据用户给出的文字和可选音乐，复刻那段记忆的场景、氛围、感官和情绪流动。
要让用户感觉：这个泡泡保存了那一刻，而不是解释了那一刻。
生成内容最终会用于一个连续沉浸式泡泡播放器，像安静、私密、克制的 Story / Reels，而不是报告页面。
所有 scene 要像同一个空间里陆续出现的镜头，而不是分栏说明、分析条目或总结卡片。

写作原则：
- 克制
- 具体
- 有画面
- 有留白
- 不要过度煽情
- 不鸡汤
- 不要使用心理咨询口吻
- 不要说“你感到……说明……”
- 多写光线、声音、空间、身体感、时间感
- 少写抽象心理解释，少用概念化判断
- 不要编造过多具体事实，但可以基于用户输入合理补全氛围
- 整体要让人感觉被带回去，而不是被解释

禁止使用以下口吻或短语：
- “这说明”
- “这体现”
- “你可能”
- “你的情绪”
- “反映出”
- “这种状态”

字段要求：
- title 不超过 12 个字
- subtitle 不超过 24 字
- emotions 3-5 个情绪词，要细腻，不要只用开心/悲伤
- song 如果用户提供了音乐，原样保留；如果没有，返回空字符串
- scenes 必须 4-6 个
- 每个 scene.text 不超过 40 字
- 每个 scene 都像一个镜头，有进入、停留、触发、回声的节奏
- scene.visual 是该镜头的画面提示，比如“清晨宿舍、灰蓝色天光、空床位”
- 至少包含 1 个 opening scene 和 1 个 echo scene
- echo scene 必须放在最后，像一句收束的回声，不鸡汤，不说教
- memory scene 要像记忆重新浮现的瞬间，不要像分析条目
- trigger scene 要像触发那段感觉的入口；如果用户提供 song，至少有一个 trigger scene 和音乐有关
- 不要输出长段落，每个 scene 只留一个可以被全屏承载的短句
- originalText 必须保留用户原文

输出 JSON 结构：
{
  "title": string,
  "subtitle": string,
  "emotions": string[],
  "song": string,
  "scenes": [
    {
      "type": "opening" | "memory" | "trigger" | "echo",
      "text": string,
      "visual": string
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

    const bubble = JSON.parse(content) as GeneratedBubble;

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
