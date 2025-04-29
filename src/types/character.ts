export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

// 技能类型枚举
export enum SkillType {
  Shooting = 'Shooting',    // 射击
  Fighting = 'Fighting',    // 格斗
  Building = 'Building',    // 建造
  Mining = 'Mining',        // 采矿
  Cooking = 'Cooking',      // 烹饪
  Farming = 'Farming',      // 种植
  AnimalTaming = 'Animal Taming', // 驯兽
  Crafting = 'Crafting',    // 手工
  Art = 'Art',              // 艺术
  Medicine = 'Medicine',    // 医疗
  Social = 'Social',        // 社交
  Intellectual = 'Intellectual' // 智识
}

// 技能属性接口
export interface Skill {
  type: SkillType;
  level: number; // 0-20
}

// 角色接口
export interface Character {
  id: string; // 唯一标识符
  name: string; // 角色名称
  gender: Gender; // 角色性别
  age: number; // 角色年龄
  skills: Skill[]; // 角色技能列表
}

// 创建新角色的表单类型
export interface CharacterFormData {
  name: string;
  gender: Gender;
  age: number;
  skills: Skill[];
} 