import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { storyCharacters } from '../data/storyCharacters';
import { PartyPopper, Trophy, Music, Sparkles, ArrowRight, Star } from 'lucide-react';

interface Level2UnlockScreenProps {
  onContinue: () => void;
  onDelay: () => void;
}

export const Level2UnlockScreen = ({ onContinue, onDelay }: Level2UnlockScreenProps) => {
  const [celebrationPhase, setCelebrationPhase] = useState(0);

  const handleContinue = () => {
    if (celebrationPhase < 2) {
      setCelebrationPhase(prev => prev + 1);
    } else {
      onContinue();
    }
  };

  const getCelebrationContent = () => {
    switch (celebrationPhase) {
      case 0:
        return {
          title: "🎉 Congratulations! 🎉",
          subtitle: "You've reached Level 2!",
          content: "Your wisdom in making good decisions has impressed everyone!",
          buttonText: "Tell me more!"
        };
      case 1:
        return {
          title: "🎊 The Characters Celebrate! 🎊",
          subtitle: "Everyone's so proud of you!",
          content: "All your character friends have been waiting to welcome you to Level 2!",
          buttonText: "Let's celebrate!"
        };
      case 2:
        return {
          title: "✨ Welcome to Level 2! ✨", 
          subtitle: "A new chapter begins!",
          content: "Now you can share your daily life experiences, achievements, and challenges with your character friends!",
          buttonText: "Enter Level 2"
        };
      default:
        return {
          title: "Welcome!",
          subtitle: "",
          content: "",
          buttonText: "Continue"
        };
    }
  };

  const celebration = getCelebrationContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blush-pink via-soft-purple to-sky-blue">
      <Card className="max-w-4xl w-full p-12 text-center bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl">
        {/* Celebration Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <PartyPopper className="w-16 h-16 text-blush-pink animate-bounce" />
          <Trophy className="w-20 h-20 text-sage-green animate-pulse" />
          <PartyPopper className="w-16 h-16 text-sky-blue animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Main Title */}
        <h1 className="text-5xl font-comfortaa font-bold text-gray-800 mb-4">
          {celebration.title}
        </h1>
        <h2 className="text-3xl font-semibold text-soft-purple mb-8">
          {celebration.subtitle}
        </h2>

        {/* Character Celebration Display */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {storyCharacters.map((character, index) => (
            <div 
              key={character.id}
              className="text-center"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className={`w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto mb-3 ${
                    celebrationPhase >= 1 ? 'animate-bounce' : 'animate-pulse'
                  }`}
                />
                
                {celebrationPhase >= 1 && (
                  <div className="absolute -top-2 -right-2">
                    {index % 2 === 0 ? (
                      <Music className="w-6 h-6 text-blush-pink animate-spin" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-sage-green animate-bounce" />
                    )}
                  </div>
                )}
              </div>
              
              <h4 className="font-comfortaa font-semibold text-gray-800 text-sm">
                {character.name}
              </h4>
              
              {celebrationPhase >= 1 && (
                <div className="mt-2">
                  {index === 0 && <span className="text-xs">🎵 "You did it!" 🎵</span>}
                  {index === 1 && <span className="text-xs">💃 *dancing* 💃</span>}
                  {index === 2 && <span className="text-xs">👏 "Amazing!" 👏</span>}
                  {index === 3 && <span className="text-xs">🎉 "So proud!" 🎉</span>}
                  {index === 4 && <span className="text-xs">✨ "Welcome!" ✨</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Celebration Message */}
        <div className="bg-gradient-to-r from-soft-purple/20 to-blush-pink/20 rounded-3xl p-8 mb-8">
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            {celebration.content}
          </p>
          
          {celebrationPhase >= 2 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/60 rounded-2xl p-4">
                <Star className="w-8 h-8 text-sage-green mx-auto mb-2" />
                <p className="font-semibold">Share Daily Life</p>
                <p className="text-gray-600">Tell us about your achievements and challenges</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4">
                <Music className="w-8 h-8 text-blush-pink mx-auto mb-2" />
                <p className="font-semibold">Casual Conversations</p>
                <p className="text-gray-600">Chat, laugh, and joke with your character friends</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-4">
                <Sparkles className="w-8 h-8 text-sky-blue mx-auto mb-2" />
                <p className="font-semibold">No Restrictions</p>
                <p className="text-gray-600">Return to Level 1 anytime you need support</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleContinue}
            className="bg-gradient-to-r from-sage-green to-sky-blue hover:from-sage-green/80 hover:to-sky-blue/80 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
          >
            {celebration.buttonText}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          {celebrationPhase >= 2 && (
            <Button 
              onClick={onDelay}
              variant="outline"
              className="py-4 px-8 rounded-2xl text-lg border-2"
            >
              Maybe Later
            </Button>
          )}
        </div>

        {/* Fun Elements */}
        {celebrationPhase >= 1 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 italic">
              🎵 *Background music plays* 🎵
            </p>
            <p className="text-sm text-gray-500 mt-2">
              The characters are singing and dancing to celebrate your progress!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};