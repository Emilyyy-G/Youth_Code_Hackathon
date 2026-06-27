import { OpenAI } from 'openai';

// 强制创建一个基础的 OpenAI 客户端
const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseURL: 'https://api.deepseek.com/v1', // 强制指定到 v1 路径
});

export async function POST(req: Request) {
    const { messages, system } = await req.json();

    try {
        // 直接使用原生的 createCompletion 接口
        const response = await client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: system },
                ...messages
            ],
            stream: true,
            temperature: 0.8,
        });

        // 手动创建一个 ReadableStream 返回给前端
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    controller.enqueue(new TextEncoder().encode(content));
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        console.error("DeepSeek API 彻底报错:", error);
        return new Response("API 调用失败，请检查 Logs", { status: 500 });
    }
}