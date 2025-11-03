import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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
  slug: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  tracks: Track[];
  category: Category | null;
  isPlaying: boolean;
  volume: number[];
  isMinimized: boolean;
  playerRef: React.MutableRefObject<any>;
  setCurrentTrack: (track: Track | null) => void;
  setTracks: (tracks: Track[]) => void;
  setCategory: (category: Category | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number[]) => void;
  toggleMinimize: () => void;
  playTrack: (trackId: string) => void;
  togglePlayPause: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMinimized, setIsMinimized] = useState(false);
  const playerRef = useRef<any>(null);

  const toggleMinimize = () => setIsMinimized(prev => !prev);

  const playTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track && playerRef.current) {
      setCurrentTrack(track);
      playerRef.current.loadVideoById(track.youtube_video_id);
      setTimeout(() => {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }, 500);
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume[0]);
    }
  }, [volume]);

  return (
    <MusicPlayerContext.Provider
      value={{
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
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  }
  return context;
};
