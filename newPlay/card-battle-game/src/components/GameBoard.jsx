import { useState, useEffect } from 'react';
import Card from './Card';
import GameLog from './GameLog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  initializeGameState,
  calculateBattle,
  getAIMove,
  generateDeck
} from '../utils/gameLogic';
import HealthBar from './HealthBar';
import GameRules from './GameRules';
import RoundResult from './RoundResult';

// 添加一个问号卡牌组件
const PlaceholderCard = ({ position = "center" }) => (
  <motion.div
    className="w-24 h-36 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <span className="text-4xl text-gray-400 font-bold">?</span>
  </motion.div>
);

// 首先在组件顶部添加一个用于创建新牌堆的函数
const createNewDeck = () => {
  const colors = ['red', 'blue', 'black'];
  const values = [2, 3, 4, 5, 6, 7];
  let id = 1;
  const deck = [];

  for (let color of colors) {
    for (let value of values) {
      deck.push({ id: id++, color, value });
    }
  }

  // Fisher-Yates 洗牌算法
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

// 创建初始手牌的函数
const createInitialHand = (deck) => {
  const hand = [];
  const colorCounts = { red: 0, blue: 0, black: 0 };
  
  // 先为每种颜色选择一张牌
  for (const color of ['red', 'blue', 'black']) {
    const cardOfColor = deck.find(card => card.color === color);
    if (cardOfColor) {
      hand.push(cardOfColor);
      colorCounts[color]++;
      // 从牌堆中移除已选择的牌
      const index = deck.indexOf(cardOfColor);
      deck.splice(index, 1);
    }
  }

  return hand;
};

function GameBoard() {
  const [gameState, setGameState] = useState(() => {
    const initialDeck = createNewDeck();
    
    // 为玩家和AI创建包含三种颜色的初始手牌
    const playerHand = createInitialHand(initialDeck);
    const aiHand = createInitialHand(initialDeck);

    return {
      playerHealth: 50,
      aiHealth: 50,
      playerHand,
      aiHand,
      deck: initialDeck,
      roundResult: null,
      gameLog: [],
      isGameOver: false
    };
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardPlay = async (selectedCard) => {
    if (isAnimating || gameState.isGameOver) return;
    setIsAnimating(true);

    try {
      // 1. 选择AI的牌
      const aiCard = getAIMove(gameState.aiHand, selectedCard);

      // 2. 播放出牌动画
      setGameState(prev => ({
        ...prev,
        roundResult: {
          playerCard: selectedCard,
          aiCard,
          winner: null,
          playerValue: selectedCard.value,
          aiValue: aiCard.value,
          damage: 0,
          isPlayerCountered: false,
          isAICountered: false
        }
      }));

      // 3. 等待出牌动画完成
      await new Promise(resolve => setTimeout(resolve, 400));

      // 4. 计算战斗结果
      const battleResult = calculateBattle(selectedCard, aiCard);

      // 5. 显示战斗结果
      setGameState(prev => ({
        ...prev,
        roundResult: {
          ...prev.roundResult,
          ...battleResult
        }
      }));

      // 6. 等待结果展示
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 7. 更新游戏状态
      setGameState(prev => {
        const newPlayerHealth = battleResult.winner === 'ai' ? 
          prev.playerHealth - battleResult.damage : 
          prev.playerHealth;

        const newAIHealth = battleResult.winner === 'player' ? 
          prev.aiHealth - battleResult.damage : 
          prev.aiHealth;

        // 移除已使用的卡牌
        const newPlayerHand = prev.playerHand.filter(
          card => card.id !== selectedCard.id
        );
        const newAIHand = prev.aiHand.filter(
          card => card.id !== aiCard.id
        );

        // 获取当前牌堆
        let currentDeck = [...prev.deck];

        // 如果牌堆为空或剩余牌数不足，创建新牌堆
        if (currentDeck.length < 2) {
          currentDeck = createNewDeck();
        }

        // 为玩家和AI各抽一张牌
        if (newPlayerHand.length < 3) {
          const newCard = currentDeck.pop();
          if (newCard) {
            newPlayerHand.push(newCard);
          }
        }

        if (newAIHand.length < 3) {
          const newCard = currentDeck.pop();
          if (newCard) {
            newAIHand.push(newCard);
          }
        }

        // 创建回合记录
        const roundLog = {
          playerCard: selectedCard,
          aiCard,
          ...battleResult,
          playerHealthAfter: newPlayerHealth,
          aiHealthAfter: newAIHealth,
          remainingCards: currentDeck.length
        };

        return {
          ...prev,
          playerHealth: newPlayerHealth,
          aiHealth: newAIHealth,
          playerHand: newPlayerHand,
          aiHand: newAIHand,
          deck: currentDeck,
          roundResult: null,
          gameLog: [roundLog, ...prev.gameLog],
          isGameOver: newPlayerHealth <= 0 || newAIHealth <= 0
        };
      });

    } catch (error) {
      console.error('Error during card play:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  const startNewGame = () => {
    setGameState(initializeGameState());
  };

  const resetGame = () => {
    const newDeck = createNewDeck();
    const playerHand = createInitialHand(newDeck);
    const aiHand = createInitialHand(newDeck);

    setGameState({
      playerHealth: 50,
      aiHealth: 50,
      playerHand,
      aiHand,
      deck: newDeck,
      roundResult: null,
      gameLog: [],
      isGameOver: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-8xl mx-auto grid grid-cols-[300px_1fr_300px] gap-6">
        {/* 左侧规则栏 */}
        <div className="h-[calc(100vh-3rem)] sticky top-6">
          <GameRules />
        </div>

        {/* 中间游戏区域 */}
        <div className="flex flex-col">
          {/* 生命值显示 - 交换位置 */}
          <div className="flex justify-between mb-8">
            <div className="w-64">
              <motion.div 
                animate={{ 
                  scale: gameState.roundResult?.winner === 'ai' ? [1, 1.05, 1] : 1 
                }}
                transition={{ duration: 0.3 }}
              >
                <HealthBar
                  current={gameState.playerHealth}
                  max={50}
                  isPlayer={true}
                />
              </motion.div>
            </div>
            <div className="w-64">
              <motion.div 
                animate={{ 
                  scale: gameState.roundResult?.winner === 'player' ? [1, 1.05, 1] : 1 
                }}
                transition={{ duration: 0.3 }}
              >
                <HealthBar
                  current={gameState.aiHealth}
                  max={50}
                  isPlayer={false}
                />
              </motion.div>
            </div>
          </div>

          {/* AI手牌区域 */}
          <div className="mb-8">
            <div className="flex justify-center gap-4">
              <AnimatePresence>
                {gameState.aiHand.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    isHidden={false}
                    position="ai"
                    custom={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 对战区域 */}
          <div className="my-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex justify-center items-start gap-16">
                {/* 玩家出牌区域 - 移到左侧 */}
                <div className="flex flex-col items-center w-1/3">
                  <AnimatePresence mode="wait">
                    {gameState.roundResult ? (
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card
                          key="player-played"
                          card={gameState.roundResult.playerCard}
                          position="player"
                          isPlayed={true}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-2 text-base whitespace-nowrap"
                        >
                          玩家：{getColorName(gameState.roundResult.playerCard.color)}
                          <span className="font-bold ml-1">
                            {gameState.roundResult.playerValue}
                          </span>
                          {gameState.roundResult.isPlayerCountered && (
                            <span className="text-red-500 ml-1">
                              (-3)
                            </span>
                          )}
                        </motion.div>
                      </motion.div>
                    ) : (
                      <PlaceholderCard />
                    )}
                  </AnimatePresence>
                </div>

                {/* VS 和结果区域 */}
                <div className="flex flex-col items-center w-1/3">
                  <motion.div 
                    className="text-3xl font-bold mb-4"
                    animate={{ 
                      scale: gameState.roundResult ? [1, 1.2, 1] : 1,
                      opacity: gameState.roundResult ? 1 : 0.5
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    VS
                  </motion.div>
                  
                  {gameState.roundResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center whitespace-nowrap"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`text-lg font-bold inline-block ml-2 ${
                          gameState.roundResult.winner === 'player' ? 'text-green-500' :
                          gameState.roundResult.winner === 'ai' ? 'text-red-500' :
                          'text-gray-500'
                        }`}
                      >
                        {gameState.roundResult.winner === 'player' && (
                          `玩家胜，对AI造成${gameState.roundResult.damage}点伤害`
                        )}
                        {gameState.roundResult.winner === 'ai' && (
                          `AI胜，对玩家造成${gameState.roundResult.damage}点伤害`
                        )}
                        {gameState.roundResult.winner === 'draw' && '不分伯仲的回合'}
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* AI出牌区域 - 移到右侧 */}
                <div className="flex flex-col items-center w-1/3">
                  <AnimatePresence mode="wait">
                    {gameState.roundResult ? (
                      <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Card
                          key="ai-played"
                          card={gameState.roundResult.aiCard}
                          position="ai"
                          isPlayed={true}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mt-2 text-base whitespace-nowrap"
                        >
                          AI：{getColorName(gameState.roundResult.aiCard.color)}
                          <span className="font-bold ml-1">
                            {gameState.roundResult.aiValue}
                          </span>
                          {gameState.roundResult.isAICountered && (
                            <span className="text-red-500 ml-1">
                              (-3)
                            </span>
                          )}
                        </motion.div>
                      </motion.div>
                    ) : (
                      <PlaceholderCard />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* 玩家手牌区域 */}
          <div>
            <div className="flex justify-center gap-4">
              <AnimatePresence>
                {gameState.playerHand.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    isSelectable={!isAnimating && !gameState.isGameOver}
                    custom={index}
                    onSelect={handleCardPlay}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 右侧日志栏 */}
        <div className="h-[calc(100vh-3rem)] sticky top-6">
          <GameLog logs={gameState.gameLog} />
        </div>
      </div>
    </div>
  );
}

// 辅助函数：获取颜色称
function getColorName(color) {
  const colorMap = {
    red: '红色',
    blue: '蓝色',
    black: '黑色'
  };
  return colorMap[color];
}

export default GameBoard;
