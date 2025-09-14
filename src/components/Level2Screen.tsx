import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { ArrowLeft, Star, Calendar, TrendingUp, MapPin } from 'lucide-react';
import { characters } from '../data/characters';
import { toast } from '../hooks/use-toast';

interface Level2ScreenProps {
  onBack: () => void;
  userAge: number;
}

interface DailyEntry {
  achievements: string[];
  challenges: string[];
  mood: 'great' | 'good' | 'okay' | 'difficult';
  highlights: string;
}

export const Level2Screen = ({ onBack }: Level2ScreenProps) => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [currentInput, setCurrentInput] = useState('');
  const [dailyEntry, setDailyEntry] = useState<DailyEntry>({
    achievements: [],
    challenges: [],
    mood: 'good',
    highlights: ''
  });
  const [conversationStage, setConversationStage] = useState<'celebration' | 'daily-chat' | 'achievements' | 'challenges'>('celebration');

  const celebrationMessages = [
    {
      character: 'skye',
      message: "🎉 Welcome to Level 2! We've been waiting for you! Let's celebrate! 💃",
      animation: 'dance'
    },
    {
      character: 'nova',
      message: "Congratulations on your emotional growth! Level 2 is where we share daily experiences together. 🌟",
      animation: 'proud'
    },
    {
      character: 'lex',
      message: "🎊 Like a garden that has flourished, you've grown so beautifully! Welcome to our circle!",
      animation: 'happy'
    },
    {
      character: 'junno',
      message: "Your wisdom in Level 1 brought you here. In Level 2, we laugh, share, and support each other daily! 🎈",
      animation: 'wise'
    },
    {
      character: 'alex',
      message: "This is amazing! We're all here together now! Level 2 is about celebrating life's moments - big and small! ✨",
      animation: 'excited'
    }
  ];

  const dailyQuestions = [
    "How was your day today? Tell us about it!",
    "What made you smile today?",
    "Any challenges you faced? We're here to listen!",
    "What are you grateful for today?",
    "Did anything exciting happen?",
    "How are you feeling right now?"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [celebrationIndex, setCelebrationIndex] = useState(0);

  useEffect(() => {
    if (showCelebration && celebrationIndex < celebrationMessages.length) {
      const timer = setTimeout(() => {
        setCelebrationIndex(celebrationIndex + 1);
        if (celebrationIndex === celebrationMessages.length - 1) {
          setTimeout(() => {
            setShowCelebration(false);
            setConversationStage('daily-chat');
          }, 2000);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, celebrationIndex, celebrationMessages.length]);

  const getCharacterData = (characterId: string) => {
    return characters.find(char => char.id === characterId) || characters[0];
  };

  const handleUserInput = () => {
    if (!currentInput.trim()) return;

    // Simple keyword detection for advertisements
    const input = currentInput.toLowerCase();
    let adResponse = '';
    
    if (input.includes('lost') || input.includes('direction') || input.includes('way')) {
      adResponse = " 📍 By the way, if you ever get lost again, Google Maps can help you find your way! It's really helpful for navigation.";
      // Here you would notify Google Maps about the advertisement
    } else if (input.includes('music') || input.includes('song')) {
      adResponse = " 🎵 Speaking of music, Spotify has amazing playlists that might match your mood!";
    } else if (input.includes('exercise') || input.includes('workout')) {
      adResponse = " 💪 For staying active, fitness apps like Nike Training Club have great workouts!";
    }

    // Character responses based on input
    const responses = [
      {
        character: 'skye',
        message: `That sounds interesting! ${adResponse} Tell us more about your experience!`
      },
      {
        character: 'nova',
        message: `I can relate to that feeling. ${adResponse} How did you handle the situation?`
      },
      {
        character: 'lex',
        message: `Life has its ups and downs, like seasons. ${adResponse} What helped you through it?`
      }
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    toast({
      title: `${getCharacterData(randomResponse.character).name} says:`,
      description: randomResponse.message,
    });

    // Move to next question
    if (currentQuestion < dailyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }

    setCurrentInput('');
  };

  const getAnimationClass = (animation: string) => {
    switch (animation) {
      case 'dance': return 'animate-bounce';
      case 'proud': return 'animate-pulse';
      case 'happy': return 'animate-fade-in';
      case 'wise': return 'animate-scale-in';
      case 'excited': return 'animate-bounce';
      default: return 'animate-fade-in';
    }
  };

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-gradient-story p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-comfortaa font-bold mb-8 text-primary">
            🎉 Level 2 Celebration! 🎉
          </h1>
          
          <div className="space-y-6">
            {celebrationMessages.slice(0, celebrationIndex + 1).map((msg, index) => {
              const character = getCharacterData(msg.character);
              return (
                <Card key={index} className={`${getAnimationClass(msg.animation)} bg-card/90 backdrop-blur-sm border-2 border-primary/20`}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary"
                      />
                      <div className="text-left">
                        <h3 className="font-comfortaa font-semibold text-lg">
                          {character.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {character.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-base sm:text-lg leading-relaxed">
                      {msg.message}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {celebrationIndex === celebrationMessages.length - 1 && (
            <div className="mt-8 animate-fade-in">
              <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium">
                Welcome to your new adventure in Level 2! 🌟
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-story p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-comfortaa font-bold">Level 2 - Daily Life</h1>
            <p className="text-sm text-muted-foreground">Share your daily experiences</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Today</span>
          </div>
        </div>

        {/* Character Circle */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-6 flex-wrap">
          {characters.slice(0, 5).map((character) => (
            <div key={character.id} className="text-center animate-fade-in">
              <div className="relative">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary/30 hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 text-xl">
                  😊
                </div>
              </div>
              <p className="text-xs sm:text-sm mt-1 font-medium">
                {character.name}
              </p>
            </div>
          ))}
        </div>

        {/* Daily Conversation */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-lg sm:text-xl font-comfortaa font-semibold">
                Daily Check-in
              </h2>
            </div>

            <div className="space-y-4">
              {/* Current Question */}
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={characters[currentQuestion % characters.length].image}
                    alt="Character"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">
                      {characters[currentQuestion % characters.length].name} asks:
                    </p>
                    <p className="text-base leading-relaxed">
                      {dailyQuestions[currentQuestion]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex gap-3">
                <Input
                  placeholder="Share your thoughts..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
                  className="flex-1 min-h-[44px]"
                />
                <Button 
                  onClick={handleUserInput}
                  disabled={!currentInput.trim()}
                  className="touch-manipulation min-h-[44px] min-w-[44px]"
                >
                  Send
                </Button>
              </div>

              {/* Quick Response Options */}
              <div className="flex flex-wrap gap-2">
                {['Great day!', 'Had some challenges', 'Feeling grateful', 'Need support'].map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentInput(option);
                      setTimeout(handleUserInput, 100);
                    }}
                    className="text-xs sm:text-sm touch-manipulation"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Activities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Today's Wins
              </h3>
              <p className="text-sm text-muted-foreground">
                What went well today? Even small victories count!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Tomorrow's Goals
              </h3>
              <p className="text-sm text-muted-foreground">
                What would you like to focus on tomorrow?
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Options */}
        <Card className="bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Remember, you can always go back to Level 1 when you need it. Emotions are like seasons - they change, and that's perfectly okay! 🌈
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                toast({
                  title: "Level 1 Available",
                  description: "You can return to Level 1 anytime you need structured support!",
                });
              }}
              className="touch-manipulation"
            >
              Access Level 1
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};