<script setup lang="ts">
import type { Character } from '../types/character';
import { Gender } from '../types/character';

const props = defineProps<{
  characters: Character[];
  onDelete: (id: string) => void;
}>();

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
</script>

<template>
  <div class="card p-4">
    <h3 class="text-xl font-bold mb-4">Character List</h3>
    
    <div v-if="characters.length === 0" class="text-center py-4 text-gray-500">
      No characters yet. Please create one.
    </div>
    
    <div v-else class="space-y-2">
      <div 
        v-for="character in characters" 
        :key="character.id" 
        class="flex items-center justify-between p-3 bg-gray-50 rounded"
      >
        <div>
          <div class="font-bold">{{ character.name }}</div>
          <div class="text-sm flex gap-3">
            <span :class="getGenderColor(character.gender)">{{ character.gender }}</span>
            <span>{{ character.age }} years old</span>
          </div>
        </div>
        <button 
          class="btn btn-sm btn-danger" 
          @click="onDelete(character.id)"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template> 