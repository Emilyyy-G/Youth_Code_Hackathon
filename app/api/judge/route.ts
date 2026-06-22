import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { JudgeReportSchema } from './types';
import { getJudgePrompt } from '@/lib/prompts';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, language = "zh", userFeedback = 50 } = body;

        // 基础入参校验
        if (!Array.isArray(messages) || messages.length < 2) {
            return Response.json(
                { error: "辩论对话记录不足，无法生成裁判报告" },
                { status: 400 }
            );
        }

        const lang = language as "zh" | "en";
        // 传入用户评分，动态生成带语气规则的裁判提示词
        const judgeSystemPrompt = getJudgePrompt(lang, userFeedback);
        const debateContext = `完整辩论对话记录：${JSON.stringify(messages)}`;

        // 强制模型输出标准JSON结构
        const { object } = await generateObject({
            model: openai.chat('deepseek-chat'),
            schema: JudgeReportSchema,
            system: judgeSystemPrompt,
            prompt: debateContext,
            temperature: 0.7,
        });

        // 直接返回结构化报告，前端无需解析处理
        return Response.json(object, { status: 200 });

    } catch (globalErr) {
        console.error("[Judge API Global Error]", globalErr);
        // 全局异常兜底
        return Response.json(
            { error: "裁判罢工了，暂时无法生成分析报告" },
            { status: 500 }
        );
    }
}