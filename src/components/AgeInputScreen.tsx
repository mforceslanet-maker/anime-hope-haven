import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Shield, Calendar } from 'lucide-react';

interface AgeInputScreenProps {
  onContinue: (age: number) => void;
}

export const AgeInputScreen = ({ onContinue }: AgeInputScreenProps) => {
  const [age, setAge] = useState('');

  const handleSubmit = () => {
    if (age && parseInt(age) >= 13 && parseInt(age) <= 100) {
      onContinue(parseInt(age));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-sky-blue to-sage-green">
      <Card className="max-w-lg w-full p-10 shadow-2xl bg-white/95 backdrop-blur-sm border-0 rounded-3xl">
        <div className="text-center mb-8">
          <Calendar className="w-16 h-16 text-sky-blue mx-auto mb-6" />
          <h2 className="text-3xl font-comfortaa font-bold text-gray-800 mb-4">
            Please enter your age
          </h2>
          <p className="text-gray-600 text-lg">
            This helps us match you with the right character interactions
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onKeyPress={handleKeyPress}
              min="13"
              max="100"
              className="w-full text-center text-2xl font-semibold py-6 rounded-2xl border-2 border-sky-blue/30 focus:border-sky-blue bg-white/80"
            />
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center gap-3 text-blue-800">
              <Shield className="w-5 h-5" />
              <div className="text-sm">
                <p className="font-semibold">Privacy Protected</p>
                <p>Used only to match character interactions. No data is saved.</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!age || parseInt(age) < 13 || parseInt(age) > 100}
            className="w-full bg-gradient-to-r from-sky-blue to-sage-green hover:from-sky-blue/80 hover:to-sage-green/80 text-white font-semibold py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};