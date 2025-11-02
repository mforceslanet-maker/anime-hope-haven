import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { BookHeart, Heart, MessageCircle, GraduationCap, Users, Settings, Sparkles, ArrowLeft, Music } from 'lucide-react';

interface TeacherHomeScreenProps {
  onStartStoryGame: () => void;
  onCheckIn: () => void;
  onVoiceConfession: () => void;
  onSettings: () => void;
  onUnitSupport?: () => void;
  onBack?: () => void;
  userName?: string;
}

export const TeacherHomeScreen = ({ 
  onStartStoryGame, 
  onCheckIn, 
  onVoiceConfession, 
  onSettings,
  onBack,
  userName = "Educator" 
}: TeacherHomeScreenProps) => {
  const [sparkle, setSparkle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkle(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 p-4 sm:p-6">
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
              <GraduationCap className={`w-8 h-8 text-teacher transition-all duration-500 ${sparkle ? 'scale-110' : 'scale-100'}`} />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-bold text-teacher">
                Welcome, {userName}
              </h1>
              <Sparkles className={`w-8 h-8 text-teacher transition-all duration-500 ${sparkle ? 'scale-110' : 'scale-100'}`} />
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
            You inspire minds every day. Now it's time to nurture your own wellbeing.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Educator Support Chat */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-teacher/20 hover:border-teacher/50">
            <CardContent className="p-6" onClick={onVoiceConfession}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teacher to-teacher/70 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Teacher's Lounge
                  </h3>
                  <p className="text-xs text-muted-foreground">Safe space for educators</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share your challenges and successes in a supportive, judgment-free environment.
              </p>
            </CardContent>
          </Card>

          {/* Wellbeing Check */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-teacher/20 hover:border-teacher/50">
            <CardContent className="p-6" onClick={onCheckIn}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Daily Self-Check
                  </h3>
                  <p className="text-xs text-muted-foreground">Monitor your wellbeing</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Track your emotional health and identify patterns in your teaching journey.
              </p>
            </CardContent>
          </Card>

          {/* Reflective Journaling */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-teacher/20 hover:border-teacher/50">
            <CardContent className="p-6" onClick={onStartStoryGame}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <BookHeart className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Reflective Journey
                  </h3>
                  <p className="text-xs text-muted-foreground">Interactive mindfulness</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Explore guided scenarios to process emotions and build resilience.
              </p>
            </CardContent>
          </Card>

          {/* Educator Community */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-teacher/20 hover:border-teacher/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-foreground mb-1">
                    Educator Network
                  </h3>
                  <p className="text-xs text-muted-foreground">Connect with peers</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Access resources and connect with fellow educators who understand your journey.
              </p>
            </CardContent>
          </Card>

          {/* Wellness Center */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-teacher/20 hover:border-teacher/50 md:col-span-2">
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
                Access curated relaxation music designed specifically for educators. Find your moment of peace.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inspirational Message */}
        <Card className="bg-gradient-to-r from-teacher/10 to-amber-100/50 dark:from-teacher/20 dark:to-amber-900/30 border-2 border-teacher/30 animate-fade-in">
          <CardContent className="p-6 text-center">
            <GraduationCap className="w-8 h-8 text-teacher mx-auto mb-3" />
            <h3 className="text-lg font-comfortaa font-semibold mb-2 text-foreground">
              You're Making a Difference
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl mx-auto">
              Behind every successful student is a dedicated teacher. Remember to care for yourself 
              with the same compassion you show your students. Your wellbeing enables you to inspire and educate. 📚✨
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
