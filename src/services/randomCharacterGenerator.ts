import type { Character, CharacterFormData } from '../types/character';
import { Gender } from '../types/character';
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

// 生成随机角色数据
export const generateRandomCharacter = (): CharacterFormData => {
  const gender = getRandomGender();
  return {
    name: getRandomNameByGender(gender),
    gender: gender,
    age: getRandomAge()
  };
};

// 创建完整的随机角色（包含ID）
export const createRandomCharacter = (): Character => {
  return {
    id: uuidv4(),
    ...generateRandomCharacter()
  };
}; 