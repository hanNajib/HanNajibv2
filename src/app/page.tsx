"use client";

import Paragraph from "@/components/Paragraph";
import { useCursor } from "./layout";
import { motion } from "framer-motion";

export default function Home() {
  const { api } = useCursor();
  
  return (
    <div className="overflow-hidden cursor-none">
      <div className="w-screen md:h-screen mt-32 md:mt-0 font-[family-name:var(--font-lexend)] flex justify-center items-center relative overflow-hidden">
        <section className="scale-90 hover:scale-100 transition-all duration-700 ease-out">
          <div className="flex flex-col justify-center items-center">
            <motion.img 
              src="https://i.pinimg.com/736x/4f/37/3c/4f373c25e5897557476d61e3b94107ba.jpg" 
              alt="Profile Picture" 
              className="w-52 md:w-60 rounded-full hover:w-72 transition-all ease-out duration-500 hover:shadow-2xl hover:shadow-zinc-700/20 z-20"
              initial={{ scale: 0.6}}
              animate={{ scale: 1}}
              transition={{ duration: 1 }}
            />
            
            <div className="text-center mt-8 flex flex-col justify-center items-center">
              <Paragraph 
                initial={{ y: -30, opacity: 0, filter: "blur(8px)" }} 
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} 
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} 
                className="w-fit text-2xl md:text-5xl font-bold text-zinc-50 hover:text-zinc-200 transition-colors"
                onMouseEnter={() => api.start({ scale: 2, rounded: 0 })}
                onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
              >
                Saya, Ahmad Royhan Najib
              </Paragraph>
              <Paragraph
                initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                className="text-sm md:text-base md:w-3/4 m-auto text-zinc-400 mt-4"
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => api.start({ scale: 1.2, rounded: 0})}
                onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
              >
                Seorang pelajar di SMKN 8 Jember, memiliki minat dalam dunia teknologi pemrograman. Sembari belajar dan eksplor teknologi, Let&apos;s build something amazing together.
              </Paragraph>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}