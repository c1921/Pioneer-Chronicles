// 工作类型枚举
export enum WorkType {
  // 基础工作
  Basic = "基本",
  Haul = "搬运",
  Clean = "清洁",
  
  // 技能类工作
  Cook = "烹饪",
  Hunt = "狩猎",
  Construct = "建造",
  Plant = "种植",
  Mine = "采矿",
  Craft = "制作",
  Smith = "锻造",
  Tailor = "缝制",
  Art = "艺术",
  Research = "研究",
  
  // 医疗类工作
  Doctor = "医生",
  Patient = "就医",
  Rest = "休养",
  Operate = "割除",
  
  // 特殊类工作
  Firefight = "灭火",
  Warden = "监管",
  Handle = "驯兽"
}

// 工作优先级
export enum WorkPriority {
  Disabled = 0,  // 禁用
  Low = 1,       // 低
  Normal = 2,    // 中
  High = 3,      // 高
  Critical = 4   // 紧急
}

// 工作能力类型
export interface WorkCapability {
  workType: WorkType;
  level: number;     // 工作能力等级 0-20
  passion: number;   // 热情 0-无 1-有兴趣 2-热爱
  enabled: boolean;  // 是否启用
  priority: WorkPriority; // 优先级
}

// 工作组定义
export const WORK_GROUPS = {
  BASIC: [WorkType.Basic, WorkType.Haul, WorkType.Clean],
  CRAFTING: [WorkType.Craft, WorkType.Smith, WorkType.Tailor, WorkType.Art],
  PRODUCTION: [WorkType.Cook, WorkType.Mine, WorkType.Plant, WorkType.Construct],
  MEDICAL: [WorkType.Doctor, WorkType.Patient, WorkType.Rest, WorkType.Operate],
  SPECIAL: [WorkType.Firefight, WorkType.Warden, WorkType.Handle, WorkType.Hunt, WorkType.Research]
};

// 获取所有工作类型
export const getAllWorkTypes = (): WorkType[] => {
  return Object.values(WorkType);
};

// 工作图标映射
export const WORK_ICONS = {
  [WorkType.Basic]: "🔧",
  [WorkType.Haul]: "📦",
  [WorkType.Clean]: "🧹",
  [WorkType.Cook]: "🍳",
  [WorkType.Hunt]: "🏹",
  [WorkType.Construct]: "🏗️",
  [WorkType.Plant]: "🌱",
  [WorkType.Mine]: "⛏️",
  [WorkType.Craft]: "🔨",
  [WorkType.Smith]: "⚒️",
  [WorkType.Tailor]: "🧵",
  [WorkType.Art]: "🎨",
  [WorkType.Research]: "🔬",
  [WorkType.Doctor]: "💉",
  [WorkType.Patient]: "🤒",
  [WorkType.Rest]: "🛌",
  [WorkType.Operate]: "🔪",
  [WorkType.Firefight]: "🧯",
  [WorkType.Warden]: "👮",
  [WorkType.Handle]: "🐕"
}; 