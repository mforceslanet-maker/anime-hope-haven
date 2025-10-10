import { Button } from './ui/button';
import { Heart, Sparkles, Star } from 'lucide-react';

interface PersonalizedMotivationalScreenProps {
  profession?: string;
  age: number;
  onContinue: () => void;
}

const motivationalMessages: Record<string, string[]> = {
  'Military Student': [
    "Your dedication to serve is admirable. Remember, even the strongest warriors need rest.",
    "Every step in your training is a step towards greatness. Be proud of how far you've come.",
    "Your commitment to excellence inspires others. Take a moment to appreciate your journey."
  ],
  'Military Personnel': [
    "Your service protects and inspires. Your mental wellness matters just as much as your physical strength.",
    "Thank you for your dedication. Remember, asking for help is a sign of strength, not weakness.",
    "You've faced challenges with courage. Now, let us support you on your wellness journey."
  ],
  'Healthcare Worker': [
    "You care for others every day. Now it's time to care for yourself.",
    "Your compassion heals others. Remember to show that same compassion to yourself.",
    "You're a hero in your field. Even heroes need support and rest."
  ],
  'Teacher': [
    "You shape minds and futures. Don't forget to nurture your own wellbeing.",
    "Your patience and dedication inspire growth. Now grow your own peace of mind.",
    "You give so much to others. It's okay to take time for yourself."
  ],
  'Student': [
    "Your future is bright, and your wellbeing matters. We're here to support you.",
    "Learning and growing can be challenging. You're doing great, and you deserve support.",
    "Your mental health is as important as your grades. Let's work on both together."
  ],
  'default': [
    "Your wellbeing matters. We're here to support you on your journey.",
    "Taking care of your mental health is one of the bravest things you can do.",
    "You're not alone. We're here to help you find peace and strength.",
    "Every journey begins with a single step. Thank you for taking yours today."
  ]
};

const relaxationTips = [
  "Take three deep breaths - in through your nose, out through your mouth.",
  "This is a safe space. There's no judgment here, only support.",
  "Remember: It's okay to not be okay. What matters is that you're here.",
  "Your feelings are valid, and your story matters."
];

export const PersonalizedMotivationalScreen = ({ 
  profession, 
  age, 
  onContinue 
}: PersonalizedMotivationalScreenProps) => {
  const messages = profession && motivationalMessages[profession] 
    ? motivationalMessages[profession]
    : motivationalMessages.default;
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const randomTip = relaxationTips[Math.floor(Math.random() * relaxationTips.length)];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 p-4 sm:p-6">
      <div className="text-center max-w-3xl mx-auto animate-fade-in">
        <div className="mb-8 flex justify-center gap-4">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500 animate-pulse" />
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <Star className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>

        <div className="space-y-8 mb-10">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-light text-foreground leading-relaxed mb-4">
              {randomMessage}
            </h2>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
            <p className="text-lg sm:text-xl font-comfortaa text-foreground/80 italic">
              💫 {randomTip}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm sm:text-base text-foreground/60 font-comfortaa mb-6">
            Take a moment to breathe. When you're ready, let's continue your journey.
          </p>
          
          <Button 
            onClick={onContinue}
            size="lg"
            className="px-8 py-6 text-lg font-comfortaa bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto min-h-[48px]"
          >
            I'm Ready to Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
