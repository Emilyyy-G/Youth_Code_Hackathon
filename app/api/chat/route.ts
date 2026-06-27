import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 1. 使用 createOpenAI 初始化 DeepSeek 兼容客户端
const deepseek = createOpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
    const { messages, system } = await req.json();

    // 2. 使用 streamText 直接处理流式响应
    const result = await streamText({
        model: deepseek('deepseek-chat'),
        system: system, // 传入系统提示词
        messages: messages, // 传入用户消息
        temperature: 0.8,
    });

    // 3. 直接返回 result.toDataStreamResponse() 或 toTextStreamResponse()
    return result.toTextStreamResponse();
}