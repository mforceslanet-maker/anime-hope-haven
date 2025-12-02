import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Key, Eye, EyeOff, Check, X } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ApiKeySettingsProps {
  onClose?: () => void;
}

export const ApiKeySettings = ({ onClose }: ApiKeySettingsProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setHasKey(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setHasKey(true);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved securely.",
      });
      onClose?.();
    }
  };

  const handleRemove = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setHasKey(false);
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed.",
    });
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Key className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">OpenAI API Key</h3>
          <p className="text-sm text-muted-foreground">Enter your API key to enable AI chat</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAI Dashboard
            </a>
          </p>
        </div>

        {hasKey && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            <Check className="w-4 h-4" />
            <span>API key is configured</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1" disabled={!apiKey.trim()}>
            Save Key
          </Button>
          {hasKey && (
            <Button onClick={handleRemove} variant="destructive" size="icon">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {onClose && (
          <Button onClick={onClose} variant="ghost" className="w-full">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
