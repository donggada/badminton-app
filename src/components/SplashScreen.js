import React, { useEffect, useState } from 'react';
import badmintonCourtIcon from '../assets/logo4.png';

function SplashScreen({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // 페이드아웃 애니메이션 후 콜백 실행
    }, 2000); // 2초 동안 스플래시 화면 표시

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 bg-white flex items-center justify-center transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="flex flex-col items-center">
        <img 
          src={badmintonCourtIcon} 
          alt="NEXTCOCK" 
          className="w-32 h-32 sm:w-48 sm:h-48 object-contain animate-bounce"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
          NEXTCOCK
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          당신의 배드민턴 파트너
        </p>
      </div>
    </div>
  );
}

export default SplashScreen; 