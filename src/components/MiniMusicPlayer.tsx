import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { Button } from './ui/button';
import { Play, Pause, Music, Maximize2, Volume2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { AudioVisualizer } from './AudioVisualizer';
import { useNavigate, useLocation } from 'react-router-dom';

export const MiniMusicPlayer = () => {
  const {
    currentTrack,
    category,
    isPlaying,
    volume,
    isMinimized,
    togglePlayPause,
    toggleMinimize,
    setVolume,
  } = useMusicPlayer();

  const navigate = useNavigate();
  const location = useLocation();

  // Don't show mini player if we're on the full relaxation player page and not minimized
  if (!isMinimized && location.pathname.startsWith('/relaxation/') && location.pathname !== '/relaxation') {
    return null;
  }

  // Don't show if no track is loaded
  if (!currentTrack || !category) {
    return null;
  }

  const handleMaximize = () => {
    if (!isMinimized) {
      navigate(`/relaxation/${category.slug}`);
    } else {
      toggleMinimize();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50 backdrop-blur-lg bg-card/95">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Visualizer */}
          <div className="hidden sm:block w-24 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
            <AudioVisualizer isPlaying={isPlaying} />
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-comfortaa font-semibold text-sm truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{category.name} Relaxation Music</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Volume Control - Desktop only */}
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
              <span className="text-xs text-muted-foreground w-10">{volume[0]}%</span>
            </div>

            {/* Play/Pause */}
            <Button
              size="sm"
              onClick={togglePlayPause}
              className="rounded-full"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            {/* Maximize */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMaximize}
              className="rounded-full"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
