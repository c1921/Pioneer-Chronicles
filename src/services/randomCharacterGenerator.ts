import type { Character, CharacterFormData, Skill } from '../types/character';
import { Gender, SkillType } from '../types/character';
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

// 生成随机角色数据
export const generateRandomCharacter = (): CharacterFormData => {
  const gender = getRandomGender();
  return {
    name: getRandomNameByGender(gender),
    gender: gender,
    age: getRandomAge(),
    skills: generateRandomSkills()
  };
};

// 创建完整的随机角色（包含ID）
export const createRandomCharacter = (): Character => {
  return {
    id: uuidv4(),
    ...generateRandomCharacter()
  };
}; 