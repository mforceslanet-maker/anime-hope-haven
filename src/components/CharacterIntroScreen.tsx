import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { storyCharacters, getCharactersByAge } from '../data/storyCharacters';

interface CharacterIntroScreenProps {
  age: number;
  onContinue: () => void;
}

export const CharacterIntroScreen = ({ age, onContinue }: CharacterIntroScreenProps) => {
  const availableCharacters = getCharactersByAge(age);

  return (
    <div className="min-h-screen bg-gradient-sage-green p-4 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-comfortaa font-bold text-white mb-4">
          Meet Your Companions
        </h1>
        <p className="text-white/80 text-lg font-nunito">
          These friends will be with you on your journey
        </p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {storyCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 text-center cursor-pointer group"
              style={{ 
                boxShadow: `0 8px 32px ${character.color}20`
              }}
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
                className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden"
                style={{ backgroundColor: character.color }}
              >
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {character.name === 'Junno' && '🧠'}
                  {character.name === 'Lex' && '⚡'}
                  {character.name === 'Nova' && '🌙'}
                  {character.name === 'Skye' && '🎨'}
                  {character.name === 'Alex' && '🛡️'}
                </div>
              </motion.div>

              <h3 className="text-xl font-comfortaa font-semibold text-white mb-2">
                {character.name}
                {character.isMuslim && <span className="ml-2">☾</span>}
              </h3>
              
              <p className="text-white/80 text-sm font-nunito mb-3">
                {character.description}
              </p>
              
              <div className="text-xs text-white/60 italic">
                {character.personality}
              </div>

              {availableCharacters.find(c => c.id === character.id) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="mt-4"
                >
                  <span className="inline-block bg-white/30 text-white text-xs px-3 py-1 rounded-full">
                    Available for you
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="text-center py-8"
      >
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-12 py-4 text-lg font-nunito font-medium rounded-full"
        >
          Continue to Home
        </Button>
      </motion.div>
    </div>
  );
};