import { OpenAI } from 'openai';

// 1. 初始化 DeepSeek 的标准兼容客户端
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1', // 强制指定到 v1 路径，避开路径错误
});

export async function POST(req: Request) {
  const { messages, topic, scores, language } = await req.json();

  // --- 保持你原有的所有数据处理逻辑不变 ---
  const scoreLabel = language === 'en' ? 'Round' : '回合';
  const scoreSummary = (scores as { score: number }[])
    .map((s: { score: number }, i: number) => `${scoreLabel} ${i + 1}: ${s.score}`)
    .join('\n');

  const transcript = (messages as { personaId: string; content: string }[])
    .map(m => `[${m.personaId}]: ${m.content}`)
    .join('\n');

  const langInstruction = language === 'zh' ? '请用中文输出。' : 'Please output in English.';
  const winnerHint = '"ai1 | ai2 | tie"';
  const summaryHint = language === 'en' ? 'Overall evaluation of the debate, around 200 words' : '整场辩论的总体评价，200字左右';

  const debaterTpl = language === 'en'
    ? `{ "personaId": "ai1", "mbti": "e.g. ENTP / INTJ", "title": "Creative title", "strengths": ["s1", "s2"], "weaknesses": ["w1"], "dimensions": [{ "label": "Logic", "score": 0, "description": "" }], "bestQuote": "" }`
    : `{ "personaId": "ai1", "mbti": "例如 ENTP", "title": "个性称号", "strengths": ["优点1"], "weaknesses": ["不足1"], "dimensions": [{ "label": "逻辑推理", "score": 0, "description": "" }], "bestQuote": "" }`;

  const system = `You are a top debate judge. ${langInstruction} Output **pure JSON** only. Structure: { "winner": ${winnerHint}, "summary": "${summaryHint}", "debaters": [${debaterTpl}, { ... }] }`;
  const fullPrompt = `Debate Topic: ${topic}\n\nScores:\n${scoreSummary}\n\nTranscript:\n${transcript}`;

  // --- 核心调用逻辑改为原生 OpenAI 客户端 ---
  try {
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: fullPrompt }
      ],
      temperature: 0.7,
      stream: false, // 裁判报告通常是 JSON 格式，不建议流式，直接获取完整 JSON 更稳健
    });

    const content = completion.choices[0].message.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;

    const report = JSON.parse(jsonStr);
    return Response.json({ ...report, topic, totalRounds: scores.length });

  } catch (error) {
    console.error("Judge API Error:", error);
    return Response.json({
      winner: 'tie',
      summary: 'Judge failed to generate report.',
      debaters: [],
      topic,
      totalRounds: scores.length,
      _error: true
    });
  }
}