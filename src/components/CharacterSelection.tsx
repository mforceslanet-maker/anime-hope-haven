import { Character } from '../types/character';
import { characters, militaryTherapist } from '../data/characters';
import { CharacterCard } from './CharacterCard';
import { MilitaryTherapistCard } from './MilitaryTherapistCard';
import { Heart, Shield, Users, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
  onBack?: () => void;
}

export const CharacterSelection = ({ onCharacterSelect, onBack }: CharacterSelectionProps) => {
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-peaceful">
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
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-comfortaa font-bold text-foreground">
              MyStory
            </h1>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto px-2">
            Choose a caring companion to support you on your journey. Each friend has their own special way of helping you feel better.
          </p>
          
          {/* Our Mission */}
          <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-gentle mb-6 sm:mb-8 max-w-4xl mx-auto border border-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h3 className="text-lg sm:text-xl font-comfortaa font-semibold text-foreground">Our Mission</h3>
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-center px-2">
              Created for military school students and their families, MyStory addresses the unique mental health challenges faced by our community. 
              We understand the invisible battles - anxiety from parental deployments, the upheaval of sudden relocations, grief from loss, 
              and the strain of prolonged separations. Our mission is to help students find their voices, regain joy, and transform 
              silent struggles into stories of resilience, leadership, and hope. Together, we're investing in the transformation of countless young lives.
            </p>
          </div>
          
          {/* Privacy Notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-gentle">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Your conversations are completely private and anonymous
            </span>
          </div>
        </div>

        {/* Companion Characters Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-comfortaa font-semibold text-foreground mb-2">
              Companion Characters
            </h2>
            <p className="text-muted-foreground">
              Gentle souls here to support your mental wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onSelect={onCharacterSelect}
              />
            ))}
          </div>
        </section>

        {/* Military Personnel Therapist Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-6 h-6 text-military" />
              <h2 className="text-2xl font-comfortaa font-semibold text-military">
                Military Personnel Support
              </h2>
              <Shield className="w-6 h-6 text-military" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized therapy for service members during pre-deployment, deployment, and post-deployment phases. 
              Understanding the unique challenges of military life.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="max-w-md">
              <MilitaryTherapistCard
                therapist={militaryTherapist}
                onSelect={onCharacterSelect}
              />
            </div>
          </div>
        </section>

        {/* Support Notice */}
        <div className="text-center bg-card rounded-2xl p-4 sm:p-6 shadow-gentle">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-comfortaa font-semibold mb-2">
            You're Not Alone
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto px-2">
            Whether you're a civilian seeking mental wellness support or a service member facing deployment challenges, 
            our compassionate companions are here to listen and help you navigate life's journey.
          </p>
        </div>
      </div>
    </div>
  );
};