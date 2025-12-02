import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mic, X, Volume2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Character } from '../types/character';
import { supabase } from '../integrations/supabase/client';

interface VoiceConversationProps {
  character: Character;
  onClose: () => void;
}

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceConversation = ({ character, onClose }: VoiceConversationProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [conversationActive, setConversationActive] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Load available voices
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      setAvailableVoices(voices);
      
      // Select a default voice (prefer English voices)
      const defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (defaultVoice) {
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Voice conversation is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log('User said:', transcript);
      
      // Stop listening while processing
      recognition.stop();
      setIsListening(false);
      
      // Get AI response
      await getAIResponse(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Restart listening if no speech detected
        if (conversationActive) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Failed to restart recognition:', e);
            }
          }, 100);
        }
      } else if (event.error !== 'aborted') {
        toast({
          title: "Recognition Error",
          description: `Could not recognize speech: ${event.error}`,
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart listening if conversation is still active and not speaking
      if (conversationActive && !isSpeaking) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [conversationActive, isSpeaking, toast]);

  const getAIResponse = async (userMessage: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: {
          message: userMessage,
          characterName: character.name,
          characterPersonality: character.personality
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "API Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      const responseText = data.response || "I'm here to listen.";
      
      // Speak the response
      await speakText(responseText);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      
      // Restart listening even on error
      if (conversationActive && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Failed to restart after error:', e);
          }
        }, 1000);
      }
    }
  };

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthRef.current) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set selected voice
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        resolve();
      };

      synthRef.current.speak(utterance);
    });
  };

  const startConversation = async () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Ready",
        description: "Voice recognition is not available.",
        variant: "destructive",
      });
      return;
    }

    // Request microphone permission explicitly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed to get permission
      stream.getTracks().forEach(track => track.stop());
      console.log('Microphone permission granted');
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice conversation.",
        variant: "destructive",
      });
      return;
    }

    setConversationActive(true);
    
    toast({
      title: "Conversation Started",
      description: `${character.name} is greeting you...`,
    });

    // Speak the character's greeting first
    await speakText(character.greeting);
    
    // Start listening after the character finishes speaking
    setTimeout(() => {
      try {
        recognitionRef.current?.start();
        console.log('Speech recognition started');
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }, 500);
  };

  const stopConversation = () => {
    setConversationActive(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    setIsListening(false);
    setIsSpeaking(false);
  };

  const handleClose = () => {
    stopConversation();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4">
      {/* Header with voice selection */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex-1 max-w-xs">
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {availableVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground ml-4">
          {character.name}
        </p>
      </div>

      {/* Character with speaking animation */}
      <div className="relative mb-12">
        {/* Animated glow rings when speaking */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-600/30 animate-pulse" />
            <div className="absolute inset-0 -m-12 rounded-full bg-gradient-to-br from-blue-300/20 to-blue-500/20 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-0 -m-16 rounded-full bg-gradient-to-br from-blue-200/10 to-blue-400/10 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </>
        )}
        
        {/* Listening indicator */}
        {isListening && (
          <div className="absolute inset-0 -m-6 rounded-full border-4 border-blue-400 animate-pulse" />
        )}
        
        {/* Character image */}
        <div 
          className={`relative w-64 h-64 rounded-full overflow-hidden transition-all duration-300 ${
            isSpeaking ? 'scale-110 shadow-2xl' : isListening ? 'scale-105 shadow-xl' : 'shadow-lg'
          }`}
          style={{
            boxShadow: isSpeaking 
              ? `0 0 80px rgba(59, 130, 246, 0.8), 0 0 40px hsl(var(--${character.color}) / 0.6)` 
              : isListening 
              ? '0 0 40px rgba(59, 130, 246, 0.5)' 
              : '0 0 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <img 
            src={character.image} 
            alt={character.name}
            className="w-full h-full object-cover"
          />
          
          {/* Mouth glow overlay when speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/40 via-transparent to-transparent animate-pulse" />
          )}
        </div>
        
        {/* Status icon overlay */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
          {isSpeaking ? (
            <Volume2 className="w-6 h-6 text-blue-500 animate-pulse" />
          ) : isListening ? (
            <Mic className="w-6 h-6 text-blue-400 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Status text */}
      <p className="text-center text-lg font-medium mb-8">
        {isSpeaking 
          ? `${character.name} is speaking...` 
          : isListening 
          ? "Listening... speak now" 
          : conversationActive
          ? "Processing..."
          : "Ready to start"}
      </p>

      {/* Control buttons */}
      <div className="flex gap-4">
        {!conversationActive ? (
          <Button
            onClick={startConversation}
            size="lg"
            className="rounded-full w-16 h-16 p-0"
            style={{
              backgroundColor: `hsl(var(--${character.color}))`,
              color: 'white',
            }}
          >
            <Mic className="w-6 h-6" />
          </Button>
        ) : (
          <Button
            onClick={stopConversation}
            size="lg"
            variant="destructive"
            className="rounded-full w-16 h-16 p-0"
          >
            <Mic className="w-6 h-6" />
          </Button>
        )}
        
        <Button
          onClick={handleClose}
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0"
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-muted-foreground">
        <p>Tap the microphone to start a live voice conversation</p>
        <p className="mt-1">The AI will respond with voice automatically</p>
      </div>
    </div>
  );
};
