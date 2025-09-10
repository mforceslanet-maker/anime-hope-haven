import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface MotivationalQuoteScreenProps {
  onBegin: () => void;
}

const motivationalQuotes = [
  "It's okay not to be okay.",
  "You are stronger than you know.",
  "Every small step counts.",
  "Your feelings are valid.",
  "Tomorrow is a new beginning.",
];

export const MotivationalQuoteScreen = ({ onBegin }: MotivationalQuoteScreenProps) => {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="min-h-screen bg-gradient-soft-green flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <span className="text-4xl">💚</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-5xl md:text-6xl font-comfortaa font-light text-white mb-8 leading-tight"
        >
          "{randomQuote}"
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-xl text-white/80 mb-12 font-nunito"
        >
          You're taking a brave step by being here
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Button
            onClick={onBegin}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-12 py-4 text-lg font-nunito font-medium rounded-full transition-all duration-300"
          >
            Begin Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};