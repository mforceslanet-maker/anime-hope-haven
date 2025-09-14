export interface StoryScenario {
  id: string;
  title: string;
  description: string;
  characters: string[];
  situation: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    consequence: string;
    characterReactions: {
      [characterId: string]: {
        expression: 'happy' | 'sad' | 'concerned' | 'proud';
        dialogue: string;
      };
    };
  }[];
  level: 1 | 2;
  ageGroup: 'teen' | 'adult' | 'senior';
}

export interface UserProgress {
  currentLevel: 1 | 2;
  completedScenarios: string[];
  correctChoices: number;
  totalChoices: number;
  lastActivity: Date;
  trialDaysRemaining: number;
  hasUnlockedLevel2: boolean;
}

export interface GameSession {
  scenarioId: string;
  userChoice?: string;
  isComplete: boolean;
  score: number;
}