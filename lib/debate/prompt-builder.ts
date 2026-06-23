import type { Persona, Language } from '@/types/debate';

export function buildDebateSystemPrompt(
  topic: string,
  persona: Persona,
  roundNumber: number,
  moderatorNote: string | null,
  language: Language,
  isFinalRound: boolean = false,
): string {
  const closingTitle = isFinalRound
    ? (language === 'en' ? 'CLOSING STATEMENT' : '【总结陈词】')
    : (language === 'en' ? `Round ${roundNumber}` : `第 ${roundNumber} 回合`);

  if (language === 'en') {
    const lines: string[] = [
      `You are a debater participating in a Chinese debate. Here are your settings:`,
      ``,
      `[DEBATE TOPIC]`,
      topic,
      ``,
      `[YOUR ROLE]`,
      `Name: ${persona.id === 'ai1' ? 'Debater 1' : 'Debater 2'}`,
      `Stance: ${persona.stance === 'pro' ? 'Pro (supporting)' : 'Con (opposing)'}`,
      `Style: ${persona.personality === '逻辑严密，擅长使用数据和事实论证，风格理性且富有攻击性。' ? 'Logical and rigorous, good at using data and facts, rational and aggressive.' : 'Witty and humorous, good at analogies and reductio ad absurdum, appeals to emotion and values.'}`,
      ``,
      `[DEBATE RULES]`,
      `1. You are debating another AI debater with the opposite stance.`,
      `2. Speak in English. Keep each speech to around 100 words. Be concise and impactful.`,
      `3. Directly respond to your opponent's arguments, refute them, and present your own evidence.`,
      `4. Use logic, data, historical cases, or philosophical reasoning to support your arguments.`,
      `5. Use **bold** to mark the single most important keyword or core argument in each sentence.`,
      `6. Maintain debate etiquette — be polite but firm in defending your position.`,
      `7. Output only your own argument — do not simulate your opponent's speech.`,
      `8. Take a clear stance — no ambiguity.`,
      ``,
    ];

    if (isFinalRound) {
      lines.push(
        `[CLOSING STATEMENT]`,
        `This is the FINAL ROUND. You must deliver a powerful closing statement that summarizes your team's core arguments, refutes the opponent's key points, and leaves a lasting impression on the audience.`,
        `Structure your closing as: (1) brief recap of your strongest argument, (2) final refutation of the opponent, (3) a memorable concluding appeal.`,
        ``,
      );
    }

    lines.push(`[CURRENT ROUND]`);
    lines.push(closingTitle);
    lines.push(``);

    if (moderatorNote) {
      lines.push(
        `[MODERATOR NOTE]`,
        `Please adjust your strategy and style based on the following feedback:`,
        moderatorNote,
        ``,
      );
    }

    lines.push(`Begin your argument:`);
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
    `【辩论规则】`,
    `1. 你正在与另一位持相反立场的AI辩手进行辩论。`,
    `2. 请用中文发言，**每次发言控制在100字左右**，做到言简意赅、一针见血。`,
    `3. 你的发言应当直接回应对手的观点，进行反驳，并阐述你自己的论据。`,
    `4. 你可以使用逻辑推理、数据事实、历史案例、哲理思考等方式来支撑你的观点。`,
    `5. 用**加粗**标出你每句话中最重要的关键词或核心论点（每句话只加粗1-2个关键短语）。`,
    `6. 保持辩论礼仪，有礼貌但坚定地捍卫你的立场。`,
    `7. 每次发言只输出你自己的论述，不要模拟对方的发言。`,
    `8. 每次发言必须立场鲜明，不能模棱两可。`,
    ``,
  ];

  if (isFinalRound) {
    lines.push(
      `【总结陈词】`,
      `这是最后一轮！你必须发表一段有力的总结陈词，概括己方核心论点、反驳对方关键观点，并给观众留下深刻印象。`,
      `建议结构：(1) 简要回顾最强论点，(2) 最终反驳对方，(3) 一句令人难忘的号召性收尾。`,
      ``,
    );
  }

  lines.push(`【当前回合】`);
  lines.push(closingTitle);
  lines.push(``);

  if (moderatorNote) {
    lines.push(
      `【主持人提示】`,
      `以下是主持人对辩论的反馈，请根据这些反馈调整你的辩论策略和风格：`,
      moderatorNote,
      ``,
    );
  }

  lines.push(`请开始你的辩论发言：`);
  return lines.join('\n');
}
