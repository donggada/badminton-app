import React, { useState, useEffect } from 'react';
import MatchingRoomListScreen from './components/MatchingRoomListScreen';
import MatchingRoomScreen from './components/MatchingRoomScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ConfirmModal from './components/ConfirmModal';
import SplashScreen from './components/SplashScreen';
import badmintonCourtIcon from './assets/logo4.png';
import { getMatchingRoom } from './services/Axios';

function App() {
  const [activeScreen, setActiveScreen] = useState('splash');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [tempRoomId, setTempRoomId] = useState(null);
  const [matchingRoomData, setMatchingRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSplashFinish = () => {
    setActiveScreen(isLoggedIn ? 'matching-room-list' : 'login');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
    setActiveScreen('matching-room-list');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setActiveScreen('login');
  };

  const handleRoomClick = async (roomId) => {
    setTempRoomId(roomId);
    setShowJoinConfirm(true);
  };

  const handleConfirmJoin = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMatchingRoom(tempRoomId);
      console.log('Matching Room Data:', response); // 데이터 확인용 로그
      
      if (!response) {
        throw new Error('매칭룸 정보를 찾을 수 없습니다.');
      }

      // API 응답 데이터 구조에 맞게 설정
      const roomData = {
        id: response.id,
        name: response.name,
        isManager: response.isManager,
        enterMebmerList: response.enterMebmerList || [],
        groupList: response.groupList || []
      };

      setMatchingRoomData(roomData);
      setSelectedRoomId(tempRoomId);
      setShowJoinConfirm(false);
      setActiveScreen('matching-room');
    } catch (err) {
      console.error('Failed to fetch matching room:', err);
      setError(err.response?.data?.message || err.message || '매칭룸 정보를 불러오는데 실패했습니다.');
      setShowJoinConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelJoin = () => {
    setShowJoinConfirm(false);
    setTempRoomId(null);
  };

  const handleExitRoom = () => {
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    setSelectedRoomId(null);
    setMatchingRoomData(null);
    setActiveScreen('matching-room-list');
    setShowExitConfirm(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  if (activeScreen === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!isLoggedIn) {
    if (showRegister) {
      return <RegisterScreen 
        onRegisterSuccess={handleLoginSuccess} 
        onBackToLogin={() => setShowRegister(false)} 
      />;
    }
    return <LoginScreen 
      onLoginSuccess={handleLoginSuccess} 
      onRegisterClick={() => setShowRegister(true)} 
    />;
  }

  const renderScreen = () => {
    console.log('Current screen:', activeScreen);
    console.log('Matching room data:', matchingRoomData);

    switch (activeScreen) {
      case 'matching-room-list':
        return (
          <MatchingRoomListScreen
            onRoomClick={handleRoomClick}
            onProfileClick={() => setActiveScreen('profile')}
            onLogout={handleLogout}
          />
        );
      case 'matching-room':
        if (loading) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          );
        }
        if (error) {
          return (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-600">{error}</p>
            </div>
          );
        }
        if (!matchingRoomData) {
          return (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600">매칭룸 정보를 불러오는 중입니다...</p>
            </div>
          );
        }
        return (
          <MatchingRoomScreen
            onExitRoom={handleExitRoom}
            onStartMatching={() => {
              console.log('Start matching');
              // TODO: 매칭 시작 API 호출
            }}
            onJoinMatching={() => {
              console.log('Join matching');
              // TODO: 매칭 참가 API 호출
            }}
            isManager={matchingRoomData.isManager}
            roomData={matchingRoomData}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onReturnClick={() => setActiveScreen('matching-room-list')}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* 로고 영역 */}
      <div className="w-full bg-white shadow-sm">
        <div className="w-full px-4 py-2">
          <div className="flex items-center justify-start">
            <img src={badmintonCourtIcon} alt="NEXTCOCK" className="h-24 w-24 sm:h-36 sm:w-36 object-contain" />
          </div>
        </div>
      </div>
      
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 w-full">
        {renderScreen()}
      </div>
      
      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around w-full">
          <button 
            className={`flex flex-col items-center py-2 sm:py-3 px-4 sm:px-6 ${activeScreen === 'matching-room-list' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveScreen('matching-room-list')}
          >
            <div className="relative h-5 w-5 sm:h-6 sm:w-6 mb-1">
              <div className="absolute inset-x-0 bottom-0 h-2.5 sm:h-3 bg-current rounded-sm"></div>
              <div className="absolute inset-0 border-t-4 border-current" style={{ borderRadius: '50% 50% 0 0' }}></div>
            </div>
            <span className="text-xs font-medium">홈</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 sm:py-3 px-4 sm:px-6 ${activeScreen === 'matching' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveScreen('matching-room-list')}
          >
            <div className="relative h-5 w-5 sm:h-6 sm:w-6 mb-1">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium">검색</span>
          </button>
          
          <button 
            className={`flex flex-col items-center py-2 sm:py-3 px-4 sm:px-6 ${activeScreen === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveScreen('profile')}
          >
            <div className="relative h-5 w-5 sm:h-6 sm:w-6 mb-1">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-current rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 sm:w-5 h-2.5 sm:h-3 bg-current rounded-t-full"></div>
            </div>
            <span className="text-xs font-medium">마이페이지</span>
          </button>
        </div>
      </div>

      {/* 모달들 */}
      <ConfirmModal
        isOpen={showExitConfirm}
        onClose={handleCancelExit}
        onConfirm={handleConfirmExit}
        title="매칭방 나가기"
        message="매칭방을 나가시겠습니까?"
      />

      <ConfirmModal
        isOpen={showJoinConfirm}
        onClose={handleCancelJoin}
        onConfirm={handleConfirmJoin}
        title="매칭방 참여"
        message="매칭방에 참여하시겠습니까?"
      />
    </div>
  );
}

export default App;