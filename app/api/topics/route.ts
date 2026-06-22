import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { DEFAULT_TOPICS } from '@/lib/debate/constants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refresh = searchParams.get('refresh');

  // Return random 6 from default topics when no refresh
  if (refresh !== 'true') {
    const shuffled = [...DEFAULT_TOPICS].sort(() => Math.random() - 0.5);
    return Response.json({ topics: shuffled.slice(0, 6) });
  }

  // Use AI to generate fresh topics
  const result = await streamText({
    model: openai('deepseek-chat'),
    messages: [
      {
        role: 'user',
        content: '请生成6个适合高中生辩论的中文辩题，主题不限但要有辩论价值。' +
          '每个辩题应是一个争议性陈述句，格式如"......？"。' +
          '直接输出JSON数组，不要其他文字。',
      },
    ],
    temperature: 0.9,
    maxOutputTokens: 800,
  });

  let fullContent = '';
  for await (const chunk of result.textStream) {
    fullContent += chunk;
  }

  try {
    // Try to parse the AI response as JSON array
    const topics = JSON.parse(fullContent);
    if (Array.isArray(topics) && topics.length > 0) {
      return Response.json({ topics: topics.slice(0, 6) });
    }
  } catch {
    // If parsing fails, fall back to defaults
  }

  const shuffled = [...DEFAULT_TOPICS].sort(() => Math.random() - 0.5);
  return Response.json({ topics: shuffled.slice(0, 6) });
}
