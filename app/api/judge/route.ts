import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, topic, scores, language } = await req.json();

  const scoreLabel = language === 'en' ? 'Round' : '回合';
  const scoreSummary = (scores as { score: number }[])
    .map((s: { score: number }, i: number) => `${scoreLabel} ${i + 1}: ${s.score}`)
    .join('\n');

  const transcript = (messages as { personaId: string; content: string }[])
    .map(m => `[${m.personaId}]: ${m.content}`)
    .join('\n');

  const langInstruction = language === 'zh'
    ? '请用中文输出。'
    : 'Please output in English.';

  const isEn = language === 'en';
  const winnerHint = '"ai1 | ai2 | tie"';
  const summaryHint = isEn ? 'Overall evaluation of the debate, around 200 words' : '整场辩论的总体评价，200字左右';
  const debaterTpl = isEn
    ? `{
      "personaId": "ai1",
      "mbti": "e.g. ENTP / INTJ",
      "title": "Creative title like 'The Logic Breaker'",
      "strengths": ["strength1", "strength2", "strength3"],
      "weaknesses": ["weakness1", "weakness2"],
      "dimensions": [
        { "label": "Logic", "score": 0-100, "description": "brief note" },
        { "label": "Expression", "score": 0-100, "description": "brief note" },
        { "label": "Rebuttal", "score": 0-100, "description": "brief note" },
        { "label": "Innovation", "score": 0-100, "description": "brief note" },
        { "label": "Composure", "score": 0-100, "description": "brief note" }
      ],
      "bestQuote": "The debater's most brilliant quote of the match"
    }`
    : `{
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
    }`;
  const fullPrompt = isEn
    ? `Debate Topic: ${topic}

Round Scores:
${scoreSummary}

Transcript:
${transcript}

Please output the judge report in JSON format.`
    : `辩论主题：${topic}

各回合评分：
${scoreSummary}

辩论记录：
${transcript}

请以JSON格式输出裁判报告。`;

  const system = `You are a top debate judge specializing in debate psychology and personality analysis. ${langInstruction}

Based on the following debate transcript, generate an MBTI-style analysis report. Your output must be **pure JSON**, without any markdown or extra text.

JSON structure:
{
  "winner": ${winnerHint},
  "summary": "${summaryHint}",
  "debaters": [
    ${debaterTpl},
    { ... // same structure for the second debater }
  ]
}`;

  const result = await streamText({
    model: openai.chat('deepseek-chat'),
    messages: [{ role: 'user', content: fullPrompt }],
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
