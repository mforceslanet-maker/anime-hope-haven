import { Heart, Sparkles, Users, Music2 } from 'lucide-react';
import { Character } from '../types/character';
import { CharacterCard } from './CharacterCard';
import { useState, useEffect } from 'react';

interface CommunityLandingScreenProps {
  onCharacterSelect: (character: Character) => void;
}

const communityCharacters: Character[] = [
  {
    id: 'community-counselor-1',
    name: 'Grace Wanjiru',
    role: 'Community Wellness Guide',
    description: 'Supporting mental health in our local communities',
    personality: 'Warm, culturally aware, deeply empathetic',
    specialties: ['Life Transitions', 'Family Matters', 'Community Support'],
    color: 'from-purple-400 to-pink-500',
    image: '/placeholder.svg',
    greeting: 'Karibu! Welcome to a safe space where your story matters and you are valued.'
  },
  {
    id: 'community-counselor-2',
    name: 'Daniel Ochieng',
    role: 'Community Mental Health Advocate',
    description: 'Bridging traditional and modern mental health support',
    personality: 'Respectful, understanding, community-centered',
    specialties: ['Cultural Sensitivity', 'Personal Growth', 'Relationship Guidance'],
    color: 'from-pink-400 to-rose-500',
    image: '/placeholder.svg',
    greeting: 'Hello, my friend. I\'m here to walk with you on your journey to wellness.'
  }
];

export const CommunityLandingScreen = ({ onCharacterSelect }: CommunityLandingScreenProps) => {
  const [ripplePhase, setRipplePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipplePhase(prev => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-900/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-comfortaa font-bold text-purple-700 dark:text-purple-300">
              Community Wellness Hub
            </h1>
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            A welcoming space for everyone. Your mental health journey matters, and you deserve support.
          </p>

          {/* Ripple/Sound Wave Effect */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border-2 border-purple-400 dark:border-purple-500"
                  style={{
                    width: ripplePhase === i ? '80px' : '40px',
                    height: ripplePhase === i ? '80px' : '40px',
                    opacity: ripplePhase === i ? 0.3 : 0.7,
                    transition: 'all 1.5s ease-out',
                  }}
                />
              ))}
              <Music2 className="w-8 h-8 text-purple-600 dark:text-purple-400 relative z-10" />
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-full border-2 border-purple-300 dark:border-purple-700">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Everyone is welcome here—no judgment, just support
              </span>
              <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          {/* Support Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-comfortaa text-purple-700 dark:text-purple-300 font-semibold">Open to All</p>
              <p className="text-xs text-muted-foreground mt-1">Everyone deserves mental health support</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-comfortaa text-purple-700 dark:text-purple-300 font-semibold">Culturally Aware</p>
              <p className="text-xs text-muted-foreground mt-1">Respecting your background and values</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-comfortaa text-purple-700 dark:text-purple-300 font-semibold">Community-First</p>
              <p className="text-xs text-muted-foreground mt-1">Building stronger, healthier communities</p>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {communityCharacters.map((character, index) => (
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
        <div className="text-center bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 dark:border-purple-800 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From everyday stresses to life's bigger challenges, our community counselors are here for you. 
            We understand the unique experiences and values of our community, and we're committed to providing 
            culturally sensitive, compassionate support that honors where you come from.
          </p>
        </div>
      </div>
    </div>
  );
};
