import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Users } from 'lucide-react';

interface AgeInputScreenProps {
  onContinue: (age: number, profession?: string, idNumber?: string) => void;
}

const PROFESSIONS = [
  { value: 'Military Student', label: 'Military Students', idLabel: 'Admission Number', idPlaceholder: 'Enter your admission number' },
  { value: 'Military Personnel', label: 'Military Personnel', idLabel: 'Service Number', idPlaceholder: 'Enter your service number' },
  { value: 'Subordinate Staff', label: 'Subordinate Staffs', idLabel: 'Employee Number', idPlaceholder: 'Enter your employee number' },
  { value: 'Teacher', label: 'Teachers', idLabel: 'TSC Number', idPlaceholder: 'Enter your TSC number' },
  { value: 'Community', label: 'Community', idLabel: 'ID Number', idPlaceholder: 'Enter your ID number' }
];

export const AgeInputScreen = ({ onContinue }: AgeInputScreenProps) => {
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idError, setIdError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    
    if (!age || ageNum < 5 || ageNum > 120) {
      setError('Please enter a valid age between 5 and 120');
      return;
    }

    if (!selectedProfession) {
      setError('Please select your profession');
      return;
    }

    if (!idNumber.trim()) {
      setIdError('This field is required');
      return;
    }
    
    setError('');
    setIdError('');
    onContinue(ageNum, selectedProfession, idNumber.trim());
  };

  const selectedProfessionData = PROFESSIONS.find(p => p.value === selectedProfession);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border border-border animate-fade-in">
          <div className="text-center mb-6">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-comfortaa font-semibold text-foreground mb-2">
              Tell Us About You
            </h2>
            <p className="text-muted-foreground text-sm">
              Help us personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Your Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setError('');
                }}
                className="text-center text-lg h-12"
                min="5"
                max="120"
              />
            </div>

            {/* Profession Selection */}
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm font-medium">
                Your Profession
              </Label>
              <select
                id="profession"
                value={selectedProfession}
                onChange={(e) => {
                  setSelectedProfession(e.target.value);
                  setIdNumber('');
                  setIdError('');
                  setError('');
                }}
                className="w-full h-12 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select your profession</option>
                {PROFESSIONS.map((prof) => (
                  <option key={prof.value} value={prof.value}>
                    {prof.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ID Number Input - Shows when profession is selected */}
            {selectedProfessionData && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="idNumber" className="text-sm font-medium">
                  {selectedProfessionData.idLabel}
                </Label>
                <Input
                  id="idNumber"
                  type="text"
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    setIdError('');
                  }}
                  placeholder={selectedProfessionData.idPlaceholder}
                  className="text-lg h-12"
                />
                {idError && (
                  <p className="text-sm text-destructive">{idError}</p>
                )}
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-comfortaa"
            >
              Continue
            </Button>
          </form>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <p className="leading-relaxed">
                <strong className="text-foreground">Privacy Notice:</strong> The information you provide (age, profession, and ID number) is only used to personalize your experience and will not be shared with any third party or used for any other purpose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
