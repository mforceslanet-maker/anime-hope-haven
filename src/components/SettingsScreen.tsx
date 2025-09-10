import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ArrowLeft, Volume2, VolumeX, Bell, BellOff, Palette } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

const colorThemes = [
  { name: 'Soft Green', value: 'soft-green', color: 'hsl(140, 35%, 75%)' },
  { name: 'Soft Purple', value: 'soft-purple', color: 'hsl(280, 30%, 80%)' },
  { name: 'Sky Blue', value: 'sky-blue', color: 'hsl(200, 40%, 85%)' },
  { name: 'Sage Green', value: 'sage-green', color: 'hsl(150, 25%, 80%)' },
  { name: 'Blush Pink', value: 'blush-pink', color: 'hsl(340, 40%, 85%)' },
];

export const SettingsScreen = ({ onBack }: SettingsScreenProps) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [selectedTheme, setSelectedTheme] = useState('soft-green');

  return (
    <div className="min-h-screen bg-gradient-sage-green">
      <div className="p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-2xl font-comfortaa font-bold text-white">
            Settings
          </h1>

          <div className="w-10 h-10"></div>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Audio Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-6"
          >
            <h2 className="text-xl font-comfortaa font-semibold text-white mb-4 flex items-center gap-3">
              <Volume2 className="w-6 h-6" />
              Audio Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-nunito font-medium">Sound Effects</p>
                  <p className="text-white/70 text-sm">Button clicks and interactions</p>
                </div>
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-white/70" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-white/70" />
                  )}
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-nunito font-medium">Background Music</p>
                  <p className="text-white/70 text-sm">Calming ambient sounds</p>
                </div>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                />
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-6"
          >
            <h2 className="text-xl font-comfortaa font-semibold text-white mb-4 flex items-center gap-3">
              <Bell className="w-6 h-6" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-nunito font-medium">Daily Reminders</p>
                  <p className="text-white/70 text-sm">Gentle check-in reminders</p>
                </div>
                <div className="flex items-center gap-2">
                  {notificationsEnabled ? (
                    <Bell className="w-5 h-5 text-white/70" />
                  ) : (
                    <BellOff className="w-5 h-5 text-white/70" />
                  )}
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
              </div>

              {notificationsEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-4 pl-4 border-l border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white/90 font-nunito">Reminder Time</p>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-6"
          >
            <h2 className="text-xl font-comfortaa font-semibold text-white mb-4 flex items-center gap-3">
              <Palette className="w-6 h-6" />
              Color Themes
            </h2>

            <p className="text-white/70 text-sm mb-4">
              Choose your favorite color theme for the app
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorThemes.map((theme) => (
                <motion.button
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    selectedTheme === theme.value
                      ? 'border-white bg-white/20'
                      : 'border-white/30 bg-white/10 hover:bg-white/15'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: theme.color }}
                  />
                  <p className="text-white text-sm font-nunito">{theme.name}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Privacy Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6"
          >
            <h2 className="text-xl font-comfortaa font-semibold text-white mb-4 flex items-center gap-3">
              🔒 Privacy & Data
            </h2>

            <div className="space-y-3 text-white/80 font-nunito">
              <p className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                No personal data is stored
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                Anonymous usage only
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                Age used only for character matching
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                4-day free trial active
              </p>
            </div>
          </motion.div>

          {/* Reset Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Reset All Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};