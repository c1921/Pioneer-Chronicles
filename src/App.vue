<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CharacterManager from './components/CharacterManager.vue';
import MainScreen from './components/MainScreen.vue';
import InventoryView from './components/InventoryView.vue';
import InventoryManager from './services/inventoryManager';
import ItemGenerator from './services/itemGenerator';

// 检查是否有已创建的角色或已进入游戏
const hasCharacters = !!localStorage.getItem('characters') && 
                       JSON.parse(localStorage.getItem('characters') || '[]').length > 0;
const hasEnteredGameBefore = localStorage.getItem('hasEnteredGame') === 'true';

// 如果有角色或已进入过游戏，则直接进入主界面
const currentView = ref<'characters' | 'main' | 'inventory'>(
  hasCharacters || hasEnteredGameBefore ? 'main' : 'characters'
);

// 直接进入主界面（不可返回）
const enterMainScreen = () => {
  currentView.value = 'main';
  // 保存状态到本地存储，标记已进入游戏
  localStorage.setItem('hasEnteredGame', 'true');
};

// 切换到库存视图
const enterInventoryView = () => {
  currentView.value = 'inventory';
};

// 返回主界面
const returnToMainScreen = () => {
  currentView.value = 'main';
};

// 初始化物品库存
const initializeInventory = () => {
  // 检查是否已经初始化过库存
  const isInventoryInitialized = localStorage.getItem('inventoryInitialized') === 'true';
  if (isInventoryInitialized) return;
  
  // 初始化库存管理器
  InventoryManager.init();
  
  // 添加一些基础资源
  InventoryManager.addItem(ItemGenerator.CommonItems.Stone());
  InventoryManager.addItem(ItemGenerator.CommonItems.Wood());
  InventoryManager.addItem(ItemGenerator.CommonItems.Steel());
  
  // 添加一些食物
  const apple = ItemGenerator.CommonItems.Apple();
  apple.quantity = 5;
  InventoryManager.addItem(apple);
  
  const meat = ItemGenerator.CommonItems.Meat();
  meat.quantity = 3;
  InventoryManager.addItem(meat);
  
  // 添加一些医疗物品
  const bandage = ItemGenerator.CommonItems.Bandage();
  bandage.quantity = 2;
  InventoryManager.addItem(bandage);
  
  // 添加工具和武器
  InventoryManager.addItem(ItemGenerator.CommonItems.Hammer());
  InventoryManager.addItem(ItemGenerator.CommonItems.Pistol());
  
  // 添加一些随机物品
  for (let i = 0; i < 3; i++) {
    InventoryManager.addItem(ItemGenerator.generateRandomItem());
  }
  
  // 标记库存已初始化
  localStorage.setItem('inventoryInitialized', 'true');
};

// 重置游戏
const resetGame = () => {
  console.log('App: Resetting game...');
  // 清除本地存储
  localStorage.removeItem('hasEnteredGame');
  localStorage.removeItem('characters');
  localStorage.removeItem('inventory');
  localStorage.removeItem('inventoryInitialized');
  // 回到角色创建界面
  currentView.value = 'characters';
  // 可选：刷新页面
  // location.reload();
};

onMounted(() => {
  setTimeout(() => window.HSStaticMethods?.autoInit(), 100);
  
  // 初始化物品库存
  initializeInventory();
});
</script>

<template>
  <div class="app">
    <header class="bg-primary text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Pioneer Chronicles</h1>
        
        <!-- 导航菜单 -->
        <div v-if="currentView !== 'characters'" class="flex space-x-4">
          <button 
            @click="returnToMainScreen" 
            :class="['text-white hover:underline', currentView === 'main' ? 'font-bold underline' : '']"
          >
            Main
          </button>
          <button 
            @click="enterInventoryView" 
            :class="['text-white hover:underline', currentView === 'inventory' ? 'font-bold underline' : '']"
          >
            Inventory
          </button>
        </div>
      </div>
    </header>
    
    <main>
      <!-- 角色管理界面 - 只在初始创建时显示 -->
      <CharacterManager 
        v-if="currentView === 'characters'" 
        @enter-main-screen="enterMainScreen"
      />
      
      <!-- 主界面 - 游戏主要界面 -->
      <MainScreen 
        v-if="currentView === 'main'"
        @reset-game="resetGame" 
        @enter-inventory="enterInventoryView"
      />
      
      <!-- 库存界面 - 物品管理 -->
      <InventoryView
        v-if="currentView === 'inventory'"
      />
    </main>
  </div>
</template>
