import React from 'react';
import { 
  UserCircleIcon, 
  ClockIcon, 
  CalendarIcon, 
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  TrophyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

function ProfileScreen({ onReturnClick, onLogout }) {
  // 임시 데이터 (실제로는 API에서 받아와야 함)
  const userData = {
    name: "홍길동",
    level: "중급",
    email: "hong@example.com",
    joinDate: "2024-01-01",
    totalMatches: 25,
    winRate: "68%",
    recentMatches: [
      { date: "2024-03-15", result: "승", opponent: "김철수", score: "21-18" },
      { date: "2024-03-14", result: "패", opponent: "이영희", score: "19-21" },
      { date: "2024-03-13", result: "승", opponent: "박지성", score: "21-15" },
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">마이페이지</h1>
            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 프로필 카드 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <UserCircleIcon className="h-16 w-16 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {userData.level}
                  </span>
                  <span className="text-sm text-gray-500">{userData.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>가입일: {userData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-2">
                <TrophyIcon className="h-5 w-5 text-yellow-500" />
                <h3 className="text-sm font-medium text-gray-900">총 매칭</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{userData.totalMatches}회</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-5 w-5 text-green-500" />
                <h3 className="text-sm font-medium text-gray-900">승률</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{userData.winRate}</p>
            </div>
          </div>

          {/* 최근 매칭 기록 */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 매칭 기록</h3>
            <div className="space-y-3">
              {userData.recentMatches.map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      match.result === '승' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-sm font-medium ${
                        match.result === '승' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {match.result}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{match.opponent}</p>
                      <p className="text-xs text-gray-500">{match.score}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {match.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 설정 메뉴 */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-100">
              <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">계정 설정</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">매칭 기록</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* 뒤로가기 버튼 */}
          <button
            onClick={onReturnClick}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;