<script setup lang="ts">
import { ref } from 'vue';
import CharacterForm from './CharacterForm.vue';
import CharacterList from './CharacterList.vue';
import type { Character } from '../types/character';
import { createRandomCharacter } from '../services/randomCharacterGenerator';

// 定义事件
const emit = defineEmits<{
  (e: 'enter-main-screen'): void
}>();

// 角色列表数据
const characters = ref<Character[]>([]);

// 添加角色
const addCharacter = (character: Character) => {
  characters.value.push(character);
  // 保存到本地存储
  saveToLocalStorage();
};

// 删除角色
const deleteCharacter = (id: string) => {
  characters.value = characters.value.filter(c => c.id !== id);
  // 保存到本地存储
  saveToLocalStorage();
};

// 进入主界面
const enterMainScreen = () => {
  if (characters.value.length > 0) {
    emit('enter-main-screen');
  }
};

// 生成多个随机角色
const generateRandomCharacters = (count: number = 5) => {
  for (let i = 0; i < count; i++) {
    const randomCharacter = createRandomCharacter();
    characters.value.push(randomCharacter);
  }
  // 保存到本地存储
  saveToLocalStorage();
};

// 清空所有角色
const clearAllCharacters = () => {
  characters.value = [];
  // 保存到本地存储
  saveToLocalStorage();
};

// 保存到本地存储
const saveToLocalStorage = () => {
  localStorage.setItem('characters', JSON.stringify(characters.value));
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
loadFromLocalStorage();
</script>

<template>
  <div class="container mx-auto py-8">
    <h2 class="text-2xl font-bold mb-6 text-center">Character Management</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <CharacterForm :on-save="addCharacter" />
        
        <div class="card p-4 mt-4">
          <h3 class="text-xl font-bold mb-4">Bulk Actions</h3>
          <div class="flex gap-2 flex-wrap">
            <button class="btn btn-secondary" @click="() => generateRandomCharacters(5)">
              Generate 5 Random
            </button>
            <button 
              class="btn btn-danger" 
              @click="clearAllCharacters" 
              :disabled="characters.length === 0"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <CharacterList 
          :characters="characters" 
          :on-delete="deleteCharacter" 
        />
        
        <div class="mt-4 text-center" v-if="characters.length > 0">
          <button
            class="btn btn-primary"
            @click="enterMainScreen"
          >
            Start Game (Permanent)
          </button>
          <p class="text-sm text-gray-500 mt-2">
            <strong>Warning:</strong> After entering the game, you <strong>permanently</strong> won't be able to create more characters!
          </p>
          <p class="text-sm text-gray-500 mt-1">
            Even after page refresh, you will stay in game mode.
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 