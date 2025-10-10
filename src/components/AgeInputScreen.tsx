import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Users, Briefcase, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AgeInputScreenProps {
  onContinue: (age: number, profession?: string) => void;
}

const DEFAULT_PROFESSIONS = [
  'Military Student',
  'Military Personnel',
  'Healthcare Professional',
  'Teacher/Educator',
  'Engineer',
  'Business Professional',
  'Student',
  'Other'
];

export const AgeInputScreen = ({ onContinue }: AgeInputScreenProps) => {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [profession, setProfession] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [professions, setProfessions] = useState<string[]>(DEFAULT_PROFESSIONS);

  useEffect(() => {
    const saved = localStorage.getItem('customProfessions');
    if (saved) {
      const custom = JSON.parse(saved);
      setProfessions([...DEFAULT_PROFESSIONS, ...custom]);
    }
  }, []);

  const handleAddCustomProfession = () => {
    if (customProfession.trim()) {
      const saved = localStorage.getItem('customProfessions');
      const existing = saved ? JSON.parse(saved) : [];
      const updated = [...existing, customProfession.trim()];
      localStorage.setItem('customProfessions', JSON.stringify(updated));
      setProfessions([...DEFAULT_PROFESSIONS, ...updated]);
      setProfession(customProfession.trim());
      setCustomProfession('');
      setShowCustomInput(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    
    if (!age || ageNum < 5 || ageNum > 100) {
      setError('Please enter a valid age between 5 and 100');
      return;
    }
    
    setError('');
    const finalProfession = profession === 'Other' ? undefined : profession || undefined;
    onContinue(ageNum, finalProfession);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-border animate-fade-in">
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

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Your Profession (Optional)
              </Label>
              <Select value={profession} onValueChange={(value) => {
                if (value === 'add_new') {
                  setShowCustomInput(true);
                } else {
                  setProfession(value);
                  setShowCustomInput(false);
                }
              }}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                  <SelectItem value="add_new" className="text-primary font-medium">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Custom Profession
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {showCustomInput && (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter your profession"
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                    className="h-10"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddCustomProfession}
                    disabled={!customProfession.trim()}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
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