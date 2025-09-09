import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Heart, Users, GraduationCap } from 'lucide-react';

interface AgeOnboardingProps {
  onComplete: (age: number, category: 'military-student' | 'military-personnel') => void;
}

export const AgeOnboarding = ({ onComplete }: AgeOnboardingProps) => {
  const [age, setAge] = useState('');
  const [category, setCategory] = useState<'military-student' | 'military-personnel' | null>(null);
  const [showMotivation, setShowMotivation] = useState(true);

  const handleSubmit = () => {
    if (age && category && parseInt(age) >= 13) {
      onComplete(parseInt(age), category);
    }
  };

  const motivationalMessages = [
    "It's okay not to be okay. You're brave for being here. 💙",
    "Every warrior needs support. You're not alone in this journey. 🌟",
    "Seeking help is a sign of strength, not weakness. 💪",
    "Your mental health matters as much as your physical health. 🌱",
    "Today is a new day to prioritize your wellbeing. ✨"
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  if (showMotivation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-soft-green to-sky-blue">
        <Card className="max-w-md w-full p-8 text-center shadow-2xl bg-white/95 backdrop-blur-sm">
          <Heart className="w-16 h-16 text-blush-pink mx-auto mb-6" />
          <h2 className="text-2xl font-comfortaa font-bold mb-4 text-gray-800">
            Welcome to MyStory
          </h2>
          <p className="text-lg text-gray-700 mb-8 font-medium">
            {randomMessage}
          </p>
          <Button 
            onClick={() => setShowMotivation(false)}
            className="w-full bg-soft-purple hover:bg-soft-purple/80 text-white font-semibold py-3 rounded-xl"
          >
            Continue Your Journey
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-soft-purple to-blush-pink">
      <Card className="max-w-lg w-full p-8 shadow-2xl bg-white/95 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-comfortaa font-bold mb-4 text-gray-800">
            Let's Get Started
          </h2>
          <p className="text-gray-600">
            Help us personalize your experience by sharing a bit about yourself
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your age?
            </label>
            <Input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="13"
              max="100"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us match you with age-appropriate content
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Which describes you best?
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setCategory('military-student')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  category === 'military-student' 
                    ? 'border-soft-green bg-soft-green/20' 
                    : 'border-gray-200 hover:border-soft-green/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-soft-green" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Military Student</h3>
                    <p className="text-sm text-gray-600">Cadet, academy student, or in training</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCategory('military-personnel')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  category === 'military-personnel' 
                    ? 'border-soft-purple bg-soft-purple/20' 
                    : 'border-gray-200 hover:border-soft-purple/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-soft-purple" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">Military Personnel</h3>
                    <p className="text-sm text-gray-600">Active duty, veteran, or family member</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!age || !category || parseInt(age) < 13}
            className="w-full bg-sage-green hover:bg-sage-green/80 text-white font-semibold py-3 rounded-xl mt-8"
          >
            Start My Journey
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your information is completely anonymous and private
        </p>
      </Card>
    </div>
  );
};