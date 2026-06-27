import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com',
});

export async function POST(req: Request) {
    const { messages, system } = await req.json();

    const response = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
            { role: 'system', content: system },
            ...messages
        ],
        stream: true,
        temperature: 0.8,
    });

    // 使用 ai SDK 提供的转换器处理流
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}