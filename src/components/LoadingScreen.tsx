import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8F6B]"></div>
    </div>
  );
};

export default LoadingScreen;