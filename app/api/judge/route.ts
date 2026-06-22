import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, topic, scores, language } = await req.json();

  const scoreSummary = (scores as { score: number }[])
    .map((s: { score: number }, i: number) => `回合 ${i + 1}: ${s.score}`)
    .join('\n');

  const transcript = (messages as { personaId: string; content: string }[])
    .map(m => `[${m.personaId}]: ${m.content}`)
    .join('\n');

  const langInstruction = language === 'zh'
    ? '请用中文输出。'
    : 'Please output in English.';

  const system = `你是一位顶尖辩论裁判，擅长从辩论心理学和人格分析角度评价辩手。${langInstruction}

请根据以下辩论记录，生成一份MBTI风格的分析报告。你的输出必须是**纯JSON**，不要包含任何markdown标记或额外文字。

JSON结构：
{
  "winner": "ai1 | ai2 | tie",
  "summary": "整场辩论的总体评价，200字左右",
  "debaters": [
    {
      "personaId": "ai1",
      "mbti": "例如 ENTP / INTJ 等",
      "title": "例如「逻辑破局者」之类有个性的称号",
      "strengths": ["优点1", "优点2", "优点3"],
      "weaknesses": ["不足1", "不足2"],
      "dimensions": [
        { "label": "逻辑推理", "score": 0-100, "description": "简短说明" },
        { "label": "语言表达", "score": 0-100, "description": "简短说明" },
        { "label": "反驳力度", "score": 0-100, "description": "简短说明" },
        { "label": "论点创新", "score": 0-100, "description": "简短说明" },
        { "label": "情绪控制", "score": 0-100, "description": "简短说明" }
      ],
      "bestQuote": "辩手在本场最精彩的一句话"
    }
  ]
}`;

  const userPrompt = `辩论主题：${topic}

各回合评分：
${scoreSummary}

辩论记录：
${transcript}

请以JSON格式输出裁判报告。`;

  const result = await streamText({
    model: openai.chat('deepseek-chat'),
    messages: [{ role: 'user', content: userPrompt }],
    system,
    temperature: 0.7,
    maxOutputTokens: 2000,
  });

  let content = '';
  for await (const chunk of result.textStream) {
    content += chunk;
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : content;

  try {
    const report = JSON.parse(jsonStr);
    return Response.json({ ...report, topic, totalRounds: scores.length });
  } catch {
    return Response.json({
      winner: 'tie',
      summary: content,
      debaters: [],
      topic,
      totalRounds: scores.length,
      _fallback: true,
    });
  }
}
