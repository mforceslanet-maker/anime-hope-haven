import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { storyCharacters } from '../data/storyCharacters';

interface Level2UnlockScreenProps {
  onContinue: () => void;
  age: number;
}

export const Level2UnlockScreen = ({ onContinue, age }: Level2UnlockScreenProps) => {
  useEffect(() => {
    // Play celebration sound effect (placeholder)
    console.log('🎉 Level 2 unlocked!');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-blush-pink relative overflow-hidden flex items-center justify-center">
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ 
              y: '100vh', 
              x: Math.random() * window.innerWidth,
              rotate: 0 
            }}
            animate={{ 
              y: '-100px', 
              rotate: 360 
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          >
            {['🎉', '✨', '🎊', '🌟', '💫'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🎉</div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-6xl font-comfortaa font-bold text-white mb-6"
        >
          Congratulations!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-2xl text-white/90 font-nunito mb-8"
        >
          You've reached Level 2!
        </motion.p>

        {/* Celebrating characters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex justify-center gap-4 mb-8"
        >
          {storyCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
              className="text-center"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2 border-2 border-white/30"
                style={{ backgroundColor: character.color }}
              >
                <span className="text-2xl">
                  {character.name === 'Junno' && '🎊'}
                  {character.name === 'Lex' && '🎉'}
                  {character.name === 'Nova' && '✨'}
                  {character.name === 'Skye' && '🌟'}
                  {character.name === 'Alex' && '💫'}
                </span>
              </div>
              <p className="text-white text-xs font-nunito">{character.name}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-8"
        >
          <h2 className="text-2xl font-comfortaa font-semibold text-white mb-4">
            Welcome to Level 2!
          </h2>
          <p className="text-white/90 font-nunito text-lg leading-relaxed">
            You've shown great wisdom in your choices. Now it's time to integrate these lessons 
            into your daily life. In Level 2, you can share your daily experiences, achievements, 
            and challenges with your companions who are here to celebrate and support you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8, type: "spring" }}
        >
          <Button
            onClick={onContinue}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-12 py-4 text-xl font-nunito font-medium rounded-full shadow-lg"
          >
            Enter Level 2
          </Button>
        </motion.div>

        {/* Music notes animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`note-${i}`}
              className="absolute text-2xl text-white/30"
              animate={{
                y: [0, -30, 0],
                x: [0, 20, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            >
              ♪
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};