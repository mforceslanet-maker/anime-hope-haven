import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shield, Heart, Radio, Activity, BookOpen, Users, Settings, ArrowLeft } from 'lucide-react';

interface MilitaryHomeScreenProps {
  onStartStoryGame: () => void;
  onCheckIn: () => void;
  onVoiceConfession: () => void;
  onSettings: () => void;
  onUnitSupport: () => void;
  onBack?: () => void;
  userName?: string;
}

export const MilitaryHomeScreen = ({ 
  onStartStoryGame, 
  onCheckIn, 
  onVoiceConfession, 
  onSettings,
  onUnitSupport,
  onBack,
  userName = "Soldier" 
}: MilitaryHomeScreenProps) => {
  const [tacticalGlow, setTacticalGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTacticalGlow(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 relative overflow-hidden">
      {/* Military Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header with Military Theme */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            {onBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-white/10 w-10 h-10 text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            ) : (
              <div className="w-10"></div>
            )}
            <div className="flex items-center gap-3">
              <Shield className={`w-8 h-8 text-military transition-all duration-500 ${tacticalGlow ? 'drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : ''}`} />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-bold text-white">
                Mission Control, {userName}
              </h1>
              <Shield className={`w-8 h-8 text-military transition-all duration-500 ${tacticalGlow ? 'drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : ''}`} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
              className="hover:bg-white/10 w-10 h-10 text-white"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {/* Status Bar */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-military/20 backdrop-blur-sm rounded-full border border-military/30 mb-6">
            <Activity className="w-4 h-4 text-military animate-pulse" />
            <span className="text-sm font-medium text-military">Systems Online • Mental Wellness Active</span>
          </div>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Tactical Support Session */}
          <Card className="group bg-slate-800/50 backdrop-blur-sm border-2 border-military/30 hover:border-military hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6" onClick={onVoiceConfession}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-military/20 rounded-lg flex items-center justify-center border border-military/30 group-hover:bg-military/30 transition-all">
                  <Radio className="w-7 h-7 text-military" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-white mb-1">
                    Tactical Support Session
                  </h3>
                  <p className="text-xs text-slate-300">Secure communication channel</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Connect with Dr. Morgan for confidential support. Your mental readiness is mission critical.
              </p>
            </CardContent>
          </Card>

          {/* Wellness Check-In */}
          <Card className="group bg-slate-800/50 backdrop-blur-sm border-2 border-military/30 hover:border-military hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6" onClick={onCheckIn}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-military/20 rounded-lg flex items-center justify-center border border-military/30 group-hover:bg-military/30 transition-all">
                  <Heart className="w-7 h-7 text-military" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-white mb-1">
                    Daily Wellness Report
                  </h3>
                  <p className="text-xs text-slate-300">Mental fitness tracking</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Log your emotional status and track your mental wellness journey.
              </p>
            </CardContent>
          </Card>

          {/* Resilience Training */}
          <Card className="group bg-slate-800/50 backdrop-blur-sm border-2 border-military/30 hover:border-military hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6" onClick={onStartStoryGame}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-military/20 rounded-lg flex items-center justify-center border border-military/30 group-hover:bg-military/30 transition-all">
                  <BookOpen className="w-7 h-7 text-military" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-white mb-1">
                    Resilience Training
                  </h3>
                  <p className="text-xs text-slate-300">Interactive scenario exercises</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Build mental toughness through guided scenarios and emotional training.
              </p>
            </CardContent>
          </Card>

          {/* Unit Support Network */}
          <Card className="group bg-slate-800/50 backdrop-blur-sm border-2 border-military/30 hover:border-military hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6" onClick={onUnitSupport}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-military/20 rounded-lg flex items-center justify-center border border-military/30 group-hover:bg-military/30 transition-all">
                  <Users className="w-7 h-7 text-military" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-comfortaa font-semibold text-white mb-1">
                    Unit Support Network
                  </h3>
                  <p className="text-xs text-slate-300">Community resources</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Access peer support and military family resources. No one serves alone.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Brief */}
        <Card className="bg-slate-800/30 backdrop-blur-sm border-2 border-military/20 animate-fade-in">
          <CardContent className="p-6 text-center">
            <Shield className="w-8 h-8 text-military mx-auto mb-3" />
            <h3 className="text-lg font-comfortaa font-semibold text-white mb-2">
              Mission Brief: Mental Wellness Priority
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto">
              Your mental readiness is as vital as physical readiness. Taking care of your mental health 
              is not a sign of weakness—it's a demonstration of strength and tactical awareness. 
              Stay mission-ready. Stay resilient. 🎖️
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
