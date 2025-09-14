import { useState } from 'react';
import { Character } from '../types/character';
import { AppScreen, StoryProgress } from '../types/story';
import { SplashScreen } from '../components/SplashScreen';
import { MotivationalQuoteScreen } from '../components/MotivationalQuoteScreen';
import { AgeInputScreen } from '../components/AgeInputScreen';
import { CharacterSelection } from '../components/CharacterSelection';
import { HomeScreen } from '../components/HomeScreen';
import { ChatInterface } from '../components/ChatInterface';
import { WellnessDashboard } from '../components/WellnessDashboard';

type AppView = AppScreen | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState<StoryProgress>({
    level: 1,
    completedScenarios: [],
    unlockedFeatures: []
  });

  const handleSplashComplete = () => {
    setCurrentView('quote');
  };

  const handleQuoteBegin = () => {
    setCurrentView('age-input');
  };

  const handleAgeSubmit = (age: number) => {
    setUserAge(age);
    setCurrentView('character-selection');
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('home');
  };

  const handleStartStoryGame = () => {
    setCurrentView('chat'); // For now, redirect to chat - can be expanded to story game later
  };

  const handleCheckIn = () => {
    setCurrentView('dashboard');
  };

  const handleVoiceConfession = () => {
    setCurrentView('chat'); // For now, redirect to chat - can be expanded to voice input later
  };

  const handleSettings = () => {
    // Can be expanded to settings screen later
    console.log('Settings clicked');
  };

  const handleBackToSelection = () => {
    setCurrentView('character-selection');
    setSelectedCharacter(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Render screens based on current view
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === 'quote') {
    return <MotivationalQuoteScreen onBegin={handleQuoteBegin} />;
  }

  if (currentView === 'age-input') {
    return <AgeInputScreen onContinue={handleAgeSubmit} />;
  }

  if (currentView === 'character-selection') {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
  }

  if (currentView === 'home') {
    return (
      <HomeScreen 
        onStartStoryGame={handleStartStoryGame}
        onCheckIn={handleCheckIn}
        onVoiceConfession={handleVoiceConfession}
        onSettings={handleSettings}
      />
    );
  }

  if (currentView === 'chat' && selectedCharacter) {
    return (
      <ChatInterface 
        character={selectedCharacter} 
        onBack={handleBackToHome}
      />
    );
  }

  if (currentView === 'dashboard' && selectedCharacter) {
    return (
      <WellnessDashboard 
        character={selectedCharacter}
        onBack={handleBackToHome}
        onStartChat={() => setCurrentView('chat')}
      />
    );
  }

  // Fallback to character selection
  return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
};

export default Index;
