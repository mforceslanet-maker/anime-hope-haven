export interface StoryCharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  ageGroup: 'teen' | 'young-adult' | 'adult' | 'middle-aged';
  image: string;
  color: string;
  isMuslim?: boolean;
}

export interface StoryScenario {
  id: string;
  title: string;
  description: string;
  characters: string[];
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
    outcome: string;
    characterReaction: string;
  }[];
}

export interface UserProgress {
  age: number;
  level: number;
  scenariosCompleted: string[];
  hasUnlockedLevel2: boolean;
  lastVisit: Date;
}

export type AppScreen = 
  | 'splash'
  | 'motivational-quote'
  | 'age-input'
  | 'character-intro'
  | 'home'
  | 'story-game'
  | 'voice-text-confession'
  | 'level2-unlock'
  | 'level2'
  | 'settings';

export interface NotificationConfig {
  enabled: boolean;
  reminderTime: string;
  level2Reminder: boolean;
}