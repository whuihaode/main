
import { GoogleGenAI } from "@google/genai";
import { UserPreferences, ItineraryResult } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateItinerary = async (prefs: UserPreferences): Promise<ItineraryResult> => {
  const model = "gemini-2.5-flash";

  // 构建更详细的上下文 Prompt
  const prompt = `
    你是一位拥有百万粉丝的“小红书”金牌旅行规划师，同时也是一位精算的导游。请为用户定制一份事无巨细、极具参考价值的旅行攻略。

    ### 核心任务：
    1.  **真实数据搜寻 (Grounding)**: 必须使用 Google Search 搜索以下内容：
        *   **天气**: 查询 ${prefs.destination} 未来几天的天气预报或当前季节的典型天气。
        *   **小红书/携程口碑**: 搜索 "site:xiaohongshu.com ${prefs.destination} 避雷" 或 "site:ctrip.com ${prefs.destination} 评价"，获取真实的景点和餐厅评价。
        *   **准确票价**: 获取最新的门票价格（区分成人/儿童/老人）。
        *   **交通方案**: 查询具体的地铁线路、公交车次或打车预估价格。
    
    ### 用户画像 (Persona):
    *   **预算**: ${prefs.totalBudget} ${prefs.currency} (共${prefs.travelers}人)。必须严格控制在此预算内，如果预算紧张，请在交通和餐饮上通过“本地人吃法”省钱。
    *   **人员**: ${prefs.companionType}。
        *   *带小孩*: 必须标注推车友好度、母婴室、少排队路线。
        *   *带老人*: 必须标注体力消耗、无障碍通道、休息点。
    *   **风格**: ${prefs.travelStyle}。
    *   **特殊要求**: ${prefs.mustSee}。
    *   **食宿偏好**: 住[${prefs.accommodationPref.join(',')}], 行[${prefs.transportPref.join(',')}]。

    ### 输出要求：
    返回严格的 JSON 格式。

    ### 细节字段说明：
    *   **weather**: 根据搜索结果填写真实的天气预测。
    *   **xiaohongshuNote**: 模仿小红书笔记风格，用emoji和短句写出该地点的亮点或避雷点（例如："❌别去游客中心买票，⭕️提前在携程买省20"）。
    *   **transportDetail**: 必须具体！不要只写“去景点”，要写“乘坐地铁2号线至钟楼站C口出，步行300米”。
    *   **costEstimate**: 每一项的具体花费。

    interface ItineraryResult {
      tripTitle: string; // 吸引人的标题，如 "🇨🇳 长沙3日吃喝玩乐 | 人均800拿下！"
      summary: string; // 整体规划思路
      currency: string;
      totalEstimatedCost: string; // 纯数字
      budgetAnalysis: string; // 预算分析，如 "住宿占大头，建议选择民宿节省30%"
      packingList: string[]; // 针对天气和人员的打包清单
      days: {
        dayNumber: number;
        theme: string;
        weather: {
          condition: string; // e.g. "多云转晴"
          temperature: string; // e.g. "22°C"
          advice: string; // e.g. "紫外线强，注意防晒"
          icon: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
        };
        activities: {
          time: string;
          activityName: string;
          description: string;
          location: string;
          costEstimate: string; // 数字字符串
          type: 'food' | 'sightseeing' | 'transport' | 'relax' | 'accommodation';
          tips: string; // 实用贴士
          bookingAdvice: string; // 购票/排队建议
          xiaohongshuNote: string; // 🌟 必填：小红书风格短评
          transportDetail: string; // 🚌 必填：具体交通方案
        }[];
      }[];
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.4, // 降低温度以确保 factual accuracy (价格、路线)
    }
  });

  let text = response.text;
  if (!text) throw new Error("AI 未返回内容");

  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const parsedData = JSON.parse(text);
    
    // Process Grounding Metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; uri: string }[] = [];
    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "参考来源",
            uri: chunk.web.uri || "#"
          });
        }
      });
    }
    // Filter out duplicate URIs
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
    parsedData.sourceUrls = uniqueSources;

    return parsedData;
  } catch (e) {
    console.error("JSON Parse Error", text);
    throw new Error("生成的行程格式有误，请重试。");
  }
};
