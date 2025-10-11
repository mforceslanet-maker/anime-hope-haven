export interface StoryProgress {
  level: number;
  completedScenarios: string[];
  unlockedFeatures: string[];
  userAge?: number;
  userProfession?: string;
  lastActiveDate?: string;
}

export interface StoryScenario {
  id: string;
  title: string;
  description: string;
  characters: string[];
  choices: StoryChoice[];
  correctChoice: string;
  outcome: {
    success: string;
    failure: string;
  };
}

export interface StoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type AppScreen = 
  | 'splash'
  | 'quote'
  | 'age-input'
  | 'personalized-motivation'
  | 'character-selection'
  | 'military-landing'
  | 'teacher-landing'
  | 'staff-landing'
  | 'community-landing'
  | 'home'
  | 'story-game'
  | 'voice-confession'
  | 'level2-unlock'
  | 'level2'
  | 'settings'
  | 'chat';

export interface UserSession {
  currentScreen: AppScreen;
  storyProgress: StoryProgress;
  selectedCharacter?: any;
  chatHistory: any[];
  anonymousId: string;
}