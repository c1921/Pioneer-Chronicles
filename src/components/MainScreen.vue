<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import type { Character, Skill, Need } from '../types/character';
import { Gender, SkillType, NeedType, WorkStatus } from '../types/character';
import { WorkType } from '../types/work';
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
    console.log('Resetting game...');
    // 清空本地数据
    localStorage.removeItem('characters');
    // 清空当前角色数据
    characters.value = [];
    selectedCharacterId.value = null;
    // 触发重置事件，通知父组件
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

// 获取工作状态文本和颜色
const getWorkStatusClass = (status: WorkStatus): string => {
  switch (status) {
    case WorkStatus.Idle:
      return 'text-gray-600';
    case WorkStatus.Working:
      return 'text-green-600 font-bold';
    default:
      return 'text-gray-600';
  }
};

// 分配工作任务给角色
const assignWork = (workType: string) => {
  if (!selectedCharacter.value) return;
  
  // 更新选中的角色工作状态
  const updatedCharacter = { 
    ...selectedCharacter.value,
    workStatus: WorkStatus.Working,
    currentWorkType: workType
  };
  
  // 更新角色列表中的对应角色
  characters.value = characters.value.map(char => 
    char.id === updatedCharacter.id ? updatedCharacter : char
  );
  
  // 保存到本地存储
  saveToLocalStorage();
};

// 让角色停止工作
const stopWorking = () => {
  if (!selectedCharacter.value) return;
  
  // 更新选中的角色工作状态
  const updatedCharacter = { 
    ...selectedCharacter.value,
    workStatus: WorkStatus.Idle,
    currentWorkType: undefined
  };
  
  // 更新角色列表中的对应角色
  characters.value = characters.value.map(char => 
    char.id === updatedCharacter.id ? updatedCharacter : char
  );
  
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

// 命令输入框
const commandInput = ref('');
const commandError = ref('');
const commandSuccess = ref('');

// 处理命令
const handleCommand = () => {
  const command = commandInput.value.trim();
  if (!command) return;
  
  // 重置消息
  commandError.value = '';
  commandSuccess.value = '';
  
  // 分析命令
  if (command.startsWith('work')) {
    // 工作命令格式: work 工作类型
    const parts = command.split(' ');
    if (parts.length < 2) {
      commandError.value = 'Invalid command format. Use: work [work type]';
      return;
    }
    
    const workType = parts[1];
    // 检查工作类型是否有效
    const validWorkTypes = Object.values(WorkType);
    const foundWorkType = validWorkTypes.find(type => type.toLowerCase() === workType.toLowerCase());
    
    if (!foundWorkType) {
      commandError.value = `Invalid work type: ${workType}. Available types: ${validWorkTypes.join(', ')}`;
      return;
    }
    
    // 查找空闲角色
    const idleCharacters = characters.value.filter(char => char.workStatus === WorkStatus.Idle);
    if (idleCharacters.length === 0) {
      commandError.value = 'No idle characters available for work assignment.';
      return;
    }
    
    // 分配工作给第一个空闲角色
    const targetCharacter = idleCharacters[0];
    
    // 更新角色工作状态
    const updatedCharacter = { 
      ...targetCharacter,
      workStatus: WorkStatus.Working,
      currentWorkType: foundWorkType
    };
    
    // 更新角色列表
    characters.value = characters.value.map(char => 
      char.id === updatedCharacter.id ? updatedCharacter : char
    );
    
    // 保存到本地存储
    saveToLocalStorage();
    
    // 显示成功消息
    commandSuccess.value = `Assigned ${foundWorkType} to ${targetCharacter.name}`;
    
    // 选中该角色
    selectCharacter(targetCharacter.id);
  } else {
    commandError.value = 'Unknown command. Available commands: work [work type]';
  }
  
  // 清空命令输入
  commandInput.value = '';
};

// 自动分配工作
const autoAssignWork = (workType: string) => {
  // 查找空闲角色
  const idleCharacters = characters.value.filter(char => char.workStatus === WorkStatus.Idle);
  if (idleCharacters.length === 0) {
    commandError.value = 'No idle characters available for work assignment.';
    // 3秒后清除错误消息
    setTimeout(() => { commandError.value = ''; }, 3000);
    return;
  }
  
  // 分配工作给第一个空闲角色
  const targetCharacter = idleCharacters[0];
  
  // 更新角色工作状态
  const updatedCharacter = { 
    ...targetCharacter,
    workStatus: WorkStatus.Working,
    currentWorkType: workType
  };
  
  // 更新角色列表
  characters.value = characters.value.map(char => 
    char.id === updatedCharacter.id ? updatedCharacter : char
  );
  
  // 保存到本地存储
  saveToLocalStorage();
  
  // 显示成功消息
  commandSuccess.value = `Assigned ${workType} to ${targetCharacter.name}`;
  // 3秒后清除成功消息
  setTimeout(() => { commandSuccess.value = ''; }, 3000);
  
  // 选中该角色
  selectCharacter(targetCharacter.id);
};
</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Main Screen Header -->
    <div class="flex justify-between items-center mb-4">
      <TimeController class="ml-4" @time-passed="updateAllCharactersNeeds" />
      <button @click="resetGame" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm">
        Reset Game
      </button>
    </div>

    <!-- Auto Work Assignment Section -->
    <div class="mb-4 bg-white rounded shadow p-4">
      <h3 class="text-lg font-semibold mb-2">Auto Assign Work</h3>
      <div v-if="commandSuccess" class="text-green-500 text-sm mb-2">{{ commandSuccess }}</div>
      <div v-if="commandError" class="text-red-500 text-sm mb-2">{{ commandError }}</div>
      
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="(workName, workKey) in WorkType" 
          :key="workKey"
          @click="autoAssignWork(workName)"
          class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
        >
          {{ workName }}
        </button>
      </div>
    </div>

    <!-- Main Screen Content -->
    <div class="flex flex-wrap -mx-2">
      <!-- Left Side: Character List -->
      <div class="w-full md:w-1/3 px-2 mb-4">
        <div class="bg-white rounded shadow p-4 h-full">
          <h2 class="text-xl font-bold mb-3">Characters</h2>
          <div v-if="characters.length === 0" class="text-gray-600">
            No characters. Please go back and create characters.
          </div>
          <div v-else class="divide-y">
            <div 
              v-for="character in characters" 
              :key="character.id"
              @click="selectCharacter(character.id)"
              :class="['p-2 cursor-pointer hover:bg-gray-100', 
                      selectedCharacterId === character.id ? 'bg-blue-100' : '']"
            >
              <div class="flex justify-between items-center">
                <div>
                  <span :class="getGenderColor(character.gender)">{{ character.name }}</span>
                  <span class="text-xs text-gray-500 ml-2">{{ character.age }} yrs</span>
                </div>
                <div>
                  <!-- Work Status Label -->
                  <span :class="['text-xs py-1 px-2 rounded-full', getWorkStatusClass(character.workStatus)]">
                    {{ character.workStatus === WorkStatus.Working ? 'Working' : 'Idle' }}
                    <span v-if="character.currentWorkType">({{ character.currentWorkType }})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Selected Character Details -->
      <div class="w-full md:w-2/3 px-2">
        <div v-if="selectedCharacter" class="bg-white rounded shadow p-4">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">{{ selectedCharacter.name }} Details</h2>
            <div class="flex items-center">
              <span :class="getGenderColor(selectedCharacter.gender)" class="mr-2">
                {{ selectedCharacter.gender === 'Male' ? '♂' : selectedCharacter.gender === 'Female' ? '♀' : '⚧' }}
              </span>
              <span class="text-sm">{{ selectedCharacter.age }} years old</span>
            </div>
          </div>

          <!-- Work Status -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Work Status</h3>
            <div class="flex items-center mb-2">
              <span :class="['px-3 py-1 rounded-full', getWorkStatusClass(selectedCharacter.workStatus)]">
                {{ selectedCharacter.workStatus === WorkStatus.Working ? 'Working' : 'Idle' }}
                <span v-if="selectedCharacter.currentWorkType">
                  ({{ selectedCharacter.currentWorkType }})
                </span>
              </span>
              
              <button 
                v-if="selectedCharacter.workStatus === WorkStatus.Working"
                @click="stopWorking"
                class="ml-4 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              >
                Stop Working
              </button>
            </div>
            
            <!-- Available Work Types -->
            <div v-if="selectedCharacter.workStatus === WorkStatus.Idle" class="mt-3">
              <p class="text-sm mb-2">Assign Work:</p>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="(workName, workKey) in WorkType" 
                  :key="workKey"
                  @click="assignWork(workName)"
                  class="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
                >
                  {{ workName }}
                </button>
              </div>
            </div>
          </div>

          <!-- Needs -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Needs</h3>
            <div 
              v-for="need in getCharacterNeeds" 
              :key="need.type"
              class="mb-2"
            >
              <div class="flex justify-between items-center mb-1">
                <span>{{ need.type }}</span>
                <button 
                  @click="satisfyNeed(need.type)"
                  class="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
                >
                  Satisfy Need
                </button>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  :class="['h-2.5 rounded-full', getNeedStatusClass(need.value)]"
                  :style="{ width: `${need.value}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div>
            <h3 class="text-lg font-semibold mb-2">Skills</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div 
                v-for="skill in sortedSkills" 
                :key="skill.type"
                class="border rounded p-2"
              >
                <div class="flex justify-between items-center">
                  <span>{{ skill.type }}</span>
                  <span :class="['px-2 py-0.5 rounded-full text-xs', getSkillLevelColor(skill.level)]">
                    {{ skill.level }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-white rounded shadow p-4 flex items-center justify-center h-64">
          <p class="text-gray-500">Please select a character from the left</p>
        </div>
      </div>
    </div>
  </div>
</template> 