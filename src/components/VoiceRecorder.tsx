import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceRecorder = ({ onTranscriptionComplete, disabled }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Listening...",
        description: "Speak now. The recording will stop automatically.",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log('Transcription:', transcript, 'Confidence:', confidence);
      onTranscriptionComplete(transcript);
      
      toast({
        title: "Voice Recognized",
        description: "Your message has been transcribed.",
      });
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        toast({
          title: "Microphone Access Denied",
          description: "Please enable microphone access in your browser settings to use voice input.",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: "No Speech Detected",
          description: "Please speak louder or check your microphone.",
          variant: "destructive",
        });
      } else if (event.error === 'aborted') {
        // User stopped recording manually, no error toast needed
        return;
      } else {
        toast({
          title: "Voice Recognition Failed",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [onTranscriptionComplete, toast]);

  const toggleRecording = () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    if (!recognitionRef.current) {
      toast({
        title: "Not Ready",
        description: "Voice recognition is still loading. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsRecording(false);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Failed to Start",
          description: "Could not start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      onClick={toggleRecording}
      disabled={disabled || !isSupported}
      variant={isRecording ? "destructive" : "secondary"}
      className={`rounded-xl min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px] ${isRecording ? 'animate-pulse' : ''}`}
      title={!isSupported ? 'Voice input not supported' : isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};
