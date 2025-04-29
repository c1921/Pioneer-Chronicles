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

// 需求类型
export enum NeedType {
  Rest = 'Rest',       // 休息
  Food = 'Food'        // 饮食
}

// 技能属性接口
export interface Skill {
  type: SkillType;
  level: number; // 0-20
}

// 需求接口
export interface Need {
  type: NeedType;
  value: number; // 0-100
}

// 角色接口
export interface Character {
  id: string; // 唯一标识符
  name: string; // 角色名称
  gender: Gender; // 角色性别
  age: number; // 角色年龄
  skills: Skill[]; // 角色技能列表
  needs: Need[]; // 角色需求列表
  lastUpdateTime?: number; // 上次更新需求的时间戳
}

// 创建新角色的表单类型
export interface CharacterFormData {
  name: string;
  gender: Gender;
  age: number;
  skills: Skill[];
  needs?: Need[]; // 可选，创建时会自动初始化
} 