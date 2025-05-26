import React from 'react';
import { XMarkIcon, UserCircleIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function MatchingRoomScreen({ onExitRoom, onStartMatching, onJoinMatching, isManager, roomData }) {
  const renderWaitingList = () => {
    if (!roomData?.enterMebmerList?.length) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">대기 중인 플레이어가 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 gap-2">
        {roomData.enterMebmerList.map((player) => (
          <div 
            key={player.memberId} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-2">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-1 rounded-full mb-1">
                  <UserCircleIcon className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-gray-900 mb-1 truncate w-full">{player.name}</p>
                <div className="flex flex-col space-y-0.5 w-full">
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                    {player.level}
                  </span>
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                    {player.status}
                  </span>
                </div>
                <div className="flex items-center text-[10px] text-gray-500 mt-1">
                  <ClockIcon className="h-3 w-3 mr-0.5" />
                  <span>대기</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMatchedGroups = () => {
    if (!roomData?.groupList?.length) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">매칭된 그룹이 없습니다.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roomData.groupList.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">그룹 {group.id}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  코트 {group.courtNumber || '미정'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {group.memberList.map((player) => (
                  <div 
                    key={player.memberId} 
                    className="bg-gray-50 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="p-2">
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-50 p-1 rounded-full mb-1">
                          <UserCircleIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mb-1 truncate w-full">{player.name}</p>
                        <div className="flex flex-col space-y-0.5 w-full">
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                            {player.level}
                          </span>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                            {player.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {roomData?.name || '매칭룸'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={onExitRoom}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 대기 목록 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
              대기 목록
            </h2>
            {renderWaitingList()}
          </div>

          {/* 매칭된 그룹 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-green-600" />
              매칭된 그룹
            </h2>
            {renderMatchedGroups()}
          </div>

          {/* 매칭 버튼 */}
          <div className="mt-6 mb-4">
            {isManager ? (
              <button
                onClick={onStartMatching}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                매칭 시작하기
              </button>
            ) : (
              <button
                onClick={onJoinMatching}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                매칭 참가하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchingRoomScreen; 