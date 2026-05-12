import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { ProxyAgent } from "undici";
import type { StoryFragment } from "@/app/types/bubble";

type RefineAction = "expand" | "rewrite" | "correct" | "ask";

type RefineFragmentInput = {
  bubbleTitle: string;
  originalText: string;
  fragment: Pick<StoryFragment, "id" | "type" | "title" | "text">;
  userInput: string;
  action: RefineAction;
};

type RefineFragmentResponse = {
  updatedFragment: Pick<StoryFragment, "id" | "type" | "title" | "text">;
  aiQuestion?: string;
  suggestedOptions?: string[];
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

const refineSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    updatedFragment: {
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
      },
      required: ["id", "type", "title", "text"],
    },
    aiQuestion: { type: "string" },
    suggestedOptions: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["updatedFragment", "aiQuestion", "suggestedOptions"],
} as const;

function normalizeRequestBody(body: unknown): RefineFragmentInput | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const data = body as Record<string, unknown>;
  const fragment = data.fragment;

  if (!fragment || typeof fragment !== "object") {
    return null;
  }

  const typedFragment = fragment as Record<string, unknown>;
  const action = data.action;

  if (
    typeof data.bubbleTitle !== "string" ||
    typeof data.originalText !== "string" ||
    typeof data.userInput !== "string" ||
    !["expand", "rewrite", "correct", "ask"].includes(String(action)) ||
    typeof typedFragment.id !== "string" ||
    typeof typedFragment.type !== "string" ||
    !["scene", "trigger", "feeling", "memory", "echo"].includes(
      typedFragment.type,
    ) ||
    typeof typedFragment.title !== "string" ||
    typeof typedFragment.text !== "string"
  ) {
    return null;
  }

  return {
    bubbleTitle: data.bubbleTitle,
    originalText: data.originalText,
    userInput: data.userInput,
    action: action as RefineAction,
    fragment: {
      id: typedFragment.id,
      type: typedFragment.type as StoryFragment["type"],
      title: typedFragment.title,
      text: typedFragment.text,
    },
  };
}

function buildPrompt(input: RefineFragmentInput) {
  return `
你是“记忆故事流共创助手”。

你不是心理咨询师，也不是文学润色器。
你的任务是帮助用户把一个模糊的记忆片段补得更准确、更具体、更贴近真实感觉。
不要过度创作，不要替用户编造明确事实。
可以帮助补足光线、声音、空间、身体感和情绪流动。
如果用户纠正你，必须以用户纠正为准。

动作规则：
- expand：根据用户输入，把该 fragment 扩写得更具体，但不要超过 160 字。
- rewrite：换一种更贴近情绪、更克制的表达，不改变事实。
- correct：用户指出不准确时，优先尊重用户输入，修正 fragment。
- ask：不改写 fragment，只提出一个温和的问题，帮助用户继续找回细节。

输出要求：
- updatedFragment.id/type/title 必须保持与输入 fragment 一致。
- updatedFragment.text 不超过 160 字。
- action 为 ask 时，updatedFragment.text 保持原文不变，aiQuestion 必须有内容，suggestedOptions 返回 2-4 个温和选项或空数组。
- action 不是 ask 时，aiQuestion 返回空字符串，suggestedOptions 返回空数组。
- 输出必须是合法 JSON，不要 markdown，不要解释。

输入：
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
      { error: "Invalid request body." },
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
          name: "refined_fragment",
          strict: true,
          schema: refineSchema,
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

    const result = JSON.parse(content) as RefineFragmentResponse;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to refine fragment:", error);

    return NextResponse.json(
      {
        error: "Failed to refine fragment.",
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
