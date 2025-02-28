import React from 'react';

const ProfileScreen = ({ onReturnClick, onProfileClick }) => {
  return (
    <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
      <div className="bg-blue-50 p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold text-blue-600">프로필</h2>
        <p className="text-gray-500">내 정보</p>
      </div>
      
      <div className="p-4">
        <div className="flex space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full overflow-hidden">
            <img src="/profile-placeholder.png" alt="프로필" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-700">김배드</h3>
            <p className="text-gray-500 text-sm">배드민턴 애호가</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="font-medium">이름</span>
            <span className="text-gray-600">김배드</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="font-medium">레벨</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">중급자</span>
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="font-medium">경기 수</span>
            <span className="text-gray-600">24</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
            <span className="font-medium">승/패</span>
            <span className="text-gray-600">16/8</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            className="w-1/2 bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
            onClick={onReturnClick}
          >
            돌아가기
          </button>
          <button 
            className="w-1/2 bg-gray-200 text-gray-800 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-300"
            onClick={onProfileClick}
          >
            프로필
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;