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
      const { data, error } = await supabase.functions.invoke('chat-with-perplexity', {
        body: {
          message: userMessage,
          characterName: character.name,
          characterPersonality: character.personality,
        }
      });

      if (error) throw error;

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

  const startConversation = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Not Ready",
        description: "Voice recognition is not available.",
        variant: "destructive",
      });
      return;
    }

    setConversationActive(true);
    
    toast({
      title: "Conversation Started",
      description: `Start speaking with ${character.name}`,
    });

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
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

      {/* Animated orb */}
      <div className="relative mb-20">
        <div 
          className={`w-64 h-64 rounded-full transition-all duration-300 ${
            isSpeaking 
              ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 animate-pulse scale-110' 
              : isListening 
              ? 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 animate-pulse' 
              : 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400'
          }`}
          style={{
            boxShadow: isSpeaking || isListening 
              ? '0 0 60px rgba(59, 130, 246, 0.6)' 
              : '0 0 30px rgba(59, 130, 246, 0.3)',
          }}
        />
        
        {/* Status indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isSpeaking ? (
            <Volume2 className="w-16 h-16 text-white animate-pulse" />
          ) : isListening ? (
            <Mic className="w-16 h-16 text-white animate-pulse" />
          ) : null}
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
