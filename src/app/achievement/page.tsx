"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import AchievementCard, { Achievement } from "@/components/AchievementCard";
import TitleLabel from "@/components/TitleLabel";

const achievementsData: Achievement[] = [ 
  { 
    title: "3rd Runner Up EPIM", 
    description: "Dalam kompetisi Web Programming tingkat Nasional yang diselenggarakan oleh Himpunan Mahasiswa Teknologi Informasi", 
    date: "31 Agustus 2024", 
    imageUrl: "/epimwebprog.jpg", 
    type: "trophy",
    organization: "Politeknik Negeri Jember"
  },
  { 
    title: "3rd Place LKS", 
    description: "Dalam Lomba Kompetensi Siswa (LKS) tingkat Kabupaten Jember Bidang Lomba Web Technologies", 
    date: "21 Februari 2025", 
    imageUrl: "/lkswebtech.jpg", 
    type: "trophy",
    organization: "Kabupaten Jember"
  }
];

const AchievementsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const cardWidth = 400; 
        const gap = 32; 
        const totalCards = achievementsData.length;
        const viewportWidth = window.innerWidth;
        
        // Adjust card width for smaller screens
        const responsiveCardWidth = viewportWidth < 768 
          ? viewportWidth * 0.8 
          : cardWidth;

        // Calculate total scroll width
        const calculatedWidth = (responsiveCardWidth + gap) * totalCards - viewportWidth + 100;
        setTotalWidth(calculatedWidth);
        setWindowWidth(viewportWidth);
      }
    };

    calculateWidth();

      window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 40,
    stiffness: 300,
    mass: 0.8
  });
  
  const x = useTransform(
    smoothProgress,
    [0, 1],
    [0, -totalWidth]
  );

  return (
    <div className="relative w-full min-h-[95vh] py-16">
      <TitleLabel>Achievements</TitleLabel>

      <div 
        className="w-full" 
        style={{ 
          height: `${totalWidth + windowWidth}px` 
        }}
        aria-hidden="true"
      />
      
      <div className="fixed top-0 left-0 w-full h-screen flex items-center overflow-hidden">
        <motion.div 
          ref={containerRef}
          style={{ x }} 
          className="flex gap-8 px-0 md:px-10 -translate-x-12 scale-90 md:scale-100 md:-translate-x-0"
        >
          {achievementsData.map((achievement, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.1
                }
              }}
              viewport={{ once: true }}
              className={`flex-shrink-0 ${
                windowWidth < 768 ? "w-[80vw] h-[60vh]" : "w-[400px] h-[500px]"
              }`} 
            >
              <AchievementCard {...achievement} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AchievementsPage;