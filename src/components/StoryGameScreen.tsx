import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { storyScenarios } from '../data/storyScenarios';
import { storyCharacters } from '../data/storyCharacters';
import { UserProfile, StoryScenario, StoryChoice } from '../types/story';
import { CheckCircle, XCircle, RefreshCw, ArrowLeft, MessageSquare } from 'lucide-react';

interface StoryGameScreenProps {
  userProfile: UserProfile;
  onComplete: () => void;
  onBack: () => void;
}

export const StoryGameScreen = ({ userProfile, onComplete, onBack }: StoryGameScreenProps) => {
  const [currentScenario, setCurrentScenario] = useState<StoryScenario | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [dialogStep, setDialogStep] = useState(0);

  useEffect(() => {
    loadNextScenario();
  }, []);

  const loadNextScenario = () => {
    const availableScenarios = storyScenarios.filter(scenario => 
      scenario.ageGroup === userProfile.ageGroup &&
      scenario.category === userProfile.category
    );

    if (availableScenarios.length === 0) {
      onComplete();
      return;
    }

    const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    setCurrentScenario(randomScenario);
    setSelectedChoice(null);
    setShowConsequence(false);
    setShowRetry(false);
    setDialogStep(0);
  };

  const handleChoiceSelect = (choice: StoryChoice) => {
    setSelectedChoice(choice);
    setShowConsequence(true);

    if (!choice.isCorrect) {
      setShowRetry(true);
    } else {
      setTimeout(() => {
        setCompletedCount(prev => prev + 1);
        if (completedCount + 1 >= 3) {
          onComplete();
        } else {
          loadNextScenario();
        }
      }, 4000);
    }
  };

  const handleRetry = () => {
    setSelectedChoice(null);
    setShowConsequence(false);
    setShowRetry(false);
  };

  if (!currentScenario) {
    return <div>Loading story...</div>;
  }

  const dialogParts = [
    `Characters notice something happening...`,
    currentScenario.situation,
    `The characters look at each other, wondering what to do...`
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-soft-purple to-sky-blue">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-white text-center">
            <h1 className="text-2xl font-comfortaa font-bold">Story Game - Level 1</h1>
            <p>Scenario {completedCount + 1}/3</p>
          </div>
          <div></div>
        </div>

        {/* Comic-style Character Dialog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {storyCharacters.slice(0, 3).map((character, index) => (
            <Card 
              key={character.id}
              className={`p-6 bg-white/95 backdrop-blur-sm border-0 rounded-3xl transition-all duration-500 ${
                dialogStep >= index ? 'opacity-100 scale-100' : 'opacity-50 scale-95'
              }`}
            >
              <div className="text-center">
                <img
                  src={character.image}
                  alt={character.name}
                  className={`w-16 h-16 rounded-full mx-auto mb-3 transition-all ${
                    showConsequence && selectedChoice?.isCorrect === false 
                      ? 'filter grayscale' 
                      : ''
                  }`}
                />
                <h3 className="font-comfortaa font-semibold text-gray-800 mb-2">
                  {character.name}
                </h3>
                
                {/* Speech Bubble */}
                <div className="relative bg-gray-100 rounded-2xl p-4 mt-3">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-100 rotate-45"></div>
                  <p className="text-sm text-gray-700">
                    {index === 0 && dialogStep >= 0 && "I notice something's happening..."}
                    {index === 1 && dialogStep >= 1 && "We should think about this carefully."}
                    {index === 2 && dialogStep >= 2 && "What would be the right thing to do?"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Story Card */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
          <div className="text-center mb-6">
            <MessageSquare className="w-12 h-12 text-soft-purple mx-auto mb-4" />
            <h2 className="text-2xl font-comfortaa font-bold text-gray-800 mb-4">
              {currentScenario.title}
            </h2>
          </div>

          {!showConsequence ? (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {currentScenario.situation}
                </p>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  The characters are looking at you. What would you do?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentScenario.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    variant="outline"
                    className="p-6 h-auto text-left border-2 border-gray-200 hover:border-soft-purple hover:bg-soft-purple/10 transition-all"
                  >
                    <div className="text-gray-800 font-medium">{choice.text}</div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Choice Result */}
              <div className={`flex items-center justify-center gap-3 p-6 rounded-2xl ${
                selectedChoice?.isCorrect 
                  ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                  : 'bg-red-100 text-red-800 border-2 border-red-200'
              }`}>
                {selectedChoice?.isCorrect ? (
                  <>
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-xl font-semibold">Great choice! ✨</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8" />
                    <span className="text-xl font-semibold">Let's think about this... 🤔</span>
                  </>
                )}
              </div>

              {/* Consequence */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">What happens next:</h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedChoice?.consequence}
                </p>
              </div>

              {/* Character Reactions */}
              <div className="grid grid-cols-3 gap-4">
                {storyCharacters.slice(0, 3).map((character, index) => (
                  <div key={character.id} className="text-center">
                    <img
                      src={character.image}
                      alt={character.name}
                      className={`w-12 h-12 rounded-full mx-auto mb-2 transition-all ${
                        selectedChoice?.isCorrect ? 'filter-none' : 'filter grayscale'
                      }`}
                    />
                    <p className="text-xs text-gray-600">
                      {selectedChoice?.isCorrect ? '😊' : '😔'}
                    </p>
                  </div>
                ))}
              </div>

              {showRetry ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 italic">
                    The characters are thinking: "What if a different choice was made?"
                  </p>
                  <Button
                    onClick={handleRetry}
                    className="bg-soft-purple hover:bg-soft-purple/80 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try the Right Choice
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-green-700 font-semibold text-lg mb-4">
                    The characters smile and cheer! Moving to next scenario... 🌟
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};