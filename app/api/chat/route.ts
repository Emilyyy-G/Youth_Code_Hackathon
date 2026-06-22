import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
    const { messages, system } = await req.json();

    const result = await streamText({
        model: openai('deepseek-chat'),
        messages,
        system,
        temperature: 0.8,
        maxOutputTokens: 500,
    });

    return result.toTextStreamResponse();
}
