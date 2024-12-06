// 游戏常量
const COLORS = ['red', 'blue', 'black'];
const VALUES = [2, 3, 4, 5, 6, 7];
const INITIAL_HEALTH = 50;
const HAND_SIZE = 3;

// 创建单张卡牌
const createCard = (color, value) => ({
  id: `${color}-${value}-${Math.random()}`,
  color,
  value
});

// 生成完整牌组
export const generateDeck = () => {
  const deck = [];
  COLORS.forEach(color => {
    VALUES.forEach(value => {
      deck.push(createCard(color, value));
    });
  });
  return shuffleDeck(deck);
};

// 洗牌函数
export const shuffleDeck = (deck) => {
  return [...deck].sort(() => Math.random() - 0.5);
};

// 计算伤害和胜者
export const calculateBattle = (playerCard, aiCard) => {
  let playerValue = playerCard.value;
  let aiValue = aiCard.value;

  // 颜色克制关系
  const isPlayerCountered = (
    (aiCard.color === 'red' && playerCard.color === 'blue') ||
    (aiCard.color === 'blue' && playerCard.color === 'black') ||
    (aiCard.color === 'black' && playerCard.color === 'red')
  );

  const isAICountered = (
    (playerCard.color === 'red' && aiCard.color === 'blue') ||
    (playerCard.color === 'blue' && aiCard.color === 'black') ||
    (playerCard.color === 'black' && aiCard.color === 'red')
  );

  if (isPlayerCountered) {
    playerValue = Math.max(0, playerValue - 3);
  }
  if (isAICountered) {
    aiValue = Math.max(0, aiValue - 3);
  }

  return {
    playerValue,
    aiValue,
    winner: playerValue > aiValue ? 'player' : playerValue < aiValue ? 'ai' : 'draw',
    damage: Math.max(playerValue, aiValue),
    isPlayerCountered,
    isAICountered
  };
};

// 初始化游戏状态
export const initializeGameState = () => {
  const deck = generateDeck();
  const playerHand = deck.slice(0, HAND_SIZE);
  const aiHand = deck.slice(HAND_SIZE, HAND_SIZE * 2);
  const remainingDeck = deck.slice(HAND_SIZE * 2);

  return {
    playerHealth: INITIAL_HEALTH,
    aiHealth: INITIAL_HEALTH,
    playerHand,
    aiHand,
    deck: remainingDeck,
    selectedCard: null,
    roundResult: null,
    gameLog: [],
    isGameOver: false
  };
};

// AI选择卡牌策略
export const getAIMove = (aiHand, playerCard) => {
  // 如果玩家还没出牌，随机选择
  if (!playerCard) {
    return aiHand[Math.floor(Math.random() * aiHand.length)];
  }

  // 尝试找到能克制玩家卡牌的牌
  const counterCard = aiHand.find(card => {
    if (
      (card.color === 'red' && playerCard.color === 'blue') ||
      (card.color === 'blue' && playerCard.color === 'black') ||
      (card.color === 'black' && playerCard.color === 'red')
    ) {
      return true;
    }
    return false;
  });

  if (counterCard) return counterCard;

  // 如果没有克制牌，选择最大值的牌
  return aiHand.reduce((highest, current) => 
    current.value > highest.value ? current : highest
  , aiHand[0]);
};
