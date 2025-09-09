import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Quote, Heart } from 'lucide-react';

interface MotivationalQuoteScreenProps {
  onContinue: () => void;
}

export const MotivationalQuoteScreen = ({ onContinue }: MotivationalQuoteScreenProps) => {
  const motivationalQuotes = [
    "It's okay not to be okay.",
    "Every warrior needs support. You're not alone in this journey.",
    "Seeking help is a sign of strength, not weakness.",
    "Your mental health matters as much as your physical health.",
    "Today is a new day to prioritize your wellbeing.",
    "You are braver than you believe, stronger than you seem.",
    "Healing isn't linear, and that's perfectly normal.",
    "Your feelings are valid, and your story matters.",
    "Progress, not perfection, is what we're aiming for.",
    "You deserve peace, happiness, and support."
  ];

  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-soft-green to-soft-purple">
      <Card className="max-w-2xl w-full p-12 text-center shadow-2xl bg-white/95 backdrop-blur-sm border-0 rounded-3xl">
        <Quote className="w-16 h-16 text-soft-purple mx-auto mb-8" />
        
        <h2 className="text-4xl font-comfortaa font-bold text-gray-800 mb-8 leading-relaxed">
          "{currentQuote}"
        </h2>
        
        <div className="flex justify-center mb-8">
          <Heart className="w-8 h-8 text-blush-pink animate-pulse" />
        </div>
        
        <p className="text-lg text-gray-600 mb-10 font-medium">
          Take a moment to breathe. You're exactly where you need to be.
        </p>
        
        <Button 
          onClick={onContinue}
          className="bg-gradient-to-r from-soft-purple to-blush-pink hover:from-soft-purple/80 hover:to-blush-pink/80 text-white font-semibold py-4 px-12 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
        >
          Begin
        </Button>
      </Card>
    </div>
  );
};