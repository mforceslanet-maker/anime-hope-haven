import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, Star, Gift } from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface TrialManagerProps {
  onTrialUpdate: (daysRemaining: number) => void;
}

export const TrialManager = ({ onTrialUpdate }: TrialManagerProps) => {
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(() => {
    const saved = localStorage.getItem('mystory-trial-days');
    return saved ? parseInt(saved, 10) : 4;
  });
  
  const [trialStartDate] = useState(() => {
    const saved = localStorage.getItem('mystory-trial-start');
    return saved ? new Date(saved) : new Date();
  });

  useEffect(() => {
    // Calculate days remaining based on start date
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, 4 - daysPassed);
    
    if (remaining !== trialDaysRemaining) {
      setTrialDaysRemaining(remaining);
      localStorage.setItem('mystory-trial-days', remaining.toString());
      onTrialUpdate(remaining);
    }

    // Show daily trial reminders
    if (remaining > 0 && remaining <= 2) {
      toast({
        title: `⏰ Trial Reminder`,
        description: `Only ${remaining} day${remaining !== 1 ? 's' : ''} left in your free trial! Experience the full benefits of MyStory.`,
        variant: remaining === 1 ? "destructive" : "default"
      });
    }
  }, [trialDaysRemaining, trialStartDate, onTrialUpdate]);

  useEffect(() => {
    // Save trial start date if not already saved
    if (!localStorage.getItem('mystory-trial-start')) {
      localStorage.setItem('mystory-trial-start', trialStartDate.toISOString());
    }
  }, [trialStartDate]);

  const getTrialStatus = () => {
    if (trialDaysRemaining > 3) return { color: 'bg-green-100 text-green-800', status: 'Active Trial' };
    if (trialDaysRemaining > 1) return { color: 'bg-yellow-100 text-yellow-800', status: 'Trial Ending Soon' };
    if (trialDaysRemaining === 1) return { color: 'bg-orange-100 text-orange-800', status: 'Last Day!' };
    return { color: 'bg-red-100 text-red-800', status: 'Trial Expired' };
  };

  const trialStatus = getTrialStatus();

  if (trialDaysRemaining === 0) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-4 text-center">
          <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
            Free Trial Ended
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 mb-4">
            Thank you for trying MyStory! Continue your emotional wellness journey.
          </p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Upgrade Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Free Trial Active</h3>
              <p className="text-sm text-muted-foreground">
                Day {5 - trialDaysRemaining} of 4
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={trialStatus.color}>
              {trialStatus.status}
            </Badge>
            <div className="text-sm font-semibold mt-1">
              {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''} left
            </div>
          </div>
        </div>
        
        {trialDaysRemaining <= 2 && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Don't lose your progress!
              </span>
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
              Your emotional wellness journey and all characters will continue with the full version.
            </p>
            <Button size="sm" className="w-full">
              Learn More About Full Version
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};