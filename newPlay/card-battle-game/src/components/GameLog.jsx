import { motion } from 'framer-motion';

function GameLog({ logs }) {
  const getColorStyle = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 border-red-600';
      case 'blue':
        return 'bg-blue-500 border-blue-600';
      case 'black':
        return 'bg-gray-800 border-gray-900';
      default:
        return 'bg-gray-400 border-gray-500';
    }
  };

  const getColorName = (color) => {
    const colorMap = { red: '红', blue: '蓝', black: '黑' };
    return colorMap[color];
  };

  const getCounterText = (log) => {
    const texts = [];
    if (log.isPlayerCountered) texts.push('玩家被克制(-3)');
    if (log.isAICountered) texts.push('AI被克制(-3)');
    return texts.join('，');
  };

  return (
    <div className="bg-white rounded-xl p-4 h-[672px] flex flex-col shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">对战记录</h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {logs.map((log, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-100"
          >
            {/* 回合标题 */}
            <div className="text-gray-600 mb-2">
              第 {logs.length - index} 回合
            </div>

            {/* 卡牌展示区 */}
            <div className="flex justify-between mb-3">
              {/* 玩家卡牌 */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-18 rounded-lg ${getColorStyle(log.playerCard.color)}
                  border flex items-center justify-center text-white font-bold
                `}>
                  {log.playerCard.value}
                </div>
                <div className="text-gray-500 mt-1 text-xs">
                  玩家
                </div>
              </div>

              {/* VS */}
              <div className="flex items-center text-gray-400">
                VS
              </div>

              {/* AI卡牌 */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-18 rounded-lg ${getColorStyle(log.aiCard.color)}
                  border flex items-center justify-center text-white font-bold
                `}>
                  {log.aiCard.value}
                </div>
                <div className="text-gray-500 mt-1 text-xs">
                  AI
                </div>
              </div>
            </div>

            {/* 战斗过程 */}
            <div className="text-sm space-y-1">
              {/* 颜色相同提示 */}
              {log.playerCard.color === log.aiCard.color && (
                <div className="text-yellow-600">
                  双方出{getColorName(log.playerCard.color)}牌，比较点数
                </div>
              )}
              
              {/* 克制效果 */}
              {(log.isPlayerCountered || log.isAICountered) && (
                <div className="text-red-500">
                  {getCounterText(log)}
                </div>
              )}

              {/* 最终结果 */}
              <div className={`font-medium ${
                log.winner === 'player' ? 'text-green-600' :
                log.winner === 'ai' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {log.winner === 'player' && `玩家胜(${log.playerValue} vs ${log.aiValue})，造成${log.damage}伤害`}
                {log.winner === 'ai' && `AI胜(${log.playerValue} vs ${log.aiValue})，造成${log.damage}伤害`}
                {log.winner === 'draw' && '回合平局'}
              </div>

              {/* 生命值变化 */}
              <div className="text-gray-500 text-xs">
                玩家生命：{log.playerHealthAfter}/50，
                AI生命：{log.aiHealthAfter}/50
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 更新滚动条样式
const style = document.createElement('style');
style.textContent = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
`;
document.head.appendChild(style);

export default GameLog;
