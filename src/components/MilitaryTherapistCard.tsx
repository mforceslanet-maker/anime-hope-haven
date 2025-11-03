import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Shield, Heart } from 'lucide-react';
import { Character } from '../types/character';

interface MilitaryTherapistCardProps {
  therapist: Character;
  onSelect: (character: Character) => void;
}

export const MilitaryTherapistCard = ({ therapist, onSelect }: MilitaryTherapistCardProps) => {
  const handleClick = () => {
    console.log('Military therapist selected:', therapist.name);
    onSelect(therapist);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 cursor-pointer bg-gradient-to-br from-military/5 to-military/10 border-2 border-military/20 hover:border-military/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl">
      <div className="absolute top-4 right-4">
        <Shield className="w-6 h-6 text-military" />
      </div>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <img
            src={therapist.image}
            alt={`${therapist.name} - Military Therapist`}
            className="w-24 h-24 rounded-full object-cover border-4 border-military/30 shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 bg-military text-white rounded-full p-2">
            <Heart className="w-4 h-4" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-2xl font-comfortaa font-bold text-military">
            {therapist.name}
          </h3>
          <p className="text-sm font-medium text-military/80 uppercase tracking-wider">
            {therapist.role}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
            {therapist.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {therapist.specialties.slice(0, 3).map((specialty, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs bg-military/10 text-military border-military/20"
            >
              {specialty}
            </Badge>
          ))}
        </div>

        <div className="w-full space-y-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full bg-military hover:bg-military/90 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Start Chat Session
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Available 24/7 • Confidential • Veteran-focused</p>
        </div>
      </div>
    </div>
  );
};