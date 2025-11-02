import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Home, Heart, MessageCircleHeart, Sparkles, Users, Settings, Smile, Music } from 'lucide-react';

interface CommunityHomeScreenProps {
  onStartStoryGame: () => void;
  onCheckIn: () => void;
  onVoiceConfession: () => void;
  onSettings: () => void;
  userName?: string;
}

export const CommunityHomeScreen = ({ 
  onStartStoryGame, 
  onCheckIn, 
  onVoiceConfession, 
  onSettings,
  userName = "Friend" 
}: CommunityHomeScreenProps) => {
  const [glow, setGlow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10"></div>
            <div className="flex items-center gap-3">
              <Home className={`w-8 h-8 text-community transition-all duration-500 ${glow ? 'drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]' : ''}`} />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-bold text-community">
                Welcome Home, {userName}
              </h1>
              <Smile className={`w-8 h-8 text-community transition-all duration-500 ${glow ? 'drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]' : ''}`} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
              className="hover:bg-white/20 w-10 h-10"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            A safe space for your mental wellness journey. You're part of a caring community.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Heart-to-Heart Chat */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-community/20 hover:border-community/50">
            <CardContent className="p-6" onClick={onVoiceConfession}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-community to-community/70 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircleHeart className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Heart-to-Heart Chat
                  </h3>
                  <p className="text-xs text-muted-foreground">Express yourself freely</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share what's on your mind in a warm, welcoming, and judgment-free space.
              </p>
            </CardContent>
          </Card>

          {/* Daily Mood Check */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-community/20 hover:border-community/50">
            <CardContent className="p-6" onClick={onCheckIn}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Daily Mood Check
                  </h3>
                  <p className="text-xs text-muted-foreground">How are you today?</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Track your emotional journey and celebrate your progress over time.
              </p>
            </CardContent>
          </Card>

          {/* Wellness Journey */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-community/20 hover:border-community/50">
            <CardContent className="p-6" onClick={onStartStoryGame}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Wellness Journey
                  </h3>
                  <p className="text-xs text-muted-foreground">Interactive experiences</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore guided scenarios designed to build emotional strength and resilience.
              </p>
            </CardContent>
          </Card>

          {/* Community Circle */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-community/20 hover:border-community/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Community Circle
                  </h3>
                  <p className="text-xs text-muted-foreground">You're not alone</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect with others on similar journeys and access helpful resources.
              </p>
            </CardContent>
          </Card>

          {/* Wellness Center */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-community/20 hover:border-community/50 md:col-span-2">
            <CardContent className="p-6" onClick={() => navigate('/relaxation')}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Wellness Center
                  </h3>
                  <p className="text-xs text-muted-foreground">Relaxation music & meditation</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Access calming music and meditation sounds designed to bring you peace and comfort.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Encouraging Message */}
        <Card className="bg-gradient-to-r from-community/10 to-pink-100/50 dark:from-community/20 dark:to-pink-900/30 border-2 border-community/30 animate-fade-in">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-community mx-auto mb-3" />
            <h3 className="text-lg font-comfortaa font-semibold mb-2 text-foreground">
              You're Valued and Supported
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
              Your mental wellness matters deeply. Every step you take toward self-care is meaningful. 
              In this community, you're accepted, understood, and supported exactly as you are. 💖
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
