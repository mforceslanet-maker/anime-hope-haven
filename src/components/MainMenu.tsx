import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { UserProfile } from '../types/story';
import { Trophy, Star, Users, Bell, Gift } from 'lucide-react';

interface MainMenuProps {
  userProfile: UserProfile;
  onStartLevel1: () => void;
  onStartLevel2: () => void;
  showLevel2Notification: boolean;
  trialDaysLeft: number;
}

export const MainMenu = ({ 
  userProfile, 
  onStartLevel1, 
  onStartLevel2, 
  showLevel2Notification,
  trialDaysLeft 
}: MainMenuProps) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showLevel2Notification) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevel2Notification]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-soft-purple to-sage-green">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-comfortaa font-bold text-white mb-4">
            Welcome to MyStory
          </h1>
          <p className="text-white/90 text-lg">
            Your personal journey to mental wellness and growth
          </p>
          
          {/* Trial Info */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mt-4">
            <Gift className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              {trialDaysLeft > 0 ? `${trialDaysLeft} days of free trial left` : 'Trial period ended'}
            </span>
          </div>
        </div>

        {/* Level 2 Notification */}
        {showNotification && (
          <Card className="p-6 mb-6 bg-blush-pink/90 backdrop-blur-sm border-blush-pink shadow-lg animate-bounce">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-white" />
              <div>
                <h3 className="text-white font-semibold">Hey there's Level 2!</h3>
                <p className="text-white/90">You'll like it - share your daily experiences with character friends!</p>
              </div>
              <Button
                onClick={() => setShowNotification(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level 1 Card */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <Star className="w-16 h-16 text-soft-green mx-auto mb-4" />
              <h2 className="text-2xl font-comfortaa font-bold text-gray-800 mb-4">
                Level 1: Decision Stories
              </h2>
              <p className="text-gray-600 mb-6">
                Interactive stories that help you learn decision-making through character conversations. 
                Choose the right path and see the positive outcomes!
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">What you'll experience:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Character-driven decision scenarios</li>
                  <li>• Learn from both right and wrong choices</li>
                  <li>• {userProfile.ageGroup === 'teen' ? 'Teen-focused' : 
                           userProfile.ageGroup === 'adult' ? 'Adult-focused' : 'Senior-focused'} situations</li>
                  <li>• {userProfile.category === 'military-student' ? 'Military academy' : 'Military personnel'} themes</li>
                </ul>
              </div>

              <Button 
                onClick={onStartLevel1}
                className="w-full bg-soft-green hover:bg-soft-green/80 text-white font-semibold py-3 rounded-xl"
              >
                Start Level 1
              </Button>
            </div>
          </Card>

          {/* Level 2 Card */}
          <Card className={`p-8 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all ${
            userProfile.level < 2 ? 'opacity-75' : ''
          }`}>
            <div className="text-center">
              <Trophy className="w-16 h-16 text-blush-pink mx-auto mb-4" />
              <h2 className="text-2xl font-comfortaa font-bold text-gray-800 mb-4">
                Level 2: Daily Life Sharing
              </h2>
              <p className="text-gray-600 mb-6">
                {userProfile.level >= 2 
                  ? "Share your daily experiences, achievements, and challenges with your character friends. They'll listen, support, and offer helpful suggestions!"
                  : "Complete Level 1 scenarios to unlock this peaceful space where you can share your daily life with character friends."
                }
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">What you'll experience:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Free conversation with character friends</li>
                  <li>• Share achievements and challenges</li>
                  <li>• Get supportive responses and suggestions</li>
                  <li>• Voice and text input options</li>
                </ul>
              </div>

              <Button 
                onClick={onStartLevel2}
                disabled={userProfile.level < 2}
                className={`w-full font-semibold py-3 rounded-xl ${
                  userProfile.level >= 2
                    ? 'bg-blush-pink hover:bg-blush-pink/80 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {userProfile.level >= 2 ? 'Enter Level 2' : 'Complete Level 1 to Unlock'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Character Preview */}
        <Card className="mt-8 p-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <div className="text-center">
            <Users className="w-8 h-8 text-sage-green mx-auto mb-4" />
            <h3 className="text-xl font-comfortaa font-semibold text-gray-800 mb-4">
              Your Character Friends
            </h3>
            <p className="text-gray-600 mb-4">
              Meet Junno, Lex, Nova, Skye, and Alex - your supportive companions designed to match your age group and provide personalized guidance.
            </p>
            <p className="text-sm text-gray-500">
              All conversations are completely anonymous and private
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};