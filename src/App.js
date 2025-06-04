import React, { useState, useEffect, useCallback } from 'react';
import MatchingRoomListScreen from './components/MatchingRoomListScreen';
import MatchingRoomScreen from './components/MatchingRoomScreen';
import ProfileScreen from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ConfirmModal from './components/ConfirmModal';
import SplashScreen from './components/SplashScreen';
import badmintonCourtIcon from './assets/logo4.png';
import { getMatchingRoom, joinMatchingRoomByEntryCode, joinMatchingRoom } from './services/Axios';
import { QrCodeIcon, XMarkIcon } from '@heroicons/react/24/outline';

function App() {
  const [activeScreen, setActiveScreen] = useState('splash');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [showEntryCodeModal, setShowEntryCodeModal] = useState(false);
  const [entryCode, setEntryCode] = useState('');
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

  const refreshRoomData = async () => {
    if (!selectedRoomId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getMatchingRoom(selectedRoomId);
      
      if (!response) {
        throw new Error('매칭룸 정보를 찾을 수 없습니다.');
      }

      const roomData = {
        id: response.id,
        name: response.name,
        isManager: response.isManager,
        enterMebmerList: response.enterMebmerList || [],
        groupList: response.groupList || [],
        entryCode: response.entryCode
      };

      setMatchingRoomData(roomData);
    } catch (err) {
      console.error('Failed to refresh room data:', err);
      setError(err.response?.data?.message || err.message || '매칭룸 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      const response = await joinMatchingRoom(tempRoomId);
      
      if (!response) {
        throw new Error('매칭룸 정보를 찾을 수 없습니다.');
      }

      const roomData = {
        id: response.id,
        name: response.name,
        isManager: response.isManager,
        enterMebmerList: response.enterMebmerList || [],
        groupList: response.groupList || [],
        entryCode: response.entryCode
      };

      setMatchingRoomData(roomData);
      setSelectedRoomId(response.id);
      setShowJoinConfirm(false);
      setActiveScreen('matching-room');
    } catch (err) {
      console.error('Failed to join matching room:', err);
      setError(err.response?.data?.message || err.message || '매칭룸 입장에 실패했습니다.');
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
    setSelectedRoomId(null);
    setMatchingRoomData(null);
    setActiveScreen('matching-room-list');
  };

  const handleEntryCodeSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await joinMatchingRoomByEntryCode(entryCode);
      
      if (!response) {
        throw new Error('매칭룸 정보를 찾을 수 없습니다.');
      }

      const roomData = {
        id: response.id,
        name: response.name,
        isManager: response.isManager,
        enterMebmerList: response.enterMebmerList || [],
        groupList: response.groupList || [],
        entryCode: response.entryCode
      };

      setMatchingRoomData(roomData);
      setSelectedRoomId(response.id);
      setShowEntryCodeModal(false);
      setEntryCode('');
      setActiveScreen('matching-room');
    } catch (err) {
      console.error('Failed to join room with entry code:', err);
      setError(err.response?.data?.message || err.message || '매칭룸 입장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToMatchingRoom = useCallback(async (roomId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMatchingRoom(roomId);
      
      if (!response) {
        throw new Error('매칭룸 정보를 찾을 수 없습니다.');
      }

      const roomData = {
        id: response.id,
        name: response.name,
        isManager: response.isManager,
        enterMebmerList: response.enterMebmerList || [],
        groupList: response.groupList || [],
        entryCode: response.entryCode
      };

      setMatchingRoomData(roomData);
      setSelectedRoomId(roomId);
      setActiveScreen('matching-room');
      // URL 업데이트
      window.history.replaceState({}, '', `/matching-room/${roomId}`);
    } catch (error) {
      console.error('Failed to navigate to matching room:', error);
      setError(error.response?.data?.message || error.message || '매칭방 입장에 실패했습니다.');
      setActiveScreen('matching-room-list');
      window.history.replaceState({}, '', '/');
    } finally {
      setLoading(false);
    }
  }, []);

  // 페이지 로드 시 URL 확인
  useEffect(() => {
    const path = window.location.pathname;
    const matchingRoomMatch = path.match(/^\/matching-room\/(\d+)$/);
    
    if (matchingRoomMatch) {
      const roomId = matchingRoomMatch[1];
      handleNavigateToMatchingRoom(roomId);
    } else if (path === '/') {
      setActiveScreen('matching-room-list');
    }
  }, []);

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setActiveScreen('matching-room-list');
        setMatchingRoomData(null);
        setSelectedRoomId(null);
      } else {
        const matchingRoomMatch = path.match(/^\/matching-room\/(\d+)$/);
        if (matchingRoomMatch) {
          const roomId = matchingRoomMatch[1];
          handleNavigateToMatchingRoom(roomId);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleNavigateToMatchingRoom]);

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
              // TODO: 매칭 시작 API 호출
            }}
            isManager={matchingRoomData.isManager}
            roomData={matchingRoomData}
            onNavigateToMatchingRoom={() => setActiveScreen('matching-room-list')}
            onRefreshRoomData={refreshRoomData}
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
            className={`flex flex-col items-center py-2 sm:py-3 px-4 sm:px-6 text-gray-500 hover:text-blue-600`}
            onClick={() => setShowEntryCodeModal(true)}
          >
            <div className="relative h-5 w-5 sm:h-6 sm:w-6 mb-1">
              <QrCodeIcon className="w-full h-full" />
            </div>
            <span className="text-xs font-medium">입장코드</span>
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
        isOpen={showJoinConfirm}
        onClose={handleCancelJoin}
        onConfirm={handleConfirmJoin}
        title="매칭방 참여"
        message="매칭방에 참여하시겠습니까?"
      />

      {/* 입장코드 모달 */}
      {showEntryCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">입장코드로 참여</h2>
              <button
                onClick={() => {
                  setShowEntryCodeModal(false);
                  setEntryCode('');
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="entryCode" className="block text-sm font-medium text-gray-700 mb-2">
                  매칭방 입장코드
                </label>
                <input
                  type="text"
                  id="entryCode"
                  value={entryCode}
                  onChange={(e) => setEntryCode(e.target.value)}
                  placeholder="입장코드를 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 mb-4">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEntryCodeModal(false);
                  setEntryCode('');
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleEntryCodeSubmit}
                disabled={!entryCode.trim() || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '입장 중...' : '입장하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;