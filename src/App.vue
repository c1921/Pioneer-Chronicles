<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CharacterManager from './components/CharacterManager.vue';
import MainScreen from './components/MainScreen.vue';

// 检查是否有已创建的角色或已进入游戏
const hasCharacters = !!localStorage.getItem('characters') && 
                       JSON.parse(localStorage.getItem('characters') || '[]').length > 0;
const hasEnteredGameBefore = localStorage.getItem('hasEnteredGame') === 'true';

// 如果有角色或已进入过游戏，则直接进入主界面
const currentView = ref<'characters' | 'main'>(
  hasCharacters || hasEnteredGameBefore ? 'main' : 'characters'
);

// 直接进入主界面（不可返回）
const enterMainScreen = () => {
  currentView.value = 'main';
  // 保存状态到本地存储，标记已进入游戏
  localStorage.setItem('hasEnteredGame', 'true');
};

// 重置游戏
const resetGame = () => {
  console.log('App: Resetting game...');
  // 清除本地存储
  localStorage.removeItem('hasEnteredGame');
  localStorage.removeItem('characters');
  // 回到角色创建界面
  currentView.value = 'characters';
  // 可选：刷新页面
  // location.reload();
};

onMounted(() => {
  setTimeout(() => window.HSStaticMethods.autoInit(), 100);
});
</script>

<template>
  <div class="app">
    <header class="bg-primary text-white p-4">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold">Pioneer Chronicles</h1>
      </div>
    </header>
    
    <main>
      <!-- 角色管理界面 - 只在初始创建时显示 -->
      <CharacterManager 
        v-if="currentView === 'characters'" 
        @enter-main-screen="enterMainScreen"
      />
      
      <!-- 主界面 - 大部分时间显示 -->
      <MainScreen 
        v-if="currentView === 'main'"
        @reset-game="resetGame" 
      />
    </main>
  </div>
</template>
