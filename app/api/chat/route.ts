import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getSystemPrompt } from "@/lib/prompts";

// 配置常量
const MAX_RETRY_TIMES = 2;
const DELAY_MIN = 1000;
const DELAY_MAX = 1500;

// 根据语言返回对应兜底文案
function getFallbackText(lang: 'zh' | 'en') {
    if (lang === 'zh') {
        return "抱歉，我卡住了，请再说一遍";
    } else {
        return "Sorry, I got stuck. Please repeat your statement.";
    }
}

// 模拟思考延迟
function randomThinkDelay() {
    const delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
    return new Promise(resolve => setTimeout(resolve, delay));
}

// 校验单条消息完整性
function validateMessage(msg: unknown): boolean {
    if (!msg || typeof msg !== "object") return false;
    const m = msg as Record<string, unknown>;
    const hasRole = typeof m.role === "string" && m.role.trim() !== "";
    const hasContent = typeof m.content === "string" && m.content.trim() !== "";
    return hasRole && hasContent;
}

export async function POST(req: Request) {
    // 提前初始化变量，避免catch内无值、重复读取请求流
    let body;
    let lang: 'zh' | 'en' = 'zh';
    let fallbackText: string = getFallbackText('zh');

    try {
        // 仅读取一次请求体流
        body = await req.json();
        const { messages, role, language = 'zh' } = body;
        lang = language as 'zh' | 'en';
        fallbackText = getFallbackText(lang);

        // 动态生成多语言系统提示词（替换原前端传入的固定system）
        const system = getSystemPrompt(role as "A" | "B", lang);

        // 基础入参校验
        if (!Array.isArray(messages) || messages.length === 0) {
            return Response.json(
                { error: "messages 不能为空数组" },
                { status: 400 }
            );
        }

        // 过滤脏消息，只保留带role+content的合法对话
        const validMessages = messages.filter(validateMessage);
        if (validMessages.length === 0) {
            return Response.json(
                { error: "消息列表缺少合法 role / content" },
                { status: 400 }
            );
        }

        let retryCount = 0;
        let streamResult;

        // 请求重试循环
        while (retryCount <= MAX_RETRY_TIMES) {
            try {
                await randomThinkDelay();

                streamResult = await streamText({
                    model: openai.chat('deepseek-chat'),
                    messages: validMessages,
                    system,
                    temperature: 0.8,
                    maxOutputTokens: 500,
                });
                break;
            } catch (fetchErr) {
                retryCount++;
                if (retryCount > MAX_RETRY_TIMES) throw fetchErr;
                await new Promise(r => setTimeout(r, 300));
            }
        }

        if (!streamResult) throw new Error("stream 创建失败");

        // 流式空片段兜底替换
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                const text = chunk.toString();
                if (!text || text.trim() === "") {
                    controller.enqueue(fallbackText);
                } else {
                    controller.enqueue(chunk);
                }
            },
        });

        const finalStream = streamResult.textStream.pipeThrough(transformStream);
        return new Response(finalStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (globalErr) {
        console.error("[Chat API Error]", globalErr);
        // 直接复用提前缓存的兜底文案，不再读取req.json()
        return Response.json(
            {
                role: "assistant",
                content: fallbackText,
            },
            { status: 200 }
        );
    }
}