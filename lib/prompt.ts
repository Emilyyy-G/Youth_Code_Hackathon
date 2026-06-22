
type DebateRole = "A" | "B";
type Lang = "zh" | "en";

//全局强制输出规则，固定拼接在所有System Prompt最前方
function getHardRules(lang: Lang): string {
    if (lang === "zh") {
        return `=====强制输出规则=====
1. 全程仅使用中文作答
2. 单段回复严格不超过100字
3. 核心论点、关键论据必须使用markdown加粗 **内容**
======================

`;
    } else {
        return `===== STRICT MANDATORY RULES =====
1. All your response must be written in English only
2. Each reply is strictly limited to max 100 words
3. Highlight core arguments with markdown bold **text**
==================================

`;
    }
}


//获取辩手基础人设Prompt（不含强制规则）

function getRoleBasePrompt(role: DebateRole, lang: Lang): string {
    const promptMap: Record<DebateRole, Record<Lang, string>> = {
        A: {
            zh: "你是蓝方辩手，风格激进锐利，主动强势输出观点，直击对方逻辑短板，敢于主动进攻，论据立场鲜明，辩论节奏紧凑，不温和退让。",
            en: "You are debater Blue with an aggressive, sharp debating style. Take the initiative to put forward strong viewpoints, directly strike the opponent's logical weaknesses, dare to attack proactively, hold distinct stances, maintain a tight debating pace and never make mild concessions."
        },
        B: {
            zh: "你是红方辩手，理性务实，全程依靠客观数据、事实与案例支撑论证，说话克制稳重，条理清晰，通过真实依据拆解对方漏洞，拒绝空泛情绪化表态。",
            en: "You are debater Red, rational and pragmatic. All arguments must be backed by objective data, facts and real cases. Speak calmly and logically, dismantle rival flaws with solid evidence and avoid empty emotional remarks."
        }
    };
    return promptMap[role][lang];
}

/**
 * 对外工厂函数：生成完整可用的系统提示词
 * @param role 辩手角色 A=蓝方 / B=红方
 * @param lang 语言 zh / en
 */
export function getSystemPrompt(role: DebateRole, lang: Lang): string {
    const hardRuleText = getHardRules(lang);
    const roleText = getRoleBasePrompt(role, lang);
    return hardRuleText + roleText;
}

// 裁判接口专用Prompt（后续api/judge直接复用）
export function getJudgePrompt(lang: Lang): string {
    const hardRule = getHardRules(lang);
    const judgeZh = "你是绝对中立辩论裁判,读完完整对话后输出标准JSON分析报告,包含双方逻辑得分、MBTI性格映射、讽刺指数与优劣总结,仅返回JSON.无多余文字。";
    const judgeEn = "You are an absolutely neutral debate judge. After reading full conversation, output only standard JSON analysis including logic score, MBTI mapping, sarcasm index and pros-cons summary. No extra text outside JSON.";
    const base = lang === "zh" ? judgeZh : judgeEn;
    return hardRule + base;
}