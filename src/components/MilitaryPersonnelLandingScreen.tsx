import { Shield, Heart, ArrowLeft } from 'lucide-react';
import { Character } from '../types/character';
import { militaryTherapist } from '../data/characters';
import { MilitaryTherapistCard } from './MilitaryTherapistCard';
import { Button } from './ui/button';

interface MilitaryPersonnelLandingScreenProps {
  onCharacterSelect: (character: Character) => void;
  onBack?: () => void;
}

export const MilitaryPersonnelLandingScreen = ({ 
  onCharacterSelect,
  onBack
}: MilitaryPersonnelLandingScreenProps) => {
  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-blue-950/20 dark:via-slate-950/20 dark:to-blue-900/20">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="fixed top-4 left-4 z-50 hover:bg-white/20 dark:hover:bg-black/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-military" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-comfortaa font-bold text-military">
              Military Personnel Support
            </h1>
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-military" />
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            Specialized therapy for service members during pre-deployment, deployment, and post-deployment phases. 
            Understanding the unique challenges of military life.
          </p>

          {/* Honor Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-military/10 rounded-full border-2 border-military/20 mb-8">
            <Heart className="w-5 h-5 text-military" />
            <span className="text-sm font-medium text-military">
              Thank you for your service. You're not alone.
            </span>
            <Heart className="w-5 h-5 text-military" />
          </div>

          {/* Support Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-military/10">
              <p className="text-sm font-comfortaa text-military font-semibold">Available 24/7</p>
              <p className="text-xs text-muted-foreground mt-1">Always here when you need support</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-military/10">
              <p className="text-sm font-comfortaa text-military font-semibold">Confidential</p>
              <p className="text-xs text-muted-foreground mt-1">Your privacy is our priority</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-military/10">
              <p className="text-sm font-comfortaa text-military font-semibold">Veteran-Focused</p>
              <p className="text-xs text-muted-foreground mt-1">Understanding military culture</p>
            </div>
          </div>
        </div>

        {/* Therapist Card */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-md w-full">
            <MilitaryTherapistCard
              therapist={militaryTherapist}
              onSelect={onCharacterSelect}
            />
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 text-center bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-military/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Whether you're preparing for deployment, currently serving, or transitioning back to civilian life, 
            Dr. Morgan specializes in the unique mental health challenges faced by military personnel. 
            From PTSD support to family counseling, you'll receive care from someone who truly understands.
          </p>
        </div>
      </div>
    </div>
  );
};
