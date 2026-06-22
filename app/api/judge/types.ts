import { z } from 'zod';

export const JudgeReportSchema = z.object({
    verdict: z.string().describe("最终裁判判词，带嘲讽色彩，贴合用户反馈倾向"),
    mbti: z.string().describe("两位辩手综合映射MBTI类型,格式示例:蓝方INTJ / 红方ESFP"),
    sarcasmScore: z.number().min(0).max(100).describe("0-100区间讽刺指数,数值越高语气越尖锐"),
    logicScore: z.number().min(0).max(100).describe("整场辩论综合逻辑得分,满分100"),
    personalitySummary: z.string().describe("简短性格特质与辩论风格总结，区分红蓝双方"),
});

// TS导出类型，前端可复用
export type JudgeReport = z.infer<typeof JudgeReportSchema>;