import { ref, computed } from 'vue';
import type { Item } from '../types/item';
import { ItemCategory, getTotalWeight, getTotalValue } from '../types/item';

// 库存全局状态
const inventory = ref<Item[]>([]);

// 初始化库存
export const initInventory = () => {
  // 从本地存储加载物品
  const savedInventory = localStorage.getItem('inventory');
  if (savedInventory) {
    try {
      inventory.value = JSON.parse(savedInventory);
    } catch (e) {
      console.error('Failed to load inventory from localStorage', e);
      inventory.value = [];
    }
  }
};

// 保存库存到本地存储
export const saveInventory = () => {
  localStorage.setItem('inventory', JSON.stringify(inventory.value));
};

// 添加物品到库存
export const addItem = (item: Item) => {
  // 检查是否存在相同物品且可堆叠
  if (item.stackable) {
    const existingItem = inventory.value.find(i => 
      i.name === item.name && 
      i.category === item.category && 
      i.quality === item.quality
    );

    if (existingItem) {
      // 检查堆叠限制
      if (existingItem.maxStackSize && existingItem.quantity + item.quantity > existingItem.maxStackSize) {
        // 超过堆叠限制，分成两部分
        const remainingSpace = existingItem.maxStackSize - existingItem.quantity;
        if (remainingSpace > 0) {
          existingItem.quantity += remainingSpace;
          
          // 为剩余部分创建新物品
          const remainingItem = { ...item, quantity: item.quantity - remainingSpace };
          inventory.value.push(remainingItem);
        } else {
          // 如果现有堆栈已满，则添加为新物品
          inventory.value.push({ ...item });
        }
      } else {
        // 正常堆叠
        existingItem.quantity += item.quantity;
      }
    } else {
      // 不存在相同物品，添加新物品
      inventory.value.push({ ...item });
    }
  } else {
    // 不可堆叠物品，直接添加
    inventory.value.push({ ...item });
  }

  // 保存更改
  saveInventory();
  return true;
};

// 移除物品
export const removeItem = (itemId: string, quantity: number = 1): boolean => {
  const itemIndex = inventory.value.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return false;

  const item = inventory.value[itemIndex];
  
  if (item.quantity > quantity) {
    // 减少数量
    item.quantity -= quantity;
  } else {
    // 完全移除物品
    inventory.value.splice(itemIndex, 1);
  }

  // 保存更改
  saveInventory();
  return true;
};

// 获取库存物品
export const getInventory = () => inventory.value;

// 按分类获取物品
export const getItemsByCategory = (category: ItemCategory) => {
  return inventory.value.filter(item => item.category === category);
};

// 获取物品总重量
export const getInventoryTotalWeight = computed(() => {
  return inventory.value.reduce((total, item) => total + getTotalWeight(item), 0);
});

// 获取物品总价值
export const getInventoryTotalValue = computed(() => {
  return inventory.value.reduce((total, item) => total + getTotalValue(item), 0);
});

// 搜索物品
export const searchItems = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return inventory.value.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) || 
    (item.description && item.description.toLowerCase().includes(lowercaseQuery)) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

// 库存管理器
const InventoryManager = {
  init: initInventory,
  addItem,
  removeItem,
  getInventory,
  getItemsByCategory,
  getTotalWeight: getInventoryTotalWeight,
  getTotalValue: getInventoryTotalValue,
  searchItems
};

export default InventoryManager; 