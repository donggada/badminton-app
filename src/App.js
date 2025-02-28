import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import MatchingScreen from './components/MatchingScreen';
import ProfileScreen from './components/ProfileScreen';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center space-x-4">
          {/* 배드민턴 라켓 로고 */}
          <div className="relative h-40 w-16">
            <div className="bg-blue-500 h-32 w-6 rounded-b-lg absolute left-5"></div>
            <div className="bg-blue-600 h-16 w-16 rounded-full absolute top-0"></div>
            <div className="bg-blue-400 h-12 w-12 rounded-full absolute top-2 left-2"></div>
            <div className="absolute top-14 left-6 w-4 h-20 bg-gray-200 rounded-b-lg"></div>
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
      
      <div className="mt-8 flex items-center space-x-8">
        {/* 셔틀콕 아이콘 */}
        <div className="relative h-12 w-12">
          <div className="absolute bottom-0 w-6 h-6 bg-white rounded-full left-3"></div>
          <div className="absolute bottom-4 w-12 h-8 bg-white border-t border-gray-300 rounded-t-full"></div>
        </div>
        
        {/* 배드민턴 라켓 */}
        <div className="relative h-36 w-16">
          <div className="bg-blue-500 h-28 w-4 rounded-b-lg absolute left-6"></div>
          <div className="bg-blue-600 h-16 w-16 rounded-full absolute top-0"></div>
          <div className="bg-blue-400 h-12 w-12 rounded-full absolute top-2 left-2"></div>
          <div className="absolute top-14 left-7 w-2 h-20 bg-gray-200 rounded-b-lg"></div>
        </div>
        
        {/* 셔틀콕 아이콘 */}
        <div className="relative h-12 w-12">
          <div className="absolute bottom-0 w-6 h-6 bg-white rounded-full left-3"></div>
          <div className="absolute bottom-4 w-12 h-8 bg-white border-t border-gray-300 rounded-t-full"></div>
        </div>
      </div>
    </div>
  );
}

export default App;