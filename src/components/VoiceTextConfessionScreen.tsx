import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Mic, MicOff, Send } from 'lucide-react';
import { storyCharacters, getCharactersByAge } from '../data/storyCharacters';
import { supabase } from '../integrations/supabase/client';

interface VoiceTextConfessionScreenProps {
  onBack: () => void;
  age: number;
}

export const VoiceTextConfessionScreen = ({ onBack, age }: VoiceTextConfessionScreenProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState('');
  const [respondingCharacter, setRespondingCharacter] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const availableCharacters = getCharactersByAge(age);
  const selectedCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: formData,
      });

      if (error) throw error;

      if (data?.text) {
        setMessage(data.text);
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);
    setRespondingCharacter(selectedCharacter);

    // Simulate character response
    setTimeout(() => {
      const responses = [
        "That must be really tough, but you're not alone in feeling this way.",
        "I hear you, and your feelings are completely valid.",
        "Thank you for sharing that with me. It takes courage to open up.",
        "You're being so brave by talking about this. I'm here to listen.",
        "What you're feeling makes complete sense given what you're going through.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setResponse(randomResponse);
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setMessage('');
    setResponse('');
    setRespondingCharacter(null);
  };

  return (
    <div className="min-h-screen bg-gradient-sky-blue relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-2xl font-comfortaa font-bold text-white text-center">
            Share Your Feelings
          </h1>

          <div className="w-10 h-10"></div>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {!response ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
                <h2 className="text-xl font-comfortaa font-semibold text-white text-center mb-4">
                  What's on your mind today?
                </h2>
                
                <p className="text-white/80 text-center mb-6 font-nunito">
                  You can type your thoughts or use the microphone to speak
                </p>

                <div className="space-y-4">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what you're thinking or feeling..."
                    className="min-h-32 bg-white/10 border-white/20 text-white placeholder-white/60 rounded-2xl resize-none"
                    disabled={isProcessing}
                  />

                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isProcessing}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                        isRecording 
                          ? 'bg-red-500/20 border-red-400/30 text-red-200 hover:bg-red-500/30' 
                          : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-5 h-5" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          Record Voice
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={!message.trim() || isProcessing}
                      className="flex items-center gap-2 px-6 py-3 bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-2xl"
                    >
                      <Send className="w-5 h-5" />
                      {isProcessing ? 'Processing...' : 'Share'}
                    </Button>
                  </div>
                </div>
              </div>

              {isRecording && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-200 px-4 py-2 rounded-full">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    Recording...
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Character response */}
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/30"
                    style={{ backgroundColor: respondingCharacter?.color }}
                  >
                    <span className="text-2xl">
                      {respondingCharacter?.name === 'Junno' && '🧠'}
                      {respondingCharacter?.name === 'Lex' && '⚡'}
                      {respondingCharacter?.name === 'Nova' && '🌙'}
                      {respondingCharacter?.name === 'Skye' && '🎨'}
                      {respondingCharacter?.name === 'Alex' && '🛡️'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-comfortaa font-semibold text-white">
                      {respondingCharacter?.name}
                    </h3>
                    <p className="text-white/60 text-sm">is speaking...</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-white text-lg font-nunito leading-relaxed"
                  >
                    "{response}"
                  </motion.p>
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleReset}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2 rounded-2xl"
                  >
                    Share Something Else
                  </Button>
                </div>
              </div>

              {/* Your message */}
              <div className="bg-white/10 rounded-2xl p-4">
                <h4 className="text-white/80 font-nunito font-medium mb-2">You shared:</h4>
                <p className="text-white/60 font-nunito italic">"{message}"</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};