import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface MotivationalQuoteScreenProps {
  onBegin: () => void;
}

const quotes = [
  "It's okay not to be okay.",
  "You are stronger than you think.",
  "Every small step counts.",
  "Your feelings are valid.",
  "Tomorrow is a new beginning.",
  "You matter, and your story matters."
];

export const MotivationalQuoteScreen = ({ onBegin }: MotivationalQuoteScreenProps) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-purple-50 to-green-100 dark:from-green-900/20 dark:via-purple-900/20 dark:to-green-900/20 p-6">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-comfortaa font-light text-foreground leading-relaxed mb-8">
            "{randomQuote}"
          </h2>
        </div>
        
        <Button 
          onClick={onBegin}
          size="lg"
          className="px-8 py-6 text-lg font-comfortaa bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Begin Your Journey
        </Button>
      </div>
    </div>
  );
};