import { EmotionalState } from '../types/character';
import { Smile, Waves, CloudRain, Zap, Star } from 'lucide-react';

interface EmotionalStateSelectorProps {
  currentMood?: EmotionalState;
  onMoodSelect: (mood: EmotionalState) => void;
}

const moodOptions = [
  { state: 'happy' as EmotionalState, icon: Smile, label: 'Happy', color: 'happy' },
  { state: 'calm' as EmotionalState, icon: Waves, label: 'Calm', color: 'calm' },
  { state: 'sad' as EmotionalState, icon: CloudRain, label: 'Sad', color: 'sad' },
  { state: 'anxious' as EmotionalState, icon: Zap, label: 'Anxious', color: 'anxious' },
  { state: 'excited' as EmotionalState, icon: Star, label: 'Excited', color: 'excited' },
];

export const EmotionalStateSelector = ({ currentMood, onMoodSelect }: EmotionalStateSelectorProps) => {
  return (
    <div className="bg-card rounded-2xl p-3 sm:p-4 shadow-gentle">
      <h3 className="text-xs sm:text-sm font-comfortaa font-medium text-center mb-3 text-muted-foreground">
        How are you feeling right now?
      </h3>
      <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
        {moodOptions.map(({ state, icon: Icon, label, color }) => (
          <button
            key={state}
            onClick={() => onMoodSelect(state)}
            className={`emotion-indicator ${currentMood === state ? `emotion-${state}` : 'bg-muted/50 text-muted-foreground'} transition-all duration-300 hover:scale-110 touch-manipulation min-h-[40px] text-xs sm:text-sm`}
            title={label}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs hidden sm:inline">{label}</span>
            <span className="text-xs sm:hidden">{label.charAt(0)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};