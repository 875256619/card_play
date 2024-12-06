import { motion } from 'framer-motion';

function Card({ 
  card, 
  isHidden, 
  isSelectable, 
  onSelect, 
  isPlayed,
  position, 
  custom 
}) {
  // 判断是否显示AI的牌
  const isAICard = position === 'ai' && !isPlayed;
  
  // 获取卡牌颜色样式
  const getColorStyle = () => {
    switch (card.color) {
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

  return (
    <motion.div
      initial={isPlayed ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      exit={isPlayed ? { scale: 0.8, opacity: 0 } : false}
      whileHover={isSelectable ? { scale: 1.1 } : {}}
      onClick={() => isSelectable && onSelect(card)}
      custom={custom}
      className={`
        relative w-24 h-36 rounded-xl 
        ${getColorStyle()}
        ${isSelectable ? 'cursor-pointer transform hover:shadow-xl' : ''}
        border-2 flex items-center justify-center
        transition-shadow duration-200
      `}
    >
      {/* 卡牌内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        {/* 如果是AI未打出的牌，显示"AI"而不是数值 */}
        <div className="text-3xl font-bold mb-2">
          {isAICard ? 'AI' : card.value}
        </div>
        
        {/* 卡牌花色背景 */}
        <div className={`text-4xl opacity-30`}>
          {card.color === 'red' && '♦'}
          {card.color === 'blue' && '♠'}
          {card.color === 'black' && '♣'}
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
