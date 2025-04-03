import React from 'react';

interface LoadingScreenProps {
  fullScreen?: boolean;
  isExiting?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullScreen = true, isExiting = false }) => {
  return (
    <div
      className={`flex items-center justify-center bg-white/80 backdrop-blur-sm ${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full py-12'
      } ${isExiting ? 'fade-exit' : 'fade-enter'}`}
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-t-[#dd2444] border-r-[#dd2444]/20 border-b-[#dd2444]/20 border-l-[#dd2444]0/20 animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-b-[#dd2444] border-l-[#dd2444]/20 border-t-[#dd2444]/20 border-r-[#dd2444]/20 animate-spin-reverse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;