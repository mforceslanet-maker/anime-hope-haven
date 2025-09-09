export interface StoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  consequence: string;
}

export interface StoryScenario {
  id: string;
  title: string;
  description: string;
  situation: string;
  choices: StoryChoice[];
  ageGroup: 'teen' | 'adult' | 'senior';
  category: 'military-student' | 'military-personnel';
}

export interface UserProfile {
  age: number;
  ageGroup: 'teen' | 'adult' | 'senior';
  category: 'military-student' | 'military-personnel';
  level: 1 | 2;
  completedScenarios: string[];
  anonymousId: string;
}

export interface GameSession {
  currentScenario: StoryScenario;
  selectedChoice?: StoryChoice;
  showConsequence: boolean;
  isComplete: boolean;
}