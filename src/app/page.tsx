"use client";

import Paragraph from "@/components/Paragraph";
import { useCursor } from "./layout";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import DiscordActivity from "@/components/DiscordActivity";

export default function Home() {
  const { api } = useCursor();
  const [userInput, setUserInput] = useState("");
  const [userIntro, setUserIntro] = useState("");
  const [showUserBubble, setShowUserBubble] = useState(true);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startHideTimeout = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => setShowUserBubble(false), 3000);
  };

  useEffect(() => {
    startHideTimeout();
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/kenalin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserIntro(data.reply);
          setUserInput("");
          setShowUserBubble(true);
          startHideTimeout();
        } else {
          console.error('Failed to fetch:', response.status);
          // Handle error appropriately
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
    <DiscordActivity />
    <div className="overflow-hidden cursor-none">
      <div className="w-screen md:h-screen mt-32 md:mt-0 flex justify-center items-center relative">
        <section className="scale-90 hover:scale-100 transition-all duration-700 ease-out">
          <div className="flex flex-col items-center">
            <div className="relative">
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: showUserBubble || userIntro ? 1 : 0.25,
                }}
                transition={{
                  delay: 1.2,
                  y: { duration: 1 },
                  opacity: { duration: 1 },
                  layout: { type: 'spring', stiffness: 300, damping: 30 },
                }}
                className={
                  `absolute -right-52 top-1/2 bg-zinc-800/70 backdrop-blur-sm text-zinc-100
                   p-3 rounded-2xl shadow-lg z-20 flex items-center justify-center
                   ${showUserBubble || userIntro ? 'w-64 h-auto' : 'w-12 h-12 opacity-25 hover:opacity-100 transition-all'}
                   `
                }
              >
                {showUserBubble || userIntro ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center space-x-2 w-full"
                    onMouseEnter={() => clearTimeout(hideTimeout.current!)}
                    onMouseLeave={startHideTimeout}
                  >
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Perkenalkan Dirimu"
                      className="flex-1 bg-zinc-700/50 border border-zinc-600 rounded-xl py-1 px-3 text-sm placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    />
                    <button
                      type="submit"
                      className="bg-zinc-600 hover:bg-zinc-500 transition-colors rounded-lg px-2 py-1 text-sm"
                    >
                      ↑
                    </button>
                  </form>
                ) : (
                  <motion.button
                    onClick={() => {
                      setShowUserBubble(true);
                      startHideTimeout();
                    }}
                    layout
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-gradient-to-br rounded-full flex items-center justify-center shadow-lg ring-2 ring-transparent transition-all duration-300 focus:outline-none w-full h-full opacity-25"
                  >
                    💬
                  </motion.button>
                )}
              </motion.div>

              {/* User Intro Bubble */}
              {userIntro && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, layout: { type: 'spring', stiffness: 300, damping: 30 } }}
                  className={
                    `absolute bottom-0 -left-52 bg-zinc-700/70 backdrop-blur-sm text-zinc-100
                     p-3 rounded-lg shadow-lg z-20 w-60
                     before:content-[''] before:absolute before:right-2 before:-top-4
                     before:border-8 before:border-transparent before:opacity-100 before:border-l-zinc-700/70 before:-rotate-90
                     `
                  }
                >
                  {isLoading ? (
                    <p className="text-sm">hmm...</p>
                  ) : (
                    <p className="text-sm">{userIntro}</p>
                  )}
                </motion.div>
              )}

              <motion.div
                className="w-52 md:w-60 rounded-full overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-zinc-700/20 z-10"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/profile.png"
                  alt="HanNajib"
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                  priority
                />
              </motion.div>
            </div>

            <div className="text-center mt-8 flex flex-col items-center">
              <Paragraph
                initial={{ y: -30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl md:text-5xl font-bold text-zinc-50 hover:text-zinc-200 transition-colors"
                onMouseEnter={() => api.start({ scale: 2, rounded: 0 })}
                onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
              >
                Saya, Ahmad Royhan Najib
              </Paragraph>
              <Paragraph
                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm md:text-base md:w-3/4 m-auto text-zinc-400 mt-4"
                onMouseEnter={() => api.start({ scale: 1.2, rounded: 0 })}
                onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
              >
                Seorang pelajar di SMKN 8 Jember, memiliki minat dalam dunia teknologi pemrograman. Sembari belajar dan eksplor teknologi, Let&apos;s build something amazing together.
              </Paragraph>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
