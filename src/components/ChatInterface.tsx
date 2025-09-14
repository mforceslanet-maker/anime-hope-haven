import { useState, useRef, useEffect } from 'react';
import { Character, ChatMessage, EmotionalState } from '../types/character';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EmotionalStateSelector } from './EmotionalStateSelector';
import { Send, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

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

  const generateAIResponse = async (userMessage: string, mood?: EmotionalState): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-perplexity', {
        body: {
          message: userMessage,
          characterName: character.name,
          characterPersonality: character.personality,
          mood: mood
        }
      });

      if (error) {
        console.error('Error calling Perplexity:', error);
        return getFallbackResponse();
      }

      return data.response || getFallbackResponse();
    } catch (error) {
      console.error('Error with AI response:', error);
      return getFallbackResponse();
    }
  };

  const getFallbackResponse = (): string => {
    const responses = {
      junno: [
        "I hear you, and what you're feeling is completely valid. Let's explore this together gently.",
        "Take a deep breath with me. You're safe here, and we have all the time you need.",
        "That sounds challenging. What feels most important to you right now?",
        "You're showing such courage by sharing this. How can I best support you today?"
      ],
      lex: [
        "Like trees that bend but don't break in storms, you have incredible inner strength.",
        "Sometimes nature teaches us that growth happens slowly, and that's perfectly okay.",
        "Your feelings are like seasons - they change, and each one has its purpose.",
        "Let's find some calm together. You deserve peace and comfort."
      ],
      nova: [
        "It's beautiful how you're taking time to understand your emotions. That takes wisdom.",
        "Your thoughts and feelings matter deeply. Let's sit with them together.",
        "Sometimes the most healing thing is simply being heard and understood.",
        "What would it feel like to be gentle with yourself in this moment?"
      ],
      skye: [
        "You know what? You're being so brave right now, and I'm proud of you!",
        "Even on cloudy days, the sun is still shining above the clouds - just like your inner light!",
        "Let's find something that brings a little sparkle to your day together!",
        "You have so much strength inside you - sometimes we just need to remind ourselves!"
      ],
      alex: [
        "I'm here to listen and support you through whatever you're experiencing.",
        "Your feelings are completely valid, and you deserve compassion and understanding.",
        "Let's work through this together, one step at a time.",
        "You're not alone in this. I'm here to help you find your way forward."
      ]
    };

    const characterResponses = responses[character.id as keyof typeof responses] || responses.junno;
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

    // Generate AI response
    setTimeout(async () => {
      const aiContent = await generateAIResponse(currentMessage, currentMood);
      
      const characterResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
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
      <div className="bg-card border-b border-border p-3 sm:p-4 shadow-gentle">
        <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <img
            src={character.image}
            alt={character.name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <h2 className="font-comfortaa font-semibold text-base sm:text-lg truncate">{character.name}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{character.role}</p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 text-primary">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Safe Space</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-3 sm:p-4 overflow-y-auto">
        <div className="space-y-3 sm:space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-character'} ${message.sender === 'user' ? 'max-w-[85%] ml-auto' : 'max-w-[85%]'}`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                {message.sender === 'character' && (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  {message.emotion && message.sender === 'user' && (
                    <div className={`emotion-indicator emotion-${message.emotion} text-xs mb-2 inline-flex`}>
                      Feeling {message.emotion}
                    </div>
                  )}
                  <p className="text-sm sm:text-base leading-relaxed break-words">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="chat-bubble chat-bubble-character max-w-[85%]">
              <div className="flex items-center gap-2 sm:gap-3">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
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
      <div className="bg-card border-t border-border p-3 sm:p-4 shadow-gentle">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <EmotionalStateSelector
            currentMood={currentMood}
            onMoodSelect={setCurrentMood}
          />
          
          <div className="flex gap-2 sm:gap-3">
            <Input
              placeholder={`Share what's on your mind with ${character.name}...`}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 rounded-xl border-border/50 focus:border-primary/50 transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-[48px]"
            />
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim()}
              className="p-3 sm:p-4 rounded-xl touch-manipulation min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px]"
              style={{
                backgroundColor: `hsl(var(--${character.color}))`,
                color: 'white',
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground leading-relaxed px-2">
            <MessageCircle className="w-3 h-3 inline mr-1" />
            Your conversations are private and anonymous. {character.name} is here to listen and support you.
          </p>
        </div>
      </div>
    </div>
  );
};