import { Character } from '../types/character';
import { Button } from './ui/button';
import { ArrowLeft, Star, Heart, Smile, Sun, Moon } from 'lucide-react';

interface WellnessDashboardProps {
  character: Character;
  onBack: () => void;
  onStartChat: () => void;
}

export const WellnessDashboard = ({ character, onBack, onStartChat }: WellnessDashboardProps) => {
  const dailyTips = [
    {
      icon: Sun,
      title: "Morning Mindfulness",
      description: "Start your day with 3 deep breaths and one thing you're grateful for.",
      color: 'excited'
    },
    {
      icon: Heart,
      title: "Connection Time",
      description: "Reach out to someone you care about today - even a simple message counts.",
      color: 'happy'
    },
    {
      icon: Star,
      title: "Small Victory",
      description: "Celebrate one small thing you accomplished today, no matter how tiny.",
      color: 'calm'
    },
    {
      icon: Moon,
      title: "Evening Reflection",
      description: "Before bed, think of one moment today that brought you peace.",
      color: 'yuki'
    }
  ];

  const quickActivities = [
    "5-minute breathing exercise",
    "Write three good things from today",
    "Listen to calming music",
    "Take a gentle walk",
    "Chat with a friend"
  ];

  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <img
              src={character.image}
              alt={character.name}
              className="w-12 h-12 rounded-full object-cover shadow-character"
            />
            <div>
              <h1 className="text-2xl font-comfortaa font-bold">Wellness Dashboard</h1>
              <p className="text-muted-foreground">with {character.name}</p>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-card rounded-2xl p-6 shadow-gentle mb-8">
          <div className="flex items-start gap-4">
            <img
              src={character.image}
              alt={character.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="font-comfortaa font-semibold text-lg mb-2">
                Welcome back, friend! 🌟
              </h2>
              <p className="text-muted-foreground mb-4">
                I'm so glad you're here today. Remember, taking care of your mental health is just as important as taking care of your body. You're doing something wonderful by being here.
              </p>
              <Button 
                onClick={onStartChat}
                className="mb-2"
                style={{
                  backgroundColor: `hsl(var(--${character.color}))`,
                  color: 'white',
                }}
              >
                Continue our conversation
              </Button>
            </div>
          </div>
        </div>

        {/* Daily Wellness Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-comfortaa font-semibold">Daily Wellness Tips</h3>
            {dailyTips.map((tip, index) => (
              <div key={index} className="bg-card rounded-xl p-4 shadow-gentle hover:shadow-float transition-shadow">
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `hsl(var(--${tip.color}) / 0.2)` }}
                  >
                    <tip.icon 
                      className="w-5 h-5"
                      style={{ color: `hsl(var(--${tip.color}))` }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Activities */}
          <div className="space-y-4">
            <h3 className="text-xl font-comfortaa font-semibold">Quick Feel-Good Activities</h3>
            <div className="bg-card rounded-xl p-4 shadow-gentle">
              <p className="text-sm text-muted-foreground mb-3">
                When you need a quick mood boost, try one of these:
              </p>
              <div className="space-y-2">
                {quickActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    <span className="text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breathing Exercise */}
            <div className="bg-card rounded-xl p-6 shadow-gentle text-center">
              <h4 className="font-comfortaa font-semibold mb-3">Calm Your Mind</h4>
              <div className="breathing-circle mx-auto mb-4 border-primary/30"></div>
              <p className="text-sm text-muted-foreground">
                Breathe in for 4 counts, hold for 4, breathe out for 4. Follow the circle.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Support Notice */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center">
          <h4 className="font-comfortaa font-semibold text-destructive mb-2">
            Need Immediate Support?
          </h4>
          <p className="text-sm text-destructive/80 mb-3">
            If you're having thoughts of hurting yourself or others, please reach out for immediate help:
          </p>
          <div className="text-sm space-y-1">
            <div>🇺🇸 Crisis Text Line: Text HOME to 741741</div>
            <div>📞 National Suicide Prevention Lifeline: 988</div>
            <div>🏥 Military Family Life Counselor (MFLC) at your installation</div>
          </div>
        </div>
      </div>
    </div>
  );
};