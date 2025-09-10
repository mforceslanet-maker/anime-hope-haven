import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface AgeInputScreenProps {
  onContinue: (age: number) => void;
}

export const AgeInputScreen = ({ onContinue }: AgeInputScreenProps) => {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      setError('Please enter a valid age between 13 and 100');
      return;
    }
    setError('');
    onContinue(ageNum);
  };

  return (
    <div className="min-h-screen bg-gradient-soft-purple flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-float"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-16 h-16 mx-auto mb-6 bg-white/30 rounded-full flex items-center justify-center"
        >
          <span className="text-2xl">🎂</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-comfortaa font-semibold text-white text-center mb-4"
        >
          Please enter your age
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-center mb-8 font-nunito"
        >
          Used only to match the right character interactions. No data is saved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <Input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="text-center text-2xl py-6 bg-white/10 border-white/20 text-white placeholder-white/60 rounded-xl"
            min="13"
            max="100"
          />
          
          {error && (
            <p className="text-red-200 text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 py-6 text-lg font-nunito font-medium rounded-xl transition-all duration-300"
            disabled={!age}
          >
            Continue
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-white/60 text-sm">
            <span>🔒</span>
            <span>Anonymous & Private</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};