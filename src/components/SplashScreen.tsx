import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Heart, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush-pink to-sky-blue">
      <Card className="text-center p-12 bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl">
        <div className="relative">
          {/* Animated Logo */}
          <div className="animate-pulse mb-8">
            <Heart className="w-20 h-20 text-blush-pink mx-auto mb-4 animate-bounce" />
            <Sparkles className="w-12 h-12 text-sky-blue mx-auto absolute -top-2 -right-2 animate-spin" />
          </div>
          
          {/* App Title */}
          <h1 className="text-5xl font-comfortaa font-bold bg-gradient-to-r from-blush-pink to-sky-blue bg-clip-text text-transparent mb-4 animate-fade-in">
            My Story
          </h1>
          
          <p className="text-lg text-gray-600 font-medium animate-fade-in">
            Your journey to wellness begins here
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-3 h-3 bg-blush-pink rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-sky-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-sage-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Card>
    </div>
  );
};