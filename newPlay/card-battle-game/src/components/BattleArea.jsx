import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';

function BattleArea({ playerCard, aiCard, battleResult }) {
  const battleVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={battleVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex items-center justify-center h-full"
      >
        <Card card={playerCard} />
        <Card card={aiCard} />
      </motion.div>
    </AnimatePresence>
  );
}

export default BattleArea;
