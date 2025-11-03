import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { ArrowLeft, Play, Pause, Volume2, Music, Minimize2 } from 'lucide-react';
import { Slider } from '../components/ui/slider';
import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

interface Track {
  id: string;
  title: string;
  youtube_video_id: string;
  description: string;
  duration: string;
}

interface Category {
  name: string;
  color: string;
}

export default function RelaxationPlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  
  const {
    currentTrack,
    tracks,
    category,
    isPlaying,
    volume,
    isMinimized,
    playerRef,
    setCurrentTrack,
    setTracks,
    setCategory,
    setIsPlaying,
    setVolume,
    toggleMinimize,
    playTrack,
    togglePlayPause,
  } = useMusicPlayer();

  useEffect(() => {
    loadCategoryAndTracks();
    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [slug]);

  const loadYouTubeAPI = () => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        setPlayerReady(true);
      };
    } else {
      setPlayerReady(true);
    }
  };

  const loadCategoryAndTracks = async () => {
    try {
      // Load category
      const { data: categoryData, error: categoryError } = await supabase
        .from('relaxation_categories')
        .select('name, color')
        .eq('slug', slug)
        .maybeSingle();

      if (categoryError) throw categoryError;
      
      if (!categoryData) {
        toast({
          title: 'Category Not Found',
          description: 'This relaxation category does not exist',
          variant: 'destructive',
        });
        navigate('/relaxation');
        return;
      }
      
      // Set category with slug early
      setCategory({ ...categoryData, slug: slug || '' });

      // Load tracks
      const { data: categoryId } = await supabase
        .from('relaxation_categories')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!categoryId) {
        setTracks([]);
        setLoading(false);
        return;
      }

      const { data: tracksData, error: tracksError } = await supabase
        .from('relaxation_music')
        .select('id, title, youtube_video_id, description, duration')
        .eq('category_id', categoryId.id)
        .eq('is_active', true)
        .order('created_at');

      if (tracksError) throw tracksError;
      
      // Clean video IDs (remove query parameters)
      const cleanedTracks = (tracksData || []).map(track => ({
        ...track,
        youtube_video_id: track.youtube_video_id.split('?')[0].split('&')[0]
      }));
      
      setTracks(cleanedTracks);
      if (cleanedTracks.length > 0 && !currentTrack) {
        setCurrentTrack(cleanedTracks[0]);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load relaxation content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (playerReady && currentTrack && !playerRef.current) {
      initializePlayer();
    }
  }, [playerReady, currentTrack]);

  const initializePlayer = () => {
    if (!currentTrack) return;

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new (window as any).YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: currentTrack.youtube_video_id,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(volume[0]);
        },
        onStateChange: (event: any) => {
          if (event.data === (window as any).YT.PlayerState.ENDED) {
            setIsPlaying(false);
          }
        },
      },
    });
  };

  const handleTrackSelect = (trackId: string) => {
    if (currentTrack?.id === trackId) {
      togglePlayPause();
    } else {
      playTrack(trackId);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading relaxation center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hidden YouTube player */}
      <div id="youtube-player" className="hidden" />

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/relaxation')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          
          <Button
            variant="outline"
            onClick={toggleMinimize}
            className="gap-2"
          >
            <Minimize2 className="w-4 h-4" />
            Minimize Player
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-comfortaa font-bold mb-2">
            {category?.name} Relaxation Music
          </h1>
          <p className="text-muted-foreground">
            Select a track to begin your relaxation journey
          </p>
        </div>

        {tracks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-2">No relaxation tracks available yet.</p>
              <p className="text-sm text-muted-foreground">Check back soon!</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Current Playing Track Visualizer */}
            {currentTrack && (
              <Card className="mb-8 overflow-hidden border-2 border-primary/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
                        <AudioVisualizer isPlaying={isPlaying} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-comfortaa font-bold mb-2">Now Playing</h3>
                      <p className="text-lg mb-4">{currentTrack.title}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          size="lg"
                          onClick={() => handleTrackSelect(currentTrack.id)}
                          className="rounded-full"
                        >
                          {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                          {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <div className="flex items-center gap-2 flex-1">
                          <Volume2 className="w-4 h-4 text-muted-foreground" />
                          <Slider
                            value={volume}
                            onValueChange={handleVolumeChange}
                            max={100}
                            step={1}
                            className="flex-1 max-w-[200px]"
                          />
                          <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Track Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track, index) => (
                <Card
                  key={track.id}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                    currentTrack?.id === track.id ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
                  }`}
                  onClick={() => handleTrackSelect(track.id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-xl transition-all ${
                        currentTrack?.id === track.id 
                          ? 'bg-primary text-primary-foreground scale-110' 
                          : 'bg-muted group-hover:bg-primary/10'
                      }`}>
                      {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </div>
                      {currentTrack?.id === track.id && (
                        <Badge variant="default" className="animate-pulse">
                          {isPlaying ? 'Playing' : 'Selected'}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg font-comfortaa group-hover:text-primary transition-colors">
                      {track.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {track.description && (
                      <CardDescription className="text-sm leading-relaxed mb-2">
                        {track.description}
                      </CardDescription>
                    )}
                    {track.duration && (
                      <p className="text-xs text-muted-foreground">
                        Duration: {track.duration}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
