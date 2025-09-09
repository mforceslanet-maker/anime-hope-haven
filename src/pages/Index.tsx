import { useState, useEffect } from 'react';
import { UserProfile } from '../types/story';
import { AgeOnboarding } from '../components/AgeOnboarding';
import { MainMenu } from '../components/MainMenu';
import { StoryGame } from '../components/StoryGame';
import { Level2Interface } from '../components/Level2Interface';

type AppView = 'onboarding' | 'menu' | 'level1' | 'level2';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('onboarding');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showLevel2Notification, setShowLevel2Notification] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(4);

  useEffect(() => {
    // Check if user has completed onboarding
    const savedProfile = localStorage.getItem('myStoryUserProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      setCurrentView('menu');
      
      // Check trial period
      const trialStart = localStorage.getItem('myStoryTrialStart');
      if (trialStart) {
        const daysPassed = Math.floor((Date.now() - parseInt(trialStart)) / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, 4 - daysPassed));
      }
    }
  }, []);

  const handleOnboardingComplete = (age: number, category: 'military-student' | 'military-personnel') => {
    const ageGroup = age < 25 ? 'teen' : age < 50 ? 'adult' : 'senior';
    const profile: UserProfile = {
      age,
      ageGroup,
      category,
      level: 1,
      completedScenarios: [],
      anonymousId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    setUserProfile(profile);
    localStorage.setItem('myStoryUserProfile', JSON.stringify(profile));
    localStorage.setItem('myStoryTrialStart', Date.now().toString());
    setCurrentView('menu');
  };

  const handleLevel1Complete = () => {
    if (!userProfile) return;
    
    const updatedProfile = { ...userProfile, level: 2 as const };
    setUserProfile(updatedProfile);
    localStorage.setItem('myStoryUserProfile', JSON.stringify(updatedProfile));
    setShowLevel2Notification(true);
    setCurrentView('menu');
  };

  const handleStartLevel1 = () => {
    setCurrentView('level1');
  };

  const handleStartLevel2 = () => {
    setCurrentView('level2');
    setShowLevel2Notification(false);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const handleBackToLevel1 = () => {
    setCurrentView('level1');
  };

  if (currentView === 'onboarding') {
    return <AgeOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (!userProfile) {
    return <AgeOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'menu') {
    return (
      <MainMenu 
        userProfile={userProfile}
        onStartLevel1={handleStartLevel1}
        onStartLevel2={handleStartLevel2}
        showLevel2Notification={showLevel2Notification}
        trialDaysLeft={trialDaysLeft}
      />
    );
  }

  if (currentView === 'level1') {
    return (
      <StoryGame 
        userProfile={userProfile}
        onLevelComplete={handleLevel1Complete}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  if (currentView === 'level2') {
    return (
      <Level2Interface 
        userProfile={userProfile}
        onBackToLevel1={handleBackToLevel1}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  return <MainMenu 
    userProfile={userProfile}
    onStartLevel1={handleStartLevel1}
    onStartLevel2={handleStartLevel2}
    showLevel2Notification={showLevel2Notification}
    trialDaysLeft={trialDaysLeft}
  />;
};

export default Index;
