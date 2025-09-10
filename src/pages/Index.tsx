import { useState, useEffect } from 'react';
import { AppScreen, UserProgress } from '../types/story';
import { SplashScreen } from '../components/SplashScreen';
import { MotivationalQuoteScreen } from '../components/MotivationalQuoteScreen';
import { AgeInputScreen } from '../components/AgeInputScreen';
import { CharacterIntroScreen } from '../components/CharacterIntroScreen';
import { HomeScreen } from '../components/HomeScreen';
import { StoryGameScreen } from '../components/StoryGameScreen';
import { VoiceTextConfessionScreen } from '../components/VoiceTextConfessionScreen';
import { Level2UnlockScreen } from '../components/Level2UnlockScreen';
import { Level2Screen } from '../components/Level2Screen';
import { SettingsScreen } from '../components/SettingsScreen';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    age: 0,
    level: 1,
    scenariosCompleted: [],
    hasUnlockedLevel2: false,
    lastVisit: new Date(),
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('myStoryProgress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setUserProgress({ ...progress, lastVisit: new Date(progress.lastVisit) });
        // Skip intro screens if user has progress
        if (progress.age > 0) {
          setCurrentScreen('home');
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (updates: Partial<UserProgress>) => {
    const newProgress = { ...userProgress, ...updates, lastVisit: new Date() };
    setUserProgress(newProgress);
    localStorage.setItem('myStoryProgress', JSON.stringify(newProgress));
  };

  // Screen navigation handlers
  const handleSplashComplete = () => setCurrentScreen('motivational-quote');
  const handleBegin = () => setCurrentScreen('age-input');
  
  const handleAgeContinue = (age: number) => {
    saveProgress({ age });
    setCurrentScreen('character-intro');
  };
  
  const handleCharacterIntroContinue = () => setCurrentScreen('home');
  
  const handleStartStoryGame = () => setCurrentScreen('story-game');
  const handleCheckIn = () => setCurrentScreen('voice-text-confession');
  const handleSpeakOrType = () => setCurrentScreen('voice-text-confession');
  
  const handleStoryGameComplete = () => {
    // Unlock Level 2 after completing story scenarios
    saveProgress({ 
      hasUnlockedLevel2: true,
      level: 2,
      scenariosCompleted: ['scenario-1', 'scenario-2', 'scenario-3']
    });
    setCurrentScreen('level2-unlock');
  };
  
  const handleLevel2UnlockContinue = () => setCurrentScreen('level2');
  const handleLevel2 = () => setCurrentScreen('level2');
  const handleReturnToLevel1 = () => setCurrentScreen('story-game');
  const handleSettings = () => setCurrentScreen('settings');
  
  const handleBackToHome = () => setCurrentScreen('home');

  // Render current screen
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;
      
    case 'motivational-quote':
      return <MotivationalQuoteScreen onBegin={handleBegin} />;
      
    case 'age-input':
      return <AgeInputScreen onContinue={handleAgeContinue} />;
      
    case 'character-intro':
      return (
        <CharacterIntroScreen 
          age={userProgress.age} 
          onContinue={handleCharacterIntroContinue} 
        />
      );
      
    case 'home':
      return (
        <HomeScreen
          onStartStoryGame={handleStartStoryGame}
          onCheckIn={handleCheckIn}
          onSpeakOrType={handleSpeakOrType}
          onSettings={handleSettings}
          hasLevel2Unlocked={userProgress.hasUnlockedLevel2}
          onLevel2={handleLevel2}
        />
      );
      
    case 'story-game':
      return (
        <StoryGameScreen
          onBack={handleBackToHome}
          onComplete={handleStoryGameComplete}
          age={userProgress.age}
        />
      );
      
    case 'voice-text-confession':
      return (
        <VoiceTextConfessionScreen
          onBack={handleBackToHome}
          age={userProgress.age}
        />
      );
      
    case 'level2-unlock':
      return (
        <Level2UnlockScreen
          onContinue={handleLevel2UnlockContinue}
          age={userProgress.age}
        />
      );
      
    case 'level2':
      return (
        <Level2Screen
          onBack={handleBackToHome}
          onReturnToLevel1={handleReturnToLevel1}
          age={userProgress.age}
        />
      );
      
    case 'settings':
      return <SettingsScreen onBack={handleBackToHome} />;
      
    default:
      return <SplashScreen onComplete={handleSplashComplete} />;
  }
};

export default Index;
