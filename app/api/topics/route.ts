import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { TOPIC_CATEGORIES } from '@/lib/debate/constants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refresh = searchParams.get('refresh');
  const category = searchParams.get('category') || 'tech';
  const lang = searchParams.get('language') || 'zh';

  // Find the category
  const cat = TOPIC_CATEGORIES.find(c => c.id === category);
  if (!cat) {
    return Response.json({ topics: [] });
  }

  // Return bilingual topics from the category (no refresh)
  if (refresh !== 'true') {
    const topics = cat.topics.map(t => t.zh);
    const shuffled = [...topics].sort(() => Math.random() - 0.5);
    return Response.json({ topics: shuffled.slice(0, 6) });
  }

  // Use AI to generate fresh topics in the selected language
  const langContent = lang === 'en'
    ? `Generate 6 debate topics related to "${cat.id}" that are suitable for university-level debate. Each topic should be a controversial statement ending with "?". Output as a JSON array of strings in English.`
    : `请生成6个关于「${lang === 'en' ? cat.id : cat.id}」领域的辩题，适合大学生辩论。每个辩题应是一个争议性问句，格式如"......？"。直接输出JSON数组。`;

  const result = await streamText({
    model: openai.chat('deepseek-chat'),
    messages: [{ role: 'user', content: langContent }],
    temperature: 0.9,
    maxOutputTokens: 800,
  });

  let fullContent = '';
  for await (const chunk of result.textStream) {
    fullContent += chunk;
  }

  try {
    const topics = JSON.parse(fullContent);
    if (Array.isArray(topics) && topics.length > 0) {
      return Response.json({ topics: topics.slice(0, 6) });
    }
  } catch {
    // fallback
  }

  const fallback = cat.topics.map(t => t.zh);
  const shuffled = [...fallback].sort(() => Math.random() - 0.5);
  return Response.json({ topics: shuffled.slice(0, 6) });
}
