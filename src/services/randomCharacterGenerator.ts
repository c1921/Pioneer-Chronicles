import type { Character, CharacterFormData, Skill, Need } from '../types/character';
import { Gender, SkillType, NeedType, WorkStatus } from '../types/character';
import { v4 as uuidv4 } from 'uuid';

// 男性名字列表
const maleNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 
  'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald',
  'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth'
];

// 女性名字列表
const femaleNames = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth',
  'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Sandra', 'Margaret',
  'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'
];

// 中性名字列表
const neutralNames = [
  'Alex', 'Jordan', 'Taylor', 'Casey', 'Riley',
  'Peyton', 'Quinn', 'Avery', 'Morgan', 'Hayden',
  'Blake', 'Cameron', 'Rowan', 'Dakota', 'River',
  'Emerson', 'Finley', 'Sage', 'Skyler', 'Reese'
];

// 随机数生成函数
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 随机选择函数
const getRandomElement = <T>(array: T[]): T => {
  return array[getRandomInt(0, array.length - 1)];
};

// 根据性别获取随机名字
const getRandomNameByGender = (gender: Gender): string => {
  switch (gender) {
    case Gender.Male:
      return getRandomElement(maleNames);
    case Gender.Female:
      return getRandomElement(femaleNames);
    default:
      return getRandomElement(neutralNames);
  }
};

// 获取随机性别
const getRandomGender = (): Gender => {
  const genders = [Gender.Male, Gender.Female, Gender.Other];
  return getRandomElement(genders);
};

// 获取随机年龄
const getRandomAge = (min: number = 18, max: number = 80): number => {
  return getRandomInt(min, max);
};

// 获取所有技能类型数组
const getAllSkillTypes = (): SkillType[] => {
  return Object.values(SkillType);
};

// 生成随机技能等级
const getRandomSkillLevel = (min: number = 0, max: number = 20): number => {
  return getRandomInt(min, max);
};

// 生成随机技能列表
const generateRandomSkills = (): Skill[] => {
  const allSkillTypes = getAllSkillTypes();
  
  // 为每种技能生成随机等级
  return allSkillTypes.map(skillType => {
    // 大多数技能保持较低等级 (0-5)
    let maxLevel = 5;
    
    // 随机选择1-3个技能作为擅长技能 (5-15)
    if (Math.random() < 0.2) {
      maxLevel = 15;
    }
    
    // 极少数技能达到专精水平 (15-20)
    if (Math.random() < 0.05) {
      maxLevel = 20;
    }
    
    return {
      type: skillType,
      level: getRandomSkillLevel(0, maxLevel)
    };
  });
};

// 获取所有需求类型数组
const getAllNeedTypes = (): NeedType[] => {
  return Object.values(NeedType);
};

// 生成随机需求等级
const getRandomNeedValue = (min: number = 70, max: number = 100): number => {
  return getRandomInt(min, max);
};

// 生成随机需求列表
const generateRandomNeeds = (): Need[] => {
  const allNeedTypes = getAllNeedTypes();
  
  // 为每种需求生成随机值，初始值偏高（70-100）
  return allNeedTypes.map(needType => {
    return {
      type: needType,
      value: getRandomNeedValue()
    };
  });
};

// 生成随机角色数据
export const generateRandomCharacter = (): CharacterFormData => {
  const gender = getRandomGender();
  return {
    name: getRandomNameByGender(gender),
    gender: gender,
    age: getRandomAge(),
    skills: generateRandomSkills(),
    needs: generateRandomNeeds(),
    workStatus: WorkStatus.Idle // 默认为空闲状态
  };
};

// 创建具有ID的随机角色
export const createRandomCharacter = (): Character => {
  const formData = generateRandomCharacter();
  return {
    id: uuidv4(),
    name: formData.name,
    gender: formData.gender,
    age: formData.age,
    skills: formData.skills,
    needs: formData.needs || [],
    workStatus: formData.workStatus || WorkStatus.Idle,
    lastUpdateTime: Date.now()
  };
}; 