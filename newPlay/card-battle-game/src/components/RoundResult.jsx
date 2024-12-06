import { motion, AnimatePresence } from 'framer-motion';

function RoundResult({ result }) {
  if (!result || !result.winner) return null;

  const getResultColor = (winner) => {
    switch (winner) {
      case 'player':
        return 'text-green-400';
      case 'ai':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getColorName = (color) => {
    const colorMap = {
      red: '红色',
      blue: '蓝色',
      black: '黑色'
    };
    return colorMap[color];
  };

  const getCounterEffect = () => {
    const effects = [];
    
    if (result.playerCard.color === result.aiCard.color) {
      effects.push(
        <motion.div
          key="same-color"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-yellow-400 font-bold text-lg"
        >
          双方都出了{getColorName(result.playerCard.color)}牌！仅比较点数
        </motion.div>
      );
    }
    
    if (result.isPlayerCountered) {
      effects.push(
        <motion.div
          key="player-counter"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-red-400 font-bold text-lg"
        >
          玩家的牌被克制！(-3)
        </motion.div>
      );
    }
    if (result.isAICountered) {
      effects.push(
        <motion.div
          key="ai-counter"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-red-400 font-bold text-lg"
        >
          AI的牌被克制！(-3)
        </motion.div>
      );
    }
    return effects;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-x-0 top-1/2 -mt-32"
      >
        <div className="relative max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="
              backdrop-blur-md bg-white/30 dark:bg-black/30
              rounded-xl shadow-lg border border-white/20
              p-6 relative z-10 overflow-hidden
              mx-4
            "
          >
            <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-white/40 to-black/40 opacity-50" />

            <div className="relative z-20">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center gap-8 mb-2 text-white text-lg"
              >
                <span>玩家出牌：{getColorName(result.playerCard.color)}</span>
                <span>AI出牌：{getColorName(result.aiCard.color)}</span>
              </motion.div>

              <div className="flex flex-col items-center gap-2 mb-4">
                {getCounterEffect()}
              </div>

              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="text-3xl font-bold mb-3 text-white drop-shadow-lg"
                >
                  <span className={getResultColor(result.winner)}>
                    {result.playerValue} VS {result.aiValue}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className={`
                    text-2xl font-bold 
                    ${getResultColor(result.winner)}
                    drop-shadow-lg
                  `}
                >
                  {result.winner === 'player' && (
                    <span>玩家获胜！造成 {result.damage} 点伤害</span>
                  )}
                  {result.winner === 'ai' && (
                    <span>AI获胜！造成 {result.damage} 点伤害</span>
                  )}
                  {result.winner === 'draw' && '回合平局！'}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RoundResult;
