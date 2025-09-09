import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { storyCharacters } from '../data/storyCharacters';
import { UserProfile } from '../types/story';
import { Hand, Eye } from 'lucide-react';

interface CharacterIntroScreenProps {
  userProfile: UserProfile;
  onContinue: () => void;
}

export const CharacterIntroScreen = ({ userProfile, onContinue }: CharacterIntroScreenProps) => {
  const [animatingCharacter, setAnimatingCharacter] = useState<string | null>(null);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    // Show continue button after 3 seconds
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCharacterTap = (characterId: string) => {
    setAnimatingCharacter(characterId);
    setTimeout(() => {
      setAnimatingCharacter(null);
    }, 1000);
  };

  const getAgeBasedGreeting = () => {
    if (userProfile.ageGroup === 'teen') {
      return "Hey there! We're your new friends who totally get what you're going through! 🌟";
    } else if (userProfile.ageGroup === 'adult') {
      return "Welcome! We're here to support you through life's challenges with understanding and care. 💙";
    } else {
      return "Greetings, friend. We're honored to accompany you on this journey with wisdom and compassion. 🌸";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blush-pink to-soft-purple">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-comfortaa font-bold text-white mb-6">
            Meet Your Support Team
          </h1>
          <Card className="inline-block p-6 bg-white/90 backdrop-blur-sm border-0 rounded-2xl">
            <p className="text-lg text-gray-700 font-medium">
              {getAgeBasedGreeting()}
            </p>
          </Card>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          {storyCharacters.map((character, index) => (
            <Card 
              key={character.id}
              className={`p-6 text-center bg-white/90 backdrop-blur-sm border-0 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 ${
                animatingCharacter === character.id ? 'animate-bounce scale-110' : ''
              }`}
              onClick={() => handleCharacterTap(character.id)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-4">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg"
                />
                
                {/* Animation icons */}
                {animatingCharacter === character.id && (
                  <div className="absolute -top-2 -right-2">
                    {Math.random() > 0.5 ? (
                      <Hand className="w-8 h-8 text-blush-pink animate-bounce" />
                    ) : (
                      <Eye className="w-8 h-8 text-sky-blue animate-pulse" />
                    )}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-comfortaa font-bold text-gray-800 mb-2">
                {character.name}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {character.role}
              </p>
              
              {character.id === 'nova' && (
                <div className="mt-2">
                  <span className="text-xs bg-sage-green/20 text-sage-green px-2 py-1 rounded-full">
                    ☪️ Spiritual Guide
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block p-6 bg-white/90 backdrop-blur-sm border-0 rounded-2xl mb-8">
            <p className="text-gray-700 font-medium mb-2">
              <strong>Tap any character</strong> to see them wave or blink! 👋
            </p>
            <p className="text-sm text-gray-600">
              Your age helps us choose the perfect interactions for you.
            </p>
          </Card>

          {showContinue && (
            <div className="animate-fade-in">
              <Button 
                onClick={onContinue}
                className="bg-gradient-to-r from-sage-green to-sky-blue hover:from-sage-green/80 hover:to-sky-blue/80 text-white font-semibold py-4 px-12 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
              >
                Let's Begin Our Journey! ✨
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};