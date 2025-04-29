// 日期时间状态接口
export interface GameDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
}

// 时间速度选项
export enum TimeSpeed {
  Paused = 0,     // 暂停
  Normal = 1,     // 正常 (5000ms = 1小时)
  Fast = 2,       // 快速 (2500ms = 1小时)
  VeryFast = 5,   // 很快 (1000ms = 1小时)
  UltraFast = 10  // 极快 (500ms = 1小时)
}

// 月份名称
export const MonthNames = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];

// 每月天数 (非闰年)
export const DaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// 判断是否闰年
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

// 获取指定月份的天数
export const getDaysInMonth = (year: number, month: number): number => {
  // 二月份特殊处理闰年
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }
  return DaysInMonth[month];
};

// 格式化时间显示
export const formatDateTime = (dateTime: GameDateTime): string => {
  const monthName = MonthNames[dateTime.month];
  const day = dateTime.day + 1; // 转为1-31表示
  return `${monthName} ${day}, ${dateTime.year} - ${dateTime.hour}:00`;
};

// 创建时间管理器类
export class TimeManager {
  private dateTime: GameDateTime;
  private speed: TimeSpeed;
  private timerId: number | null;
  private baseInterval: number;
  private callbacks: Array<(time: GameDateTime) => void>;
  
  constructor(
    initialDateTime?: Partial<GameDateTime>, 
    baseInterval: number = 5000
  ) {
    // 默认从5500年1月1日0时开始
    this.dateTime = {
      year: initialDateTime?.year || 5500,
      month: initialDateTime?.month || 0, // 0-11表示月份
      day: initialDateTime?.day || 0,     // 0-30表示日期
      hour: initialDateTime?.hour || 0,   // 0-23表示小时
    };
    
    this.speed = TimeSpeed.Normal;
    this.timerId = null;
    this.baseInterval = baseInterval;
    this.callbacks = [];
  }
  
  // 获取当前时间
  public getDateTime(): GameDateTime {
    return { ...this.dateTime };
  }
  
  // 获取当前速度
  public getSpeed(): TimeSpeed {
    return this.speed;
  }
  
  // 设置速度
  public setSpeed(speed: TimeSpeed): void {
    this.speed = speed;
    
    // 如果时间正在运行，重新启动计时器以应用新速度
    if (this.timerId !== null) {
      this.stop();
      if (speed !== TimeSpeed.Paused) {
        this.start();
      }
    }
  }
  
  // 添加时间变化回调
  public onTimeChange(callback: (time: GameDateTime) => void): void {
    this.callbacks.push(callback);
  }
  
  // 启动时间
  public start(): void {
    if (this.timerId !== null || this.speed === TimeSpeed.Paused) {
      return;
    }
    
    const interval = this.baseInterval / this.speed;
    
    this.timerId = window.setInterval(() => {
      this.advanceHour();
    }, interval);
  }
  
  // 停止时间
  public stop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
  
  // 前进一小时
  private advanceHour(): void {
    this.dateTime.hour += 1;
    
    // 处理小时溢出
    if (this.dateTime.hour >= 24) {
      this.dateTime.hour = 0;
      this.advanceDay();
    }
    
    // 触发回调
    this.notifyTimeChange();
  }
  
  // 前进一天
  private advanceDay(): void {
    this.dateTime.day += 1;
    
    // 处理日期溢出
    const daysInCurrentMonth = getDaysInMonth(this.dateTime.year, this.dateTime.month);
    if (this.dateTime.day >= daysInCurrentMonth) {
      this.dateTime.day = 0;
      this.advanceMonth();
    }
  }
  
  // 前进一个月
  private advanceMonth(): void {
    this.dateTime.month += 1;
    
    // 处理月份溢出
    if (this.dateTime.month >= 12) {
      this.dateTime.month = 0;
      this.advanceYear();
    }
  }
  
  // 前进一年
  private advanceYear(): void {
    this.dateTime.year += 1;
  }
  
  // 通知时间变化
  private notifyTimeChange(): void {
    const currentTime = this.getDateTime();
    this.callbacks.forEach(callback => callback(currentTime));
  }
  
  // 保存时间状态到本地存储
  public saveToStorage(): void {
    localStorage.setItem('gameDateTime', JSON.stringify(this.dateTime));
    localStorage.setItem('gameTimeSpeed', this.speed.toString());
  }
  
  // 从本地存储加载时间状态
  public loadFromStorage(): boolean {
    const savedDateTime = localStorage.getItem('gameDateTime');
    const savedSpeed = localStorage.getItem('gameTimeSpeed');
    
    if (savedDateTime) {
      try {
        this.dateTime = JSON.parse(savedDateTime);
        if (savedSpeed) {
          this.speed = parseInt(savedSpeed) as TimeSpeed;
        }
        return true;
      } catch (e) {
        console.error('Failed to load time from storage', e);
      }
    }
    
    return false;
  }
}

// 创建全局单例时间管理器
const globalTimeManager = new TimeManager();

export default globalTimeManager; 