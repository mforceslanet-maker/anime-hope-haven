import { useState, useRef, useEffect } from 'react';
import { Character, ChatMessage, EmotionalState } from '../types/character';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { EmotionalStateSelector } from './EmotionalStateSelector';
import { VoiceRecorder } from './VoiceRecorder';
import { VoiceConversation } from './VoiceConversation';
import { Send, ArrowLeft, Heart, Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './ui/use-toast';

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
  const [showVoiceConversation, setShowVoiceConversation] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize profile and load chat history
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get client IP and assign room
        const { data: ipData } = await supabase.functions.invoke('get-client-ip');
        const clientIp = ipData?.ip || 'unknown';

        // Get or create room for this IP
        const { data: roomId } = await supabase.rpc('get_or_create_room', {
          p_ip_address: clientIp
        });

        // Get room name for display
        const { data: roomData } = await supabase
          .from('rooms')
          .select('room_name')
          .eq('id', roomId)
          .single();

        console.log('Connected from:', roomData?.room_name || 'Unknown Room');

        // Get or create anonymous profile
        const anonymousId = localStorage.getItem('anonymousId') || crypto.randomUUID();
        localStorage.setItem('anonymousId', anonymousId);

        // Check if profile exists
        let { data: profile } = await supabase
          .from('profiles')
          .select('id, room_id')
          .eq('anonymous_id', anonymousId)
          .maybeSingle();

        // Create profile if it doesn't exist
        if (!profile) {
          const { data: newProfile, error } = await supabase
            .from('profiles')
            .insert({ 
              anonymous_id: anonymousId, 
              current_mood: currentMood,
              room_id: roomId 
            })
            .select()
            .single();

          if (error) throw error;
          profile = newProfile;
        } else if (!profile.room_id) {
          // Update existing profile with room_id
          await supabase
            .from('profiles')
            .update({ room_id: roomId })
            .eq('id', profile.id);
        }

        setProfileId(profile.id);

        // Get or create chat session
        let { data: session } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('profile_id', profile.id)
          .eq('character_id', character.id)
          .order('last_message_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!session) {
          const { data: newSession, error } = await supabase
            .from('chat_sessions')
            .insert({
              profile_id: profile.id,
              character_id: character.id,
              character_name: character.name
            })
            .select()
            .single();

          if (error) throw error;
          session = newSession;
        }

        setSessionId(session.id);

        // Load previous messages
        const { data: previousMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true });

        if (previousMessages && previousMessages.length > 0) {
          const loadedMessages = previousMessages.map(msg => ({
            id: msg.id,
            content: msg.content,
            sender: msg.sender as 'user' | 'character',
            timestamp: new Date(msg.created_at),
            emotion: msg.emotion as EmotionalState | undefined
          }));
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [character.id, character.name, currentMood]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowBackToTop(scrollContainerRef.current.scrollTop > 300);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, mood?: EmotionalState): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: {
          message: userMessage,
          characterName: character.name,
          characterPersonality: character.personality,
          mood: mood
        }
      });

      if (error) {
        console.error('Error calling OpenAI:', error);
        toast({
          title: "Connection Error",
          description: "Unable to connect to AI service. Using fallback response.",
          variant: "destructive"
        });
        return getFallbackResponse();
      }

      if (data.error) {
        toast({
          title: "Chat Error",
          description: data.error,
          variant: "destructive"
        });
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
      'military-therapist': [
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
    if (!currentMessage.trim() || !sessionId) return;

    const userMessageContent = currentMessage;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userMessageContent,
      sender: 'user',
      timestamp: new Date(),
      emotion: currentMood
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Save user message to database
    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        content: userMessageContent,
        sender: 'user',
        emotion: currentMood
      });
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    // Generate AI response
    setTimeout(async () => {
      const aiContent = await generateAIResponse(userMessageContent, currentMood);
      
      const characterResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiContent,
        sender: 'character',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, characterResponse]);
      setIsTyping(false);

      // Save character response to database
      try {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          content: aiContent,
          sender: 'character'
        });
      } catch (error) {
        console.error('Error saving character message:', error);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setCurrentMessage(text);
  };

  if (showVoiceConversation) {
    return (
      <VoiceConversation
        character={character}
        onClose={() => setShowVoiceConversation(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border p-3 sm:p-4 shadow-gentle">
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

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowVoiceConversation(true)}
              variant="ghost"
              size="sm"
              className="gap-2"
              style={{
                color: `hsl(var(--${character.color}))`,
              }}
            >
              <Phone className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Voice Call</span>
            </Button>
            <div className="flex items-center gap-1 sm:gap-2 text-primary">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">Safe Space</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 max-w-4xl mx-auto w-full p-3 sm:p-4 overflow-y-auto"
      >
        <div className="space-y-8 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {message.sender === 'character' && (
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover flex-shrink-0 shadow-xl"
                />
              )}
              
              <div className={`relative max-w-[65%] ${message.sender === 'user' ? 'mr-4' : 'ml-2'}`}>
                {/* Cloud speech bubble with tail */}
                {message.sender === 'character' && (
                  <>
                    <div 
                      className="absolute left-2 -bottom-4 w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '2px solid',
                        borderColor: `hsl(var(--${character.color}) / 0.3)`,
                      }}
                    />
                    <div 
                      className="absolute left-0 -bottom-2 w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '2px solid',
                        borderColor: `hsl(var(--${character.color}) / 0.3)`,
                      }}
                    />
                  </>
                )}
                {message.sender === 'user' && (
                  <>
                    <div 
                      className="absolute right-2 -bottom-4 w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: `hsl(var(--${character.color}))`,
                      }}
                    />
                    <div 
                      className="absolute right-0 -bottom-2 w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: `hsl(var(--${character.color}))`,
                      }}
                    />
                  </>
                )}
                
                {/* Cloud-style message bubble */}
                <div 
                  className={`relative px-6 py-5 shadow-lg ${
                    message.sender === 'user' 
                      ? 'text-white' 
                      : 'bg-card text-foreground border-[3px]'
                  }`}
                  style={{
                    ...(message.sender === 'user' ? {
                      backgroundColor: `hsl(var(--${character.color}))`,
                    } : {
                      borderColor: `hsl(var(--${character.color}) / 0.4)`,
                    }),
                    borderRadius: '25px 25px 25px 25px',
                  }}
                >
                  {message.emotion && message.sender === 'user' && (
                    <div className="text-xs mb-2 opacity-90 font-medium">
                      Feeling {message.emotion}
                    </div>
                  )}
                  <p className="text-sm sm:text-base leading-relaxed break-words overflow-wrap-anywhere">
                    {message.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-end gap-4">
              <img
                src={character.image}
                alt={character.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover flex-shrink-0 shadow-xl"
              />
              
              <div className="relative max-w-[65%] ml-2">
                {/* Cloud speech bubble with tail */}
                <>
                  <div 
                    className="absolute left-2 -bottom-4 w-6 h-6 rounded-full border-[3px]"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: `hsl(var(--${character.color}) / 0.4)`,
                    }}
                  />
                  <div 
                    className="absolute left-0 -bottom-2 w-4 h-4 rounded-full border-[3px]"
                    style={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: `hsl(var(--${character.color}) / 0.4)`,
                    }}
                  />
                </>
                
                {/* Typing indicator bubble */}
                <div 
                  className="relative px-6 py-5 bg-card shadow-lg border-[3px]"
                  style={{
                    borderColor: `hsl(var(--${character.color}) / 0.4)`,
                    borderRadius: '25px 25px 25px 25px',
                  }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Floating Input Area */}
          <div className="bg-card rounded-2xl p-4 shadow-lg border border-border/50 mt-4 animate-fade-in">
            <EmotionalStateSelector
              currentMood={currentMood}
              onMoodSelect={setCurrentMood}
            />
            
            <div className="flex gap-2 sm:gap-3 mt-3">
              <VoiceRecorder
                onTranscriptionComplete={handleVoiceTranscription}
                disabled={isTyping}
              />
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
            
            <p className="text-xs text-center text-muted-foreground leading-relaxed px-2 mt-3">
              <MessageCircle className="w-3 h-3 inline mr-1" />
              Your conversations are private and anonymous. {character.name} is here to listen and support you.
            </p>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-20 rounded-full p-3 shadow-lg animate-fade-in"
          style={{
            backgroundColor: `hsl(var(--${character.color}))`,
            color: 'white',
          }}
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};