import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [audioLevel, setAudioLevel] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const { toast } = useToast();

  // Audio level visualization
  const startAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
    } catch (error) {
      console.error('Failed to start audio visualization:', error);
    }
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  }, []);

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
      stopAudioVisualization();
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [stopAudioVisualization]);

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
    recognition.continuous = true;
    recognition.interimResults = true; // Enable interim results for better feedback
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      lastSpeechTimeRef.current = Date.now();
      console.log('Speech recognition started');
    };

    recognition.onresult = async (event: any) => {
      let finalTranscript = '';
      let interim = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      
      // Update interim transcript for visual feedback
      setInterimTranscript(interim);
      lastSpeechTimeRef.current = Date.now();
      
      if (finalTranscript) {
        console.log('Final transcript:', finalTranscript);
        setInterimTranscript('');
        
        // Stop listening while processing
        recognition.stop();
        setIsListening(false);
        
        // Clear silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        // Get AI response
        await getAIResponse(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // Restart listening if no speech detected
        if (conversationActive && !isSpeaking) {
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
      setInterimTranscript('');
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

    // Request microphone permission and start visualization
    try {
      await startAudioVisualization();
      console.log('Microphone permission granted and visualization started');
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
    
    stopAudioVisualization();
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    
    setIsListening(false);
    setIsSpeaking(false);
    setInterimTranscript('');
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
        
        {/* Listening indicator with volume level */}
        {isListening && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-4 border-green-400 transition-all duration-75"
              style={{
                margin: `${-6 - audioLevel * 20}px`,
                opacity: 0.3 + audioLevel * 0.7,
                borderColor: audioLevel > 0.3 ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)',
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border-2 border-green-300 transition-all duration-75"
              style={{
                margin: `${-12 - audioLevel * 30}px`,
                opacity: audioLevel * 0.5,
              }}
            />
          </>
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

      {/* Volume level bars when listening */}
      {isListening && (
        <div className="flex items-end justify-center gap-1 h-8 mb-4">
          {[...Array(7)].map((_, i) => {
            const threshold = i / 7;
            const isActive = audioLevel > threshold;
            return (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-75 ${
                  isActive ? 'bg-green-500' : 'bg-muted'
                }`}
                style={{
                  height: `${12 + i * 4}px`,
                  opacity: isActive ? 0.8 + audioLevel * 0.2 : 0.3,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Status text */}
      <p className="text-center text-lg font-medium mb-2">
        {isSpeaking 
          ? `${character.name} is speaking...` 
          : isListening 
          ? "Listening... speak now" 
          : conversationActive
          ? "Processing..."
          : "Ready to start"}
      </p>
      
      {/* Show interim transcript */}
      {interimTranscript && (
        <p className="text-center text-sm text-muted-foreground mb-6 px-4 italic max-w-md">
          "{interimTranscript}"
        </p>
      )}
      {!interimTranscript && <div className="mb-6" />}

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
