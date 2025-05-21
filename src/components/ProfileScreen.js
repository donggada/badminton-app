import React from 'react';

const ProfileScreen = ({ onReturnClick, onProfileClick, onLogout }) => {
  return (
    <div className="bg-black rounded-lg w-full max-w-md shadow-lg">
      <div className="bg-gray-900 p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-white">프로필</h2>
        <p className="text-gray-400">내 정보</p>
      </div>
      
      <div className="p-4">
        <div className="flex space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden">
            <img src="/profile-placeholder.png" alt="프로필" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">김배드</h3>
            <p className="text-gray-400 text-sm">배드민턴 애호가</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-2 bg-gray-900 rounded-lg">
            <span className="font-medium text-white">이름</span>
            <span className="text-gray-300">김배드</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-900 rounded-lg">
            <span className="font-medium text-white">레벨</span>
            <div className="flex items-center">
              <span className="text-gray-300 mr-2">중급자</span>
              <div className="w-4 h-4 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-900 rounded-lg">
            <span className="font-medium text-white">경기 수</span>
            <span className="text-gray-300">24</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-900 rounded-lg">
            <span className="font-medium text-white">승/패</span>
            <span className="text-gray-300">16/8</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            className="w-full bg-white text-black py-2 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300"
            onClick={onLogout}
          >
            로그아웃
          </button>
          <div className="flex space-x-4">
            <button 
              className="w-1/2 bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
              onClick={onReturnClick}
            >
              돌아가기
            </button>
            <button 
              className="w-1/2 bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
              onClick={onProfileClick}
            >
              프로필
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;