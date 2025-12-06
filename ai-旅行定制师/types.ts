
export enum TravelStyle {
  Relaxed = '🌴 休闲漫游 (睡到自然醒)',
  Packed = '⚡️ 特种兵打卡 (日行三万步)',
  Balanced = '⚖️ 劳逸结合 (经典玩法)',
  Culture = '🏛 人文深度 (博物馆/历史)',
  Nature = '🏔 拥抱自然 (徒步/看海)',
}

export enum CompanionType {
  Solo = '👤 独自一人',
  Couple = '💕 情侣/夫妻',
  FamilyKids = '👨‍👩‍👧 亲子 (带小孩)',
  FamilyElderly = '👵 家族 (带长辈)',
  Friends = '👯‍♂️ 朋友出行',
}

export interface UserPreferences {
  destination: string;
  days: number;
  travelers: number;
  
  // 核心变更：具体预算
  totalBudget: number; 
  currency: string;
  
  // 核心变更：更细致的画像
  companionType: CompanionType;
  travelStyle: TravelStyle;
  
  interests: string[];
  foodPreferences: string[];
  
  // 新增偏好
  accommodationPref: string[]; // e.g. ["星级酒店", "特色民宿", "青旅"]
  transportPref: string[]; // e.g. ["公共交通", "打车", "自驾"]
  
  mustSee: string;
}

export interface Activity {
  time: string;
  activityName: string;
  description: string;
  location: string;
  costEstimate: string;
  type: 'food' | 'sightseeing' | 'transport' | 'relax' | 'accommodation';
  tips?: string; // 避坑指南
  bookingAdvice?: string; // 预订建议
  xiaohongshuNote?: string; // 新增：仿小红书笔记风格的简短评价
  transportDetail?: string; // 新增：具体的交通路线，如"地铁2号线->3号线"
}

export interface WeatherInfo {
  condition: string; // e.g., "晴转多云"
  temperature: string; // e.g., "18°C - 25°C"
  advice: string; // e.g., "建议穿风衣，带雨伞"
  icon: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
}

export interface DayPlan {
  dayNumber: number;
  date?: string; // 虚拟日期
  theme: string;
  weather: WeatherInfo; // 新增天气
  activities: Activity[];
}

export interface ItineraryResult {
  tripTitle: string;
  summary: string;
  currency: string;
  totalEstimatedCost: string;
  budgetAnalysis: string; 
  days: DayPlan[];
  packingList: string[];
  sourceUrls?: { title: string; uri: string }[];
}
