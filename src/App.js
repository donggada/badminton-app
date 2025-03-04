import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import MatchingScreen from './components/MatchingScreen';
import ProfileScreen from './components/ProfileScreen';
import logoImage from './assets/logo.jpg'; // 로고 이미지 import

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [players] = useState([
    { id: 1, name: '홍길동', level: '중급자', img: '/profile-placeholder.png' },
    { id: 2, name: '김철수', level: '고급자', img: '/profile-placeholder.png' },
    { id: 3, name: '이영희', level: '초보자', img: '/profile-placeholder.png' },
    { id: 4, name: '박민수', level: '중급자', img: '/profile-placeholder.png' },
    { id: 5, name: '정준호', level: '고급자', img: '/profile-placeholder.png' },
    { id: 6, name: '최지은', level: '초보자', img: '/profile-placeholder.png' }
  ]);
  
  // 대기자 목록 확장
  const [waitingList] = useState([
    { id: 1, name: '대기자 1', time: '5분' },
    { id: 2, name: '대기자 2', time: '7분' },
    { id: 3, name: '대기자 3', time: '10분' },
    { id: 4, name: '대기자 4', time: '12분' },
    { id: 5, name: '대기자 5', time: '15분' },
    { id: 6, name: '대기자 6', time: '18분' },
    { id: 7, name: '대기자 7', time: '20분' },
    { id: 8, name: '대기자 8', time: '22분' },
    { id: 9, name: '대기자 9', time: '25분' }
  ]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pb-20">
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center space-x-4">
          {/* 배드민턴 라켓 로고를 이미지로 대체 */}
          <div className="h-16">
            <img src={logoImage} alt="배드민턴 로고" className="h-full object-contain" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-600">배드민턴</h1>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {activeScreen === 'home' && (
        <HomeScreen 
          waitingList={waitingList} 
          onStartMatching={() => setActiveScreen('matching')} 
        />
      )}
      
      {activeScreen === 'matching' && (
        <MatchingScreen 
          players={players} 
          onHomeClick={() => setActiveScreen('home')}
          onProfileClick={() => setActiveScreen('profile')}
        />
      )}
      
      {activeScreen === 'profile' && (
        <ProfileScreen 
          onReturnClick={() => setActiveScreen('home')}
          onProfileClick={() => setActiveScreen('matching')}
        />
      )}
      
      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around max-w-md mx-auto">
          <button 
            className={`flex flex-col items-center py-3 px-6 ${activeScreen === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveScreen('home')}
          >
            <div className="relative h-6 w-6 mb-1">
              {/* 홈 아이콘 - 집 모양 */}
              <div className="absolute inset-x-0 bottom-0 h-3 bg-current rounded-sm"></div>
              <div className="absolute inset-0 border-t-4 border-current" style={{ borderRadius: '50% 50% 0 0' }}></div>
            </div>
            <span className="text-xs font-medium">홈</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-6 ${activeScreen === 'matching' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveScreen('matching')}
          >
            <div className="relative h-6 w-6 mb-1">
              {/* 매칭 아이콘 - 셔틀콕 모양 */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-current rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-3 border-l border-r border-t border-current rounded-t-full"></div>
            </div>
            <span className="text-xs font-medium">매칭하기</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-3 px-6 ${activeScreen === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveScreen('profile')}
          >
            <div className="relative h-6 w-6 mb-1">
              {/* 마이페이지 아이콘 - 사람 모양 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-current rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-3 bg-current rounded-t-full"></div>
            </div>
            <span className="text-xs font-medium">마이페이지</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;