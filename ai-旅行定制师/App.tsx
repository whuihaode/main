import React, { useState } from 'react';
import StepWizard from './components/StepWizard';
import ItineraryView from './components/ItineraryView';
import LoadingScreen from './components/LoadingScreen';
import { UserPreferences, ItineraryResult } from './types';
import { generateItinerary } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'wizard' | 'loading' | 'result'>('wizard');
  const [itinerary, setItinerary] = useState<ItineraryResult | null>(null);

  const handleItineraryGeneration = async (prefs: UserPreferences) => {
    setView('loading');
    try {
      const result = await generateItinerary(prefs);
      setItinerary(result);
      setView('result');
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("生成行程时出现问题，请重试。");
      setView('wizard');
    }
  };

  const resetApp = () => {
    setItinerary(null);
    setView('wizard');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-gray-900 font-sans selection:bg-blue-100 relative overflow-x-hidden">
        {/* Abstract Background Shapes */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-3xl"></div>
        </div>

      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md z-40 border-b border-white/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="font-bold text-gray-800 tracking-tight text-lg">Wanderlust AI</span>
            </div>
            {view === 'result' && (
                <button 
                  onClick={() => window.print()}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="打印或保存PDF"
                  title="打印行程"
                >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
            )}
        </div>
      </header>

      <main className="pt-24 px-4 pb-12 max-w-4xl mx-auto relative z-10">
        {view === 'wizard' && (
            <div className="fade-in">
                <div className="text-center mb-10 mt-6">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                        秒速规划您的<br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            梦幻之旅
                        </span>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
                        告诉我们您的喜好，AI 将为您量身打造包含<br className="hidden md:inline"/>详细费用预算的每日行程。
                    </p>
                </div>
                <StepWizard onComplete={handleItineraryGeneration} isLoading={false} />
            </div>
        )}

        {view === 'loading' && <LoadingScreen />}

        {view === 'result' && itinerary && (
          <ItineraryView data={itinerary} onReset={resetApp} />
        )}
      </main>
    </div>
  );
};

export default App;