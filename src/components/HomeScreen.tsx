import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Gamepad2, Heart, Mic, Settings, Bell } from 'lucide-react';

interface HomeScreenProps {
  onStartStoryGame: () => void;
  onCheckIn: () => void;
  onVoiceConfession: () => void;
  onSettings: () => void;
  userName?: string;
}

export const HomeScreen = ({ 
  onStartStoryGame, 
  onCheckIn, 
  onVoiceConfession, 
  onSettings,
  userName = "Friend" 
}: HomeScreenProps) => {
  const [showReminder, setShowReminder] = useState(false);
  const [bgGradient, setBgGradient] = useState(0);

  const gradients = [
    'from-pink-100 via-rose-50 to-pink-100',
    'from-green-100 via-emerald-50 to-green-100',
    'from-blue-100 via-sky-50 to-blue-100',
    'from-purple-100 via-lavender-50 to-purple-100'
  ];

  useEffect(() => {
    // Show reminder after 10 seconds
    const reminderTimer = setTimeout(() => {
      setShowReminder(true);
    }, 10000);

    // Rotate background colors every 30 seconds
    const bgTimer = setInterval(() => {
      setBgGradient((prev) => (prev + 1) % gradients.length);
    }, 30000);

    return () => {
      clearTimeout(reminderTimer);
      clearInterval(bgTimer);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradients[bgGradient]} dark:from-pink-900/20 dark:via-rose-900/20 dark:to-pink-900/20 transition-all duration-1000 p-6`}>
      {/* Reminder Popup */}
      {showReminder && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <Card className="bg-card border border-border shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground">
                  Hey there! Don't forget to check in.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReminder(false)}
                  className="h-6 w-6 p-0 ml-2"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h1 className="text-3xl font-comfortaa font-bold text-foreground">
              Welcome back, {userName}!
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
              className="hover:bg-white/20"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Story Game */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={onStartStoryGame}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-comfortaa font-semibold mb-2">
                Start Story Game
              </h3>
              <p className="text-muted-foreground text-sm">
                Join your characters on an emotional journey
              </p>
            </CardContent>
          </Card>

          {/* Check-in */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={onCheckIn}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-comfortaa font-semibold mb-2">
                Daily Check-in
              </h3>
              <p className="text-muted-foreground text-sm">
                Track your mood and emotional wellness
              </p>
            </CardContent>
          </Card>

          {/* Voice/Text Feelings */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={onVoiceConfession}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-comfortaa font-semibold mb-2">
                Share Your Feelings
              </h3>
              <p className="text-muted-foreground text-sm">
                Speak or type what's on your mind today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 animate-fade-in">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-comfortaa font-semibold mb-2">
              You're Doing Great!
            </h3>
            <p className="text-muted-foreground">
              Every step forward is progress. Your mental wellness journey matters, and we're here to support you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};