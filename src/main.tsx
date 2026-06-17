import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  ChevronRight,
  Download,
  HeartHandshake,
  RefreshCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import './styles.css';

type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
type ResultId =
  | 'isfj'
  | 'esfj'
  | 'istj'
  | 'enfp'
  | 'infj'
  | 'infp'
  | 'esfp'
  | 'entp'
  | 'enfj'
  | 'istp'
  | 'intj'
  | 'isfp'
  | 'estp'
  | 'estj'
  | 'entj'
  | 'intp';

type Result = {
  id: ResultId;
  order: number;
  mbti: string;
  title: string;
  craftGroup: string;
  image: string;
  hue: string;
  softHue: string;
  oneLiner: string;
  description: string;
  ability: string;
  crafts: string[];
  firstStep: string;
  mission: string;
  shareLine: string;
  bestPartner: string;
  contrastPartner: string;
};

type Option = {
  label: string;
  text: string;
  scores: Partial<Record<Dimension, number>>;
  tags: string[];
  resultHints?: ResultId[];
};

type Question = {
  title: string;
  kicker: string;
  options: Option[];
};

type Answer = {
  questionIndex: number;
  optionIndex: number;
};

const results: Result[] = [
  {
    id: 'isfj',
    order: 1,
    mbti: 'ISFJ',
    title: '时间慢酿家',
    craftGroup: '茶酒药香与发酵养生',
    image: './artisans_ascii/artisan-01.png',
    hue: '#7c8f3f',
    softHue: '#edf2d2',
    oneLiner: '你擅长把时间照顾成味道。',
    description:
      '你不急着把答案端出来，更相信火候、耐心和长期照看。茶香、米酒、草药和发酵的细微变化，会让你重新理解生活不是冲刺，而是一点点养出来的秩序。',
    ability: '稳定照看、细腻观察、把普通日子慢慢调顺。',
    crafts: ['茶制作', '酿造发酵', '药香香囊'],
    firstStep: '跟工匠老师记录一次发酵或焙茶过程，问清楚每个等待节点为什么不能省。',
    mission: '做一瓶属于今天心情的茶饮或发酵小物。',
    shareLine: '我不是慢热，我是在给生活留发酵时间。',
    bestPartner: '烟火投喂官',
    contrastPartner: '纸上开花派',
  },
  {
    id: 'esfj',
    order: 2,
    mbti: 'ESFJ',
    title: '烟火投喂官',
    craftGroup: '面点肉食与地方小吃',
    image: './artisans_ascii/artisan-02.png',
    hue: '#d4623c',
    softHue: '#ffe1cf',
    oneLiner: '你把热闹、照顾和手艺揉进一口热食。',
    description:
      '你最懂“让人坐下来”的力量。米面、灶火、地方小吃和乡宴背后，不只是好吃，还有节气、分寸和待客之道。你适合从一张热桌子开始理解乡村生活。',
    ability: '组织氛围、照顾他人、让陌生人很快变熟。',
    crafts: ['米面点心', '地方小吃', '乡宴技艺'],
    firstStep: '先跟老师学一道地方小吃的基础动作，再听它在当地什么时候会被端上桌。',
    mission: '做一份能分给三个人的乡味小食。',
    shareLine: '我的手艺天赋，是把大家重新叫回一张桌子。',
    bestPartner: '时间慢酿家',
    contrastPartner: '硬核雕刻家',
  },
  {
    id: 'istj',
    order: 3,
    mbti: 'ISTJ',
    title: '窑火秩序师',
    craftGroup: '陶瓷烧造与窑火器物',
    image: './artisans_ascii/artisan-03.png',
    hue: '#b85f38',
    softHue: '#ffe0cf',
    oneLiner: '你相信好器物来自温度、步骤和反复试错。',
    description:
      '你对流程和标准有天然尊重。泥料、釉色、火候、测温和失败率，会让你感到踏实。你适合在窑火边学习一件事：真正的稳定，是允许每一步都被认真对待。',
    ability: '控流程、守标准、把复杂工序拆成可靠步骤。',
    crafts: ['陶瓷拉坯', '釉色试片', '窑烧器物'],
    firstStep: '从一只杯或碗开始，记录泥、釉、温度和烧成结果。',
    mission: '烧出一个每天都会用到的小器物。',
    shareLine: '我不是较真，我是在给作品留住分寸。',
    bestPartner: '纸墨研究员',
    contrastPartner: '泥火造梦师',
  },
  {
    id: 'enfp',
    order: 4,
    mbti: 'ENFP',
    title: '泥火造梦师',
    craftGroup: '琉璃陶塑与泥火装饰',
    image: './artisans_ascii/artisan-04.png',
    hue: '#c36b8c',
    softHue: '#ffdceb',
    oneLiner: '你能把一团泥，捏成别人没见过的想象。',
    description:
      '你不满足于照着样子做，更喜欢让泥、火、釉色和造型出现新的组合。你的创造力不是乱来，而是敢于把传统材料推向更有表情的当代器物。',
    ability: '大胆联想、情绪表达、把材料变成角色和故事。',
    crafts: ['陶塑', '泥塑', '琉璃感装饰'],
    firstStep: '先做一个小陶塑或装饰件，问老师哪些夸张造型会影响烧成。',
    mission: '捏出一件“只有你会想到”的小作品。',
    shareLine: '我的想象力，得进窑里烧一烧才算数。',
    bestPartner: '国潮气氛组',
    contrastPartner: '窑火秩序师',
  },
  {
    id: 'infj',
    order: 5,
    mbti: 'INFJ',
    title: '针线图腾师',
    craftGroup: '民族刺绣与挑花',
    image: './artisans_ascii/artisan-05.png',
    hue: '#3e7f8f',
    softHue: '#d8f2f2',
    oneLiner: '你总能看见纹样背后更深的心意。',
    description:
      '你会被图案、寓意和人的故事吸引。刺绣与挑花不只是漂亮纹样，它们往往连接地方记忆、族群生活和女性经验。你适合带着敬意，把一针一线学慢一点。',
    ability: '理解象征、倾听故事、把情绪缝成有出处的纹样。',
    crafts: ['刺绣', '挑花', '纹样记录'],
    firstStep: '先学一个基础针法，再问清楚纹样来自哪里、适合用在什么场景。',
    mission: '绣一个小符号，写下它真实的来处和你的理解。',
    shareLine: '我做的不是花纹，是一段被认真听见的故事。',
    bestPartner: '好运绣造师',
    contrastPartner: '生活发明家',
  },
  {
    id: 'infp',
    order: 6,
    mbti: 'INFP',
    title: '好运绣造师',
    craftGroup: '特色绣品与生活绣物',
    image: './artisans_ascii/artisan-06.png',
    hue: '#9b5c9f',
    softHue: '#f1ddf5',
    oneLiner: '你把祝福缝进生活，不把它说得太响。',
    description:
      '你喜欢安静但有情绪的表达。一个香包、一方帕子、一只布偶或一件生活绣物，都能承载心愿。这里的“好运”不是玄学，而是亲手做给自己和重要的人一点祝福。',
    ability: '情绪感知、温柔表达、把心事变成可携带的小物。',
    crafts: ['生活刺绣', '香包', '布艺小物'],
    firstStep: '从一个小绣片开始，跟老师学基础针法和收边方式。',
    mission: '给自己或朋友做一件带有祝福意味的小物。',
    shareLine: '我把好运缝好，先送给今天的自己。',
    bestPartner: '针线图腾师',
    contrastPartner: '火花锻造派',
  },
  {
    id: 'esfp',
    order: 7,
    mbti: 'ESFP',
    title: '东方穿搭局',
    craftGroup: '织染服饰与布艺鞋帽',
    image: './artisans_ascii/artisan-07.png',
    hue: '#d35172',
    softHue: '#ffdce6',
    oneLiner: '你能把传统穿成今天也想出门的样子。',
    description:
      '你对颜色、布料、造型和上身效果很敏感。织、染、裁、绣、鞋帽都不是简单换装，而是生活礼俗与当代审美的连接。你适合让手艺走进真实穿搭。',
    ability: '审美转换、现场感染、把材料变成可穿的态度。',
    crafts: ['草木染', '织布', '布艺鞋帽'],
    firstStep: '选一块布料，跟老师了解它从纤维到穿着的完整过程。',
    mission: '做一件能真正穿出去的小配饰。',
    shareLine: '我不是爱打扮，我是在给传统找新穿法。',
    bestPartner: '国潮气氛组',
    contrastPartner: '纸墨研究员',
  },
  {
    id: 'entp',
    order: 8,
    mbti: 'ENTP',
    title: '纸上开花派',
    craftGroup: '剪纸年画与民间绘画',
    image: './artisans_ascii/artisan-08.png',
    hue: '#e24f44',
    softHue: '#ffdbd6',
    oneLiner: '你一出手，平面就开始长出新点子。',
    description:
      '你喜欢把熟悉的符号翻新，不怕脑洞拐弯。剪纸、年画、刻纸和民间绘画，给了你最轻快的实验场。纸很薄，但它能开出非常热闹的想象。',
    ability: '快速发想、重组符号、把传统图案转成传播语言。',
    crafts: ['剪纸', '年画', '民间绘画'],
    firstStep: '先复刻一个基础图案，再做一个属于当下生活的新版本。',
    mission: '剪一张“今天也能看懂”的纸上作品。',
    shareLine: '纸够薄，脑洞才开得够快。',
    bestPartner: '国潮气氛组',
    contrastPartner: '时间慢酿家',
  },
  {
    id: 'enfj',
    order: 9,
    mbti: 'ENFJ',
    title: '国潮气氛组',
    craftGroup: '漆彩灯影与节庆玩艺',
    image: './artisans_ascii/artisan-09.png',
    hue: '#dd8a22',
    softHue: '#ffe7bd',
    oneLiner: '你一出现，普通日子就有了节庆感。',
    description:
      '你擅长把人聚到一起，也懂得用灯彩、漆色、皮影和玩艺制造共同记忆。真正的国潮不是符号乱贴，而是知道元素从哪里来、怎样用得准。',
    ability: '召集人群、点亮现场、把文化表达变成大家愿意参与的场。',
    crafts: ['灯彩', '皮影', '漆彩玩艺'],
    firstStep: '跟老师学一个节庆器物的基础结构，听它在当地怎么被使用。',
    mission: '组织一次小型手艺共创，把三个人带进同一张桌子。',
    shareLine: '我不是爱热闹，我是在把日子重新点亮。',
    bestPartner: '东方穿搭局',
    contrastPartner: '硬核雕刻家',
  },
  {
    id: 'istp',
    order: 10,
    mbti: 'ISTP',
    title: '木语造物家',
    craftGroup: '木作家具与竹木雕刻',
    image: './artisans_ascii/artisan-10.png',
    hue: '#8b6848',
    softHue: '#eadac4',
    oneLiner: '你听得懂木头的脾气，也尊重工具的答案。',
    description:
      '你喜欢直接上手，拆开、看懂、修好。木作里的纹理、结构、榫卯和打磨，会让你很快进入状态。你适合用一件耐用器物，把混乱生活重新做实。',
    ability: '动手解决、结构判断、把想法落实到手感和用途。',
    crafts: ['木作', '榫卯', '竹木雕刻'],
    firstStep: '先做一只木勺或小凳部件，体会顺纹、逆纹和打磨分寸。',
    mission: '做一件每天能被手摸到的木器。',
    shareLine: '别讲太多，给我一块木头和一套工具。',
    bestPartner: '窑火秩序师',
    contrastPartner: '泥火造梦师',
  },
  {
    id: 'intj',
    order: 11,
    mbti: 'INTJ',
    title: '硬核雕刻家',
    craftGroup: '石玉骨雕与雕塑',
    image: './artisans_ascii/artisan-11.png',
    hue: '#596171',
    softHue: '#dfe4ec',
    oneLiner: '你能在坚硬材料里看见未来的形状。',
    description:
      '你不怕慢，也不怕难。石、玉、骨、木或雕塑材料里的阻力，反而会让你进入专注状态。你适合学习如何在硬材料中找结构、留余地、下决定。',
    ability: '长期专注、判断取舍、把抽象构想落进坚硬材料。',
    crafts: ['石雕', '玉雕', '雕塑'],
    firstStep: '从线稿和小料练习开始，理解每一刀为什么不能随便撤回。',
    mission: '雕出一个小而明确的形体。',
    shareLine: '我不是冷，我只是习惯把判断刻深一点。',
    bestPartner: '村落设计师',
    contrastPartner: '烟火投喂官',
  },
  {
    id: 'isfp',
    order: 12,
    mbti: 'ISFP',
    title: '野生编织者',
    craftGroup: '草藤竹编与麦秆画',
    image: './artisans_ascii/artisan-12.png',
    hue: '#6e9a5e',
    softHue: '#dff0d6',
    oneLiner: '你顺着自然的材料，编出自己的节奏。',
    description:
      '这里的“野生”不是粗糙，而是就地取材、自由生长的创造力。草、藤、竹、棕和麦秆，都有各自的韧性。你适合在反复穿压之间，找回身体自己的节奏。',
    ability: '材料敏感、自由调整、把自然纹理变成生活器物。',
    crafts: ['竹编', '藤编', '麦秆画'],
    firstStep: '先学一种基础编法，观察材料干湿、粗细和受力变化。',
    mission: '编一个能装下小东西的生活器物。',
    shareLine: '我不是随便长大，我是在顺着材料生长。',
    bestPartner: '生活发明家',
    contrastPartner: '火花锻造派',
  },
  {
    id: 'estp',
    order: 13,
    mbti: 'ESTP',
    title: '生活发明家',
    craftGroup: '日用器具与乡土乐器',
    image: './artisans_ascii/artisan-13.png',
    hue: '#2e8c83',
    softHue: '#d0f0ea',
    oneLiner: '你看到问题，第一反应是上手改一改。',
    description:
      '你不太爱空谈，更喜欢现场解决。农具、器具、乐器和日用小物背后，常常是生活经验的发明。你适合跟工匠老师学习“为什么这样更好用”。',
    ability: '快速试错、现场判断、把需求改造成能用的东西。',
    crafts: ['日用器具', '乡土乐器', '旧物改造'],
    firstStep: '观察一件老工具的结构，问老师它解决了什么具体问题。',
    mission: '把一件旧物改成新的生活用途。',
    shareLine: '人生先动手，答案会自己长出来。',
    bestPartner: '野生编织者',
    contrastPartner: '针线图腾师',
  },
  {
    id: 'estj',
    order: 14,
    mbti: 'ESTJ',
    title: '火花锻造派',
    craftGroup: '金属锻铸与首饰器物',
    image: './artisans_ascii/artisan-14.png',
    hue: '#a94f36',
    softHue: '#ffd8c9',
    oneLiner: '你把热度、力量和规则锻成真正可靠的东西。',
    description:
      '你喜欢清楚的目标和硬核的现场。金属锻铸、錾刻、首饰器物都有安全、力量和工序门槛。你适合在火花里学习控制，而不只是追求酷炫。',
    ability: '执行力强、守规则、能把团队和流程组织起来。',
    crafts: ['金属锻造', '首饰器物', '錾刻'],
    firstStep: '从安全规则和基础敲击练习开始，了解金属如何被加热、延展和成形。',
    mission: '做一件小金属器物，记录它从硬到顺的过程。',
    shareLine: '我不是强势，我是在把事情锻到靠谱。',
    bestPartner: '生活发明家',
    contrastPartner: '好运绣造师',
  },
  {
    id: 'entj',
    order: 15,
    mbti: 'ENTJ',
    title: '村落设计师',
    craftGroup: '传统建筑与空间营造',
    image: './artisans_ascii/artisan-15.png',
    hue: '#476f96',
    softHue: '#d8e8f6',
    oneLiner: '你关心的不是一个作品，而是一条路能不能走通。',
    description:
      '你会自然地看见空间、组织和未来。传统建筑、木构、院落更新和工坊营造，都需要尊重原有生活，不是把乡村当成设计游乐场。你适合做连接者。',
    ability: '系统规划、资源整合、把人、空间和手艺组织成可持续项目。',
    crafts: ['传统建筑', '木构营造', '工坊空间'],
    firstStep: '先观察一个真实院落怎么被使用，再和老师讨论什么能改、什么该留。',
    mission: '为一间乡村工坊画出更好用的一日动线。',
    shareLine: '我要做的不是爆款，是让手艺有未来。',
    bestPartner: '硬核雕刻家',
    contrastPartner: '好运绣造师',
  },
  {
    id: 'intp',
    order: 16,
    mbti: 'INTP',
    title: '纸墨研究员',
    craftGroup: '文房纸墨与印刷装裱',
    image: './artisans_ascii/artisan-16.png',
    hue: '#4c5b7d',
    softHue: '#dde3f4',
    oneLiner: '你会把一张纸、一滴墨，研究到出现宇宙。',
    description:
      '你对“为什么会这样”很着迷。纸、墨、印刷、装裱和文房器物，都藏着材料、湿度、纤维、胶性和审美判断。你适合把工坊变成自己的生活实验室。',
    ability: '追问原理、安静研究、把细节拆到别人没注意的地方。',
    crafts: ['造纸', '制墨', '印刷装裱'],
    firstStep: '从纸张纤维、墨色变化或装裱结构中选一个问题，跟老师追问到底。',
    mission: '做一张属于自己的纸墨样本卡。',
    shareLine: '我不是想太多，我是在研究世界的纤维。',
    bestPartner: '窑火秩序师',
    contrastPartner: '东方穿搭局',
  },
];

const resultByMbti = new Map(results.map((result) => [result.mbti, result]));

const questions: Question[] = [
  {
    kicker: '第一步，选一种回血方式',
    title: '城市把你耗到只剩 20% 电量，你最想怎么充回来？',
    options: [
      {
        label: 'A',
        text: '约朋友去村集，边吃边逛，顺手认识几个摊主',
        scores: { E: 2, S: 2, P: 1, F: 1 },
        tags: ['集市', '食物', '热闹'],
        resultHints: ['esfj', 'esfp'],
      },
      {
        label: 'B',
        text: '找个安静院子，跟老师慢慢做一只杯子',
        scores: { I: 2, S: 2, J: 2 },
        tags: ['陶土', '器物', '安静'],
        resultHints: ['istj', 'isfj'],
      },
      {
        label: 'C',
        text: '去山里看植物，研究它们能染出什么颜色',
        scores: { I: 2, N: 2, P: 2 },
        tags: ['植物', '草木染', '颜色'],
        resultHints: ['isfp', 'infp'],
      },
      {
        label: 'D',
        text: '组织一次“旧物变新物”挑战，看看谁脑洞最大',
        scores: { E: 2, N: 2, T: 1, P: 2 },
        tags: ['改造', '共创', '脑洞'],
        resultHints: ['entp', 'estp'],
      },
    ],
  },
  {
    kicker: '进工坊的第一眼',
    title: '你第一次走进工匠老师的工坊，最先被什么吸引？',
    options: [
      {
        label: 'A',
        text: '工具摆放、工序节奏、每一步有没有章法',
        scores: { S: 2, T: 2, J: 2 },
        tags: ['工具', '流程', '结构'],
        resultHints: ['istj', 'istp'],
      },
      {
        label: 'B',
        text: '材料的味道、触感、颜色和手上的温度',
        scores: { S: 2, F: 2, P: 1 },
        tags: ['手感', '颜色', '材料'],
        resultHints: ['isfp', 'esfp'],
      },
      {
        label: 'C',
        text: '老师讲起这门手艺时，眼神里那种关系感',
        scores: { I: 1, N: 2, F: 2, J: 1 },
        tags: ['故事', '纹样', '记忆'],
        resultHints: ['infj', 'infp'],
      },
      {
        label: 'D',
        text: '这门手艺有没有机会做成年轻人会用的新产品',
        scores: { E: 1, N: 2, T: 2, J: 2 },
        tags: ['产品', '品牌', '未来'],
        resultHints: ['entj', 'intj'],
      },
    ],
  },
  {
    kicker: '你想带走什么',
    title: '如果只能从乡村带走一件亲手做的作品，你会选？',
    options: [
      {
        label: 'A',
        text: '每天能用的杯、碗、盘，越朴素越耐看',
        scores: { I: 1, S: 2, J: 2 },
        tags: ['陶瓷', '日用', '朴素'],
        resultHints: ['istj', 'isfj'],
      },
      {
        label: 'B',
        text: '有寓意的小饰品或绣物，像一枚安静护身符',
        scores: { I: 2, N: 2, F: 2 },
        tags: ['刺绣', '银饰', '祝福'],
        resultHints: ['infj', 'infp'],
      },
      {
        label: 'C',
        text: '结构很巧的木器或工具，越研究越聪明',
        scores: { I: 1, N: 1, T: 2, J: 1 },
        tags: ['木作', '工具', '结构'],
        resultHints: ['istp', 'intj'],
      },
      {
        label: 'D',
        text: '颜色大胆、拍照很好看的包、围巾或灯彩小物',
        scores: { E: 2, F: 1, P: 2, N: 1 },
        tags: ['穿搭', '灯彩', '出片'],
        resultHints: ['esfp', 'enfj'],
      },
    ],
  },
  {
    kicker: '失败时的真实反应',
    title: '作品做到一半翻车了，你脑子里第一句话是？',
    options: [
      {
        label: 'A',
        text: '先找失败原因，下次按步骤修正',
        scores: { S: 2, T: 2, J: 2 },
        tags: ['修正', '标准', '复盘'],
        resultHints: ['istj', 'estj'],
      },
      {
        label: 'B',
        text: '这个裂纹也许就是它自己的性格',
        scores: { I: 1, N: 2, F: 2, P: 2 },
        tags: ['窑变', '情绪', '偶然'],
        resultHints: ['enfp', 'infp'],
      },
      {
        label: 'C',
        text: '赶紧问老师有没有补救办法，别浪费材料',
        scores: { E: 1, S: 2, F: 1, J: 2 },
        tags: ['请教', '节俭', '补救'],
        resultHints: ['isfj', 'esfj'],
      },
      {
        label: 'D',
        text: '干脆改成另一个用途，说不定更酷',
        scores: { E: 1, N: 2, T: 2, P: 2 },
        tags: ['改造', '发明', '反转'],
        resultHints: ['entp', 'estp'],
      },
    ],
  },
  {
    kicker: '旅行搭子人格',
    title: '如果去乡村学手艺，你更像哪种同行者？',
    options: [
      {
        label: 'A',
        text: '攻略做满，路线、预算、时间点都安排清楚',
        scores: { E: 1, S: 1, T: 2, J: 2 },
        tags: ['规划', '运营', '路线'],
        resultHints: ['estj', 'entj'],
      },
      {
        label: 'B',
        text: '到了再说，跟着路边的香味和声音走',
        scores: { E: 2, S: 2, F: 1, P: 2 },
        tags: ['小吃', '集市', '即兴'],
        resultHints: ['esfj', 'esfp'],
      },
      {
        label: 'C',
        text: '喜欢跟当地人深聊，听一件旧物的来历',
        scores: { I: 2, N: 2, F: 2, J: 1 },
        tags: ['故事', '旧物', '传承'],
        resultHints: ['infj', 'intp'],
      },
      {
        label: 'D',
        text: '一路拍素材，回来做成“乡村手艺观察”',
        scores: { E: 2, N: 2, T: 1, P: 1 },
        tags: ['传播', '策展', '影像'],
        resultHints: ['enfj', 'entp'],
      },
    ],
  },
  {
    kicker: '你的材料手感',
    title: '闭眼摸到一种材料，你希望它是什么？',
    options: [
      {
        label: 'A',
        text: '温润的泥和釉，手上能感觉到水分和重量',
        scores: { I: 1, S: 2, F: 1, J: 1 },
        tags: ['陶土', '釉色', '器物'],
        resultHints: ['istj', 'enfp'],
      },
      {
        label: 'B',
        text: '木头、竹子或藤草，有纹理、有韧劲',
        scores: { I: 1, S: 2, T: 1, P: 1 },
        tags: ['木', '竹藤', '自然'],
        resultHints: ['istp', 'isfp'],
      },
      {
        label: 'C',
        text: '金属、石头或硬材料，越难越想挑战',
        scores: { S: 1, T: 2, J: 1 },
        tags: ['金属', '石雕', '力量'],
        resultHints: ['estj', 'intj'],
      },
      {
        label: 'D',
        text: '纸、布、线、颜料，轻轻一动就能变出图案',
        scores: { N: 2, F: 2, P: 1 },
        tags: ['纸艺', '刺绣', '织染'],
        resultHints: ['infj', 'entp', 'esfp'],
      },
    ],
  },
  {
    kicker: '你最怕的工坊体验',
    title: '参加手艺体验时，你最受不了哪种情况？',
    options: [
      {
        label: 'A',
        text: '步骤不清楚，做着做着不知道下一步',
        scores: { S: 2, T: 1, J: 2 },
        tags: ['步骤', '清晰', '标准'],
        resultHints: ['istj', 'estj'],
      },
      {
        label: 'B',
        text: '全程太安静，没人交流，像在考试',
        scores: { E: 2, F: 2, P: 1 },
        tags: ['交流', '气氛', '组局'],
        resultHints: ['enfj', 'esfj'],
      },
      {
        label: 'C',
        text: '只能照着做，不能改出自己的版本',
        scores: { N: 2, T: 1, P: 2 },
        tags: ['自由', '创新', '改造'],
        resultHints: ['entp', 'enfp'],
      },
      {
        label: 'D',
        text: '只讲情怀，不讲方法、品质和出处',
        scores: { I: 1, S: 1, T: 2, J: 1 },
        tags: ['方法', '品质', '真实'],
        resultHints: ['intp', 'intj'],
      },
    ],
  },
  {
    kicker: '你想跟谁学',
    title: '你最想遇到哪类工匠老师？',
    options: [
      {
        label: 'A',
        text: '话不多，但手上全是真功夫',
        scores: { I: 2, S: 2, T: 2 },
        tags: ['真功夫', '工具', '沉默'],
        resultHints: ['istp', 'intj'],
      },
      {
        label: 'B',
        text: '会讲故事，知道每个纹样背后的来处',
        scores: { I: 1, N: 2, F: 2, J: 1 },
        tags: ['纹样', '故事', '出处'],
        resultHints: ['infj', 'infp'],
      },
      {
        label: 'C',
        text: '能把传统手艺做成年轻品牌和新空间',
        scores: { E: 1, N: 2, T: 2, J: 2 },
        tags: ['品牌', '空间', '共创'],
        resultHints: ['entj', 'enfj'],
      },
      {
        label: 'D',
        text: '像邻居一样热情，边做边把你投喂饱',
        scores: { E: 2, S: 2, F: 2 },
        tags: ['款待', '小吃', '热情'],
        resultHints: ['esfj', 'isfj'],
      },
    ],
  },
  {
    kicker: '作品命名现场',
    title: '如果给你的手艺作品起名，你会偏向？',
    options: [
      {
        label: 'A',
        text: '朴素直接：山杯、竹灯、秋染',
        scores: { I: 1, S: 2, J: 2 },
        tags: ['朴素', '器物', '自然'],
        resultHints: ['isfj', 'isfp'],
      },
      {
        label: 'B',
        text: '有故事感：给外婆的蓝、风经过的银',
        scores: { I: 1, N: 2, F: 2 },
        tags: ['诗意', '银饰', '染色'],
        resultHints: ['infj', 'infp'],
      },
      {
        label: 'C',
        text: '有系统感：模块一号、折叠结构、轻量款',
        scores: { N: 2, T: 2, J: 1 },
        tags: ['系统', '结构', '产品'],
        resultHints: ['intp', 'entj'],
      },
      {
        label: 'D',
        text: '有传播感：今天不想上班包、松弛感杯',
        scores: { E: 2, N: 1, F: 1, P: 2 },
        tags: ['传播', '梗感', '出片'],
        resultHints: ['entp', 'esfp'],
      },
    ],
  },
  {
    kicker: '最后一题，决定你想留下些什么',
    title: '如果把作品发朋友圈，你最希望别人评论哪一句？',
    options: [
      {
        label: 'A',
        text: '“这个好实用，真的会想每天用。”',
        scores: { S: 2, T: 1, J: 2 },
        tags: ['实用', '日常', '品质'],
        resultHints: ['istj', 'istp'],
      },
      {
        label: 'B',
        text: '“好有你自己的感觉。”',
        scores: { I: 2, F: 2, P: 1 },
        tags: ['自我', '情绪', '手作'],
        resultHints: ['infp', 'isfp'],
      },
      {
        label: 'C',
        text: '“这个点子怎么想到的？”',
        scores: { N: 2, T: 2, P: 2 },
        tags: ['点子', '发明', '脑洞'],
        resultHints: ['entp', 'intp'],
      },
      {
        label: 'D',
        text: '“看完我也想去乡村学手艺了。”',
        scores: { E: 2, N: 2, F: 2, J: 1 },
        tags: ['召集', '共创', '传播'],
        resultHints: ['enfj', 'entj'],
      },
    ],
  },
];

const initialScores = (): Record<Dimension, number> => ({
  E: 0,
  I: 0,
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0,
});

function getImageFor(result: Result) {
  return new URL(result.image, window.location.href).toString();
}

function calculateResult(answers: Answer[]) {
  const scores = initialScores();
  const tags = new Map<string, number>();
  const hintedResults = new Map<ResultId, number>();

  answers.forEach(({ questionIndex, optionIndex }) => {
    const option = questions[questionIndex].options[optionIndex];
    Object.entries(option.scores).forEach(([key, value]) => {
      scores[key as Dimension] += value ?? 0;
    });
    option.tags.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1));
    option.resultHints?.forEach((resultId) => {
      hintedResults.set(resultId, (hintedResults.get(resultId) ?? 0) + 1);
    });
  });

  const mbti =
    (scores.E >= scores.I ? 'E' : 'I') +
    (scores.S >= scores.N ? 'S' : 'N') +
    (scores.T >= scores.F ? 'T' : 'F') +
    (scores.J >= scores.P ? 'J' : 'P');

  const exact = resultByMbti.get(mbti);
  const fallback = [...hintedResults.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => results.find((result) => result.id === id))
    .find(Boolean);
  const result = exact ?? fallback ?? results[0];

  const topTags = [...tags.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  return { result, mbti, scores, topTags };
}

function makeShareText(result: Result) {
  return `我的手艺人格是「${result.title}」：${result.shareLine} 测测你适合跟哪位乡村工匠老师学一门手艺。`;
}

function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'reveal' | 'result' | 'gallery'>('home');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const currentQuestion = questions[answers.length];
  const calculation = useMemo(() => calculateResult(answers), [answers]);
  const result = calculation.result;
  const revealPool = useMemo(() => results.slice().sort(() => 0.5 - Math.random()).slice(0, 7), []);

  function startQuiz() {
    setAnswers([]);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function chooseOption(optionIndex: number) {
    const nextAnswers = [...answers, { questionIndex: answers.length, optionIndex }];
    setAnswers(nextAnswers);
    if (nextAnswers.length >= questions.length) {
      setAnswers(nextAnswers);
      setScreen('reveal');
      window.setTimeout(() => setScreen('result'), 1250);
    }
  }

  async function shareResult() {
    const text = makeShareText(result);
    if (navigator.share) {
      await navigator.share({
        title: `我的手艺人格是${result.title}`,
        text,
        url: window.location.href,
      });
      return;
    }
    await navigator.clipboard?.writeText(text);
  }

  function saveCard() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, result.softHue);
      gradient.addColorStop(0.52, '#fff8eb');
      gradient.addColorStop(1, '#efe0c6');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = result.hue;
      context.fillRect(72, 72, 936, 14);
      context.fillStyle = '#2b2218';
      context.font = '700 56px sans-serif';
      context.fillText('我的手艺人格', 72, 170);
      context.font = '900 92px sans-serif';
      context.fillText(result.title, 72, 278);
      context.font = '500 38px sans-serif';
      context.fillStyle = '#6a5541';
      context.fillText(`${result.mbti} · ${result.craftGroup}`, 76, 340);

      context.drawImage(image, 190, 380, 700, 700);
      context.fillStyle = 'rgba(255, 255, 255, 0.86)';
      context.fillRect(72, 1050, 936, 260);
      context.fillStyle = '#2b2218';
      context.font = '700 42px sans-serif';
      context.fillText(result.shareLine, 110, 1132);
      context.font = '400 32px sans-serif';
      context.fillStyle = '#6a5541';
      wrapCanvasText(context, `适合从 ${result.crafts.join(' / ')} 开始，跟真实乡村工匠老师学一门手艺。`, 110, 1198, 860, 44);
      context.font = '700 28px sans-serif';
      context.fillStyle = result.hue;
      context.fillText('中国乡村工匠焕青计划 · 手艺人格测试', 110, 1352);

      const link = document.createElement('a');
      link.download = `我的手艺人格-${result.title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    image.src = getImageFor(result);
  }

  const activeGallery = results[galleryIndex];

  return (
    <main className="app-shell">
      <div className="phone-stage">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        {screen === 'home' && (
          <section className="home-screen screen-panel">
            <header className="brand-row">
              <span>中国乡村工匠焕青计划</span>
              <span className="pill">H5 测试</span>
            </header>

            <div className="hero-art">
              <div className="hero-card hero-card-back">
                <img src={results[8].image} alt={results[8].title} />
              </div>
              <div className="hero-card hero-card-front">
                <img src={results[4].image} alt={results[4].title} />
              </div>
            </div>

            <div className="hero-copy">
              <p className="eyebrow">MBTI 测腻了，来点会动手的</p>
              <h1>你的手艺人格是什么？</h1>
              <p>
                10 个选择，找到你更适合从哪门乡村手艺开始，看看该跟哪位工匠老师学一件真正能留下来的东西。
              </p>
            </div>

            <div className="quick-stats" aria-label="测试亮点">
              <span>16 位大师卡</span>
              <span>约 2 分钟</span>
              <span>可生成海报</span>
            </div>

            <button className="primary-action" onClick={startQuiz}>
              <Sparkles size={20} />
              进入我的本命工坊
            </button>
            <button className="ghost-action" onClick={() => setScreen('gallery')}>
              先看 16 种手艺人格
              <ChevronRight size={18} />
            </button>
          </section>
        )}

        {screen === 'quiz' && currentQuestion && (
          <section className="quiz-screen screen-panel">
            <div className="quiz-topbar">
              <button className="icon-button" onClick={() => (answers.length ? setAnswers(answers.slice(0, -1)) : setScreen('home'))} aria-label="返回">
                <ArrowLeft size={20} />
              </button>
              <div className="progress-wrap">
                <div className="progress-label">
                  <span>{answers.length + 1}</span>
                  <span>/ {questions.length}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${((answers.length + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="question-copy">
              <p className="eyebrow">{currentQuestion.kicker}</p>
              <h2>{currentQuestion.title}</h2>
            </div>

            <div className="options-list">
              {currentQuestion.options.map((option, index) => (
                <button key={option.label} className="choice-card" onClick={() => chooseOption(index)}>
                  <span className="choice-label">{option.label}</span>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>

            <div className="micro-proof">
              <Check size={16} />
              <span>这是兴趣匹配，不是身份认定。真正的手艺来自长期练习和工匠老师的经验。</span>
            </div>
          </section>
        )}

        {screen === 'reveal' && (
          <section className="reveal-screen screen-panel">
            <div className="reveal-wheel">
              {revealPool.map((item) => (
                <img key={item.id} src={item.image} alt="" />
              ))}
            </div>
            <p className="eyebrow">正在匹配你的工坊气质</p>
            <h2>大师卡正在靠近你</h2>
          </section>
        )}

        {screen === 'result' && (
          <section className="result-screen screen-panel">
            <header className="result-hero" style={{ background: `linear-gradient(160deg, ${result.softHue}, #fff8eb 62%)` }}>
              <div className="result-title-row">
                <span className="pill dark">你的手艺人格</span>
                <button className="icon-button light" onClick={() => setScreen('gallery')} aria-label="查看图鉴">
                  <BookOpen size={19} />
                </button>
              </div>
              <img className="result-avatar" src={result.image} alt={result.title} />
              <div className="result-name">
                <span>{result.mbti}</span>
                <h1>{result.title}</h1>
                <p>{result.craftGroup}</p>
              </div>
            </header>

            <div className="result-body">
              <section className="quote-block">
                <p>{result.oneLiner}</p>
                <strong>{result.shareLine}</strong>
              </section>

              <section className="content-block">
                <h2>你在工坊里的样子</h2>
                <p>{result.description}</p>
              </section>

              <section className="tag-cloud" aria-label="推荐手艺">
                {result.crafts.map((craft) => (
                  <span key={craft}>{craft}</span>
                ))}
              </section>

              <section className="content-grid">
                <article>
                  <HeartHandshake size={19} />
                  <h3>隐藏能力</h3>
                  <p>{result.ability}</p>
                </article>
                <article>
                  <Camera size={19} />
                  <h3>乡村任务</h3>
                  <p>{result.mission}</p>
                </article>
              </section>

              <section className="content-block action-block">
                <h2>第一次向工匠老师学习，可以这样开始</h2>
                <p>{result.firstStep}</p>
              </section>

              <section className="partner-row">
                <div>
                  <span>最佳工坊搭子</span>
                  <strong>{result.bestPartner}</strong>
                </div>
                <div>
                  <span>反差灵感搭子</span>
                  <strong>{result.contrastPartner}</strong>
                </div>
              </section>

              <section className="respect-note">
                <h2>请带着尊重进入乡村</h2>
                <p>
                  不随意拍摄老师和作品，不乱碰工具材料，不把纹样当素材乱用。测试只是门口，真实的手、材料、地方和时间才是主角。
                </p>
              </section>

              <div className="sticky-actions">
                <button className="secondary-action" onClick={saveCard}>
                  <Download size={18} />
                  保存人格卡
                </button>
                <button className="primary-action compact" onClick={shareResult}>
                  <Users size={18} />
                  找工坊搭子
                </button>
              </div>

              <button className="ghost-action full" onClick={startQuiz}>
                <RefreshCcw size={17} />
                重新测试一次
              </button>
            </div>
          </section>
        )}

        {screen === 'gallery' && (
          <section className="gallery-screen screen-panel">
            <div className="quiz-topbar">
              <button className="icon-button" onClick={() => setScreen(answers.length ? 'result' : 'home')} aria-label="返回">
                <ArrowLeft size={20} />
              </button>
              <span className="pill">16 种手艺人格图鉴</span>
            </div>

            <div className="gallery-feature">
              <img src={activeGallery.image} alt={activeGallery.title} />
              <div>
                <span>{activeGallery.mbti}</span>
                <h2>{activeGallery.title}</h2>
                <p>{activeGallery.craftGroup}</p>
              </div>
            </div>

            <div className="gallery-controls">
              <button className="secondary-action" onClick={() => setGalleryIndex((galleryIndex + results.length - 1) % results.length)}>
                <ArrowLeft size={17} />
                上一位
              </button>
              <button className="secondary-action" onClick={() => setGalleryIndex((galleryIndex + 1) % results.length)}>
                下一位
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="gallery-grid">
              {results.map((item, index) => (
                <button key={item.id} className={index === galleryIndex ? 'active' : ''} onClick={() => setGalleryIndex(index)}>
                  <img src={item.image} alt={item.title} />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  let line = '';
  let currentY = y;
  [...text].forEach((char) => {
    const testLine = line + char;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });
  context.fillText(line, x, currentY);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
