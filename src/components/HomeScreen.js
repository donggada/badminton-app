import React from 'react';
import shuttlecockIcon from './assets//logo3.png';


const HomeScreen = ({ waitingList, onStartMatching, onJoinMatching, isManager }) => {
  console.log('HomeScreen isManager:', isManager);
  console.log('HomeScreen waitingList:', waitingList);
  // 오늘 날짜 포맷팅
  const today = new Date();
  const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  // 대기자 목록 표시
  const renderWaitingList = () => {
    if (!waitingList || !waitingList.enterMebmerList) return null;
    
    const chunkedWaitingList = [];
    for (let i = 0; i < waitingList.enterMebmerList.length; i += 4) {
      chunkedWaitingList.push(waitingList.enterMebmerList.slice(i, i + 4));
    }

    return (
      <>
        <h3 className="text-lg font-medium mb-4 text-black">대기 목록</h3>
        {chunkedWaitingList.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-between mb-4">
            {row.map((player) => (
              <div 
                key={player.memberId} 
                className="bg-gray-300 border-2 border-black rounded-full w-16 h-16 flex flex-col items-center justify-center text-center shadow-md"
              >
                <span className="text-xs font-bold text-black">{player.name}</span>
                <span className="text-xs font-bold text-black">{player.level}</span>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  };

  // 매칭된 그룹 표시
  const renderMatchedGroups = () => {
    if (!waitingList || !waitingList.groupList) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-black">매칭된 그룹</h3>
        {waitingList.groupList.map((group, groupIndex) => (
          <div key={group.id} className="bg-gray-300 rounded-lg p-3 border-2 border-black mb-4">
            <div className="flex justify-between">
              <div className="flex space-x-1">
                {group.memberList.slice(0, 2).map((member) => (
                  <div key={member.memberId} 
                    className="bg-gray-300 border-2 border-black rounded-full w-14 h-14 flex items-center justify-center text-black text-sm font-bold"
                  >
                    {member.name}
                  </div>
                ))}
              </div>
              <div className="text-sm text-black flex items-center font-bold">VS</div>
              <div className="flex space-x-1">
                {group.memberList.slice(2, 4).map((member) => (
                  <div key={member.memberId} 
                    className="bg-gray-300 border-2 border-black rounded-full w-14 h-14 flex items-center justify-center text-black text-sm font-bold"
                  >
                    {member.name}
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
    <div className="bg-white rounded-lg p-6 text-gray-900 w-full max-w-md shadow-lg mb-4">
      <div className="flex items-center justify-center mb-6">
        <div>
          <h1 className="text-xl font-bold mb-1 text-gray-900 text-center">{waitingList?.name || '모임'}</h1>
          <p className="text-sm text-gray-500 text-center">{formattedDate}</p>
        </div>
      </div>
      
      {renderWaitingList()}
      {renderMatchedGroups()}
      
      {isManager && (
        <button 
          className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-medium flex items-center justify-center shadow-md transition-colors duration-300 mt-6"
          onClick={onStartMatching}
        >
          <img src={shuttlecockIcon} alt="셔틀콕" className="h-6 w-6 mr-2" />
          매칭 시작하기
        </button>
      )}
      <button 
        className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-lg font-medium flex items-center justify-center shadow-md transition-colors duration-300 mt-3"
        onClick={onJoinMatching}
      >
        <img src={shuttlecockIcon} alt="셔틀콕" className="h-6 w-6 mr-2" />
        매칭 참가
      </button>
    </div>
  );
};

export default HomeScreen;