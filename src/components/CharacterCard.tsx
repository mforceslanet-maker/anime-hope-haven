import { Character } from '../types/character';
import { Button } from './ui/button';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
}

export const CharacterCard = ({ character, onSelect }: CharacterCardProps) => {
  const handleClick = () => {
    console.log('Character selected:', character.name);
    onSelect(character);
  };

  return (
    <div className="character-card group touch-manipulation" onClick={handleClick}>
      <div className="flex flex-col items-center space-y-3 sm:space-y-4 pointer-events-none">
        <div className="relative">
          <img
            src={character.image}
            alt={character.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-character transition-transform duration-300 group-hover:scale-110"
          />
          <div 
            className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{ backgroundColor: `hsl(var(--${character.color}))` }}
          />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg sm:text-xl font-comfortaa font-semibold text-foreground">
            {character.name}
          </h3>
          <p 
            className="text-sm font-medium"
            style={{ color: `hsl(var(--${character.color}))` }}
          >
            {character.role}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2">
            {character.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1 justify-center">
          {character.specialties.slice(0, 2).map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 text-xs rounded-full border"
              style={{ 
                borderColor: `hsl(var(--${character.color}) / 0.3)`,
                backgroundColor: `hsl(var(--${character.color}) / 0.1)`,
                color: `hsl(var(--${character.color}))`
              }}
            >
              {specialty}
            </span>
          ))}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full pointer-events-auto min-h-[44px] touch-manipulation text-sm sm:text-base"
          style={{
            backgroundColor: `hsl(var(--${character.color}))`,
            color: 'white',
          }}
        >
          Talk with {character.name}
        </Button>
      </div>
    </div>
  );
};