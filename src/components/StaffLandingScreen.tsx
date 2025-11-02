import { Briefcase, Users, Heart, Music, ArrowLeft } from 'lucide-react';
import { Character } from '../types/character';
import { CharacterCard } from './CharacterCard';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import staffFemaleBlack from '../assets/staff-female-black.jpg';
import staffMaleBlack from '../assets/staff-male-black.jpg';

interface StaffLandingScreenProps {
  onCharacterSelect: (character: Character) => void;
  onBack?: () => void;
}

const staffCharacters: Character[] = [
  {
    id: 'staff-counselor-1',
    name: 'Linda Achieng',
    role: 'Workplace Wellness Specialist',
    description: 'Supporting staff mental health and work-life harmony',
    personality: 'Approachable, understanding, practical solutions',
    specialties: ['Work Stress', 'Team Dynamics', 'Career Development'],
    color: 'from-orange-400 to-amber-500',
    image: staffFemaleBlack,
    greeting: 'Hello! I\'m here to help you navigate workplace challenges and find balance.'
  },
  {
    id: 'staff-counselor-2',
    name: 'Peter Kamau',
    role: 'Employee Support Counselor',
    description: 'Specializing in organizational wellbeing',
    personality: 'Patient, insightful, focused on sustainable solutions',
    specialties: ['Burnout Prevention', 'Communication Skills', 'Personal Growth'],
    color: 'from-amber-400 to-yellow-500',
    image: staffMaleBlack,
    greeting: 'Welcome! Let\'s work together to create a healthier work experience for you.'
  }
];

export const StaffLandingScreen = ({ onCharacterSelect, onBack }: StaffLandingScreenProps) => {
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWavePhase(prev => (prev + 1) % 5);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-yellow-900/20">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="fixed top-4 left-4 z-50 hover:bg-white/20 dark:hover:bg-black/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-comfortaa font-bold text-amber-700 dark:text-amber-300">
              Staff Wellness Center
            </h1>
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" />
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            Your dedicated space for workplace wellbeing. Every team member deserves support and understanding.
          </p>

          {/* Relaxing Music Wave Animation */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-300"
                  style={{
                    height: wavePhase === i ? '40px' : '20px',
                  }}
                />
              ))}
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-100 dark:bg-amber-900/30 rounded-full border-2 border-amber-300 dark:border-amber-700">
              <Music className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Relaxing atmosphere for open conversation
              </span>
              <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          {/* Support Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-comfortaa text-amber-700 dark:text-amber-300 font-semibold">Always Available</p>
              <p className="text-xs text-muted-foreground mt-1">Support whenever you need it</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-comfortaa text-amber-700 dark:text-amber-300 font-semibold">Private & Secure</p>
              <p className="text-xs text-muted-foreground mt-1">Your conversations stay confidential</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-comfortaa text-amber-700 dark:text-amber-300 font-semibold">Employee-Focused</p>
              <p className="text-xs text-muted-foreground mt-1">Understanding your work environment</p>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {staffCharacters.map((character, index) => (
            <div 
              key={character.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CharacterCard
                character={character}
                onSelect={onCharacterSelect}
              />
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="text-center bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 dark:border-amber-800 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Whether you're dealing with workplace stress, team challenges, or seeking personal growth, 
            our counselors understand the unique pressures of being a valued team member. 
            Your wellbeing matters to us—let's work together to create a healthier work-life experience.
          </p>
        </div>
      </div>
    </div>
  );
};
