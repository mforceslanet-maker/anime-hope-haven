import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { storyScenarios } from '../data/storyScenarios';
import { storyCharacters } from '../data/storyCharacters';
import { StoryScenario } from '../types/story';

interface StoryGameScreenProps {
  onBack: () => void;
  onComplete: () => void;
  age: number;
}

export const StoryGameScreen = ({ onBack, onComplete, age }: StoryGameScreenProps) => {
  const [currentScenario, setCurrentScenario] = useState<StoryScenario>(storyScenarios[0]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [needsRetry, setNeedsRetry] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const resetScenario = () => {
    setSelectedChoice(null);
    setShowOutcome(false);
    setIsCorrect(false);
    setNeedsRetry(false);
  };

  const handleChoiceSelect = (choiceId: string) => {
    const choice = currentScenario.choices.find(c => c.id === choiceId);
    if (!choice) return;

    setSelectedChoice(choiceId);
    setIsCorrect(choice.isCorrect);
    setShowOutcome(true);
    
    if (!choice.isCorrect) {
      setNeedsRetry(true);
    }
  };

  const handleContinue = () => {
    if (needsRetry) {
      resetScenario();
      return;
    }

    if (scenarioIndex < storyScenarios.length - 1) {
      setScenarioIndex(prev => prev + 1);
      setCurrentScenario(storyScenarios[scenarioIndex + 1]);
      resetScenario();
    } else {
      onComplete();
    }
  };

  const selectedChoiceData = currentScenario.choices.find(c => c.id === selectedChoice);

  return (
    <div className="min-h-screen bg-gradient-soft-green relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-comfortaa font-bold text-white">
              Story Game - Level 1
            </h1>
            <p className="text-white/80 text-sm">
              Scenario {scenarioIndex + 1} of {storyScenarios.length}
            </p>
          </div>

          <div className="w-10 h-10"></div>
        </motion.div>

        {/* Character bubbles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          {currentScenario.characters.map((charId, index) => {
            const character = storyCharacters.find(c => c.id === charId);
            if (!character) return null;

            return (
              <motion.div
                key={charId}
                animate={{ 
                  y: [0, -10, 0],
                  scale: showOutcome && !isCorrect ? [1, 0.9, 1] : [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
                className="text-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2 border-2 border-white/30"
                  style={{ backgroundColor: character.color }}
                >
                  <span className="text-2xl">
                    {character.name === 'Junno' && (showOutcome && !isCorrect ? '😔' : '🧠')}
                    {character.name === 'Lex' && (showOutcome && !isCorrect ? '😢' : '⚡')}
                    {character.name === 'Nova' && (showOutcome && !isCorrect ? '😰' : '🌙')}
                    {character.name === 'Skye' && (showOutcome && !isCorrect ? '😭' : '🎨')}
                    {character.name === 'Alex' && (showOutcome && !isCorrect ? '😟' : '🛡️')}
                  </span>
                </div>
                <p className="text-white text-xs font-nunito">{character.name}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Story content */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!showOutcome ? (
              <motion.div
                key="scenario"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6"
              >
                <h2 className="text-2xl font-comfortaa font-bold text-white mb-4 text-center">
                  {currentScenario.title}
                </h2>
                
                <div className="bg-white/10 rounded-2xl p-4 mb-6">
                  <p className="text-white text-lg font-nunito leading-relaxed text-center">
                    {currentScenario.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-white/90 text-center font-nunito mb-4">
                    What would you do?
                  </p>
                  
                  {currentScenario.choices.map((choice, index) => (
                    <motion.div
                      key={choice.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <Button
                        onClick={() => handleChoiceSelect(choice.id)}
                        className="w-full p-6 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-left rounded-2xl transition-all duration-300 hover:scale-105"
                        disabled={!!selectedChoice}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {choice.isCorrect ? '✅' : '❌'}
                          </span>
                          <span className="text-lg font-nunito">{choice.text}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="outcome"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`rounded-3xl p-6 mb-6 ${
                  isCorrect 
                    ? 'bg-green-400/20 border border-green-400/30' 
                    : 'bg-red-400/20 border border-red-400/30'
                }`}
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="text-6xl mb-4"
                  >
                    {isCorrect ? '🎉' : '😔'}
                  </motion.div>
                  
                  <h3 className="text-2xl font-comfortaa font-bold text-white mb-4">
                    {isCorrect ? 'Well Done!' : 'Not Quite Right'}
                  </h3>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-white text-lg font-nunito text-center">
                    {selectedChoiceData?.outcome}
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6">
                  <p className="text-white/90 font-nunito text-center italic">
                    "{selectedChoiceData?.characterReaction}"
                  </p>
                </div>

                {!isCorrect && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mb-6"
                  >
                    <p className="text-white/80 font-nunito mb-4">
                      What if you chose differently? Let's see the positive outcome!
                    </p>
                  </motion.div>
                )}

                <div className="text-center">
                  <Button
                    onClick={handleContinue}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-3 rounded-2xl font-nunito font-medium"
                  >
                    {needsRetry ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Try Again
                      </>
                    ) : scenarioIndex < storyScenarios.length - 1 ? (
                      'Next Scenario'
                    ) : (
                      'Complete Level 1'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};