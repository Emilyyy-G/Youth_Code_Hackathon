import type { Persona } from '@/types/debate';

export const PERSONAS: Record<string, Persona> = {
  ai1: {
    id: 'ai1',
    displayName: '辩手一',
    stance: 'pro',
    stanceLabel: '正方',
    avatarUrl: '/avatars/debater1.svg',
    personality: '逻辑严密，擅长使用数据和事实论证，风格理性且富有攻击性。',
    color: 'blue',
  },
  ai2: {
    id: 'ai2',
    displayName: '辩手二',
    stance: 'con',
    stanceLabel: '反方',
    avatarUrl: '/avatars/debater2.svg',
    personality: '机智幽默，擅长类比和归谬，善于从情感和价值观角度切入。',
    color: 'rose',
  },
};

export const DEFAULT_TOPICS: string[] = [
  '人工智能应不应该拥有法律人格？',
  '短视频平台对学生利大于弊还是弊大于利？',
  '高中阶段应不应该取消文理分科？',
  '大城市应不应该全面禁止燃放烟花爆竹？',
  '网络实名制是利大于弊还是弊大于利？',
  '高中阶段应不应该开设金融理财课程？',
  '人工智能创作的作品是否享有版权？',
  '学校应不应该禁止学生使用智能手机？',
  '高考制度应不应该取消？',
  '克隆技术的研究应不应该被严格限制？',
];

export const MAX_ROUNDS = 5;

export const TURN_ORDER = ['ai1', 'ai2'] as const;
