import { useState, useEffect } from 'react';
import { UserProfile } from '../types/story';
import { SplashScreen } from '../components/SplashScreen';
import { MotivationalQuoteScreen } from '../components/MotivationalQuoteScreen';
import { AgeInputScreen } from '../components/AgeInputScreen';
import { CharacterIntroScreen } from '../components/CharacterIntroScreen';
import { HomeScreen } from '../components/HomeScreen';
import { StoryGameScreen } from '../components/StoryGameScreen';
import { VoiceTextConfessionScreen } from '../components/VoiceTextConfessionScreen';
import { Level2UnlockScreen } from '../components/Level2UnlockScreen';
import { Level2Interface } from '../components/Level2Interface';
import { SettingsScreen } from '../components/SettingsScreen';

type AppView = 'splash' | 'motivation' | 'age-input' | 'character-intro' | 'home' | 'story-game' | 'voice-text' | 'level2-unlock' | 'level2' | 'settings' | 'daily-checkin';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('myStoryUserProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setCurrentView('home');
    }
  }, []);

  const handleSplashComplete = () => {
    setCurrentView('motivation');
  };

  const handleMotivationContinue = () => {
    setCurrentView('age-input');
  };

  const handleAgeInput = (age: number) => {
    const ageGroup = age < 25 ? 'teen' : age < 50 ? 'adult' : 'senior';
    const profile: UserProfile = {
      age,
      ageGroup,
      category: 'military-student', // Default, could be updated later
      level: 1,
      completedScenarios: [],
      anonymousId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setUserProfile(profile);
    setCurrentView('character-intro');
  };

  const handleCharacterIntroComplete = () => {
    if (userProfile) {
      localStorage.setItem('myStoryUserProfile', JSON.stringify(userProfile));
      setCurrentView('home');
    }
  };

  const handleStartStoryGame = () => {
    setCurrentView('story-game');
  };

  const handleStoryGameComplete = () => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, level: 2 as const };
      setUserProfile(updatedProfile);
      localStorage.setItem('myStoryUserProfile', JSON.stringify(updatedProfile));
      setCurrentView('level2-unlock');
    }
  };

  const handleLevel2UnlockContinue = () => {
    setCurrentView('level2');
  };

  const handleLevel2UnlockDelay = () => {
    setCurrentView('home');
  };

  const handleSpeakFeelings = () => {
    setCurrentView('voice-text');
  };

  const handleDailyCheckIn = () => {
    setCurrentView('daily-checkin');
  };

  const handleSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleBackToLevel1 = () => {
    setCurrentView('story-game');
  };

  const handleResetData = () => {
    localStorage.removeItem('myStoryUserProfile');
    setUserProfile(null);
    setCurrentView('splash');
  };

  // Render screens based on current view
  if (currentView === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === 'motivation') {
    return <MotivationalQuoteScreen onContinue={handleMotivationContinue} />;
  }

  if (currentView === 'age-input') {
    return <AgeInputScreen onContinue={handleAgeInput} />;
  }

  if (currentView === 'character-intro' && userProfile) {
    return (
      <CharacterIntroScreen 
        userProfile={userProfile} 
        onContinue={handleCharacterIntroComplete} 
      />
    );
  }

  if (currentView === 'home' && userProfile) {
    return (
      <HomeScreen
        userProfile={userProfile}
        onStartStoryGame={handleStartStoryGame}
        onDailyCheckIn={handleDailyCheckIn}
        onSpeakFeelings={handleSpeakFeelings}
        onSettings={handleSettings}
      />
    );
  }

  if (currentView === 'story-game' && userProfile) {
    return (
      <StoryGameScreen
        userProfile={userProfile}
        onComplete={handleStoryGameComplete}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentView === 'voice-text' && userProfile) {
    return (
      <VoiceTextConfessionScreen
        userProfile={userProfile}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentView === 'level2-unlock') {
    return (
      <Level2UnlockScreen
        onContinue={handleLevel2UnlockContinue}
        onDelay={handleLevel2UnlockDelay}
      />
    );
  }

  if (currentView === 'level2' && userProfile) {
    return (
      <Level2Interface
        userProfile={userProfile}
        onBackToLevel1={handleBackToLevel1}
        onBackToMenu={handleBackToHome}
      />
    );
  }

  if (currentView === 'settings' && userProfile) {
    return (
      <SettingsScreen
        userProfile={userProfile}
        onBack={handleBackToHome}
        onResetData={handleResetData}
      />
    );
  }

  if (currentView === 'daily-checkin' && userProfile) {
    // For now, redirect to voice-text screen
    return (
      <VoiceTextConfessionScreen
        userProfile={userProfile}
        onBack={handleBackToHome}
      />
    );
  }

  // Fallback to splash screen
  return <SplashScreen onComplete={handleSplashComplete} />;
};

export default Index;
