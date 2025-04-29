import type { Character } from '../types/character';
import { NeedType } from '../types/character';
import timeManager from './timeService';

// 需求衰减配置（每小时减少的数值）
const NEED_DECAY_RATES = {
  [NeedType.Rest]: 4,  // 每小时休息需求增加4点
  [NeedType.Food]: 5   // 每小时饮食需求增加5点
};

// 需求临界值
export const NEED_THRESHOLDS = {
  CRITICAL: 20,  // 临界值
  LOW: 40,       // 低值
  MEDIUM: 70     // 中等值
};

// 管理角色需求
export class NeedsManager {
  // 更新角色的所有需求
  public static updateCharacterNeeds(character: Character): Character {
    // 没有上次更新时间，设置为当前时间并返回
    if (!character.lastUpdateTime) {
      return {
        ...character,
        lastUpdateTime: Date.now()
      };
    }

    // 使用当前时间戳
    const now = Date.now();
    
    // 计算经过的现实时间（毫秒）
    const elapsedRealTime = now - character.lastUpdateTime;
    
    // 获取当前游戏速度
    const gameSpeed = timeManager.getSpeed();
    
    // 如果游戏暂停或没有经过时间，直接返回原角色
    if (gameSpeed === 0 || elapsedRealTime <= 0) {
      return character;
    }
    
    // 计算应该经过的游戏小时数
    // 公式: (经过的现实时间(ms) / 每小时的现实时间(ms)) * 游戏速度
    const baseHourInterval = 5000; // 每小时5000ms
    const elapsedGameHours = (elapsedRealTime / baseHourInterval) * gameSpeed;
    
    // 更新需求
    const updatedNeeds = character.needs.map(need => {
      const decayRate = NEED_DECAY_RATES[need.type] || 0;
      // 减少需求值
      const newValue = Math.max(0, need.value - decayRate * elapsedGameHours);
      return {
        ...need,
        value: newValue
      };
    });

    // 返回更新后的角色
    return {
      ...character,
      needs: updatedNeeds,
      lastUpdateTime: now
    };
  }

  // 更新角色列表的所有需求
  public static updateAllCharactersNeeds(characters: Character[]): Character[] {
    return characters.map(character => this.updateCharacterNeeds(character));
  }

  // 满足特定需求
  public static satisfyNeed(character: Character, needType: NeedType, amount: number): Character {
    const updatedNeeds = character.needs.map(need => {
      if (need.type === needType) {
        // 增加需求值，但不超过100
        return {
          ...need,
          value: Math.min(100, need.value + amount)
        };
      }
      return need;
    });

    return {
      ...character,
      needs: updatedNeeds
    };
  }
  
  // 获取需求状态描述
  public static getNeedStatus(value: number): 'critical' | 'low' | 'medium' | 'high' {
    if (value <= NEED_THRESHOLDS.CRITICAL) return 'critical';
    if (value <= NEED_THRESHOLDS.LOW) return 'low';
    if (value <= NEED_THRESHOLDS.MEDIUM) return 'medium';
    return 'high';
  }
  
  // 获取需求颜色类
  public static getNeedColorClass(value: number): string {
    const status = this.getNeedStatus(value);
    switch (status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'low': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-400 text-black';
      case 'high': return 'bg-green-500 text-white';
    }
  }
}

export default NeedsManager; 