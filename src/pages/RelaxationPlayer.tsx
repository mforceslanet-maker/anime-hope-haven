import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Slider } from '../components/ui/slider';
import { useToast } from '../hooks/use-toast';

interface Track {
  id: string;
  title: string;
  youtube_video_id: string;
  description: string;
}

interface Category {
  name: string;
  color: string;
}

export default function RelaxationPlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [category, setCategory] = useState<Category | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);

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
      
      setCategory(categoryData);

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
        .select('id, title, youtube_video_id, description')
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
    if (playerReady && tracks.length > 0 && !playerRef.current) {
      initializePlayer();
    }
  }, [playerReady, tracks, currentTrackIndex]);

  const initializePlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new (window as any).YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId: tracks[currentTrackIndex]?.youtube_video_id,
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
            handleNext();
          }
        },
      },
    });
  };

  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.loadVideoById(tracks[nextIndex].youtube_video_id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.loadVideoById(tracks[prevIndex].youtube_video_id);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume[0]);
    }
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

  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hidden YouTube player */}
      <div id="youtube-player" className="hidden" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/relaxation')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        {/* Player Card */}
        <Card className="overflow-hidden border-2 border-primary/20 shadow-2xl animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
            <CardTitle className="text-2xl font-comfortaa text-center">
              {category?.name} - Relaxation Center
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {tracks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No relaxation tracks available yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
              </div>
            ) : (
              <>
                {/* Visualizer */}
                <div className="relative w-full h-64 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 mb-8 overflow-hidden shadow-inner">
                  <AudioVisualizer isPlaying={isPlaying} />
                </div>

                {/* Track Info */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-comfortaa font-bold mb-2">{currentTrack?.title}</h3>
                  {currentTrack?.description && (
                    <p className="text-muted-foreground">{currentTrack.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Track {currentTrackIndex + 1} of {tracks.length}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handlePrevious}
                    className="rounded-full w-14 h-14"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    size="lg"
                    onClick={togglePlay}
                    className="rounded-full w-20 h-20 shadow-xl hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleNext}
                    className="rounded-full w-14 h-14"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-4 max-w-xs mx-auto">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                  <Slider
                    value={volume}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {volume[0]}%
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
