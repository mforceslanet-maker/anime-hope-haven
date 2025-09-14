import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Users } from 'lucide-react';

interface AgeInputScreenProps {
  onContinue: (age: number) => void;
}

export const AgeInputScreen = ({ onContinue }: AgeInputScreenProps) => {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    
    if (!age || ageNum < 5 || ageNum > 100) {
      setError('Please enter a valid age between 5 and 100');
      return;
    }
    
    setError('');
    onContinue(ageNum);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-3xl p-8 shadow-xl border border-border animate-fade-in">
          <div className="text-center mb-6">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-comfortaa font-semibold text-foreground mb-2">
              Tell Us About You
            </h2>
            <p className="text-muted-foreground">
              Please enter your age
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Your Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="text-center text-lg h-12"
                min="5"
                max="100"
              />
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-comfortaa"
              disabled={!age}
            >
              Continue
            </Button>
          </form>

          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>
                Used only to match the right character interactions. No data is saved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};