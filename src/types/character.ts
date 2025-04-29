export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}
   
export interface Character {
  id: string; // 唯一标识符
  name: string; // 角色名称
  gender: Gender; // 角色性别
  age: number; // 角色年龄
}

// 创建新角色的表单类型
export interface CharacterFormData {
  name: string;
  gender: Gender;
  age: number;
} 