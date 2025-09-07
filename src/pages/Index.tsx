import { useState } from 'react';
import { Character } from '../types/character';
import { CharacterSelection } from '../components/CharacterSelection';
import { ChatInterface } from '../components/ChatInterface';
import { WellnessDashboard } from '../components/WellnessDashboard';

type AppView = 'selection' | 'chat' | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('selection');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentView('chat');
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setSelectedCharacter(null);
  };

  const handleShowDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  if (currentView === 'selection') {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
  }

  if (currentView === 'chat' && selectedCharacter) {
    return (
      <ChatInterface 
        character={selectedCharacter} 
        onBack={handleBackToSelection}
      />
    );
  }

  if (currentView === 'dashboard' && selectedCharacter) {
    return (
      <WellnessDashboard 
        character={selectedCharacter}
        onBack={handleBackToSelection}
        onStartChat={handleStartChat}
      />
    );
  }

  return <CharacterSelection onCharacterSelect={handleCharacterSelect} />;
};

export default Index;
