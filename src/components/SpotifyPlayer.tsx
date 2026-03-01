/* eslint-disable @typescript-eslint/no-namespace */
import React, { useEffect, useState, useRef } from 'react';

// Define the Spotify Web API types
declare global {
  interface Window {
    Spotify: {
      Player: new (options: Spotify.PlayerOptions) => Spotify.Player;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

namespace Spotify {
  export interface PlayerOptions {
    name: string;
    getOAuthToken: (callback: (token: string) => void) => void;
    volume?: number;
  }

  export interface Player {
    connect(): Promise<boolean>;
    disconnect(): Promise<void>;
    addListener(eventName: 'ready', callback: (data: { device_id: string }) => void): void;
    addListener(eventName: 'player_state_changed', callback: (state: PlaybackState | null) => void): void;
    addListener(eventName: 'initialization_error', callback: (error: ErrorObject) => void): void;
    addListener(eventName: 'authentication_error', callback: (error: ErrorObject) => void): void;
    addListener(eventName: 'account_error', callback: (error: ErrorObject) => void): void;
    addListener(eventName: 'playback_error', callback: (error: ErrorObject) => void): void;
    removeListener(eventName: string): void;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(positionMs: number): Promise<void>;
    getCurrentState(): Promise<PlaybackState | null>;
    setVolume(volume: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }

  export interface ErrorObject {
    message: string;
  }

  export interface PlaybackState {
    context: {
      uri: string;
      metadata?: Record<string, unknown>;
    };
    disallows: {
      pausing?: boolean;
      peeking_next?: boolean;
      peeking_prev?: boolean;
      resuming?: boolean;
      seeking?: boolean;
      skipping_next?: boolean;
      skipping_prev?: boolean;
    };
    duration: number;
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
      current_track: WebPlaybackTrack;
      previous_tracks: WebPlaybackTrack[];
      next_tracks: WebPlaybackTrack[];
    };
  }

  export interface WebPlaybackTrack {
    id: string;
    uri: string;
    type: string;
    media_type: string;
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: { url: string }[];
    };
    artists: Array<{
      uri: string;
      name: string;
    }>;
  }
}

// Define the spotify data props using a proper interface
interface SpotifyTrackData {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id?: string;
  timestamps?: {
    start: number;
    end: number;
  };
}

interface SpotifyPlayerProps {
  spotifyData?: SpotifyTrackData;
  autoPlay?: boolean;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ spotifyData, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    
    const handleScriptLoad = (): void => {
      // Script has loaded
    };
    
    script.onload = handleScriptLoad;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      try {
        const token = 'eyJraWQiOiJzMEh3WFQtY0NQRTJMQXBfR1RJcEtRVUxIdmNlSEhQRTlVWmZUZ3p1Z0NrIiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJodHRwczpcL1wvc3BvdGlmeS5jb20iLCJpc3MiOiJodHRwczpcL1wvYWNjb3VudHMuc3BvdGlmeS5jb20iLCJleHAiOjE3NDU2NDA3ODgsImlhdCI6MTc0NTY0MDQ4OCwiaWRwX2luZm8iOnsiZ29vZ2xlIjp7ImlkZW50aWZpZXJfdG9rZW4iOiJBZ0h6Q2hKNzk0R21tdjV2MkhCc3R0RDdZdTRkNDdXRW1xSzJqcmlpWEVkWjlWQ0doc3AtSVpJV2lnU0hxOExkRk9aa2lXZHZFdzFOazVSQXpQZ2RXMmtzVHJodnJIei1SRFk0MlQ2RlExMHVVaHZ4eVlsclA3X2cxWDd3aWNibGE1X1JXMnhvUDMxV0NidlI4M1ZSU01LMjZXZjRLQnlWNVI2aGVHbTFhYi1vaGxibkw4OERleU1yaDlYZHdFaGNmV1JjRmctTjlQVXNyUGRZQzI5eE9CLVlNZVE5MG5Xd3o3d0VId3ZzVG1aRGhHdG05YlltYjZFWVNFTWloS21lNFQzSzBZRTJmWjRsdkwzRm53Y0ljY2hoMEtzLTBVcmh5am5zQ3c2TG9jbDJiUnJEV0k1WHY5aXMyb2I4cFBXWUZBamZyZ1d0NmQ0cTBYSDZ5elpPdUpsSmhJNW5DdTdUSHFRVnhNNklXMXhZN3VDSU9Xdmcwc1owWF9CdFdGNHl3WVZaRkxkaVBHXzdfS1g0VTJnZzc2S1BqLVU1UkppcVA4YXNnTGVpUmdiek5nIiwibmFtZSI6IkhhbiBOYWppYiIsImVtYWlsIjoiaGFuZGVmaW5lZEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX19fQ.ZbOTXZEfI7Hoopg5gGj1aKIJfW02AhvFXYdbgi44capez9SgBpO43CXYKTUT0TJlN1i6zIJhcUnlthxhFOwWlk9c41O6USkHOeTZIAEqDufFhu7DXAwghR9XHFerNiLqmKjSw47veAIUYIqlMKVFH3Y_8BwGZR-nEkYQtHxODwYzzgnqfurhPOguYQTTiqSC-8y5OOz4VJCTgpOzalwUoJnSTqfHvcfv8VJBmIFiIJC74qHCj8DlFC6UA-hWjkBry8-yycfteMicg4hBv7hbMLWr5xLJsGj1IKt0W88vhbyPsa3XThPuTr-jKY8_jabm_RksESfgq54dJVifbf9sgg';
        if (!token) {
          setError('No Spotify access token available');
          return;
        }
        
        setAccessToken(token);

        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => {
          console.error('Failed to initialize', message);
          setError(`Initialization error: ${message}`);
        });
        
        player.addListener('authentication_error', ({ message }) => {
          console.error('Failed to authenticate', message);
          setError(`Authentication error: ${message}`);
        });
        
        player.addListener('account_error', ({ message }) => {
          console.error('Failed to validate account', message);
          setError(`Account error: ${message}`);
        });
        
        player.addListener('playback_error', ({ message }) => {
          console.error('Failed to perform playback', message);
          setError(`Playback error: ${message}`);
        });

        // Playback status updates
        player.addListener('player_state_changed', state => {
          if (state) {
            setProgress(state.position);
            setDuration(state.duration);
            setIsPlaying(!state.paused);
          }
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          setError(null); // Clear any previous errors
        });

        // Connect to the player
        player.connect().then(success => {
          if (!success) {
            setError('Failed to connect to Spotify');
          }
        });
        
        setSpotifyPlayer(player);
      } catch (err) {
        setError(`SDK initialization error: ${err instanceof Error ? err.message : String(err)}`);
        console.error('Error initializing Spotify SDK:', err);
      }
    };

    return () => {
      // Clean up
      if (spotifyPlayer) {
        try {
          spotifyPlayer.disconnect();
        } catch (err) {
          console.error('Error disconnecting player:', err);
        }
      }
      
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      // Clear the global callback
      window.onSpotifyWebPlaybackSDKReady = () => {};
    };
  }, []);

  // Play track when spotify data changes
  useEffect(() => {
    const playTrack = async (): Promise<void> => {
      if (!deviceId || !accessToken || !spotifyData?.track_id || !autoPlay) {
        return;
      }
      
      try {
        // Calculate where to start playback based on timestamps
        let positionMs = 0;
        if (spotifyData.timestamps) {
          const currentTime = Date.now();
          const elapsed = currentTime - spotifyData.timestamps.start;
          positionMs = Math.min(elapsed, spotifyData.timestamps.end - spotifyData.timestamps.start);
        }

        // Play the track at the calculated position
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            uris: [`spotify:track:${spotifyData.track_id}`],
            position_ms: positionMs
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to play track');
        }
        
        setIsPlaying(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Error playing track:', errorMessage);
        setError(`Error playing track: ${errorMessage}`);
      }
    };
    
    playTrack();
  }, [deviceId, accessToken, spotifyData, autoPlay]);

  // Update progress bar continuously when playing
  useEffect(() => {
    if (isPlaying) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
            }
            return duration;
          }
          return prev + 1000; // Increment by 1 second
        });
      }, 1000);
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlayback = async (): Promise<void> => {
    if (!spotifyPlayer) return;

    try {
      if (isPlaying) {
        await spotifyPlayer.pause();
        setIsPlaying(false);
      } else {
        await spotifyPlayer.resume();
        setIsPlaying(true);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error toggling playback:', errorMessage);
      setError(`Error toggling playback: ${errorMessage}`);
    }
  };

  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>): Promise<void> => {
    if (!spotifyPlayer || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionRatio = (e.clientX - rect.left) / rect.width;
    const seekPositionMs = Math.floor(clickPositionRatio * duration);
    
    try {
      await spotifyPlayer.seek(seekPositionMs);
      setProgress(seekPositionMs);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error seeking:', errorMessage);
      setError(`Error seeking: ${errorMessage}`);
    }
  };

  const handlePreviousTrack = async (): Promise<void> => {
    if (!spotifyPlayer) return;
    
    try {
      await spotifyPlayer.previousTrack();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error going to previous track:', errorMessage);
      setError(`Error going to previous track: ${errorMessage}`);
    }
  };

  const handleNextTrack = async (): Promise<void> => {
    if (!spotifyPlayer) return;
    
    try {
      await spotifyPlayer.nextTrack();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error going to next track:', errorMessage);
      setError(`Error going to next track: ${errorMessage}`);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!spotifyData) {
    return null;
  }

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="rounded-lg bg-zinc-900 p-4 shadow-xl">
      <div className="mb-4 flex items-center">
        <div className="relative mr-4 h-16 w-16 shrink-0 overflow-hidden rounded-md shadow-lg">
          <img
            src={spotifyData.album_art_url || '/default-album-art.png'}
            alt="Album Art"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center">
            <svg className="mr-1 h-4 w-4 text-green-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-4.5l6-4.5-6-4.5v9z" />
            </svg>
            <span className="text-xs font-medium uppercase tracking-wider text-green-400">
              Spotify
            </span>
          </div>
          <h3 className="truncate font-bold text-white">{spotifyData.song}</h3>
          <p className="truncate text-sm text-zinc-400">by {spotifyData.artist}</p>
          <p className="truncate text-xs text-zinc-500">on {spotifyData.album}</p>
        </div>
      </div>

      {/* Playback controls */}
      <div className="mt-3">
        <div 
          className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-700 cursor-pointer"
          onClick={handleSeek}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={duration}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-green-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-zinc-400">{formatTime(progress)}</span>
          
          <div className="flex space-x-4">
            <button 
              className="rounded-full bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              aria-label="Previous"
              onClick={handlePreviousTrack}
              disabled={!deviceId || !accessToken}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            
            <button 
              className="rounded-full bg-green-500 p-3 text-white hover:bg-green-600 disabled:bg-green-800 disabled:opacity-50"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={!deviceId || !accessToken}
            >
              {isPlaying ? (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            <button 
              className="rounded-full bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              aria-label="Next"
              onClick={handleNextTrack}
              disabled={!deviceId || !accessToken}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
          
          <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Status messages */}
      {!deviceId && (
        <div className="mt-3 rounded-md bg-yellow-900/30 p-2 text-xs text-yellow-400">
          Connecting to Spotify...
        </div>
      )}
      
      {!accessToken && deviceId && (
        <div className="mt-3 rounded-md bg-red-900/30 p-2 text-xs text-red-400">
          Authentication required. Please login to Spotify.
        </div>
      )}
      
      {error && (
        <div className="mt-3 rounded-md bg-red-900/30 p-2 text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;