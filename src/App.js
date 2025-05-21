import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import MatchingScreen from './components/MatchingScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import { getWaitingList } from './services/Axios';
import badmintonCourtIcon from './assets/logo4.png';

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [players] = useState([
    { id: 1, name: '홍길동', level: '중급자', img: '/profile-placeholder.png' },
    { id: 2, name: '김철수', level: '고급자', img: '/profile-placeholder.png' },
    { id: 3, name: '이영희', level: '초보자', img: '/profile-placeholder.png' },
    { id: 4, name: '박민수', level: '중급자', img: '/profile-placeholder.png' },
    { id: 5, name: '정준호', level: '고급자', img: '/profile-placeholder.png' },
    { id: 6, name: '최지은', level: '초보자', img: '/profile-placeholder.png' }
  ]);
  
  // const [waitingList] = useState([
  //   { id: 1, name: '대기자 1', time: '5분' },
  //   { id: 2, name: '대기자 2', time: '7분' },
  //   { id: 3, name: '대기자 3', time: '10분' },
  //   { id: 4, name: '대기자 4', time: '12분' },
  //   { id: 5, name: '대기자 5', time: '15분' },
  //   { id: 6, name: '대기자 6', time: '18분' },
  //   { id: 7, name: '대기자 7', time: '20분' },
  //   { id: 8, name: '대기자 8', time: '22분' },
  //   { id: 8, name: '대기자 8', time: '22분' },
  //   { id: 9, name: '대기자 9', time: '25분' }
  // ]);

  // API로 가져올 대기자 목록 상태
  const [waitingList, setWaitingList] = useState({
    id: 0,
    name: 'MINTON 소모임',
    enterMebmerList: [],
    groupList: [],
    isManager: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchWaitingList = async () => {
      try {
        setLoading(true);
        const response = await getWaitingList(2);
        setWaitingList(response);
        setError(null);
      } catch (err) {
        console.error('대기자 목록 가져오기 실패:', err);
        setError('대기자 목록을 불러오는데 문제가 발생했습니다.');
        setWaitingList({
          id: 0,
          name: 'MINTON 소모임',
          enterMebmerList: [],
          groupList: [],
          isManager: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaitingList();
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 p-4 pb-20">
      <div className="w-full max-w-md mb-0">
        <div className="flex items-center justify-start">
          <div className="-m-2">
            <img src={badmintonCourtIcon} alt="NEXTCOCK" className="h-36 w-36 object-contain" />
          </div>
        </div>
      </div>
      
      {activeScreen === 'home' && (
        <HomeScreen 
          waitingList={waitingList} 
          onStartMatching={() => setActiveScreen('matching')} 
          isManager={waitingList?.isManager}
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
          onLogout={handleLogout}
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