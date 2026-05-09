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
    intro: { type: "string" },
    atmosphere: { type: "string" },
    emotionSummary: { type: "string" },
    sensoryDetails: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string" },
    },
    emotions: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
    song: { type: "string" },
    nodes: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          text: { type: "string" },
        },
        required: ["title", "text"],
      },
    },
    letterToFutureSelf: { type: "string" },
    originalText: { type: "string" },
  },
  required: [
    "title",
    "intro",
    "atmosphere",
    "emotionSummary",
    "sensoryDetails",
    "emotions",
    "song",
    "nodes",
    "letterToFutureSelf",
    "originalText",
  ],
} as const;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

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
    time: typeof data.time === "string" ? data.time : undefined,
    place: typeof data.place === "string" ? data.place : undefined,
    emotions: isStringArray(data.emotions) ? data.emotions : undefined,
    text: data.text,
    song: typeof data.song === "string" ? data.song : undefined,
  };
}

function buildPrompt(input: GenerateBubbleInput) {
  return `
你是一个“情绪记忆泡泡生成器”。

你的任务不是写作文，不是总结事件，也不是输出鸡汤。
请根据用户输入，补全一个克制、具体、有画面感的情绪记忆结构。

要求：
- 不要过度煽情
- 不要使用宏大、空泛、励志的表达
- 语言要像一个安静的记忆容器
- 尽量写具体的光线、声音、空间、身体感
- 输出必须是合法 JSON
- title 不超过 12 个字
- intro 不超过 24 个字
- atmosphere 不超过 40 字
- emotionSummary 不超过 100 字
- sensoryDetails 必须正好 3 个
- emotions 必须 3-5 个
- nodes 必须正好 3 个
- letterToFutureSelf 不超过 80 字

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
