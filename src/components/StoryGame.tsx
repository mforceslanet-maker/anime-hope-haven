import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { storyScenarios } from '../data/storyScenarios';
import { storyCharacters } from '../data/storyCharacters';
import { StoryScenario, StoryChoice, UserProfile, GameSession } from '../types/story';
import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';

interface StoryGameProps {
  userProfile: UserProfile;
  onLevelComplete: () => void;
  onBackToMenu: () => void;
}

export const StoryGame = ({ userProfile, onLevelComplete, onBackToMenu }: StoryGameProps) => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    startNewScenario();
  }, []);

  const getAvailableScenarios = (): StoryScenario[] => {
    return storyScenarios.filter(scenario => 
      scenario.ageGroup === userProfile.ageGroup &&
      scenario.category === userProfile.category &&
      !userProfile.completedScenarios.includes(scenario.id)
    );
  };

  const startNewScenario = () => {
    const availableScenarios = getAvailableScenarios();
    if (availableScenarios.length === 0) {
      onLevelComplete();
      return;
    }

    const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    setGameSession({
      currentScenario: randomScenario,
      showConsequence: false,
      isComplete: false
    });
    setShowRetry(false);
  };

  const handleChoiceSelect = (choice: StoryChoice) => {
    if (!gameSession) return;

    setGameSession(prev => ({
      ...prev!,
      selectedChoice: choice,
      showConsequence: true
    }));

    if (!choice.isCorrect) {
      setShowRetry(true);
    } else {
      setTimeout(() => {
        setCompletedCount(prev => prev + 1);
        if (completedCount + 1 >= 3) {
          onLevelComplete();
        } else {
          startNewScenario();
        }
      }, 3000);
    }
  };

  const handleRetry = () => {
    if (!gameSession) return;
    
    setGameSession(prev => ({
      ...prev!,
      selectedChoice: undefined,
      showConsequence: false
    }));
    setShowRetry(false);
  };

  if (!gameSession) {
    return <div>Loading...</div>;
  }

  const { currentScenario, selectedChoice, showConsequence } = gameSession;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-sky-blue to-soft-green">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-comfortaa font-bold text-white mb-2">
            Story Challenge
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/80">
            <span>Progress: {completedCount}/3</span>
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        {/* Characters Display */}
        <div className="flex justify-center gap-4 mb-8">
          {storyCharacters.slice(0, 3).map((character, index) => (
            <div 
              key={character.id}
              className={`transition-all duration-500 ${
                showConsequence && selectedChoice?.isCorrect === false 
                  ? 'opacity-50 scale-95' 
                  : 'opacity-100 scale-100'
              }`}
            >
              <img 
                src={character.image} 
                alt={character.name}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <p className="text-center text-white text-sm mt-2">{character.name}</p>
            </div>
          ))}
        </div>

        {/* Main Story Card */}
        <Card className="p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-comfortaa font-bold text-gray-800 mb-4">
              {currentScenario.title}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentScenario.situation}
            </p>
          </div>

          {!showConsequence ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                What would you do?
              </h3>
              {currentScenario.choices.map((choice) => (
                <Button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice)}
                  variant="outline"
                  className="w-full p-6 text-left h-auto border-2 hover:border-soft-purple transition-all"
                >
                  <div className="text-gray-800">{choice.text}</div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                selectedChoice?.isCorrect 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {selectedChoice?.isCorrect ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <span className="font-semibold">
                  {selectedChoice?.isCorrect ? 'Great choice!' : 'Let\'s think about this...'}
                </span>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">What happens next:</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedChoice?.consequence}
                </p>
              </div>

              {showRetry ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    The characters are thinking: "What if a different choice was made?"
                  </p>
                  <Button
                    onClick={handleRetry}
                    className="bg-soft-purple hover:bg-soft-purple/80 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-green-700 font-semibold mb-4">
                    Excellent decision-making! 🌟
                  </p>
                  <p className="text-gray-600">Moving to next scenario...</p>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="text-center mt-6">
          <Button 
            onClick={onBackToMenu}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};