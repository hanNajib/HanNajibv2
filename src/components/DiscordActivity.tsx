import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import NavItem from './NavItem';

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
    }>;
    spotify?: {
      album_art_url: string;
      album: string;
      artist: string;
      song: string;
    };
    active_on_discord_desktop: boolean;
    active_on_discord_mobile: boolean;
  };
}

const DiscordActivity: React.FC = () => {
  const [discordData, setDiscordData] = useState<DiscordStatusResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(0);

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

  if (!discordData) return null;

  const { discord_user, discord_status, activities, spotify } = discordData.data;
  const mainActivity = activities?.[0];
  const currentStatus = discord_status || 'offline';

  return (
    <div className="fixed top-5 left-0 z-50 origin-left scale-75 md:scale-100">
      <motion.div
        ref={labelRef}
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        transition={{ delay: 1.5}}
        className="flex h-16 min-w-80 cursor-pointer pl-4 items-center justify-start md:bg-yellow-300 font-semibold text-yellow-300 bg-zinc-900 md:text-gray-800 shadow-lg transition-all hover:shadow-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          {/* <img
            src={discord_user.avatar 
              ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`
              : '/default-avatar.png'}
            alt="Avatar"
            className="h-8 w-8 rounded-full ring-2 ring-indigo-600"
          /> */}
          <NavItem delay={1} icon='fa-brands fa-discord' link='/' />
          <div className={`h-3 w-3 rounded-full ring-2 ring-gray-800 ${getStatusColor(currentStatus)}`} />
          <span className="max-w-[200px] truncate text-sm">
            {spotify?.song 
              ? `Listening to ${spotify.song}`
              : mainActivity 
              ? `${getActivityType(mainActivity.type)} ${mainActivity.name}`
              : 'Offline'}
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
                <h3 className="text-lg font-bold text-white">{discord_user.username}</h3>
                <p className="flex items-center text-sm text-zinc-400">
                  <span className={`mr-1 h-2 w-2 rounded-full ${getStatusColor(currentStatus)}`} />
                  {currentStatus}
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-auto text-zinc-400 hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-4">
              {spotify ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={spotify.album_art_url}
                    alt="Album Art"
                    className="h-16 w-16 rounded-lg ring-1 ring-green-400/30"
                  />
                  <div>
                    <div className="mb-1 flex items-center text-sm text-green-400">
                      <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                      Listening on Spotify
                    </div>
                    <h4 className="truncate text-sm md:text-lg font-bold text-white">{spotify.song}</h4>
                    <p className="truncate text-zinc-400">{spotify.artist}</p>
                  </div>
                </div>
              ) : mainActivity ? (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-indigo-400">
                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getActivityType(mainActivity.type)}
                  </div>
                  <h4 className="text-lg font-bold text-white">{mainActivity.name}</h4>
                  {mainActivity.details && <p className="text-zinc-300">{mainActivity.details}</p>}
                  {mainActivity.state && <p className="text-zinc-400">{mainActivity.state}</p>}
                  {mainActivity.timestamps?.start && (
                    <p className="flex items-center text-sm text-zinc-500">
                      <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(mainActivity.timestamps.start)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-zinc-400">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>No current activity</p>
                </div>
              )}
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
              <span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscordActivity;