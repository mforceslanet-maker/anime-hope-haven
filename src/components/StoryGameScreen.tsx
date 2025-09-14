import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowLeft, Star, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { StoryScenario, UserProgress } from '../types/game';
import { getLevel1Scenarios } from '../data/scenarios';
import { characters } from '../data/characters';
import { toast } from '../hooks/use-toast';

interface StoryGameScreenProps {
  onBack: () => void;
  userAge: number;
  onLevelUnlocked: () => void;
}

interface CharacterMood {
  [characterId: string]: 'happy' | 'sad' | 'concerned' | 'proud';
}

export const StoryGameScreen = ({ onBack, userAge, onLevelUnlocked }: StoryGameScreenProps) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [scenarios] = useState(() => getLevel1Scenarios(userAge));
  const [progress, setProgress] = useState<UserProgress>({
    currentLevel: 1,
    completedScenarios: [],
    correctChoices: 0,
    totalChoices: 0,
    lastActivity: new Date(),
    trialDaysRemaining: 4,
    hasUnlockedLevel2: false
  });
  const [characterMoods, setCharacterMoods] = useState<CharacterMood>({});
  const [mustRetry, setMustRetry] = useState(false);

  const currentScenario = scenarios[currentScenarioIndex];

  useEffect(() => {
    if (currentScenario) {
      // Reset character moods to neutral when starting a new scenario
      const initialMoods: CharacterMood = {};
      currentScenario.characters.forEach(charId => {
        initialMoods[charId] = 'happy';
      });
      setCharacterMoods(initialMoods);
    }
  }, [currentScenario]);

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return;
    
    setSelectedOption(optionId);
    const option = currentScenario.options.find(opt => opt.id === optionId);
    
    if (option) {
      setShowResult(true);
      
      // Update character moods based on the choice
      const newMoods: CharacterMood = {};
      Object.entries(option.characterReactions).forEach(([charId, reaction]) => {
        newMoods[charId] = reaction.expression;
      });
      setCharacterMoods(newMoods);

      // Update progress
      const newProgress = {
        ...progress,
        totalChoices: progress.totalChoices + 1,
        correctChoices: option.isCorrect ? progress.correctChoices + 1 : progress.correctChoices
      };

      if (option.isCorrect) {
        newProgress.completedScenarios.push(currentScenario.id);
        toast({
          title: "Great choice! 🌟",
          description: "You made a wise decision!",
        });
      } else {
        setMustRetry(true);
        toast({
          title: "Let's try again 💭",
          description: "Think about what could happen if you chose differently...",
          variant: "destructive"
        });
      }

      setProgress(newProgress);

      // Check if Level 2 should be unlocked
      if (newProgress.correctChoices >= 3 && !newProgress.hasUnlockedLevel2) {
        setTimeout(() => {
          newProgress.hasUnlockedLevel2 = true;
          setProgress(newProgress);
          onLevelUnlocked();
          toast({
            title: "🎉 Congratulations!",
            description: "You've unlocked Level 2! You're making great progress on your emotional journey!",
          });
        }, 2000);
      }
    }
  };

  const handleNextScenario = () => {
    if (mustRetry && selectedOption) {
      const option = currentScenario.options.find(opt => opt.id === selectedOption);
      if (option && !option.isCorrect) {
        // Reset for retry
        setSelectedOption(null);
        setShowResult(false);
        setMustRetry(false);
        return;
      }
    }

    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
      setMustRetry(false);
    } else {
      toast({
        title: "Story Complete! 🎊",
        description: "You've completed all the stories in Level 1!",
      });
    }
  };

  const getCharacterImage = (characterId: string) => {
    const character = characters.find(char => char.id === characterId);
    return character?.image || '';
  };

  const getCharacterName = (characterId: string) => {
    const character = characters.find(char => char.id === characterId);
    return character?.name || characterId;
  };

  const getMoodIcon = (mood: 'happy' | 'sad' | 'concerned' | 'proud') => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'concerned': return '😟';
      case 'proud': return '🌟';
      default: return '😊';
    }
  };

  if (!currentScenario) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Star className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-comfortaa font-bold mb-4">
              No Stories Available
            </h2>
            <p className="text-muted-foreground mb-4">
              Stories for your age group will be available soon!
            </p>
            <Button onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-story p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-comfortaa font-bold">Story Game - Level 1</h1>
            <p className="text-sm text-muted-foreground">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <div>Correct: {progress.correctChoices}/{progress.totalChoices}</div>
            <div>Trial: Day {5 - progress.trialDaysRemaining}/4</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={(currentScenarioIndex / scenarios.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Characters Display */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6 flex-wrap">
          {currentScenario.characters.map((characterId) => (
            <div key={characterId} className="text-center">
              <div className="relative">
                <img
                  src={getCharacterImage(characterId)}
                  alt={getCharacterName(characterId)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/30"
                />
                <div className="absolute -bottom-1 -right-1 text-xl">
                  {getMoodIcon(characterMoods[characterId] || 'happy')}
                </div>
              </div>
              <p className="text-xs sm:text-sm mt-1 font-medium">
                {getCharacterName(characterId)}
              </p>
            </div>
          ))}
        </div>

        {/* Story Content */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-comfortaa font-semibold mb-3">
              {currentScenario.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
              {currentScenario.description}
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="text-sm sm:text-base leading-relaxed">
                {currentScenario.situation}
              </p>
            </div>

            {/* Options */}
            {!showResult && (
              <div className="space-y-3">
                <h3 className="font-medium mb-3">What should happen next?</h3>
                {currentScenario.options.map((option) => (
                  <Button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-4 hover:bg-primary/10 touch-manipulation"
                    disabled={selectedOption !== null}
                  >
                    <div className="text-sm sm:text-base leading-relaxed">
                      {option.text}
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Result */}
            {showResult && selectedOption && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${
                  currentScenario.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {currentScenario.options.find(opt => opt.id === selectedOption)?.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {currentScenario.options.find(opt => opt.id === selectedOption)?.isCorrect 
                        ? 'Great Choice!' 
                        : 'Let\'s Think About This...'
                      }
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3">
                    {currentScenario.options.find(opt => opt.id === selectedOption)?.consequence}
                  </p>
                </div>

                {/* Character Reactions */}
                <div className="space-y-3">
                  <h4 className="font-medium">Character Reactions:</h4>
                  {Object.entries(
                    currentScenario.options.find(opt => opt.id === selectedOption)?.characterReactions || {}
                  ).map(([characterId, reaction]) => (
                    <div key={characterId} className="flex items-start gap-3 p-3 bg-card rounded-lg">
                      <img
                        src={getCharacterImage(characterId)}
                        alt={getCharacterName(characterId)}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {getCharacterName(characterId)}
                          </span>
                          <span>{getMoodIcon(reaction.expression)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {reaction.dialogue}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {mustRetry ? (
                    <Button 
                      onClick={handleNextScenario}
                      className="flex-1 touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleNextScenario}
                      className="flex-1 touch-manipulation"
                    >
                      {currentScenarioIndex < scenarios.length - 1 ? 'Next Story' : 'Complete Level'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};