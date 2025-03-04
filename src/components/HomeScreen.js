import React from 'react';
import shuttlecockIcon from './assets//shuttlecock-icon.jpg'; // 셔틀콕 아이콘 import
import badmintonCourtIcon from './assets/badminton-court.jpg'; // 배드민턴 코트 아이콘 import

const HomeScreen = ({ waitingList, onStartMatching }) => {
  // 대기 목록을 4개씩 그룹화
  const chunkedWaitingList = [];
  for (let i = 0; i < waitingList.length; i += 4) {
    chunkedWaitingList.push(waitingList.slice(i, i + 4));
  }

  return (
    <div className="bg-white rounded-lg p-6 text-gray-800 w-full max-w-md shadow-lg mb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {/* 배드민턴 코트와 셔틀콕 이미지 */}
          <div className="h-24 w-24">
            <img src={badmintonCourtIcon} alt="배드민턴 코트" className="w-full h-full object-contain" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-1 text-blue-600">배드민턴</h1>
          <p className="text-sm text-gray-500">함께하는 배드민턴</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-2 text-blue-700">홈 화면</h2>
      <h3 className="text-lg font-medium mb-4 text-blue-600">대기 목록</h3>
      
      {chunkedWaitingList.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex justify-between mb-4">
          {row.map((player) => (
            <div 
              key={player.id} 
              className="bg-blue-500 rounded-full w-16 h-16 flex flex-col items-center justify-center text-center shadow-md"
            >
              <span className="text-xs font-medium text-white">{player.name}</span>
              <span className="text-xs text-blue-100">{player.time}</span>
            </div>
          ))}
        </div>
      ))}
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-blue-600">매칭 상태</h3>
        <div className="bg-gray-100 rounded-lg p-3 border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">현재 상태</span>
            <span className="text-blue-600">준비 완료</span>
          </div>
          
          {/* 매칭된 사람들 */}
          <div className="mt-3 border-t border-blue-100 pt-3">
            <p className="text-sm text-gray-600 mb-2">매칭된 사람들</p>
            
            {/* 첫 번째 매칭 그룹 */}
            <div className="flex justify-between mb-2">
              <div className="flex space-x-1">
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  홍길동
                </div>
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  김철수
                </div>
              </div>
              <div className="text-sm text-blue-600 flex items-center">VS</div>
              <div className="flex space-x-1">
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  이영희
                </div>
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  박민수
                </div>
              </div>
            </div>
            
            {/* 두 번째 매칭 그룹 */}
            <div className="flex justify-between">
              <div className="flex space-x-1">
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  정준호
                </div>
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  최지은
                </div>
              </div>
              <div className="text-sm text-blue-600 flex items-center">VS</div>
              <div className="flex space-x-1">
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  대기자1
                </div>
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white text-xs">
                  대기자2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 셔틀콕 모양이 있는 매칭 시작 버튼 */}
      <button 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center shadow-md transition-colors duration-300"
        onClick={onStartMatching}
      >
        <img src={shuttlecockIcon} alt="셔틀콕" className="h-6 w-6 mr-2" />
        매칭 시작하기
      </button>
    </div>
  );
};

export default HomeScreen;