// 物品类别枚举
export enum ItemCategory {
  Resource = 'Resource',     // 资源
  Food = 'Food',             // 食物
  Medicine = 'Medicine',     // 医疗物品
  Weapon = 'Weapon',         // 武器
  Apparel = 'Apparel',       // 服装
  Building = 'Building',     // 建筑材料
  Furniture = 'Furniture',   // 家具
  Artifact = 'Artifact',     // 工艺品
  Tool = 'Tool',             // 工具
  Component = 'Component',   // 组件
  Miscellaneous = 'Misc'     // 杂项
}

// 物品质量枚举
export enum ItemQuality {
  Awful = 0,      // 极差
  Poor = 1,       // 差
  Normal = 2,     // 普通
  Good = 3,       // 良好
  Excellent = 4,  // 优秀
  Masterwork = 5, // 大师级
  Legendary = 6   // 传奇
}

// 物品接口
export interface Item {
  id: string;               // 唯一标识符
  name: string;             // 物品名称
  category: ItemCategory;   // 物品类别
  quantity: number;         // 数量
  weight: number;           // 单位重量 (kg)
  value: number;            // 单位价值
  quality?: ItemQuality;    // 物品质量 (可选)
  description?: string;     // 描述 (可选)
  stackable: boolean;       // 是否可堆叠
  maxStackSize?: number;    // 最大堆叠数量 (可选)
  tags?: string[];          // 标签 (可选，用于过滤和分类)
}

// 创建物品实例的函数
export const createItem = (
  name: string,
  category: ItemCategory,
  quantity: number = 1,
  weight: number,
  value: number,
  options: {
    quality?: ItemQuality,
    description?: string,
    stackable?: boolean,
    maxStackSize?: number,
    tags?: string[]
  } = {}
): Item => {
  return {
    id: crypto.randomUUID(),
    name,
    category,
    quantity,
    weight,
    value,
    quality: options.quality,
    description: options.description,
    stackable: options.stackable ?? true,
    maxStackSize: options.maxStackSize,
    tags: options.tags
  };
};

// 获取物品总重量
export const getTotalWeight = (item: Item): number => {
  return item.weight * item.quantity;
};

// 获取物品总价值
export const getTotalValue = (item: Item): number => {
  return item.value * item.quantity;
}; 