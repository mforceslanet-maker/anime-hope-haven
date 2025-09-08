import { EmotionalState } from '../types/character';
import { Smile, Waves, CloudRain, Zap, Star } from 'lucide-react';

const moodOptions = [
  { state: 'happy' as EmotionalState, icon: Smile, label: 'Happy', color: 'happy' },
  { state: 'calm' as EmotionalState, icon: Waves, label: 'Calm', color: 'calm' },
  { state: 'sad' as EmotionalState, icon: CloudRain, label: 'Sad', color: 'sad' },
  { state: 'anxious' as EmotionalState, icon: Zap, label: 'Anxious', color: 'anxious' },
  { state: 'excited' as EmotionalState, icon: Star, label: 'Excited', color: 'excited' },
];

interface EmotionalStateSelectorProps {
  currentMood?: EmotionalState;
  onMoodSelect: (mood: EmotionalState) => void;
  onMoodAddToMessage?: (mood: EmotionalState) => void;
}

export const EmotionalStateSelector = ({ currentMood, onMoodSelect, onMoodAddToMessage }: EmotionalStateSelectorProps) => {
  const handleMoodClick = (state: EmotionalState) => {
    onMoodSelect(state);
    if (onMoodAddToMessage) {
      onMoodAddToMessage(state);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-gentle">
      <h3 className="text-sm font-comfortaa font-medium text-center mb-3 text-muted-foreground">
        How are you feeling right now?
      </h3>
      <div className="flex justify-center gap-2">
        {moodOptions.map(({ state, icon: Icon, label, color }) => (
          <button
            key={state}
            onClick={() => handleMoodClick(state)}
            className={`emotion-indicator ${currentMood === state ? `emotion-${state}` : 'bg-muted/50 text-muted-foreground'} transition-all duration-300 hover:scale-110`}
            title={label}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};