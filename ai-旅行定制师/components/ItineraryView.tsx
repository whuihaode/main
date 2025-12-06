
import React, { useState } from 'react';
import { ItineraryResult, Activity, WeatherInfo } from '../types';

interface ItineraryViewProps {
  data: ItineraryResult;
  onReset: () => void;
}

const WeatherWidget = ({ weather }: { weather: WeatherInfo }) => {
  const getIcon = (type: string) => {
    if (type === 'sunny') return '☀️';
    if (type === 'rainy') return '🌧';
    if (type === 'snowy') return '❄️';
    return '☁️';
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-4 text-white flex items-center justify-between shadow-lg shadow-blue-200 mb-6">
       <div className="flex items-center gap-3">
          <span className="text-4xl">{getIcon(weather.icon)}</span>
          <div>
            <p className="font-bold text-lg">{weather.condition} <span className="text-blue-100 text-sm ml-1">({weather.temperature})</span></p>
            <p className="text-xs text-blue-50 opacity-90">{weather.advice}</p>
          </div>
       </div>
    </div>
  );
};

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'food': return <span className="text-xl">🍜</span>;
    case 'sightseeing': return <span className="text-xl">📸</span>;
    case 'transport': return <span className="text-xl">🚗</span>;
    case 'accommodation': return <span className="text-xl">🛏</span>;
    case 'relax': return <span className="text-xl">☕️</span>;
    default: return <span className="text-xl">📍</span>;
  }
};

const ItineraryView: React.FC<ItineraryViewProps> = ({ data, onReset }) => {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto pb-32 animate-fadeIn">
      {/* Header Card */}
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden mb-6 relative group">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500"></div>
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {data.tripTitle}
              </h1>
              <div className="flex gap-2">
                 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                    {data.days.length} 天行程
                 </span>
              </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-400 mb-6">
             <p className="text-gray-700 text-sm md:text-base leading-relaxed italic">
                "{data.summary}"
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">💰 预估总花费</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-900">{data.totalEstimatedCost}</span>
                    <span className="text-sm font-bold text-emerald-700">{data.currency}</span>
                 </div>
                 <p className="text-xs text-emerald-600/80 mt-1">{data.budgetAnalysis}</p>
              </div>
              <div className="absolute right-0 bottom-0 text-6xl opacity-10">¥</div>
            </div>
             
             <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex flex-col justify-center">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">📊 规划来源</p>
                <div className="text-indigo-900 font-bold text-xs leading-relaxed">
                   基于小红书/携程实时口碑<br/>
                   结合 Google Search 实时票价
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="sticky top-20 z-30 bg-[#F8F9FF]/95 backdrop-blur-md py-2 -mx-4 px-4 mb-2">
        <div className="flex overflow-x-auto gap-3 no-scrollbar snap-x pb-2 pt-1">
            {data.days.map((day, index) => (
            <button
                key={day.dayNumber}
                onClick={() => setActiveDay(index)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all snap-start border ${
                activeDay === index
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform scale-105'
                    : 'bg-white text-gray-500 border-gray-200 shadow-sm hover:bg-gray-50'
                }`}
            >
                第 {day.dayNumber} 天
            </button>
            ))}
        </div>
      </div>

      {/* Weather Module for Active Day */}
      <div className="animate-fadeIn">
        <WeatherWidget weather={data.days[activeDay].weather} />
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-6 min-h-[500px]">
        <div className="flex items-center justify-between mb-8 border-b border-dashed border-gray-200 pb-4">
            <div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Day {data.days[activeDay].dayNumber} Theme</span>
                <h3 className="text-xl font-black text-gray-800 mt-0.5">{data.days[activeDay].theme}</h3>
            </div>
        </div>

        <div className="space-y-0 relative">
          {/* Continuous Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100"></div>

          {data.days[activeDay].activities.map((activity, idx) => (
            <div key={idx} className="relative pl-14 pb-10 last:pb-0 group">
              {/* Icon Bubble */}
              <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-200">
                <ActivityIcon type={activity.type} />
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-5 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 duration-300">
                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900 bg-gray-200/50 px-2 py-0.5 rounded text-center min-w-[3rem]">
                            {activity.time}
                        </span>
                        <h4 className="text-lg font-bold text-gray-800">{activity.activityName}</h4>
                    </div>
                    {activity.costEstimate !== '0' && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 whitespace-nowrap">
                            约 {activity.costEstimate} {data.currency}
                        </span>
                    )}
                </div>

                {/* Tags and Location */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <span className="mr-1">📍</span>
                    <span className="truncate max-w-[200px]">{activity.location}</span>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{activity.description}</p>
                
                {/* Specific Modules */}
                <div className="space-y-3">
                    {/* Transport Detail */}
                    {activity.transportDetail && (
                        <div className="text-xs bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100 flex gap-2 items-start">
                             <span className="shrink-0 text-lg">🚌</span>
                             <div>
                                 <span className="font-bold block mb-1 text-blue-900">路线指引:</span>
                                 {activity.transportDetail}
                             </div>
                        </div>
                    )}

                    {/* Xiaohongshu/Reviews Note */}
                    {activity.xiaohongshuNote && (
                        <div className="text-xs bg-red-50 text-red-800 p-3 rounded-xl border border-red-100 flex gap-2 items-start relative overflow-hidden">
                            {/* Decorative quotes */}
                            <span className="absolute top-0 right-2 text-4xl text-red-100 font-serif opacity-50">”</span>
                            <span className="shrink-0 text-lg">📕</span>
                            <div>
                                <span className="font-bold block mb-1 text-red-900">网友避雷/种草:</span>
                                {activity.xiaohongshuNote}
                            </div>
                        </div>
                    )}

                    {/* Grid for booking and tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {activity.bookingAdvice && (
                            <div className="text-xs bg-purple-50 text-purple-800 p-2.5 rounded-lg border border-purple-100 flex gap-2 items-start">
                                <span className="shrink-0">🎫</span>
                                <span>{activity.bookingAdvice}</span>
                            </div>
                        )}
                        {activity.tips && (
                            <div className="text-xs bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-100 flex gap-2 items-start">
                                <span className="shrink-0">💡</span>
                                <span>{activity.tips}</span>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

       {/* Packing List */}
       <div className="mt-6 bg-white rounded-[2rem] shadow-lg p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎒</span> 
                <span>出行必备清单</span>
                <span className="text-xs font-normal text-gray-400 ml-auto">已根据同行人员优化</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.packingList.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2.5 rounded-xl border border-gray-100">
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-transparent hover:bg-blue-500"></div>
                        </div>
                        {item}
                    </div>
                ))}
            </div>
       </div>

       {/* Sources */}
       {data.sourceUrls && data.sourceUrls.length > 0 && (
         <div className="mt-8 px-4 text-center">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest font-bold">参考信息来源 (Google Search)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {data.sourceUrls.map((source, i) => (
                <a 
                  key={i} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-gray-500 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 px-3 py-1 rounded-full transition-all truncate max-w-[150px]"
                >
                  {source.title}
                </a>
              ))}
            </div>
         </div>
       )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none">
        <button
          onClick={onReset}
          className="pointer-events-auto bg-gray-900 text-white pl-6 pr-8 py-4 rounded-full shadow-2xl shadow-gray-900/40 font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all ring-4 ring-white"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          策划新旅程
        </button>
      </div>
    </div>
  );
};

export default ItineraryView;
