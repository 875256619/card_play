import { motion } from 'framer-motion';

function HealthBar({ current, max, isPlayer }) {
  const percentage = (current / max) * 100;
  
  const getHealthColor = (percent) => {
    if (percent > 60) return 'bg-green-500';
    if (percent > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`w-full ${isPlayer ? 'text-left' : 'text-right'}`}>
      <div className={`flex ${isPlayer ? 'flex-row' : 'flex-row-reverse'} justify-between mb-1`}>
        <span className="font-bold text-gray-700">
          {isPlayer ? '玩家' : 'AI'}
        </span>
        <span className="text-gray-600">
          {current} / {max}
        </span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getHealthColor(percentage)}`}
          initial={{ width: `${percentage}%` }}
          animate={{ 
            width: `${percentage}%`,
            transition: { duration: 0.5, ease: "easeOut" }
          }}
          style={{
            float: isPlayer ? 'left' : 'right'
          }}
        />
      </div>
    </div>
  );
}

export default HealthBar;
