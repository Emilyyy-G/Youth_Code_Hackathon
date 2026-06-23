import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getJudgePrompt } from '@/lib/prompts';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, language = "zh", userFeedback = 50 } = body;

        if (!Array.isArray(messages) || messages.length < 2) {
            return Response.json({ error: "辩论对话记录不足" }, { status: 400 });
        }

        const lang = language as "zh" | "en";
        const baseSystemPrompt = getJudgePrompt(lang, userFeedback);

        // 强化人设：要求讽刺、毒舌、深度MBTI分析
        const systemPrompt = `
            ${baseSystemPrompt}
            你是一个极其毒舌、刻薄且洞察力惊人的辩论裁判。
            请用最犀利、甚至带点嘲讽的语气点评这场辩论。
            必须深度分析双方的 MBTI 类型，并结合辩论表现给出理由。
            输出必须是严格的纯 JSON 格式，不要包含 Markdown 标记。
        `;

        const prompt = `
            请严格按以下 JSON 结构分析辩论：
            {
                "summary": "一阵见血、带讽刺意味的辩论总结",
                "winner": "获胜方（或宣布双方都很平庸）",
                "analysis": "毒舌的辩论过程分析",
                "ai1_mbti": { "type": "XXXX", "reason": "基于表现的MBTI分析原因" },
                "ai2_mbti": { "type": "XXXX", "reason": "基于表现的MBTI分析原因" }
            }
            辩论记录：${JSON.stringify(messages)}
        `;

        const { text } = await generateText({
            model: openai.chat('deepseek-chat'),
            system: systemPrompt,
            prompt: prompt,
            temperature: 0.8, // 略微调高温度，让语气更具“攻击性”
        });

        // 解析 JSON
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const report = JSON.parse(cleanJson);

        return Response.json(report, { status: 200 });

    } catch (globalErr) {
        console.error("[Judge API Global Error]", globalErr);
        return Response.json(
            { error: "裁判罢工了，他觉得这场辩论浪费了他的时间。" },
            { status: 500 }
        );
    }
}