import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Briefcase, Heart, MessageSquare, TrendingUp, Users, Settings, Star, ArrowLeft } from 'lucide-react';

interface StaffHomeScreenProps {
  onStartStoryGame: () => void;
  onCheckIn: () => void;
  onVoiceConfession: () => void;
  onSettings: () => void;
  onUnitSupport?: () => void;
  onBack?: () => void;
  userName?: string;
}

export const StaffHomeScreen = ({ 
  onStartStoryGame, 
  onCheckIn, 
  onVoiceConfession, 
  onSettings,
  onBack,
  userName = "Team Member" 
}: StaffHomeScreenProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            {onBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-white/20 w-10 h-10"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            ) : (
              <div className="w-10"></div>
            )}
            <div className="flex items-center gap-3">
              <Briefcase className={`w-8 h-8 text-staff transition-all duration-500 ${pulse ? 'scale-110' : 'scale-100'}`} />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-bold text-staff">
                Welcome, {userName}
              </h1>
              <Star className={`w-8 h-8 text-staff transition-all duration-500 ${pulse ? 'scale-110' : 'scale-100'}`} />
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
            Your contributions matter. Take time to prioritize your mental wellness.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Support Session */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-staff/20 hover:border-staff/50">
            <CardContent className="p-6" onClick={onVoiceConfession}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-staff to-staff/70 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Wellness Chat
                  </h3>
                  <p className="text-xs text-muted-foreground">Confidential support</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share your thoughts and feelings in a safe, supportive environment.
              </p>
            </CardContent>
          </Card>

          {/* Mood Tracker */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-staff/20 hover:border-staff/50">
            <CardContent className="p-6" onClick={onCheckIn}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Daily Check-in
                  </h3>
                  <p className="text-xs text-muted-foreground">Track your wellbeing</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor your emotional wellness and identify patterns over time.
              </p>
            </CardContent>
          </Card>

          {/* Growth Journey */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-staff/20 hover:border-staff/50">
            <CardContent className="p-6" onClick={onStartStoryGame}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Personal Growth
                  </h3>
                  <p className="text-xs text-muted-foreground">Interactive scenarios</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Build resilience and emotional intelligence through guided activities.
              </p>
            </CardContent>
          </Card>

          {/* Team Support */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-staff/20 hover:border-staff/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Community Support
                  </h3>
                  <p className="text-xs text-muted-foreground">Connect with others</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Access resources and connect with peers who share similar experiences.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-staff/10 to-blue-100/50 dark:from-staff/20 dark:to-blue-900/30 border-2 border-staff/30 animate-fade-in">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-staff mx-auto mb-3" />
            <h3 className="text-lg font-comfortaa font-semibold mb-2 text-foreground">
              Your Wellbeing Matters
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
              Every role is vital, and so is your mental health. Taking care of yourself isn't selfish—
              it's essential. You deserve support, understanding, and time to recharge. 💙
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
