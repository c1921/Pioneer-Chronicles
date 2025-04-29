<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { Character, Skill, Need } from '../types/character';
import { Gender, SkillType, NeedType } from '../types/character';
import TimeController from './TimeController.vue';
import timeManager from '../services/timeService';
import NeedsManager from '../services/needsManager';

// 定义事件
const emit = defineEmits<{
  (e: 'reset-game'): void
}>();

// 角色列表
const characters = ref<Character[]>([]);

// 当前选中的角色ID
const selectedCharacterId = ref<string | null>(null);

// 计算当前选中的角色
const selectedCharacter = computed(() => {
  if (!selectedCharacterId.value) return null;
  return characters.value.find(c => c.id === selectedCharacterId.value) || null;
});

// 技能排序 - 按等级从高到低
const sortedSkills = computed(() => {
  if (!selectedCharacter.value) return [];
  return [...selectedCharacter.value.skills].sort((a, b) => b.level - a.level);
});

// 获取角色需求
const getCharacterNeeds = computed(() => {
  if (!selectedCharacter.value) return [];
  return selectedCharacter.value.needs || [];
});

// 查找特定需求
const findNeed = (character: Character, needType: NeedType): Need | undefined => {
  return character.needs.find(n => n.type === needType);
};

// 获取需求值
const getNeedValue = (character: Character, needType: NeedType): number => {
  const need = findNeed(character, needType);
  return need ? need.value : 0;
};

// 获取需求状态类名
const getNeedStatusClass = (value: number): string => {
  return NeedsManager.getNeedColorClass(value);
};

// 满足需求
const satisfyNeed = (needType: NeedType) => {
  if (!selectedCharacter.value) return;
  
  // 更新选中的角色
  const updatedCharacter = NeedsManager.satisfyNeed(selectedCharacter.value, needType, 50);
  
  // 更新角色列表中的对应角色
  characters.value = characters.value.map(char => 
    char.id === updatedCharacter.id ? updatedCharacter : char
  );
  
  // 保存到本地存储
  saveToLocalStorage();
};

// 选择角色
const selectCharacter = (characterId: string) => {
  selectedCharacterId.value = characterId;
};

// 更新所有角色的需求
const updateAllCharactersNeeds = () => {
  characters.value = NeedsManager.updateAllCharactersNeeds(characters.value);
  
  // 保存到本地存储
  saveToLocalStorage();
};

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

// 获取技能等级颜色
const getSkillLevelColor = (level: number): string => {
  if (level >= 15) return 'bg-green-600 text-white';
  if (level >= 10) return 'bg-blue-600 text-white';
  if (level >= 5) return 'bg-yellow-500 text-white';
  return 'bg-gray-300 text-gray-700';
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
      // 如果有角色，自动选择第一个
      if (characters.value.length > 0) {
        selectedCharacterId.value = characters.value[0].id;
      }
    } catch (e) {
      console.error('加载角色数据失败', e);
    }
  }
};

// 监听时间变化
watch(() => timeManager.getDateTime(), () => {
  updateAllCharactersNeeds();
});

// 组件挂载时加载数据
onMounted(() => {
  loadFromLocalStorage();
  // 立即更新一次需求
  updateAllCharactersNeeds();
  
  // 注册时间变化回调
  timeManager.onTimeChange(() => {
    updateAllCharactersNeeds();
  });
});
</script>

<template>
  <div class="container mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Game World</h2>
      <button class="btn btn-sm btn-outline-danger" @click="resetGame">
        Reset Game
      </button>
    </div>
    
    <!-- 时间控制器 -->
    <div class="mb-6">
      <TimeController />
    </div>
    
    <div v-if="characters.length === 0" class="card p-4 text-center">
      <p class="text-gray-500">No characters found. Reset the game to create characters.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 角色选择侧边栏 -->
      <div class="card p-4">
        <h3 class="text-xl font-bold mb-4">Your Characters</h3>
        <div class="space-y-2">
          <div 
            v-for="character in characters" 
            :key="character.id" 
            class="p-3 rounded cursor-pointer"
            :class="character.id === selectedCharacterId ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'"
            @click="selectCharacter(character.id)"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                {{ character.name.charAt(0) }}
              </div>
              <div>
                <div class="font-bold">{{ character.name }}</div>
                <div class="text-xs flex gap-2">
                  <span :class="getGenderColor(character.gender)">{{ character.gender }}</span>
                  <span>{{ character.age }} years old</span>
                </div>
                <!-- 简略需求指示器 -->
                <div class="flex gap-1 mt-1">
                  <div 
                    class="h-2 w-8 rounded-sm" 
                    :class="getNeedStatusClass(getNeedValue(character, NeedType.Rest))"
                    title="Rest"
                  ></div>
                  <div 
                    class="h-2 w-8 rounded-sm" 
                    :class="getNeedStatusClass(getNeedValue(character, NeedType.Food))"
                    title="Food"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 角色详情区域 -->
      <div class="md:col-span-2">
        <div v-if="selectedCharacter" class="card p-4">
          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                {{ selectedCharacter.name.charAt(0) }}
              </div>
              <div>
                <h3 class="text-2xl font-bold">{{ selectedCharacter.name }}</h3>
                <div class="text-sm flex gap-3">
                  <span :class="getGenderColor(selectedCharacter.gender)">{{ selectedCharacter.gender }}</span>
                  <span>{{ selectedCharacter.age }} years old</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 需求部分 -->
          <h4 class="text-lg font-bold mb-3">Needs</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              v-for="need in getCharacterNeeds" 
              :key="need.type"
              class="flex flex-col border rounded p-3"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">{{ need.type }}</span>
                <span 
                  :class="getNeedStatusClass(need.value)" 
                  class="px-2 py-0.5 rounded-full text-xs font-bold"
                >
                  {{ Math.round(need.value) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded h-2 mb-2">
                <div 
                  class="h-2 rounded"
                  :class="getNeedStatusClass(need.value)"
                  :style="`width: ${need.value}%`"
                ></div>
              </div>
              <button 
                class="btn btn-sm btn-outline-primary mt-1"
                @click="satisfyNeed(need.type)"
              >
                Satisfy {{ need.type }}
              </button>
            </div>
          </div>
          
          <h4 class="text-lg font-bold mb-3">Skills</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="skill in sortedSkills" 
              :key="skill.type"
              class="flex flex-col border rounded p-3"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">{{ skill.type }}</span>
                <span 
                  :class="getSkillLevelColor(skill.level)" 
                  class="px-2 py-0.5 rounded-full text-xs font-bold"
                >
                  {{ skill.level }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded h-2">
                <div 
                  class="h-2 rounded"
                  :class="getSkillLevelColor(skill.level)"
                  :style="`width: ${(skill.level / 20) * 100}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="card p-4 text-center">
          <p class="text-gray-500">Select a character to view details.</p>
        </div>
      </div>
    </div>
  </div>
</template> 