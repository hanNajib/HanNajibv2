/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import NavItem from './NavItem';
import { useCursor } from '@/app/layout';

interface DiscordStatusResponse {
  data: {
    discord_user: {
      username: string;
      avatar: string;
      id: string;
      discriminator: string;
    };
    discord_status: string;
    activities: Array<{
          name: string;
          type: number;
          state?: string;
          details?: string;
          application_id?: string;
          timestamps?: {
            start?: number;
            end?: number;
          };
          assets?: {
            large_image?: string;
            large_text?: string;
            small_image?: string;
            small_text?: string;
          };
        } & { type: number }>;
    spotify?: {
      state: ReactNode;
      details: ReactNode;
      name: ReactNode;
      type(type: any): unknown;
      album_art_url: string;
      album: string;
      artist: string;
      song: string;
      track_id?: string;
      timestamps?: {
        start: number;
        end: number;
      };
    };
    active_on_discord_desktop: boolean;
    active_on_discord_mobile: boolean;
    listening_to_spotify: boolean;
  };
}

const DiscordActivity: React.FC = () => {
  const [discordData, setDiscordData] = useState<DiscordStatusResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [spotifyProgress, setSpotifyProgress] = useState(0);

  const { api } = useCursor();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.lanyard.rest/v1/users/734571877162549262');
        const data = await response.json();
        setDiscordData(data);
      } catch (error) {
        console.error('Error fetching Discord status:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (labelRef.current) {
      setPanelWidth(labelRef.current.offsetWidth);
    }
  }, [discordData]);

  // Update Spotify progress bar
  useEffect(() => {
    if (!discordData?.data.spotify?.timestamps || !discordData.data.listening_to_spotify) return;
    
    const { start, end } = discordData.data.spotify.timestamps;
    const totalDuration = end - start;
    
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration * 100, 100);
      setSpotifyProgress(progress);
    };
    
    updateProgress();
    const progressInterval = setInterval(updateProgress, 1000);
    return () => clearInterval(progressInterval);
  }, [discordData?.data.spotify]);

  const getActivityType = (type: number) => {
    const types = {
      0: "Playing",
      1: "Streaming",
      2: "Listening to",
      3: "Watching",
      4: "Custom",
      5: "Competing in"
    };
    return types[type as keyof typeof types] || "Using";
  };

  const getStatusColor = (status: string) => {
    return {
      online: 'bg-green-500',
      idle: 'bg-yellow-500',
      dnd: 'bg-red-500',
      offline: 'bg-gray-500'
    }[status] || 'bg-gray-500';
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!discordData) return null;

  const { discord_user, discord_status, activities } = discordData.data;
  const currentStatus = discord_status || 'offline';
  
  // Handle Spotify separately
  const hasSpotify = !!discordData.data.spotify && discordData.data.listening_to_spotify;
  
  // Get all activities including Spotify
  const allActivities = [];
  
  // Add Spotify as the first activity if available
  if (hasSpotify) {
    allActivities.push({
      type: 'spotify',
      data: discordData.data.spotify
    });
  }
  
  // Add other activities
  activities.forEach(activity => {
    // Skip Spotify activity from the main activities list as we handle it separately
    if (!(activity.name === "Spotify" && hasSpotify)) {
      allActivities.push({
        type: 'regular',
        data: activity
      });
    }
  });
  
  // Handle no activities case
  const totalActivities = allActivities.length;
  
  if (totalActivities === 0) {
    // Reset index if there are no activities
    if (currentActivityIndex !== 0) {
      setCurrentActivityIndex(0);
    }
  } else if (currentActivityIndex >= totalActivities) {
    // Ensure the index is valid
    setCurrentActivityIndex(0);
  }
  
  const changeActivity = (direction: 'next' | 'prev') => {
    if (isTransitioning || totalActivities <= 1) return;
    
    setIsTransitioning(true);
    
    // Calculate the new index
    const newIndex = direction === 'next'
      ? (currentActivityIndex + 1) % totalActivities
      : (currentActivityIndex - 1 + totalActivities) % totalActivities;
    
    // Update the index
    setCurrentActivityIndex(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  };
  
  // Get current activity based on index
  const currentActivity = totalActivities > 0 ? allActivities[currentActivityIndex] : null;


  // Display text for the main label
  const getDisplayText = () => {
    if (!currentActivity) {
      return 'Offline';
    }
    
    if (currentActivity.type === 'spotify') {
      return `Listening to ${currentActivity.data?.song ?? ''}`;
    } else {
      const activity = currentActivity.data;
      return activity ? `${getActivityType(activity.type as unknown as number)} ${'name' in activity ? activity.name : ''}` : '';
    }
  };

  return (
    <div className="fixed top-5 left-0 z-50 origin-left scale-75 md:scale-100">
      <motion.div
        ref={labelRef}
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        transition={{ delay: 1.5}}
        className="flex h-16 min-w-80 pl-4 items-center justify-start md:bg-yellow-300 font-semibold text-yellow-300 bg-zinc-900 md:text-gray-800 shadow-lg transition-all hover:shadow-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <NavItem delay={1} icon='fa-brands fa-discord' link='/' onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
          <div className={`h-3 w-3 rounded-full ring-2 ring-gray-800 ${getStatusColor(currentStatus)}`} />
          <span className="max-w-[200px] truncate text-sm" onMouseEnter={() => api.start({ rounded: 0, scale: 0.8 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}>
            {getDisplayText()}
          </span>
        </div>
      </motion.div>

      {/* Expandable Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 top-full mt-2 overflow-hidden rounded-r-xl bg-zinc-800 shadow-xl"
            style={{ width: panelWidth }}
          >
            <div className="flex items-center border-b border-zinc-700 bg-zinc-900 p-4">
              <div className="relative mr-3">
                <img
                  src={discord_user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`
                    : '/default-avatar.png'}
                  alt="Avatar"
                  className="h-12 w-12 rounded-full ring-2 ring-yellow-400"
                />
                <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-800 ${getStatusColor(currentStatus)}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white" onMouseEnter={() => api.start({ rounded: 0, scale: 0.9 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}>{discord_user.username}</h3>
                <p className="flex items-center text-sm text-zinc-400" onMouseEnter={() => api.start({ rounded: 0, scale: 0.5 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}>
                  <span className={`mr-1 h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`} />
                  {currentStatus}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="ml-auto text-zinc-400 hover:text-white"
                aria-label="Close panel"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Activity Navigation */}
            {totalActivities > 1 && (
              <div className="flex items-center justify-between bg-zinc-900 px-4 py-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    changeActivity('prev');
                  }}
                  disabled={isTransitioning}
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isTransitioning 
                      ? 'bg-zinc-700 text-zinc-500' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                  aria-label="Previous activity"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center">
                  {Array.from({ length: totalActivities }).map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isTransitioning && index !== currentActivityIndex) {
                          setIsTransitioning(true);
                          setCurrentActivityIndex(index);
                          setTimeout(() => setIsTransitioning(false), 300);
                        }
                      }}
                      className={`mx-1 h-2 w-2 rounded-full transition-all ${
                        index === currentActivityIndex 
                          ? 'bg-yellow-400' 
                          : 'bg-zinc-600 hover:bg-zinc-500'
                      }`}
                      aria-label={`Go to activity ${index + 1}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    changeActivity('next');
                  }}
                  disabled={isTransitioning}
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isTransitioning 
                      ? 'bg-zinc-700 text-zinc-500' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                  aria-label="Next activity"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Panel Content */}
            <div className="relative min-h-[160px] p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentActivityIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  
                  {currentActivity?.type === 'spotify' ? (
                    <div>
                      {/* Top section with album art and basic info */}
                      <div className="mb-3 flex">
                        {/* Fixed width container for the image */}
                        <div className="relative shrink-0 mr-4">
                          <div className="h-20 w-20 overflow-hidden rounded-md shadow-lg">
                            <img
                              src={currentActivity.data?.album_art_url ?? '/default-album-art.png'}
                              alt="Album Art"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-md">
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                          </div>
                        </div>
                        {/* Text content with flex-1 to take up remaining space */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex items-center">
                            <svg className="mr-1 h-4 w-4 text-green-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1.5-4.5l6-4.5-6-4.5v9z" />
                            </svg>
                            <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                              Spotify
                            </span>
                          </div>
                          <h4 className="truncate font-bold text-white">
                            {currentActivity.data?.song}
                          </h4>
                          <p className="truncate text-sm text-zinc-400">
                            by {currentActivity.data?.artist}
                          </p>
                          <p className="truncate text-xs text-zinc-500">
                            on {currentActivity.data?.album}
                          </p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      {currentActivity.data?.timestamps && (
                        <div className="mt-3">
                          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
                            <div 
                              className="absolute left-0 top-0 h-full rounded-full bg-green-500" 
                              style={{ width: `${spotifyProgress}%` }}
                            />
                          </div>
                          
                          <div className="mt-1 flex justify-between text-xs text-zinc-500">
                            <span>
                              {formatDuration((Date.now() - currentActivity.data.timestamps.start))}
                            </span>
                            <span>
                              {formatDuration(currentActivity.data.timestamps.end - currentActivity.data.timestamps.start)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : currentActivity?.type === 'regular' ? 
                  currentActivity?.data && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-indigo-400">
                        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getActivityType(currentActivity.data.type as unknown as number)}
                      </div>
                  
                      <h4 className="text-lg font-bold text-white">{currentActivity.data.name}</h4>
                      {currentActivity.data.details && <p className="text-zinc-300">{currentActivity.data.details}</p>}
                      {currentActivity.data.state && <p className="text-zinc-400">{currentActivity.data.state}</p>}
                      {currentActivity.data?.timestamps?.start && (
                        <p className="flex items-center text-sm text-zinc-500">
                          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(currentActivity.data.timestamps.start)}
                        </p>
                      )}
                    </div>
                  )                  
                  : (
                    <div className="py-4 text-center text-zinc-400">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p>No current activity</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Panel Footer */}
            <div className="flex items-center justify-between border-t border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-500">
              <div className="flex space-x-2">
                <span className={discordData.data.active_on_discord_desktop ? 'text-green-400' : 'text-zinc-600'}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className={discordData.data.active_on_discord_mobile ? 'text-green-400' : 'text-zinc-600'}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <span className="text-xs">
                {totalActivities > 1 ? `${currentActivityIndex + 1}/${totalActivities}` : ''}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscordActivity;