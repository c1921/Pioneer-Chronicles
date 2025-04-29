<script setup lang="ts">
import { ref } from 'vue';
import type { Character, CharacterFormData } from '../types/character';
import { Gender } from '../types/character';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomCharacter } from '../services/randomCharacterGenerator';

const props = defineProps<{
  onSave: (character: Character) => void
}>();

const formData = ref<CharacterFormData>({
  name: '',
  gender: Gender.Male,
  age: 18
});

const errorMessage = ref<string>('');

// 生成随机角色
const generateRandom = () => {
  // 生成随机角色数据
  const randomCharacter = generateRandomCharacter();
  
  // 更新表单数据
  formData.value = randomCharacter;
  
  // 清除错误信息
  errorMessage.value = '';
};

const saveCharacter = () => {
  // 表单验证
  if (!formData.value.name.trim()) {
    errorMessage.value = 'Please enter character name';
    return;
  }
  
  if (formData.value.age <= 0 || formData.value.age > 150) {
    errorMessage.value = 'Please enter a valid age (1-150)';
    return;
  }
  
  // 创建角色对象
  const character: Character = {
    id: uuidv4(),
    ...formData.value
  };
  
  // 调用保存方法
  props.onSave(character);
  
  // 重置表单
  formData.value = {
    name: '',
    gender: Gender.Male,
    age: 18
  };
  
  errorMessage.value = '';
};
</script>

<template>
  <div class="card p-4 max-w-md mx-auto">
    <h3 class="text-xl font-bold mb-4">Create Character</h3>
    
    <div v-if="errorMessage" class="alert alert-danger mb-4">
      {{ errorMessage }}
    </div>
    
    <div class="mb-4">
      <label class="form-label" for="character-name">Character Name</label>
      <input
        id="character-name"
        v-model="formData.name"
        type="text"
        class="form-control"
        placeholder="Enter character name"
      />
    </div>
    
    <div class="mb-4">
      <label class="form-label">Gender</label>
      <div class="flex gap-4">
        <label class="radio-inline">
          <input
            type="radio"
            v-model="formData.gender"
            :value="Gender.Male"
            name="gender"
          />
          <span class="ml-2">{{ Gender.Male }}</span>
        </label>
        <label class="radio-inline">
          <input
            type="radio"
            v-model="formData.gender"
            :value="Gender.Female"
            name="gender"
          />
          <span class="ml-2">{{ Gender.Female }}</span>
        </label>
        <label class="radio-inline">
          <input
            type="radio"
            v-model="formData.gender"
            :value="Gender.Other"
            name="gender"
          />
          <span class="ml-2">{{ Gender.Other }}</span>
        </label>
      </div>
    </div>
    
    <div class="mb-4">
      <label class="form-label" for="character-age">Age</label>
      <input
        id="character-age"
        v-model.number="formData.age"
        type="number"
        class="form-control"
        min="1"
        max="150"
      />
    </div>
    
    <div class="flex justify-between">
      <button class="btn btn-secondary" @click="generateRandom" type="button">
        Generate Random
      </button>
      <button class="btn btn-primary" @click="saveCharacter">
        Save Character
      </button>
    </div>
  </div>
</template> 