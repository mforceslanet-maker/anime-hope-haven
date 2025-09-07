import { useState, useRef, useEffect } from 'react';
import { Character, ChatMessage, EmotionalState } from '../types/character';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EmotionalStateSelector } from './EmotionalStateSelector';
import { Send, ArrowLeft, Heart, MessageCircle } from 'lucide-react';

interface ChatInterfaceProps {
  character: Character;
  onBack: () => void;
}

export const ChatInterface = ({ character, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: character.greeting,
      sender: 'character',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentMood, setCurrentMood] = useState<EmotionalState>();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string, mood?: EmotionalState): string => {
    const responses = {
      kira: [
        "I hear you, and what you're feeling is completely valid. Let's explore this together gently.",
        "Take a deep breath with me. You're safe here, and we have all the time you need.",
        "That sounds challenging. What feels most important to you right now?",
        "You're showing such courage by sharing this. How can I best support you today?"
      ],
      hana: [
        "Like trees that bend but don't break in storms, you have incredible inner strength.",
        "Sometimes nature teaches us that growth happens slowly, and that's perfectly okay.",
        "Your feelings are like seasons - they change, and each one has its purpose.",
        "Let's find some calm together. You deserve peace and comfort."
      ],
      yuki: [
        "It's beautiful how you're taking time to understand your emotions. That takes wisdom.",
        "Your thoughts and feelings matter deeply. Let's sit with them together.",
        "Sometimes the most healing thing is simply being heard and understood.",
        "What would it feel like to be gentle with yourself in this moment?"
      ],
      sora: [
        "You know what? You're being so brave right now, and I'm proud of you!",
        "Even on cloudy days, the sun is still shining above the clouds - just like your inner light!",
        "Let's find something that brings a little sparkle to your day together!",
        "You have so much strength inside you - sometimes we just need to remind ourselves!"
      ]
    };

    const characterResponses = responses[character.id as keyof typeof responses] || responses.kira;
    return characterResponses[Math.floor(Math.random() * characterResponses.length)];
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      emotion: currentMood
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const characterResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(currentMessage, currentMood),
        sender: 'character',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, characterResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 shadow-gentle">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <img
            src={character.image}
            alt={character.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <h2 className="font-comfortaa font-semibold text-lg">{character.name}</h2>
            <p className="text-sm text-muted-foreground">{character.role}</p>
          </div>

          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Safe Space</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-character'}`}
            >
              <div className="flex items-start gap-3">
                {message.sender === 'character' && (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  {message.emotion && message.sender === 'user' && (
                    <div className={`emotion-indicator emotion-${message.emotion} text-xs mb-2 inline-flex`}>
                      Feeling {message.emotion}
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble chat-bubble-character">
              <div className="flex items-center gap-3">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4 shadow-gentle">
        <div className="max-w-4xl mx-auto space-y-4">
          <EmotionalStateSelector
            currentMood={currentMood}
            onMoodSelect={setCurrentMood}
          />
          
          <div className="flex gap-2">
            <Input
              placeholder={`Share what's on your mind with ${character.name}...`}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
            />
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim()}
              className="p-3 rounded-xl"
              style={{
                backgroundColor: `hsl(var(--${character.color}))`,
                color: 'white',
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            <MessageCircle className="w-3 h-3 inline mr-1" />
            Your conversations are private and anonymous. {character.name} is here to listen and support you.
          </p>
        </div>
      </div>
    </div>
  );
};