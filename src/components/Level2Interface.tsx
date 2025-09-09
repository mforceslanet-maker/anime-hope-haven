import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { storyCharacters } from '../data/storyCharacters';
import { VoiceInput } from './VoiceInput';
import { UserProfile } from '../types/story';
import { Sparkles, MessageCircle, Mic, ArrowLeft, PartyPopper } from 'lucide-react';

interface Level2InterfaceProps {
  userProfile: UserProfile;
  onBackToLevel1: () => void;
  onBackToMenu: () => void;
}

export const Level2Interface = ({ userProfile, onBackToLevel1, onBackToMenu }: Level2InterfaceProps) => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, text: string, speaker: string}>>([]);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      speaker: 'You'
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Simulate character response
    setTimeout(() => {
      const randomCharacter = storyCharacters[Math.floor(Math.random() * storyCharacters.length)];
      const responses = [
        "That sounds like quite an experience! Tell us more about how that made you feel.",
        "I can relate to that! I've had similar experiences myself.",
        "That's really interesting! Have you thought about trying a mindfulness app for situations like that?",
        "Your journey sounds amazing! Keep sharing - we're all here to support each other.",
        "That reminds me of something that happened to me. We all go through ups and downs!"
      ];
      
      const response = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        speaker: randomCharacter.name
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000);

    setCurrentMessage('');
  };

  const handleVoiceTranscription = (text: string) => {
    setCurrentMessage(prev => prev + (prev ? ' ' : '') + text);
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-sage-green to-blush-pink">
        <Card className="max-w-2xl w-full p-8 text-center shadow-2xl bg-white/95 backdrop-blur-sm">
          <PartyPopper className="w-20 h-20 text-blush-pink mx-auto mb-6" />
          <h1 className="text-4xl font-comfortaa font-bold text-gray-800 mb-4">
            🎉 Congratulations! 🎉
          </h1>
          <h2 className="text-2xl font-semibold text-soft-purple mb-6">
            You're now in Level 2!
          </h2>
          
          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-6">
              {storyCharacters.map((character) => (
                <img 
                  key={character.id}
                  src={character.image} 
                  alt={character.name}
                  className="w-16 h-16 rounded-full border-4 border-blush-pink animate-bounce"
                  style={{ animationDelay: `${Math.random() * 2}s` }}
                />
              ))}
            </div>
            <p className="text-lg text-gray-700 mb-4">
              All your character friends are celebrating your progress! 🎊
            </p>
            <p className="text-gray-600">
              In Level 2, you can share your daily experiences, achievements, and challenges. 
              Your character friends will listen, support, and even share helpful suggestions!
            </p>
          </div>

          <Button 
            onClick={() => setShowCelebration(false)}
            className="bg-sage-green hover:bg-sage-green/80 text-white font-semibold py-3 px-8 rounded-xl"
          >
            Let's Continue the Journey!
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-green to-sky-blue">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToMenu}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-comfortaa font-bold text-gray-800">Level 2 - Daily Life</h1>
              <p className="text-sm text-gray-600">Share your experiences with your character friends</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sage-green" />
            <span className="text-sm font-medium text-gray-700">Peace Level 2</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Character Friends Display */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-lg font-comfortaa font-semibold text-gray-800 mb-4">Your Character Friends</h2>
          <div className="flex justify-center gap-6">
            {storyCharacters.map((character) => (
              <div key={character.id} className="text-center">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-14 h-14 rounded-full border-3 border-soft-green mb-2 hover:scale-110 transition-transform cursor-pointer"
                />
                <p className="text-xs text-gray-600">{character.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="p-6 shadow-lg bg-white/95 backdrop-blur-sm min-h-[400px] flex flex-col">
          <div className="flex-1 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Life Conversation</h3>
            
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Share how your day has been, any achievements, or challenges you're facing!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg ${
                    message.speaker === 'You' 
                      ? 'bg-soft-purple/20 text-gray-800 ml-8' 
                      : 'bg-soft-green/20 text-gray-800 mr-8'
                  }`}>
                    <div className="text-xs text-gray-600 mb-1">{message.speaker}</div>
                    <div>{message.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={inputMode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('text')}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Type
              </Button>
              <Button
                variant={inputMode === 'voice' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('voice')}
                className="flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Voice
              </Button>
            </div>

            {inputMode === 'text' ? (
              <div className="flex gap-2">
                <Textarea
                  placeholder="Share your daily experiences, achievements, or challenges..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-1 min-h-[60px]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-sage-green hover:bg-sage-green/80 text-white px-6"
                >
                  Send
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Textarea
                    placeholder="Voice transcription will appear here..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
                <VoiceInput
                  onTranscription={handleVoiceTranscription}
                  disabled={false}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-sage-green hover:bg-sage-green/80 text-white px-6"
                >
                  Send
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            <Button
              onClick={onBackToLevel1}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800"
            >
              Back to Level 1
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};