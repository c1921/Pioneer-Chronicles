<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Character } from '../types/character';
import { Gender } from '../types/character';

// 定义事件
const emit = defineEmits<{
  (e: 'reset-game'): void
}>();

// 角色列表
const characters = ref<Character[]>([]);

// 重置游戏
const resetGame = () => {
  if (confirm('Are you sure you want to reset the game? All characters will be lost.')) {
    emit('reset-game');
  }
};

// 获取性别对应的颜色样式
const getGenderColor = (gender: Gender): string => {
  switch (gender) {
    case Gender.Male:
      return 'text-blue-600';
    case Gender.Female:
      return 'text-pink-600';
    default:
      return 'text-gray-600';
  }
};

// 从本地存储加载数据
const loadFromLocalStorage = () => {
  const savedCharacters = localStorage.getItem('characters');
  if (savedCharacters) {
    try {
      characters.value = JSON.parse(savedCharacters);
    } catch (e) {
      console.error('加载角色数据失败', e);
    }
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadFromLocalStorage();
});
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <button class="btn btn-sm btn-outline-danger" @click="resetGame">
        Reset Game
      </button>
    </div>
    
    <h3 class="text-xl font-bold mb-4">Your Characters</h3>
    
    <div v-if="characters.length === 0" class="card p-4 text-center">
      <p class="text-gray-500">No characters found. Reset the game to create characters.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- 角色卡片 -->
      <div 
        v-for="character in characters" 
        :key="character.id" 
        class="card p-4 hover:shadow-lg transition"
      >
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
            {{ character.name.charAt(0) }}
          </div>
          <div>
            <div class="text-lg font-bold">{{ character.name }}</div>
            <div class="text-sm flex gap-3">
              <span :class="getGenderColor(character.gender)">{{ character.gender }}</span>
              <span>{{ character.age }} years old</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 