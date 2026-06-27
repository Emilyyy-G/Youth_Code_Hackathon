import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 必须显式定义 baseURL，指向 DeepSeek 官方地址
const deepseek = createOpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY, // 建议把环境变量名改为 DEEPSEEK_API_KEY 以便区分
});

export async function POST(req: Request) {
    const { messages, system } = await req.json();

    const result = await streamText({
        model: deepseek('deepseek-chat'), // 这里调用你上面定义好的实例
        messages,
        system,
        temperature: 0.8,
        maxOutputTokens: 500,
    });

    return result.toTextStreamResponse();
}