<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ItemCategory, ItemQuality, type Item } from '../types/item';
import InventoryManager from '../services/inventoryManager';

// 当前选中的物品ID
const selectedItemId = ref<string | null>(null);

// 当前选中的分类
const selectedCategory = ref<ItemCategory | null>(null);

// 搜索查询
const searchQuery = ref('');

// 计算选中的物品
const selectedItem = computed(() => {
  if (!selectedItemId.value) return null;
  return InventoryManager.getInventory().find(item => item.id === selectedItemId.value) || null;
});

// 过滤后的物品列表
const filteredItems = computed(() => {
  let items = InventoryManager.getInventory();
  
  // 应用分类过滤
  if (selectedCategory.value) {
    items = items.filter(item => item.category === selectedCategory.value);
  }
  
  // 应用搜索过滤
  if (searchQuery.value.trim()) {
    items = InventoryManager.searchItems(searchQuery.value);
  }
  
  return items;
});

// 总库存重量
const totalWeight = computed(() => {
  return InventoryManager.getTotalWeight.value.toFixed(1);
});

// 总库存价值
const totalValue = computed(() => {
  return InventoryManager.getTotalValue.value.toFixed(0);
});

// 选择物品
const selectItem = (itemId: string) => {
  selectedItemId.value = itemId;
};

// 选择分类
const selectCategory = (category: ItemCategory | null) => {
  selectedCategory.value = category;
};

// 获取质量颜色
const getQualityColor = (quality?: ItemQuality): string => {
  if (quality === undefined) return 'text-gray-500';
  
  switch (quality) {
    case ItemQuality.Awful:
      return 'text-red-500';
    case ItemQuality.Poor:
      return 'text-orange-500';
    case ItemQuality.Normal:
      return 'text-gray-500';
    case ItemQuality.Good:
      return 'text-blue-500';
    case ItemQuality.Excellent:
      return 'text-indigo-500';
    case ItemQuality.Masterwork:
      return 'text-purple-500';
    case ItemQuality.Legendary:
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

// 获取质量文本
const getQualityText = (quality?: ItemQuality): string => {
  if (quality === undefined) return 'Normal';
  
  switch (quality) {
    case ItemQuality.Awful:
      return 'Awful';
    case ItemQuality.Poor:
      return 'Poor';
    case ItemQuality.Normal:
      return 'Normal';
    case ItemQuality.Good:
      return 'Good';
    case ItemQuality.Excellent:
      return 'Excellent';
    case ItemQuality.Masterwork:
      return 'Masterwork';
    case ItemQuality.Legendary:
      return 'Legendary';
    default:
      return 'Normal';
  }
};

// 获取物品分类图标
const getCategoryIcon = (category: ItemCategory): string => {
  switch (category) {
    case ItemCategory.Resource:
      return '🪨';
    case ItemCategory.Food:
      return '🍎';
    case ItemCategory.Medicine:
      return '💊';
    case ItemCategory.Weapon:
      return '🔫';
    case ItemCategory.Apparel:
      return '👕';
    case ItemCategory.Building:
      return '🧱';
    case ItemCategory.Furniture:
      return '🪑';
    case ItemCategory.Artifact:
      return '🏺';
    case ItemCategory.Tool:
      return '🔨';
    case ItemCategory.Component:
      return '⚙️';
    case ItemCategory.Miscellaneous:
      return '📦';
    default:
      return '❓';
  }
};

// 移除物品
const removeItem = (itemId: string, quantity: number = 1) => {
  if (confirm('Are you sure you want to remove this item?')) {
    InventoryManager.removeItem(itemId, quantity);
    if (selectedItemId.value === itemId) {
      selectedItemId.value = null;
    }
  }
};

// 组件挂载时初始化库存
onMounted(() => {
  InventoryManager.init();
});
</script>

<template>
  <div class="inventory-view">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-xl font-bold">Inventory</h2>
      <div class="flex text-sm">
        <div class="mr-4">Weight: {{ totalWeight }} kg</div>
        <div>Value: {{ totalValue }} coins</div>
      </div>
    </div>
    
    <!-- Search and Filters -->
    <div class="mb-4">
      <div class="flex">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="flex-grow px-3 py-2 border rounded-l focus:outline-none focus:border-blue-500"
        />
        <button 
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="bg-gray-300 px-2 rounded-r"
        >
          ✕
        </button>
      </div>
      
      <!-- Category Filters -->
      <div class="flex flex-wrap gap-2 mt-2">
        <button 
          @click="selectCategory(null)"
          :class="['px-2 py-1 rounded text-xs', selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-gray-200']"
        >
          All
        </button>
        <button 
          v-for="category in Object.values(ItemCategory)" 
          :key="category"
          @click="selectCategory(category)"
          :class="['px-2 py-1 rounded text-xs flex items-center', 
                  selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200']"
        >
          <span class="mr-1">{{ getCategoryIcon(category) }}</span>
          {{ category }}
        </button>
      </div>
    </div>
    
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Item List -->
      <div class="w-full md:w-2/3">
        <div class="bg-white rounded shadow p-4">
          <h3 class="text-lg font-semibold mb-2">Items</h3>
          
          <div v-if="filteredItems.length === 0" class="text-gray-500 py-4 text-center">
            <p v-if="searchQuery">No items match your search.</p>
            <p v-else-if="selectedCategory">No items in this category.</p>
            <p v-else>Your inventory is empty.</p>
          </div>
          
          <div v-else class="divide-y">
            <div 
              v-for="item in filteredItems" 
              :key="item.id"
              @click="selectItem(item.id)"
              :class="['p-2 cursor-pointer hover:bg-gray-50 flex justify-between', 
                      selectedItemId === item.id ? 'bg-blue-50' : '']"
            >
              <div class="flex items-center">
                <span class="mr-2">{{ getCategoryIcon(item.category) }}</span>
                <div>
                  <div class="flex items-center">
                    <span class="font-medium">{{ item.name }}</span>
                    <span 
                      v-if="item.quality !== undefined"
                      :class="['text-xs ml-2', getQualityColor(item.quality)]"
                    >
                      ({{ getQualityText(item.quality) }})
                    </span>
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ item.category }} | {{ item.weight }}kg each
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-medium">x{{ item.quantity }}</div>
                <div class="text-xs text-gray-500">{{ item.value * item.quantity }} coins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Item Details -->
      <div class="w-full md:w-1/3">
        <div class="bg-white rounded shadow p-4 h-full">
          <h3 class="text-lg font-semibold mb-2">Details</h3>
          
          <div v-if="selectedItem" class="space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-xl font-bold flex items-center">
                  <span class="mr-2">{{ getCategoryIcon(selectedItem.category) }}</span>
                  {{ selectedItem.name }}
                </h4>
                <div 
                  v-if="selectedItem.quality !== undefined"
                  :class="['text-sm', getQualityColor(selectedItem.quality)]"
                >
                  {{ getQualityText(selectedItem.quality) }} quality
                </div>
              </div>
              <button 
                @click="removeItem(selectedItem.id)"
                class="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div class="border-t pt-2">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div class="text-sm text-gray-500">Quantity</div>
                  <div>{{ selectedItem.quantity }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Category</div>
                  <div>{{ selectedItem.category }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Weight (each)</div>
                  <div>{{ selectedItem.weight }} kg</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Value (each)</div>
                  <div>{{ selectedItem.value }} coins</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Total Weight</div>
                  <div>{{ (selectedItem.weight * selectedItem.quantity).toFixed(1) }} kg</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Total Value</div>
                  <div>{{ selectedItem.value * selectedItem.quantity }} coins</div>
                </div>
              </div>
            </div>
            
            <div v-if="selectedItem.description" class="border-t pt-2">
              <div class="text-sm text-gray-500">Description</div>
              <p>{{ selectedItem.description }}</p>
            </div>
            
            <div v-if="selectedItem.tags && selectedItem.tags.length > 0" class="border-t pt-2">
              <div class="text-sm text-gray-500 mb-1">Tags</div>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="tag in selectedItem.tags" 
                  :key="tag"
                  class="bg-gray-200 px-2 py-0.5 rounded-full text-xs"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center justify-center h-48 text-gray-500">
            Select an item to view details
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 