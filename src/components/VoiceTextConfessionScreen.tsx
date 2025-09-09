import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { storyCharacters } from '../data/storyCharacters';
import { VoiceInput } from './VoiceInput';
import { UserProfile } from '../types/story';
import { Mic, MessageCircle, ArrowLeft, Heart } from 'lucide-react';

interface VoiceTextConfessionScreenProps {
  userProfile: UserProfile;
  onBack: () => void;
}

export const VoiceTextConfessionScreen = ({ userProfile, onBack }: VoiceTextConfessionScreenProps) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [message, setMessage] = useState('');
  const [currentCharacter, setCurrentCharacter] = useState(storyCharacters[0]);
  const [showResponse, setShowResponse] = useState(false);
  const [characterResponse, setCharacterResponse] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;

    // Select a random character based on age group
    const randomCharacter = storyCharacters[Math.floor(Math.random() * storyCharacters.length)];
    setCurrentCharacter(randomCharacter);

    // Generate age-appropriate response
    const responses = {
      teen: [
        "That must be really tough, but you're not alone. I'm here for you! 💙",
        "I totally get what you're going through. You're stronger than you think! ✨",
        "Thanks for sharing that with me. Your feelings are completely valid. 🌟",
        "That sounds really challenging. Want to talk about what might help? 💝"
      ],
      adult: [
        "Thank you for trusting me with this. Your feelings matter deeply. 💙",
        "That sounds like a significant experience. How are you processing it? 🌟",
        "I can hear the strength in your words, even through the struggle. 💝",
        "Life can be overwhelming sometimes. You're brave for reaching out. ✨"
      ],
      senior: [
        "Your wisdom and experience shine through your words. Thank you for sharing. 💙",
        "That speaks to a lifetime of experiences. Your perspective is valuable. 🌟",
        "I'm honored that you've shared this with me. Your story matters. 💝",
        "Through all of life's seasons, you've shown such resilience. ✨"
      ]
    };

    const ageResponses = responses[userProfile.ageGroup];
    const response = ageResponses[Math.floor(Math.random() * ageResponses.length)];
    
    setCharacterResponse(response);
    setShowResponse(true);
  };

  const handleVoiceTranscription = (text: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + text);
  };

  const handleReset = () => {
    setMessage('');
    setShowResponse(false);
    setCharacterResponse('');
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-sage-green to-blush-pink">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-comfortaa font-bold text-white">
              Share Your Heart
            </h1>
            <p className="text-white/90">Your feelings matter to us</p>
          </div>
          <div></div>
        </div>

        {!showResponse ? (
          /* Input Section */
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-blush-pink mx-auto mb-4" />
              <h2 className="text-3xl font-comfortaa font-bold text-gray-800 mb-4">
                What's on your mind today?
              </h2>
              <p className="text-gray-600 text-lg">
                Share your thoughts, feelings, or anything that's weighing on your heart.
              </p>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={inputMode === 'text' ? 'default' : 'outline'}
                onClick={() => setInputMode('text')}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Type Your Thoughts
              </Button>
              <Button
                variant={inputMode === 'voice' ? 'default' : 'outline'}
                onClick={() => setInputMode('voice')}
                className="flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                Speak Your Heart
              </Button>
            </div>

            {/* Input Area */}
            <div className="space-y-6">
              {inputMode === 'text' ? (
                <Textarea
                  placeholder="Take your time... share whatever feels right for you today."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[200px] text-lg rounded-2xl border-2 border-gray-200 focus:border-blush-pink"
                />
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Your voice will be transcribed here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[200px] text-lg rounded-2xl border-2 border-gray-200 focus:border-sage-green"
                  />
                  <div className="flex justify-center">
                    <VoiceInput
                      onTranscription={handleVoiceTranscription}
                      disabled={false}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-sage-green to-blush-pink hover:from-sage-green/80 hover:to-blush-pink/80 text-white font-semibold py-3 px-8 rounded-2xl"
                >
                  Share with a Friend
                </Button>
                {message && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="py-3 px-8 rounded-2xl"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          /* Character Response Section */
          <div className="space-y-6">
            {/* Character Display */}
            <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-xl">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={currentCharacter.image}
                  alt={currentCharacter.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-comfortaa font-bold text-gray-800">
                    {currentCharacter.name} is speaking...
                  </h3>
                  <p className="text-gray-600">{currentCharacter.role}</p>
                </div>
              </div>

              {/* Character Response */}
              <div className="bg-gradient-to-r from-soft-purple/20 to-blush-pink/20 rounded-2xl p-6 mb-6">
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  "{characterResponse}"
                </p>
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  {currentCharacter.name} is here whenever you need to talk.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleReset}
                    className="bg-soft-purple hover:bg-soft-purple/80 text-white"
                  >
                    Share Something Else
                  </Button>
                  <Button
                    onClick={onBack}
                    variant="outline"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>

            {/* Original Message Display */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 rounded-2xl">
              <h4 className="font-semibold text-gray-800 mb-3">What you shared:</h4>
              <p className="text-gray-700 italic">"{message}"</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};