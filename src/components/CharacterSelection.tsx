import { Character } from '../types/character';
import { characters } from '../data/characters';
import { CharacterCard } from './CharacterCard';
import { Heart, Shield, Users } from 'lucide-react';

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
}

export const CharacterSelection = ({ onCharacterSelect }: CharacterSelectionProps) => {
  return (
    <div className="min-h-screen p-6 bg-gradient-peaceful">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-comfortaa font-bold text-foreground">
              MyStory
            </h1>
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Choose a caring companion to support you on your journey. Each friend has their own special way of helping you feel better.
          </p>
          
          {/* Privacy Notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border shadow-gentle">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Your conversations are completely private and anonymous
            </span>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={onCharacterSelect}
            />
          ))}
        </div>

        {/* Support Notice */}
        <div className="text-center bg-card rounded-2xl p-6 shadow-gentle">
          <Users className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-comfortaa font-semibold mb-2">
            You're Not Alone
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Military families face unique challenges. Our friends are here to listen, support, and help you navigate life's ups and downs with understanding and care.
          </p>
        </div>
      </div>
    </div>
  );
};