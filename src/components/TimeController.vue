<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import timeManager, { TimeSpeed, GameDateTime, formatDateTime } from '../services/timeService';

// 当前游戏时间
const currentTime = ref<GameDateTime>(timeManager.getDateTime());

// 当前时间速度
const currentSpeed = ref<TimeSpeed>(timeManager.getSpeed());

// 时间速度列表
const speedOptions = [
  { value: TimeSpeed.Paused, label: 'Paused' },
  { value: TimeSpeed.Normal, label: '1x' },
  { value: TimeSpeed.Fast, label: '2x' },
  { value: TimeSpeed.VeryFast, label: '5x' },
  { value: TimeSpeed.UltraFast, label: '10x' }
];

// 格式化时间显示
const formattedTime = computed(() => {
  return formatDateTime(currentTime.value);
});

// 处理时间变化
const handleTimeChange = (newTime: GameDateTime) => {
  currentTime.value = newTime;
  // 每小时保存一次游戏时间
  timeManager.saveToStorage();
};

// 切换时间速度
const changeSpeed = (speed: TimeSpeed) => {
  // 设置新的速度
  timeManager.setSpeed(speed);
  currentSpeed.value = speed;
  
  // 如果选择了非暂停速度，而当前是暂停状态，则启动时间
  if (speed !== TimeSpeed.Paused) {
    timeManager.start();
  }
  
  // 保存状态
  timeManager.saveToStorage();
};

// 暂停/播放切换
const togglePause = () => {
  if (currentSpeed.value === TimeSpeed.Paused) {
    // 如果当前已暂停，恢复到正常速度
    changeSpeed(TimeSpeed.Normal);
  } else {
    // 否则暂停
    changeSpeed(TimeSpeed.Paused);
    timeManager.stop();
  }
};

// 组件挂载
onMounted(() => {
  // 从存储中加载时间状态
  timeManager.loadFromStorage();
  currentTime.value = timeManager.getDateTime();
  currentSpeed.value = timeManager.getSpeed();
  
  // 注册时间变化回调
  timeManager.onTimeChange(handleTimeChange);
  
  // 启动时间（如果不是暂停状态）
  if (currentSpeed.value !== TimeSpeed.Paused) {
    timeManager.start();
  }
});

// 组件卸载
onUnmounted(() => {
  // 停止时间并保存状态
  timeManager.stop();
  timeManager.saveToStorage();
});
</script>

<template>
  <div class="card p-4">
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex items-center space-x-4">
        <div class="text-lg font-bold">{{ formattedTime }}</div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          class="btn btn-sm" 
          :class="currentSpeed === TimeSpeed.Paused ? 'btn-primary' : 'btn-outline-primary'"
          @click="togglePause"
        >
          {{ currentSpeed === TimeSpeed.Paused ? 'Play' : 'Pause' }}
        </button>
        
        <div class="btn-group">
          <button 
            v-for="option in speedOptions.filter(o => o.value !== TimeSpeed.Paused)" 
            :key="option.value"
            class="btn btn-sm" 
            :class="currentSpeed === option.value ? 'btn-secondary' : 'btn-outline-secondary'"
            @click="changeSpeed(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 