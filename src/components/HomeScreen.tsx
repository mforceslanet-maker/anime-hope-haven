import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
// Import correct icons from lucide-react
import { Bell, Gamepad2, Heart, Mic } from 'lucide-react';

interface HomeScreenProps {
  onStartStoryGame: () => void;
  onCheckIn: () => void;
  onSpeakOrType: () => void;
  onSettings: () => void;
  hasLevel2Unlocked: boolean;
  onLevel2: () => void;
}

const backgroundColors = [
  'bg-gradient-blush-pink',
  'bg-gradient-sage-green',
  'bg-gradient-sky-blue',
  'bg-gradient-soft-purple',
  'bg-gradient-soft-green',
];

export const HomeScreen = ({ 
  onStartStoryGame, 
  onCheckIn, 
  onSpeakOrType, 
  onSettings,
  hasLevel2Unlocked,
  onLevel2
}: HomeScreenProps) => {
  const [currentBg, setCurrentBg] = useState(0);
  const [showReminder, setShowReminder] = useState(false);
  const [showLevel2Notification, setShowLevel2Notification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundColors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Show reminder popup periodically
    const reminderInterval = setInterval(() => {
      setShowReminder(true);
      setTimeout(() => setShowReminder(false), 4000);
    }, 30000);

    return () => clearInterval(reminderInterval);
  }, []);

  useEffect(() => {
    // Show Level 2 notification if unlocked but not visited
    if (hasLevel2Unlocked) {
      const timer = setTimeout(() => {
        setShowLevel2Notification(true);
        setTimeout(() => setShowLevel2Notification(false), 6000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasLevel2Unlocked]);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${backgroundColors[currentBg]} relative overflow-hidden`}>
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/10 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, 50, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-comfortaa font-bold text-white mb-2">
            Welcome back!
          </h1>
          <p className="text-white/80 font-nunito">
            Your mental wellness journey continues
          </p>
        </motion.div>

        {/* Main buttons */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={onStartStoryGame}
                className="w-full h-32 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 text-white transition-all duration-300 group"
              >
                <Gamepad2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-lg font-comfortaa font-semibold">Start Story Game</div>
                  <div className="text-sm opacity-80">Level 1</div>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={onCheckIn}
                className="w-full h-32 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 text-white transition-all duration-300 group"
              >
                <Heart className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-lg font-comfortaa font-semibold">Check-in</div>
                  <div className="text-sm opacity-80">Daily Mood Tracker</div>
                </div>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2"
            >
              <Button
                onClick={onSpeakOrType}
                className="w-full h-32 bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 text-white transition-all duration-300 group"
              >
                <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-lg font-comfortaa font-semibold">Speak or Type Your Feelings</div>
                  <div className="text-sm opacity-80">Share what's on your mind</div>
                </div>
              </Button>
            </motion.div>

            {hasLevel2Unlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="md:col-span-2"
              >
                <Button
                  onClick={onLevel2}
                  className="w-full h-32 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 border border-yellow-400/30 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 text-white transition-all duration-300 group relative overflow-hidden"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.div>
                  <div className="text-center">
                    <div className="text-lg font-comfortaa font-semibold">Level 2 Unlocked!</div>
                    <div className="text-sm opacity-80">Daily Life Integration</div>
                  </div>
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Settings button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-4"
        >
          <Button
            onClick={onSettings}
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Settings
          </Button>
        </motion.div>
      </div>

      {/* Reminder popup */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-4 right-4 z-20"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <span className="flex-1 font-nunito text-foreground">
                Hey there! Don't forget to check in.
              </span>
              <Button
                onClick={() => setShowReminder(false)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level 2 notification */}
      <AnimatePresence>
        {showLevel2Notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/20"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="bg-white rounded-3xl p-8 mx-4 text-center shadow-xl max-w-sm"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-comfortaa font-bold text-foreground mb-2">
                Hey there's Level 2!
              </h3>
              <p className="text-muted-foreground mb-6">
                You'll love it - it's all about your daily life experiences!
              </p>
              <div className="space-x-3">
                <Button onClick={onLevel2} className="bg-primary text-primary-foreground">
                  Check it out!
                </Button>
                <Button 
                  onClick={() => setShowLevel2Notification(false)}
                  variant="outline"
                >
                  Later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};