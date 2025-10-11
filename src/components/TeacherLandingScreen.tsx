import { GraduationCap, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Character } from '../types/character';
import { CharacterCard } from './CharacterCard';
import { useState, useEffect } from 'react';

interface TeacherLandingScreenProps {
  onCharacterSelect: (character: Character) => void;
}

const teacherCharacters: Character[] = [
  {
    id: 'teacher-mentor-1',
    name: 'Dr. Sarah Chen',
    role: 'Educational Psychologist',
    description: 'Specializing in teacher burnout prevention and work-life balance',
    personality: 'Empathetic, understanding, experienced in education system challenges',
    specialties: ['Stress Management', 'Career Guidance', 'Classroom Management Support'],
    color: 'from-emerald-400 to-teal-500',
    image: '/placeholder.svg',
    greeting: 'Hello! I understand the unique challenges teachers face. Let\'s work together to maintain your passion for teaching.'
  },
  {
    id: 'teacher-mentor-2',
    name: 'Prof. James Omondi',
    role: 'Veteran Educator & Counselor',
    description: '30+ years teaching experience, now helping teachers thrive',
    personality: 'Wise, patient, practical advice from real experience',
    specialties: ['Professional Development', 'Student Behavior', 'Administrative Stress'],
    color: 'from-blue-400 to-indigo-500',
    image: '/placeholder.svg',
    greeting: 'Welcome, fellow educator. I\'ve been where you are, and I\'m here to help you succeed.'
  }
];

export const TeacherLandingScreen = ({ onCharacterSelect }: TeacherLandingScreenProps) => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-green-900/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-comfortaa font-bold text-emerald-700 dark:text-emerald-300">
              Educators' Wellness Hub
            </h1>
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            A dedicated space for teachers who shape tomorrow's leaders. Because those who give so much deserve support too.
          </p>

          {/* Appreciation Badge with Animation */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full border-2 border-emerald-300 dark:border-emerald-700 mb-8">
            <Heart 
              className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-all duration-500 ${
                pulsePhase === 1 ? 'scale-125' : 'scale-100'
              }`}
              fill={pulsePhase === 1 ? 'currentColor' : 'none'}
            />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Thank you for educating our future. You're valued.
            </span>
            <Sparkles className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 ${pulsePhase === 2 ? 'animate-pulse' : ''}`} />
          </div>

          {/* Support Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-comfortaa text-emerald-700 dark:text-emerald-300 font-semibold">TSC Verified</p>
              <p className="text-xs text-muted-foreground mt-1">Trusted support for registered teachers</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-comfortaa text-emerald-700 dark:text-emerald-300 font-semibold">Confidential</p>
              <p className="text-xs text-muted-foreground mt-1">Safe space for your concerns</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-comfortaa text-emerald-700 dark:text-emerald-300 font-semibold">Educator-Focused</p>
              <p className="text-xs text-muted-foreground mt-1">Understanding classroom realities</p>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {teacherCharacters.map((character, index) => (
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
        <div className="text-center bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From lesson planning stress to classroom challenges, administrative pressure to student concerns—
            our specialized mentors understand the unique demands of teaching. You dedicate your life to others' growth; 
            now it's time to invest in your own wellbeing.
          </p>
        </div>
      </div>
    </div>
  );
};
