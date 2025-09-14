import { useEffect } from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-sky-50 to-blue-100 dark:from-pink-900/20 dark:via-sky-900/20 dark:to-blue-900/20">
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
          <h1 className="text-5xl font-comfortaa font-bold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
            MyStory
          </h1>
          <Heart className="w-12 h-12 text-sky-500 animate-pulse" />
        </div>
        <p className="text-xl text-muted-foreground animate-fade-in delay-500">
          Welcome to My Story
        </p>
      </div>
    </div>
  );
};