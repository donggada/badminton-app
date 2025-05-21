import React from 'react';

const MatchingScreen = ({ players, onHomeClick, onProfileClick }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">상호 매칭</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {players.slice(0, 4).map((player, idx) => (
          <div key={player.id} className="bg-gray-800 rounded-lg p-4 shadow border border-blue-900">
            <div className="flex justify-between items-center mb-2">
              <div className="w-16 h-16 bg-blue-900 rounded-full overflow-hidden">
                <img src={player.img} alt={player.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-xl font-bold text-blue-400">vs</div>
              <div className="w-16 h-16 bg-blue-900 rounded-full overflow-hidden">
                <img src={players[idx === 0 ? 1 : (idx === 1 ? 0 : (idx === 2 ? 3 : 2))].img} 
                     alt={players[idx === 0 ? 1 : (idx === 1 ? 0 : (idx === 2 ? 3 : 2))].name} 
                     className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="font-medium text-white">{player.name}</p>
                <p className="text-xs text-blue-400">{player.level}</p>
              </div>
              <div className="text-center">
                <p className="font-medium text-white">{players[idx === 0 ? 1 : (idx === 1 ? 0 : (idx === 2 ? 3 : 2))].name}</p>
                <p className="text-xs text-blue-400">{players[idx === 0 ? 1 : (idx === 1 ? 0 : (idx === 2 ? 3 : 2))].level}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-4 justify-center">
        <button 
          className="bg-blue-700 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-800 transition-colors duration-300"
          onClick={onHomeClick}
        >
          홈으로
        </button>
        <button 
          className="bg-blue-700 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-800 transition-colors duration-300"
          onClick={onProfileClick}
        >
          프로필
        </button>
      </div>
    </div>
  );
};

export default MatchingScreen;