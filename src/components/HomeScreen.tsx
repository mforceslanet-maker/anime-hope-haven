import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { UserProfile } from '../types/story';
import { Gamepad2, Heart, Mic, Bell, Settings, ArrowRight } from 'lucide-react';

interface HomeScreenProps {
  userProfile: UserProfile;
  onStartStoryGame: () => void;
  onDailyCheckIn: () => void;
  onSpeakFeelings: () => void;
  onSettings: () => void;
}

export const HomeScreen = ({ 
  userProfile, 
  onStartStoryGame, 
  onDailyCheckIn, 
  onSpeakFeelings,
  onSettings 
}: HomeScreenProps) => {
  const [showReminder, setShowReminder] = useState(false);
  const [currentBgColor, setCurrentBgColor] = useState(0);

  const bgColors = [
    'from-blush-pink to-soft-purple',
    'from-sage-green to-sky-blue', 
    'from-soft-green to-blush-pink',
    'from-sky-blue to-sage-green',
    'from-soft-purple to-soft-green'
  ];

  useEffect(() => {
    // Show reminder popup after 5 seconds
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 5000);

    // Rotate background colors every 10 seconds
    const bgTimer = setInterval(() => {
      setCurrentBgColor(prev => (prev + 1) % bgColors.length);
    }, 10000);

    return () => {
      clearTimeout(reminderTimer);
      clearInterval(bgTimer);
    };
  }, []);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! Ready to start your day?";
    if (hour < 18) return "Good afternoon! How's your day going?";
    return "Good evening! Time to reflect on your day?";
  };

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${bgColors[currentBgColor]} transition-all duration-1000`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Card className="inline-block p-6 bg-white/90 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
            <h1 className="text-3xl font-comfortaa font-bold text-gray-800 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {getWelcomeMessage()}
            </p>
          </Card>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Start Story Game */}
          <Card 
            className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={onStartStoryGame}
          >
            <div className="text-center">
              <Gamepad2 className="w-16 h-16 text-soft-purple mx-auto mb-4" />
              <h3 className="text-xl font-comfortaa font-bold text-gray-800 mb-3">
                🕹 Start Story Game
              </h3>
              <p className="text-gray-600 mb-4">
                Interactive stories that help you make better decisions in life
              </p>
              <Button className="w-full bg-soft-purple hover:bg-soft-purple/80 text-white">
                Play Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Daily Check-in */}
          <Card 
            className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={onDailyCheckIn}
          >
            <div className="text-center">
              <Heart className="w-16 h-16 text-blush-pink mx-auto mb-4" />
              <h3 className="text-xl font-comfortaa font-bold text-gray-800 mb-3">
                🧘‍♀ Check-in
              </h3>
              <p className="text-gray-600 mb-4">
                Track your daily mood and emotional wellbeing
              </p>
              <Button className="w-full bg-blush-pink hover:bg-blush-pink/80 text-white">
                Check In <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Speak Your Feelings */}
          <Card 
            className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={onSpeakFeelings}
          >
            <div className="text-center">
              <Mic className="w-16 h-16 text-sage-green mx-auto mb-4" />
              <h3 className="text-xl font-comfortaa font-bold text-gray-800 mb-3">
                🎤 Speak or Type
              </h3>
              <p className="text-gray-600 mb-4">
                Share your feelings with a caring character friend
              </p>
              <Button className="w-full bg-sage-green hover:bg-sage-green/80 text-white">
                Share Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Settings Button */}
        <div className="text-center">
          <Button
            onClick={onSettings}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-white/50 hover:bg-white/90 text-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Reminder Popup */}
        {showReminder && (
          <div className="fixed bottom-6 right-6 max-w-sm">
            <Card className="p-4 bg-sky-blue/90 backdrop-blur-sm border-0 rounded-2xl shadow-xl animate-bounce">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-white" />
                <div className="flex-1">
                  <p className="text-white font-semibold">Hey there!</p>
                  <p className="text-white/90 text-sm">Don't forget to check in. Your wellbeing matters! 💙</p>
                </div>
                <Button
                  onClick={() => setShowReminder(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};