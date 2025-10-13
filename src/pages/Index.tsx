import { useState } from 'react';
import { Character } from '../types/character';
import { AppScreen, StoryProgress } from '../types/story';
import { SplashScreen } from '../components/SplashScreen';
import { MotivationalQuoteScreen } from '../components/MotivationalQuoteScreen';
import { AgeInputScreen } from '../components/AgeInputScreen';
import { PersonalizedMotivationalScreen } from '../components/PersonalizedMotivationalScreen';
import { CharacterSelection } from '../components/CharacterSelection';
import { MilitaryPersonnelLandingScreen } from '../components/MilitaryPersonnelLandingScreen';
import { TeacherLandingScreen } from '../components/TeacherLandingScreen';
import { StaffLandingScreen } from '../components/StaffLandingScreen';
import { CommunityLandingScreen } from '../components/CommunityLandingScreen';
import { HomeScreen } from '../components/HomeScreen';
import { MilitaryHomeScreen } from '../components/MilitaryHomeScreen';
import { TeacherHomeScreen } from '../components/TeacherHomeScreen';
import { StaffHomeScreen } from '../components/StaffHomeScreen';
import { CommunityHomeScreen } from '../components/CommunityHomeScreen';
import { ChatInterface } from '../components/ChatInterface';
import { WellnessDashboard } from '../components/WellnessDashboard';
import { StoryGameScreen } from '../components/StoryGameScreen';
import { Level2Screen } from '../components/Level2Screen';
import { TrialManager } from '../components/TrialManager';
import { toast } from '../hooks/use-toast';

type AppView = AppScreen | 'dashboard' | 'story-game' | 'level2';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [userProfession, setUserProfession] = useState<string | null>(null);
  const [hasUnlockedLevel2, setHasUnlockedLevel2] = useState(false);

  const handleSplashComplete = () => setCurrentView('quote');
  const handleQuoteBegin = () => setCurrentView('age-input');
  const handleAgeSubmit = (age: number, profession?: string, idNumber?: string) => {
    setUserAge(age);
    setUserProfession(profession || null);
    setCurrentView('personalized-motivation');
  };
  const handlePersonalizedMotivationContinue = () => {
    // Route to appropriate landing page based on profession
    switch (userProfession) {
      case 'Military Student':
        setCurrentView('character-selection'); // Students see the 4 student characters
        break;
      case 'Military Personnel':
        setCurrentView('military-landing');
        break;
      case 'Teacher':
        setCurrentView('teacher-landing');
        break;
      case 'Subordinate Staff':
        setCurrentView('staff-landing');
        break;
      default:
        setCurrentView('character-selection');
    }
  };
  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('home');
  };
  const handleStartStoryGame = () => setCurrentView('story-game');
  const handleCheckIn = () => setCurrentView('dashboard');
  const handleVoiceConfession = () => setCurrentView('chat');
  const handleSettings = () => toast({ title: "Settings", description: "Settings panel coming soon!" });
  const handleBackToHome = () => setCurrentView('home');
  const handleLevelUnlocked = () => {
    setHasUnlockedLevel2(true);
    toast({ title: "🎉 Level 2 Unlocked!", description: "Hey there's Level 2 - You'll love it!" });
  };

  if (currentView === 'splash') return <SplashScreen onComplete={handleSplashComplete} />;
  if (currentView === 'quote') return <MotivationalQuoteScreen onBegin={handleQuoteBegin} />;
  if (currentView === 'age-input') return <AgeInputScreen onContinue={handleAgeSubmit} />;
  if (currentView === 'personalized-motivation') return (
    <PersonalizedMotivationalScreen 
      age={userAge || 16} 
      profession={userProfession || undefined} 
      onContinue={handlePersonalizedMotivationContinue}
      onBack={() => setCurrentView('age-input')}
    />
  );
  if (currentView === 'character-selection') return <CharacterSelection onCharacterSelect={handleCharacterSelect} onBack={() => setCurrentView('personalized-motivation')} />;
  if (currentView === 'military-landing') return <MilitaryPersonnelLandingScreen onCharacterSelect={handleCharacterSelect} onBack={() => setCurrentView('personalized-motivation')} />;
  if (currentView === 'teacher-landing') return <TeacherLandingScreen onCharacterSelect={handleCharacterSelect} onBack={() => setCurrentView('personalized-motivation')} />;
  if (currentView === 'staff-landing') return <StaffLandingScreen onCharacterSelect={handleCharacterSelect} onBack={() => setCurrentView('personalized-motivation')} />;
  if (currentView === 'community-landing') return <CommunityLandingScreen onCharacterSelect={handleCharacterSelect} />;
  if (currentView === 'home') {
    // Render different home screens based on profession
    let HomeComponent;
    switch (userProfession) {
      case 'Military Personnel':
        HomeComponent = MilitaryHomeScreen;
        break;
      case 'Teacher':
        HomeComponent = TeacherHomeScreen;
        break;
      case 'Subordinate Staff':
        HomeComponent = StaffHomeScreen;
        break;
      default:
        HomeComponent = HomeScreen; // Military Students get the original HomeScreen
    }

    return (
      <div>
        <HomeComponent 
          onStartStoryGame={handleStartStoryGame} 
          onCheckIn={handleCheckIn} 
          onVoiceConfession={handleVoiceConfession} 
          onSettings={handleSettings}
          onBack={() => {
            // Route back based on profession
            switch (userProfession) {
              case 'Military Personnel':
                setCurrentView('military-landing');
                break;
              case 'Teacher':
                setCurrentView('teacher-landing');
                break;
              case 'Subordinate Staff':
                setCurrentView('staff-landing');
                break;
              default:
                setCurrentView('character-selection');
            }
          }}
        />
        {hasUnlockedLevel2 && (
          <div className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
            <p className="text-sm mb-2">🎉 Level 2 Available!</p>
            <button onClick={() => setCurrentView('level2')} className="text-xs bg-white text-primary px-3 py-1 rounded">Try Level 2</button>
          </div>
        )}
        <div className="fixed bottom-4 left-4 z-40 max-w-sm"><TrialManager onTrialUpdate={() => {}} /></div>
      </div>
    );
  }
  if (currentView === 'story-game') return <StoryGameScreen onBack={handleBackToHome} userAge={userAge || 16} onLevelUnlocked={handleLevelUnlocked} />;
  if (currentView === 'level2') return <Level2Screen onBack={handleBackToHome} userAge={userAge || 16} />;
  if (currentView === 'chat' && selectedCharacter) return <ChatInterface character={selectedCharacter} onBack={handleBackToHome} />;
  if (currentView === 'dashboard' && selectedCharacter) return <WellnessDashboard character={selectedCharacter} onBack={handleBackToHome} onStartChat={() => setCurrentView('chat')} />;
  
  return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
};

export default Index;
