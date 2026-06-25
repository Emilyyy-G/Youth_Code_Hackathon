import type { Persona, Language } from '@/types/debate';
import { ROUND_TYPES } from './constants';

export type RoundType = (typeof ROUND_TYPES)[number];

const roundTypeConfig: Record<RoundType, {
  wordLimit: string;
  enWordLimit: string;
  zhTitle: string;
  enTitle: string;
  zhInstruction: string;
  enInstruction: string;
}> = {
  opening: {
    wordLimit: '80-120字',
    enWordLimit: '80-120 words',
    zhTitle: '开篇立论',
    enTitle: 'Opening Statement',
    zhInstruction: '这是你的开篇立论。请清晰阐述己方核心论点，为整场辩论奠定基调，做到开门见山、立场鲜明。',
    enInstruction: 'This is your opening statement. Clearly present your core argument, set the tone for the debate, and establish your position firmly.',
  },
  'rebuttal-1': {
    wordLimit: '50-80字',
    enWordLimit: '50-80 words',
    zhTitle: '第一轮反驳',
    enTitle: 'First Rebuttal',
    zhInstruction: '这是第一轮反驳。请直接回应对手观点，指出对方逻辑漏洞，并强化自己的论据。',
    enInstruction: 'This is your first rebuttal. Directly address the opponent\'s points, identify logical gaps, and reinforce your own argument.',
  },
  'rebuttal-2': {
    wordLimit: '50-80字',
    enWordLimit: '50-80 words',
    zhTitle: '第二轮反驳',
    enTitle: 'Second Rebuttal',
    zhInstruction: '这是第二轮反驳。请进一步深化反驳，针对对手的最新论点进行有力回击，巩固己方立场。',
    enInstruction: 'This is your second rebuttal. Deepen your counter-arguments, strike back against the opponent\'s latest points, and solidify your position.',
  },
  closing: {
    wordLimit: '30-60字',
    enWordLimit: '30-60 words',
    zhTitle: '总结陈词',
    enTitle: 'Closing Statement',
    zhInstruction: '这是总结陈词！请精炼回顾己方最强论点，指出对手未能解决的核心问题，并以一句有力的话收尾。',
    enInstruction: 'This is your closing statement! Briefly recap your strongest argument, highlight the core issue the opponent failed to address, and end with a powerful final remark.',
  },
};

export function getRoundType(roundNumber: number): RoundType {
  const idx = Math.min(Math.max(roundNumber - 1, 0), ROUND_TYPES.length - 1);
  return ROUND_TYPES[idx];
}

export function buildDebateSystemPrompt(
  topic: string,
  persona: Persona,
  roundNumber: number,
  moderatorNote: string | null,
  language: Language,
  isFinalRound: boolean = false,
): string {
  const roundType = getRoundType(roundNumber);
  const config = roundTypeConfig[roundType];

  if (language === 'en') {
    const lines: string[] = [
      `You are a debater participating in a debate. Here are your settings:`,
      ``,
      `[DEBATE TOPIC]`,
      topic,
      ``,
      `[YOUR ROLE]`,
      `Name: ${persona.id === 'ai1' ? 'Debater 1' : 'Debater 2'}`,
      `Stance: ${persona.stance === 'pro' ? 'Pro (supporting)' : 'Con (opposing)'}`,
      `Style: ${persona.personality === '逻辑严密，擅长使用数据和事实论证，风格理性且富有攻击性。' ? 'Logical and rigorous, good at using data and facts, rational and aggressive.' : 'Witty and humorous, good at analogies and reductio ad absurdum, appeals to emotion and values.'}`,
      ``,
      `[ABOUT THIS SPEECH]`,
      `Type: ${config.enTitle}`,
      `Word limit: ${config.enWordLimit}. Be concise and impactful.`,
      `${config.enInstruction}`,
      ``,
      `[GENERAL RULES]`,
      `1. You are debating another AI debater with the opposite stance.`,
      `2. Use **bold** to mark the single most important keyword or core argument in each sentence.`,
      `3. Maintain debate etiquette — be polite but firm in defending your position.`,
      `4. Output only your own argument — do not simulate your opponent's speech.`,
      `5. Take a clear stance — no ambiguity.`,
      `6. **CRITICAL: You MUST speak in English. Output ONLY in English.**`,
      ``,
    ];

    if (moderatorNote) {
      lines.push(
        `[MODERATOR NOTE]`,
        `Please adjust your strategy and style based on the following feedback:`,
        moderatorNote,
        ``,
      );
    }

    lines.push(`Begin your ${config.enTitle.toLowerCase()}:`);
    return lines.join('\n');
  }

  // Chinese (default)
  const lines: string[] = [
    `你是一名正在参加中文辩论赛的辩手。以下是你的辩论设定：`,
    ``,
    `【辩论主题】`,
    topic,
    ``,
    `【你的角色】`,
    `辩手名称：${persona.displayName}`,
    `你的立场：${persona.stanceLabel}（${persona.stance === 'pro' ? '支持' : '反对'}该观点）`,
    `你的风格：${persona.personality}`,
    ``,
    `【本轮说明】`,
    `类型：${config.zhTitle}`,
    `字数限制：${config.wordLimit}，言简意赅。`,
    config.zhInstruction,
    ``,
    `【辩论规则】`,
    `1. 你正在与另一位持相反立场的AI辩手进行辩论。`,
    `2. 用**加粗**标出你每句话中最重要的关键词或核心论点。`,
    `3. 保持辩论礼仪，有礼貌但坚定地捍卫你的立场。`,
    `4. 每次发言只输出你自己的论述，不要模拟对方的发言。`,
    `5. 每次发言必须立场鲜明，不能模棱两可。`,
    ``,
  ];

  if (moderatorNote) {
    lines.push(
      `【主持人提示】`,
      `以下是主持人对辩论的反馈，请根据这些反馈调整你的辩论策略和风格：`,
      moderatorNote,
      ``,
    );
  }

  lines.push(`请开始你的${config.zhTitle}：`);
  return lines.join('\n');
}
