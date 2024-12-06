function GameLog({ logs }) {
  const getColorName = (color) => {
    const colorMap = {
      red: '红色',
      blue: '蓝色',
      black: '黑色'
    };
    return colorMap[color];
  };

  const getLogMessage = (log) => {
    const { playerCard, aiCard, winner, damage, isPlayerCountered, isAICountered } = log;
    
    let message = `玩家出牌: ${getColorName(playerCard.color)}(${playerCard.value}) `;
    message += `VS AI出牌: ${getColorName(aiCard.color)}(${aiCard.value})\n`;

    if (isPlayerCountered) {
      message += `玩家的牌被克制，实际值变为${Math.max(0, playerCard.value - 3)}! `;
    }
    if (isAICountered) {
      message += `AI的牌被克制，实际值变为${Math.max(0, aiCard.value - 3)}! `;
    }

    if (winner === 'player') {
      message += `玩家获胜，造成${damage}点伤害！`;
    } else if (winner === 'ai') {
      message += `AI获胜，造成${damage}点伤害！`;
    } else {
      message += '平局！';
    }

    return message;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-h-60 overflow-y-auto">
      <h3 className="text-lg font-bold mb-2">游戏记录</h3>
      <div className="space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-500 italic">游戏尚未开始...</p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                log.winner === 'player'
                  ? 'bg-green-100'
                  : log.winner === 'ai'
                  ? 'bg-red-100'
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-sm whitespace-pre-line">
                <span className="font-medium">回合 {index + 1}:</span>
                <br />
                {getLogMessage(log)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GameLog;
