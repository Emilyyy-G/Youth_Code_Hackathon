import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 关键修正：baseURL 必须包含 /v1，且 SDK 会自动拼接 /chat/completions
const deepseek = createOpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
    const { messages, system } = await req.json();

    const result = await streamText({
        // 使用 deepseek 实例，传入模型名称
        model: deepseek('deepseek-chat'),
        messages,
        system,
        temperature: 0.8,
    });

    return result.toTextStreamResponse();
}