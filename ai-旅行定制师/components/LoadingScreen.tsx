import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6">
      <div className="relative w-32 h-32 mb-10">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl animate-bounce">✈️</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">正在规划您的完美旅程...</h3>
      <div className="h-1 w-48 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-blue-500 animate-progress"></div>
      </div>
      <p className="text-gray-500 text-center text-sm font-medium animate-pulse">
        正在查询景点票价...<br/>
        寻找当地人推荐的美食...<br/>
        计算最佳交通路线...
      </p>
    </div>
  );
};

export default LoadingScreen;