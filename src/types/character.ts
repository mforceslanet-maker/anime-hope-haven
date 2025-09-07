export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  personality: string;
  specialties: string[];
  color: string;
  image: string;
  greeting: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'character';
  timestamp: Date;
  emotion?: EmotionalState;
}

export type EmotionalState = 'happy' | 'calm' | 'sad' | 'anxious' | 'excited';

export interface UserSession {
  currentMood?: EmotionalState;
  selectedCharacter?: Character;
  chatHistory: ChatMessage[];
  anonymousId: string;
}