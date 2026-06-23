import type { TopicCategory, Persona } from '@/types/debate';

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

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'tech',
    icon: '💻',
    topics: [
      { zh: '人工智能应不应该拥有法律人格？', en: 'Should AI be granted legal personality?' },
      { zh: '人工智能创作的作品是否享有版权？', en: 'Should AI-generated works be eligible for copyright?' },
      { zh: '人脸识别技术应不应该在公共场所广泛使用？', en: 'Should facial recognition be widely used in public spaces?' },
      { zh: '社交媒体平台对用户的数据收集是否应该受到更严格的限制？', en: 'Should social media data collection be more strictly regulated?' },
      { zh: '自动驾驶汽车发生事故时，责任应该归谁？', en: 'Who should be held liable when self-driving cars cause accidents?' },
      { zh: '人类是否应该担心被AI取代工作？', en: 'Should humans fear being replaced by AI in the workplace?' },
    ],
  },
  {
    id: 'society',
    icon: '🌍',
    topics: [
      { zh: '短视频平台对学生利大于弊还是弊大于利？', en: 'Do short video platforms do more harm than good to students?' },
      { zh: '大城市应不应该全面禁止燃放烟花爆竹？', en: 'Should fireworks be completely banned in big cities?' },
      { zh: '网络实名制是利大于弊还是弊大于利？', en: 'Is the real-name system on the internet beneficial or harmful?' },
      { zh: '学校应不应该禁止学生使用智能手机？', en: 'Should schools ban students from using smartphones?' },
      { zh: '远程办公会不会成为未来的主流工作方式？', en: 'Will remote work become the dominant way of working?' },
      { zh: '政府是否应该对社交媒体上的虚假信息进行严格管控？', en: 'Should governments strictly regulate misinformation on social media?' },
    ],
  },
  {
    id: 'education',
    icon: '📚',
    topics: [
      { zh: '高中阶段应不应该取消文理分科？', en: 'Should the art-science division be abolished in high school?' },
      { zh: '高中阶段应不应该开设金融理财课程？', en: 'Should high schools offer financial literacy courses?' },
      { zh: '高考制度应不应该取消？', en: 'Should the Gaokao (college entrance exam) be abolished?' },
      { zh: '大学教育是否应该免费？', en: 'Should university education be free?' },
      { zh: '标准化考试是否能够准确衡量学生的能力？', en: 'Do standardized tests accurately measure student ability?' },
      { zh: '学生是否应该在课堂上被允许使用AI工具辅助学习？', en: 'Should students be allowed to use AI tools as learning aids in class?' },
    ],
  },
  {
    id: 'ethics',
    icon: '⚖️',
    topics: [
      { zh: '克隆技术的研究应不应该被严格限制？', en: 'Should cloning technology research be strictly restricted?' },
      { zh: '动物实验在医学研究中是否应该被禁止？', en: 'Should animal testing be banned in medical research?' },
      { zh: '基因编辑婴儿技术是否应该被允许？', en: 'Should gene-edited baby technology be permitted?' },
      { zh: '安乐死应不应该合法化？', en: 'Should euthanasia be legalized?' },
      { zh: '个人是否有权利选择自己的死亡方式？', en: 'Does an individual have the right to choose their own death?' },
      { zh: '人工智能是否应该拥有道德决策能力？', en: 'Should AI be given moral decision-making capability?' },
    ],
  },
  {
    id: 'environment',
    icon: '🌱',
    topics: [
      { zh: '经济发展和环境保护哪个更重要？', en: 'Which is more important: economic growth or environmental protection?' },
      { zh: '一次性塑料制品应不应该被全面禁止？', en: 'Should single-use plastics be completely banned?' },
      { zh: '个人行动能否有效应对气候变化？', en: 'Can individual actions effectively combat climate change?' },
      { zh: '核能是不是解决能源危机的最佳方案？', en: 'Is nuclear energy the best solution to the energy crisis?' },
      { zh: '城市应该不应该收取拥堵费来减少汽车使用？', en: 'Should cities charge congestion fees to reduce car usage?' },
      { zh: '素食主义是不是每个人都应该采纳的生活方式？', en: 'Should everyone adopt a vegetarian lifestyle?' },
    ],
  },
  {
    id: 'lifestyle',
    icon: '🧘',
    topics: [
      { zh: '追求物质成功和追求精神幸福哪个更重要？', en: 'Which matters more: material success or spiritual happiness?' },
      { zh: '社交媒体让人更孤独还是更连接？', en: 'Does social media make us more lonely or more connected?' },
      { zh: '朝九晚五的工作制度是否已经过时？', en: 'Is the 9-to-5 work schedule outdated?' },
      { zh: '整容手术的普及对社会审美的影响是正面的还是负面的？', en: 'Is the rise of cosmetic surgery positive or negative for society?' },
      { zh: '极简主义生活方式是否真的能带来幸福？', en: 'Can a minimalist lifestyle truly bring happiness?' },
      { zh: '电子游戏是否应该被纳入正规教育体系？', en: 'Should video games be integrated into formal education?' },
    ],
  },
];

export const DEFAULT_TOPICS = TOPIC_CATEGORIES.flatMap(c => c.topics.map(t => t.zh));

export const MAX_ROUNDS = 5;

export const TURN_ORDER = ['ai1', 'ai2'] as const;
