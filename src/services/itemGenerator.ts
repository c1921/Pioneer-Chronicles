import { createItem, ItemCategory, ItemQuality } from '../types/item';

// 生成随机物品名称
const generateRandomItemName = (category: ItemCategory): string => {
  const resourceNames = ['Stone', 'Wood', 'Metal', 'Steel', 'Gold', 'Silver', 'Iron', 'Copper', 'Coal'];
  const foodNames = ['Apple', 'Meat', 'Berries', 'Bread', 'Potato', 'Corn', 'Soup', 'Stew'];
  const medicineNames = ['Bandage', 'Herbal Medicine', 'Medicine', 'First Aid Kit', 'Antibiotics'];
  const weaponNames = ['Knife', 'Pistol', 'Rifle', 'Shotgun', 'Bow', 'Sword', 'Axe'];
  const apparelNames = ['Shirt', 'Pants', 'Hat', 'Coat', 'Jacket', 'Boots', 'Gloves'];
  const buildingNames = ['Brick', 'Concrete', 'Wood Plank', 'Metal Sheet', 'Wall Material'];
  const furnitureNames = ['Chair', 'Table', 'Bed', 'Dresser', 'Lamp', 'Shelf'];
  const artifactNames = ['Artifact', 'Ancient Statue', 'Old Coin', 'Ancient Manuscript'];
  const toolNames = ['Hammer', 'Screwdriver', 'Wrench', 'Saw', 'Drill', 'Chisel'];
  const componentNames = ['Circuit', 'Wire', 'Gear', 'Spring', 'Screw', 'Bolt', 'Chip'];
  const miscNames = ['Junk', 'Trinket', 'Container', 'Box', 'Bag', 'Unknown Item'];
  
  let names: string[] = [];
  
  switch (category) {
    case ItemCategory.Resource:
      names = resourceNames;
      break;
    case ItemCategory.Food:
      names = foodNames;
      break;
    case ItemCategory.Medicine:
      names = medicineNames;
      break;
    case ItemCategory.Weapon:
      names = weaponNames;
      break;
    case ItemCategory.Apparel:
      names = apparelNames;
      break;
    case ItemCategory.Building:
      names = buildingNames;
      break;
    case ItemCategory.Furniture:
      names = furnitureNames;
      break;
    case ItemCategory.Artifact:
      names = artifactNames;
      break;
    case ItemCategory.Tool:
      names = toolNames;
      break;
    case ItemCategory.Component:
      names = componentNames;
      break;
    case ItemCategory.Miscellaneous:
      names = miscNames;
      break;
    default:
      names = miscNames;
  }
  
  // 选择随机名称
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

// 生成随机质量
const generateRandomQuality = (): ItemQuality | undefined => {
  // 70%的物品有质量属性
  if (Math.random() > 0.3) {
    // 质量分布：极差(5%)，差(15%)，普通(50%)，良好(20%)，优秀(6%)，大师级(3%)，传奇(1%)
    const qualityRoll = Math.random() * 100;
    
    if (qualityRoll < 5) return ItemQuality.Awful;
    if (qualityRoll < 20) return ItemQuality.Poor;
    if (qualityRoll < 70) return ItemQuality.Normal;
    if (qualityRoll < 90) return ItemQuality.Good;
    if (qualityRoll < 96) return ItemQuality.Excellent;
    if (qualityRoll < 99) return ItemQuality.Masterwork;
    return ItemQuality.Legendary;
  }
  
  return undefined;
};

// 根据类别生成随机物品参数
const generateItemParams = (category: ItemCategory) => {
  let weight = 0;
  let value = 0;
  let stackable = true;
  let maxStackSize = 100;
  
  switch (category) {
    case ItemCategory.Resource:
      weight = Math.random() * 0.5 + 0.1; // 0.1-0.6kg
      value = Math.floor(Math.random() * 5) + 1; // 1-5
      maxStackSize = 1000;
      break;
    case ItemCategory.Food:
      weight = Math.random() * 0.3 + 0.05; // 0.05-0.35kg
      value = Math.floor(Math.random() * 10) + 1; // 1-10
      maxStackSize = 50;
      break;
    case ItemCategory.Medicine:
      weight = Math.random() * 0.2 + 0.05; // 0.05-0.25kg
      value = Math.floor(Math.random() * 30) + 10; // 10-40
      maxStackSize = 25;
      break;
    case ItemCategory.Weapon:
      weight = Math.random() * 4 + 1; // 1-5kg
      value = Math.floor(Math.random() * 200) + 50; // 50-250
      stackable = false;
      break;
    case ItemCategory.Apparel:
      weight = Math.random() * 1 + 0.2; // 0.2-1.2kg
      value = Math.floor(Math.random() * 100) + 20; // 20-120
      stackable = false;
      break;
    case ItemCategory.Building:
      weight = Math.random() * 2 + 0.5; // 0.5-2.5kg
      value = Math.floor(Math.random() * 20) + 5; // 5-25
      maxStackSize = 200;
      break;
    case ItemCategory.Furniture:
      weight = Math.random() * 15 + 5; // 5-20kg
      value = Math.floor(Math.random() * 150) + 50; // 50-200
      stackable = false;
      break;
    case ItemCategory.Artifact:
      weight = Math.random() * 3 + 0.5; // 0.5-3.5kg
      value = Math.floor(Math.random() * 500) + 200; // 200-700
      stackable = false;
      break;
    case ItemCategory.Tool:
      weight = Math.random() * 2 + 0.5; // 0.5-2.5kg
      value = Math.floor(Math.random() * 100) + 30; // 30-130
      stackable = false;
      break;
    case ItemCategory.Component:
      weight = Math.random() * 0.2 + 0.01; // 0.01-0.21kg
      value = Math.floor(Math.random() * 15) + 5; // 5-20
      maxStackSize = 100;
      break;
    case ItemCategory.Miscellaneous:
      weight = Math.random() * 1 + 0.1; // 0.1-1.1kg
      value = Math.floor(Math.random() * 50) + 1; // 1-51
      maxStackSize = 50;
      break;
  }
  
  return {
    weight: parseFloat(weight.toFixed(2)),
    value,
    stackable,
    maxStackSize: stackable ? maxStackSize : undefined
  };
};

// 生成随机类别
const generateRandomCategory = (): ItemCategory => {
  const categories = Object.values(ItemCategory);
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
};

// 生成随机物品
export const generateRandomItem = (category?: ItemCategory) => {
  // 如果没有指定类别，随机选择一个
  const itemCategory = category || generateRandomCategory();
  
  // 生成物品名称
  const name = generateRandomItemName(itemCategory);
  
  // 生成物品质量
  const quality = generateRandomQuality();
  
  // 生成物品参数
  const { weight, value, stackable, maxStackSize } = generateItemParams(itemCategory);
  
  // 随机数量 (1-10 堆叠物品, 1 不可堆叠物品)
  const quantity = stackable ? Math.floor(Math.random() * 10) + 1 : 1;
  
  // 创建随机物品描述
  let description = undefined;
  if (Math.random() > 0.7) { // 30% 的物品有描述
    const descriptions = [
      `A standard ${name.toLowerCase()}.`,
      `Used for various tasks.`,
      `Common item found in the wasteland.`,
      `Somewhat rare and valuable.`,
      `Essential for survival.`,
      `Useful for crafting.`,
      `Can be traded with merchants.`
    ];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    description = descriptions[randomIndex];
  }
  
  // 创建物品
  return createItem(
    name,
    itemCategory,
    quantity,
    weight,
    value,
    {
      quality,
      description,
      stackable,
      maxStackSize,
      tags: Math.random() > 0.8 ? ['random', itemCategory.toLowerCase()] : undefined // 20% 的物品有标签
    }
  );
};

// 常用物品列表
export const CommonItems = {
  // 资源
  Stone: () => createItem('Stone', ItemCategory.Resource, 1, 0.5, 1, { stackable: true, maxStackSize: 1000 }),
  Wood: () => createItem('Wood', ItemCategory.Resource, 1, 0.3, 2, { stackable: true, maxStackSize: 1000 }),
  Steel: () => createItem('Steel', ItemCategory.Resource, 1, 0.8, 10, { stackable: true, maxStackSize: 500 }),
  
  // 食物
  Apple: () => createItem('Apple', ItemCategory.Food, 1, 0.1, 5, { 
    stackable: true, 
    maxStackSize: 50,
    description: 'A fresh apple. Restores a small amount of hunger.'
  }),
  Meat: () => createItem('Meat', ItemCategory.Food, 1, 0.4, 15, { 
    stackable: true, 
    maxStackSize: 25,
    description: 'Raw meat. Should be cooked before eating.'
  }),
  
  // 医疗
  Bandage: () => createItem('Bandage', ItemCategory.Medicine, 1, 0.1, 25, { 
    stackable: true, 
    maxStackSize: 25,
    description: 'A simple bandage for treating minor wounds.'
  }),
  
  // 武器
  Pistol: () => createItem('Pistol', ItemCategory.Weapon, 1, 2, 150, { 
    stackable: false,
    quality: ItemQuality.Normal,
    description: 'A standard pistol. Low damage but reliable.'
  }),
  
  // 工具
  Hammer: () => createItem('Hammer', ItemCategory.Tool, 1, 1.2, 35, { 
    stackable: false,
    quality: ItemQuality.Normal,
    description: 'A basic hammer for construction.'
  })
};

// 物品生成服务
const ItemGenerator = {
  generateRandomItem,
  CommonItems
};

export default ItemGenerator; 