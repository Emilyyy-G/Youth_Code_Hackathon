import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getSystemPrompt } from "@/lib/prompts";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { messages, role, language = 'zh' } = body;

        // --- 核心修复点：防止 messages 为空 ---
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            messages = [{ role: 'user', content: '请开始辩论' }];
        }

        const system = getSystemPrompt(role, language);

        const { text } = await generateText({
            model: openai.chat('deepseek-chat'),
            messages: messages, // 现在这里一定有值了
            system: system,
            temperature: 0.8,
            maxTokens: 500,
        });

        return NextResponse.json({ content: text });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ content: "服务器内部报错，请检查终端日志。" });
    }
}