import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { UserProfile } from '../types/story';
import { Settings, Palette, Volume2, Bell, ArrowLeft, Trash2 } from 'lucide-react';

interface SettingsScreenProps {
  userProfile: UserProfile;
  onBack: () => void;
  onResetData: () => void;
}

export const SettingsScreen = ({ userProfile, onBack, onResetData }: SettingsScreenProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('default');

  const colorThemes = [
    { id: 'default', name: 'Soft & Calm', colors: 'from-blush-pink to-sage-green' },
    { id: 'ocean', name: 'Ocean Breeze', colors: 'from-sky-blue to-soft-green' },
    { id: 'sunset', name: 'Warm Sunset', colors: 'from-soft-purple to-blush-pink' },
    { id: 'nature', name: 'Nature Harmony', colors: 'from-sage-green to-sky-blue' },
    { id: 'peaceful', name: 'Peaceful Purple', colors: 'from-soft-purple to-sky-blue' }
  ];

  const handleResetConfirm = () => {
    if (window.confirm('Are you sure you want to reset all your data? This will clear your progress and start fresh.')) {
      onResetData();
    }
  };

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${colorThemes.find(t => t.id === currentTheme)?.colors || 'from-blush-pink to-sage-green'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-comfortaa font-bold text-white">Settings</h1>
            <p className="text-white/90">Customize your My Story experience</p>
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-8 h-8 text-soft-purple" />
              <h2 className="text-2xl font-comfortaa font-bold text-gray-800">Audio</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Sound Effects</h3>
                  <p className="text-sm text-gray-600">Button clicks and interaction sounds</p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Background Music</h3>
                  <p className="text-sm text-gray-600">Calming music during celebrations</p>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-8 h-8 text-blush-pink" />
              <h2 className="text-2xl font-comfortaa font-bold text-gray-800">Notifications</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Check-in Reminders</h3>
                  <p className="text-sm text-gray-600">Gentle reminders to check in on your wellbeing</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">
                  Reminders help you maintain consistent self-care habits. You can always turn them off if needed.
                </p>
              </div>
            </div>
          </Card>

          {/* Color Theme Settings */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-8 h-8 text-sage-green" />
              <h2 className="text-2xl font-comfortaa font-bold text-gray-800">Color Themes</h2>
            </div>

            <p className="text-gray-600 mb-6">Choose colors that make you feel most comfortable and peaceful</p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    currentTheme === theme.id 
                      ? 'border-gray-800 scale-105' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-full h-20 rounded-xl bg-gradient-to-br ${theme.colors} mb-3`}></div>
                  <h4 className="font-semibold text-gray-800 text-sm">{theme.name}</h4>
                </button>
              ))}
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-gray-600" />
              <h2 className="text-2xl font-comfortaa font-bold text-gray-800">Privacy & Data</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Your Privacy is Protected</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• All conversations are completely anonymous</li>
                  <li>• No personal profile data is collected or stored</li>
                  <li>• Your age is only used to match appropriate content</li>
                  <li>• All data stays on your device</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Reset All Data</h3>
                    <p className="text-sm text-gray-600">
                      Clear all your progress and start fresh. This cannot be undone.
                    </p>
                  </div>
                  <Button
                    onClick={handleResetConfirm}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="text-center bg-gray-50 rounded-2xl p-4">
                <p className="text-sm text-gray-600">
                  <strong>Current Status:</strong> Level {userProfile.level} • Age Group: {userProfile.ageGroup} • 
                  Category: {userProfile.category === 'military-student' ? 'Military Student' : 'Military Personnel'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};