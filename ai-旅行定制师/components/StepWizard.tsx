
import React, { useState } from 'react';
import { UserPreferences, TravelStyle, CompanionType } from '../types';

interface StepWizardProps {
  onComplete: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_OPTIONS = ['历史古迹', '艺术展览', '自然风光', '购物血拼', '都市夜生活', '户外探险', '休闲疗愈', '摄影打卡', '地道市集', '主题乐园'];
const FOOD_OPTIONS = ['街头小吃', '米其林/精致餐饮', '地道本帮菜', '海鲜大餐', '素食/轻食', '网红打卡店', '甜点咖啡', '夜市摊位'];
const ACCOMMODATION_OPTIONS = ['经济型酒店/青旅', '舒适型民宿/客栈', '高档星级酒店', '奢华度假村', '位置便利优先'];
const TRANSPORT_OPTIONS = ['公共交通 (地铁/公交)', '打车/网约车', '包车/自驾', '步行/骑行'];

const StepWizard: React.FC<StepWizardProps> = ({ onComplete, isLoading }) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>({
    destination: '',
    days: 3,
    travelers: 2,
    totalBudget: 2000,
    currency: 'CNY',
    companionType: CompanionType.Couple,
    travelStyle: TravelStyle.Balanced,
    foodPreferences: [],
    interests: [],
    accommodationPref: ['舒适型民宿/客栈'],
    transportPref: ['公共交通 (地铁/公交)'],
    mustSee: '',
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const toggleSelection = (list: string[], item: string, field: keyof UserPreferences) => {
    const currentList = list;
    const newList = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    setPrefs({ ...prefs, [field]: newList });
  };

  const isStep1Valid = prefs.destination.length > 0 && prefs.days > 0;
  const isStep2Valid = prefs.totalBudget > 0;
  const isStep3Valid = prefs.interests.length > 0;

  if (isLoading) return null;

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col min-h-[70vh] border border-white/50 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-100">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-r-full" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 p-6 md:p-8 overflow-y-auto relative z-10 custom-scrollbar">
        
        {/* Step 1: Destination & Companions */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">✈️</span>
                <h2 className="text-2xl font-bold text-gray-800">第一步：去哪儿 & 和谁去？</h2>
                <p className="text-gray-500 text-sm mt-1">定制适合您同伴的行程</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">我想去...</label>
              <input
                type="text"
                placeholder="例如：西安, 长沙, 迪士尼..."
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-lg transition-all"
                value={prefs.destination}
                onChange={(e) => setPrefs({ ...prefs, destination: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">玩几天？</label>
                 <input
                    type="number"
                    min="1"
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-lg"
                    value={prefs.days}
                    onChange={(e) => setPrefs({ ...prefs, days: parseInt(e.target.value) || 1 })}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">几个人？</label>
                 <input
                    type="number"
                    min="1"
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-lg"
                    value={prefs.travelers}
                    onChange={(e) => setPrefs({ ...prefs, travelers: parseInt(e.target.value) || 1 })}
                 />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">谁和你一起？<span className="text-xs font-normal text-blue-500">(影响行程强度)</span></label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(CompanionType).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPrefs({ ...prefs, companionType: type })}
                    className={`p-3 rounded-xl text-sm font-medium border transition-all text-left ${
                      prefs.companionType === type
                        ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Budget & Style */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">💰</span>
                <h2 className="text-2xl font-bold text-gray-800">第二步：预算与偏好</h2>
                <p className="text-gray-500 text-sm mt-1">告诉我有多少预算，我来帮你规划</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
               <label className="text-sm font-bold text-orange-800 ml-1 mb-2 block">本次旅行总预算 (不含往返大交通)</label>
               <div className="flex items-center gap-3">
                  <select 
                    value={prefs.currency} 
                    onChange={(e) => setPrefs({...prefs, currency: e.target.value})}
                    className="p-3 bg-white rounded-xl border border-yellow-200 text-orange-700 font-bold outline-none"
                  >
                    <option value="CNY">CNY ¥</option>
                    <option value="USD">USD $</option>
                    <option value="JPY">JPY ¥</option>
                    <option value="EUR">EUR €</option>
                  </select>
                  <input
                    type="number"
                    placeholder="例如: 2000"
                    className="flex-1 p-3 text-2xl font-bold text-orange-600 bg-white border border-yellow-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                    value={prefs.totalBudget}
                    onChange={(e) => setPrefs({ ...prefs, totalBudget: parseInt(e.target.value) || 0 })}
                  />
               </div>
               <p className="text-xs text-orange-600/70 mt-2">
                 * AI 将根据 <span className="font-bold">{prefs.travelers}人</span> 共 <span className="font-bold">{prefs.totalBudget} {prefs.currency}</span> 的预算来安排食宿标准。
               </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">旅行节奏偏好</label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(TravelStyle).map((style) => (
                  <button
                    key={style}
                    onClick={() => setPrefs({ ...prefs, travelStyle: style as TravelStyle })} // Cast needed due to enum keying
                    className={`p-3 rounded-xl text-sm font-medium text-left border transition-all flex justify-between items-center ${
                      prefs.travelStyle === style
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {style}
                    {prefs.travelStyle === style && <span>✔</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Detailed Preferences */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
             <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">🏨</span>
                <h2 className="text-2xl font-bold text-gray-800">第三步：住行与兴趣</h2>
                <p className="text-gray-500 text-sm mt-1">细节决定体验</p>
            </div>

            <div className="space-y-3">
               <label className="text-sm font-bold text-gray-700 ml-1">住宿偏好 <span className="font-normal text-gray-400 text-xs">(多选)</span></label>
               <div className="flex flex-wrap gap-2">
                 {ACCOMMODATION_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleSelection(prefs.accommodationPref, opt, 'accommodationPref')}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        prefs.accommodationPref.includes(opt)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                 ))}
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-sm font-bold text-gray-700 ml-1">交通偏好 <span className="font-normal text-gray-400 text-xs">(多选)</span></label>
               <div className="flex flex-wrap gap-2">
                 {TRANSPORT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleSelection(prefs.transportPref, opt, 'transportPref')}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                        prefs.transportPref.includes(opt)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                 ))}
               </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">兴趣点 <span className="text-red-400 font-normal text-xs">*必选</span></label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleSelection(prefs.interests, item, 'interests')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      prefs.interests.includes(item)
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">美食取向</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleSelection(prefs.foodPreferences, item, 'foodPreferences')}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      prefs.foodPreferences.includes(item)
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Touches */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
                <span className="text-4xl mb-2 block">✨</span>
                <h2 className="text-2xl font-bold text-gray-800">最后确认</h2>
                <p className="text-gray-500 text-sm mt-1">越详细，越完美</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1">
                特殊备注/必打卡清单
              </label>
              <textarea
                placeholder="例如：我对海鲜过敏；一定要去xx打卡；腿脚不便需要少走路；想给女朋友安排一个惊喜晚餐..."
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-base h-32 resize-none transition-all"
                value={prefs.mustSee}
                onChange={(e) => setPrefs({ ...prefs, mustSee: e.target.value })}
              />
            </div>
            
            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-2 text-sm text-blue-800">
                <p><strong>📍 目的地:</strong> {prefs.destination}</p>
                <p><strong>👥 人员:</strong> {prefs.travelers}人 ({prefs.companionType})</p>
                <p><strong>💰 总预算:</strong> {prefs.totalBudget} {prefs.currency}</p>
                <p><strong>🎨 风格:</strong> {prefs.travelStyle}</p>
                <p><strong>🏠 住行:</strong> {prefs.accommodationPref.join(', ') || '无特殊要求'} / {prefs.transportPref.join(', ') || '无特殊要求'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white/60 backdrop-blur-md z-20">
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-4 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              上一步
            </button>
          )}
          
          <button
            onClick={step < 4 ? handleNext : () => onComplete(prefs)}
            disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : step === 3 ? !isStep3Valid : false}
            className={`flex-1 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
              (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid) || (step === 3 && !isStep3Valid)
                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] shadow-blue-500/20'
            }`}
          >
            {step === 4 ? '生成专属攻略 🚀' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepWizard;