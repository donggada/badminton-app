import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getMatchingRoomList, createMatchingRoom } from '../services/Axios';

const MatchingRoomListScreen = ({ onRoomClick, onProfileClick, onLogout }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getMatchingRoomList();
      setRooms(response);
      setError(null);
    } catch (err) {
      console.error('매칭방 목록 가져오기 실패:', err);
      setError('매칭방 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useLayoutEffect(() => {
    fetchRooms();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRooms();
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      setErrorModal({
        show: true,
        message: '매칭방 이름을 입력해주세요.'
      });
      return;
    }

    try {
      setIsCreating(true);
      console.log('Creating room with name:', newRoomName);
      const response = await createMatchingRoom(newRoomName.trim());
      if (response) {
        setRooms(prevRooms => [...prevRooms, response]);
        setShowCreateModal(false);
        setNewRoomName('');
        handleRefresh();
      }
    } catch (err) {
      console.error('Failed to create room:', err);
      let errorMessage = '매칭방 생성에 실패했습니다.';
      
      if (err.response) {
        // 서버에서 반환한 에러 메시지가 있는 경우
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        errorMessage = '서버와 통신할 수 없습니다. 인터넷 연결을 확인해주세요.';
      }
      
      setErrorModal({
        show: true,
        message: errorMessage
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredRooms = rooms.filter(room => 
    room && room.name && room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
        <div className="text-base sm:text-lg text-gray-600">매칭방 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">매칭방 목록</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                매칭방 만들기
              </button>
              <button
                onClick={handleRefresh}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 transition-colors"
                disabled={refreshing}
              >
                <svg 
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${refreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* 검색창 */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="매칭방 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 w-full px-3 sm:px-4 py-4 sm:py-6">
        {error && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-600">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base">{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs sm:text-sm text-red-600 hover:text-red-800"
            >
              다시 시도
            </button>
          </div>
        )}

        <div className="space-y-2 sm:space-y-3">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onRoomClick(room.id)}
              className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5 sm:mb-1">{room.name}</h2>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{room.memberCount}명 참여중</span>
                  </div>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && !error && (
          <div className="text-center py-8 sm:py-12">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-base sm:text-lg text-gray-500">
              {searchQuery ? '검색 결과가 없습니다' : '현재 활성화된 매칭방이 없습니다'}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-600 hover:text-blue-800"
            >
              새로고침
            </button>
          </div>
        )}
      </div>

      {/* 매칭방 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">매칭방 만들기</h2>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="매칭방 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewRoomName('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {isCreating ? '생성 중...' : '생성하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 에러 모달 */}
      {errorModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-red-600">오류</h2>
              <button
                onClick={() => setErrorModal({ show: false, message: '' })}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-gray-700">{errorModal.message}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setErrorModal({ show: false, message: '' })}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingRoomListScreen; 