import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Mic, MicOff, Send, ArrowDown } from 'lucide-react';
import { storyCharacters, getCharactersByAge } from '../data/storyCharacters';

interface Level2ScreenProps {
  onBack: () => void;
  onReturnToLevel1: () => void;
  age: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'character';
  character?: any;
  timestamp: Date;
}

const dailyTopics = [
  "How was your day?",
  "Any wins today?",
  "What made you smile?",
  "What challenged you today?",
  "Tell us about something you're proud of!",
  "Any new experiences today?",
  "What are you grateful for?",
];

const characterResponses = {
  achievements: [
    "That's amazing! You should be really proud of yourself!",
    "Wow, look at you crushing it! That's fantastic!",
    "You're doing incredible things! Keep it up!",
    "That's such a big accomplishment! Celebrate this moment!",
  ],
  challenges: [
    "That sounds tough, but you're handling it so well.",
    "Challenges help us grow stronger. You've got this!",
    "It's okay to have difficult days. You're not alone in this.",
    "Every challenge is a step toward becoming stronger.",
  ],
  general: [
    "Thanks for sharing that with us! We love hearing about your day.",
    "You always have such interesting stories to tell!",
    "It's so nice to catch up with you like this.",
    "We're always here to listen and celebrate with you!",
  ],
  ads: {
    lost: "Speaking of getting lost, have you tried Google Maps? It's a lifesaver for finding your way around! 📍",
    tired: "Feeling tired? Maybe try a meditation app like Headspace to recharge! 🧘‍♀️",
    hungry: "Hungry? Apps like DoorDash or Uber Eats can get you food delivered quickly! 🍕",
    bored: "Bored? Netflix has tons of great shows to keep you entertained! 📺",
  }
};

export const Level2Screen = ({ onBack, onReturnToLevel1, age }: Level2ScreenProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const availableCharacters = getCharactersByAge(age);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (content: string, sender: 'user' | 'character', character?: any) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      character,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
  };

  const generateCharacterResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    let responseType = 'general';
    let adType: keyof typeof characterResponses.ads | null = null;

    // Detect context for appropriate responses
    if (lowerMessage.includes('proud') || lowerMessage.includes('achieved') || lowerMessage.includes('won') || lowerMessage.includes('success')) {
      responseType = 'achievements';
    } else if (lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('challenging') || lowerMessage.includes('problem')) {
      responseType = 'challenges';
    }

    // Detect ad opportunities
    if (lowerMessage.includes('lost') || lowerMessage.includes('direction') || lowerMessage.includes('find')) {
      adType = 'lost';
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('stressed')) {
      adType = 'tired';
    } else if (lowerMessage.includes('hungry') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      adType = 'hungry';
    } else if (lowerMessage.includes('bored') || lowerMessage.includes('nothing to do')) {
      adType = 'bored';
    }

    const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    const responses = characterResponses[responseType as keyof typeof characterResponses] as string[];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      addMessage(randomResponse, 'character', randomCharacter);
      
      // Add ad if applicable
      if (adType) {
        setTimeout(() => {
          addMessage(characterResponses.ads[adType], 'character', randomCharacter);
        }, 2000);
      }
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    addMessage(currentMessage, 'user');
    setShowTopicSuggestions(false);
    generateCharacterResponse(currentMessage);
    setCurrentMessage('');
  };

  const handleTopicClick = (topic: string) => {
    setCurrentMessage(topic);
    setShowTopicSuggestions(false);
  };

  const startRecording = async () => {
    // Voice recording implementation would go here
    setIsRecording(true);
    // Placeholder for voice recording
    setTimeout(() => {
      setIsRecording(false);
      setCurrentMessage("I had a really good day today! Got some work done and went for a walk.");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-sage-green flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/20 p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl font-comfortaa font-bold text-white">
            Level 2 - Daily Life
          </h1>
          <p className="text-white/80 text-sm">
            Share your experiences with friends
          </p>
        </div>

        <Button
          onClick={onReturnToLevel1}
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 text-sm px-3 py-1 rounded-full"
        >
          Level 1
        </Button>
      </motion.div>

      {/* Welcome message */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto">
            <div className="flex justify-center gap-3 mb-4">
              {storyCharacters.slice(0, 3).map((character, index) => (
                <motion.div
                  key={character.id}
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30"
                  style={{ backgroundColor: character.color }}
                >
                  <span className="text-xl">
                    {character.name === 'Junno' && '🎉'}
                    {character.name === 'Lex' && '✨'}
                    {character.name === 'Nova' && '🌟'}
                    {character.name === 'Skye' && '💫'}
                    {character.name === 'Alex' && '🎊'}
                  </span>
                </div>
              ))}
            </div>
            
            <h2 className="text-xl font-comfortaa font-semibold text-white text-center mb-3">
              Welcome to Level 2!
            </h2>
            <p className="text-white/90 font-nunito text-center">
              We're all here and so excited you made it! Share your daily experiences, 
              achievements, and anything that's on your mind. We love hearing from you!
            </p>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${
                  message.sender === 'user' 
                    ? 'bg-white/30 text-white ml-auto' 
                    : 'bg-white/20 text-white'
                } rounded-2xl p-4`}>
                  {message.sender === 'character' && message.character && (
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: message.character.color }}
                      >
                        {message.character.name === 'Junno' && '🧠'}
                        {message.character.name === 'Lex' && '⚡'}
                        {message.character.name === 'Nova' && '🌙'}
                        {message.character.name === 'Skye' && '🎨'}
                        {message.character.name === 'Alex' && '🛡️'}
                      </div>
                      <span className="text-sm font-nunito font-medium">
                        {message.character.name}
                      </span>
                    </div>
                  )}
                  <p className="font-nunito">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Topic suggestions */}
      {showTopicSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <div className="max-w-2xl mx-auto">
            <p className="text-white/80 text-center mb-3 font-nunito">
              Choose a topic to get started:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {dailyTopics.map((topic, index) => (
                <motion.button
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTopicClick(topic)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-2 rounded-full text-sm font-nunito transition-all duration-300 hover:scale-105"
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Input area */}
      <div className="p-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Share something about your day..."
              className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/60 rounded-2xl resize-none min-h-12"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <div className="flex flex-col gap-2">
              <Button
                onClick={isRecording ? () => setIsRecording(false) : startRecording}
                className={`p-3 rounded-2xl ${
                  isRecording 
                    ? 'bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30' 
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="p-3 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-2xl disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};