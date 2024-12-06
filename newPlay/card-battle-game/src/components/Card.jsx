import { motion } from 'framer-motion';

function Card({ 
  card, 
  isHidden, 
  isSelectable, 
  onSelect, 
  isSelected,
  isPlayed,
  position, // 'player' | 'ai' | 'battle'
  custom 
}) {
  const getCardVariants = () => {
    const baseVariants = {
      initial: { 
        scale: 0.8, 
        opacity: 0,
        y: position === 'ai' ? -50 : 50
      },
      enter: { 
        scale: 1, 
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.3,
          delay: custom * 0.1 
        }
      },
      hover: isSelectable ? {
        scale: 1.1,
        y: -10,
        transition: { duration: 0.2 }
      } : {},
    };

    // 添加出牌动画
    if (isPlayed) {
      return {
        ...baseVariants,
        played: {
          scale: 1,
          x: position === 'player' ? [0, 0] : [0, 0],
          y: position === 'player' ? [-150, 0] : [150, 0],
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: "easeInOut"
          }
        }
      };
    }

    return baseVariants;
  };

  if (isHidden) {
    return (
      <motion.div
        variants={getCardVariants()}
        initial="initial"
        animate={isPlayed ? "played" : "enter"}
        whileHover="hover"
        className="w-24 h-36 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg"
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-2xl text-white font-bold">?</div>
        </div>
      </motion.div>
    );
  }

  const colorStyles = {
    red: 'from-red-500 to-red-700 border-red-400',
    blue: 'from-blue-500 to-blue-700 border-blue-400',
    black: 'from-gray-800 to-gray-900 border-gray-600'
  };

  return (
    <motion.div
      variants={getCardVariants()}
      initial="initial"
      animate={isPlayed ? "played" : "enter"}
      whileHover="hover"
      onClick={() => isSelectable && onSelect && onSelect(card)}
      className={`
        w-24 h-36 rounded-lg shadow-lg relative overflow-hidden
        bg-gradient-to-br ${colorStyles[card.color]} border-2
        ${isSelectable ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
      `}
    >
      <div className="absolute top-2 left-2 text-2xl font-bold text-white">
        {card.value}
      </div>

      <div className="absolute bottom-2 right-2 text-sm text-white">
        {card.color === 'red' && '红'}
        {card.color === 'blue' && '蓝'}
        {card.color === 'black' && '黑'}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-4xl text-white opacity-30`}>
          {card.color === 'red' && '♦'}
          {card.color === 'blue' && '♠'}
          {card.color === 'black' && '♣'}
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
