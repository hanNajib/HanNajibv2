"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ProjectCard, { Project } from "@/components/ProjectCard";
import TitleLabel from "@/components/TitleLabel";

const projectsData: Project[] = [ 
  { 
    title: "HanShelfAPI", 
    description: "HanShelfAPI adalah API Manajemen Perpustakaan untuk mengelola buku dan rak.", 
    technologies: ["Laravel"], 
    imageUrl: "/HanShelfAPI.png", 
    githubLink: "https://github.com/hanNajib/HanShelfAPI", 
    ImagePosition: "left"
  },
  { 
    title: "Djember Fest", 
    description: "website yang dibuat untuk memperkenalkan kearifan kota Jember yang sangat kaya akan budaya, destinasi, dan UMKM", 
    technologies: ["React JS", "Tailwind"], 
    imageUrl: "/djemberfest.png", 
    githubLink: "https://github.com/hanNajib/DJEMBER-FEST", 
    liveLink: "https://djember-fest.vercel.app/" 
  },
  { 
    title: "DJ4U", 
    description: "Website Ticketing Sebuah Band Fiktif, dengan fitur schedule dan pembelian ticket", 
    technologies: ["HTML", "CSS", "JavaScript", "PHP"], 
    imageUrl: "/dj4u.png", 
    githubLink: "https://github.com/hanNajib/DJ4U-Concert", 
  },
  { 
    title: "RefactoMate", 
    description: "Simple refactoring code website dengan model AI Gemini Flash Thinking 2.0", 
    technologies: ["Next.js", "Tailwind"], 
    imageUrl: "/refactomate.png", 
    githubLink: "https://github.com/hanNajib/RefactoMate", 
    liveLink: "https://refactomate.vercel.app/" 
  },
  { 
    title: "FlipIwak", 
    description: "Memory Card Game dengan Style dari game Blue Archive dengan Leaderboard", 
    technologies: ["HTML", "CSS", "JavaScript", "Node Js", "Prisma", "Express"], 
    imageUrl: "/flipiwak.png", 
    liveLink: "http://flip-iwak.vercel.app/" 
  },
  // Add more unique projects here
];

const ProjectsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const cardWidth = 400; // Fixed card width
        const gap = 32; // Space between cards
        const totalCards = projectsData.length;
        const viewportWidth = window.innerWidth;
        
        // Adjust card width for smaller screens
        const responsiveCardWidth = viewportWidth < 768 
          ? viewportWidth * 0.8 
          : cardWidth;

        // Calculate total scroll width
        const calculatedWidth = (responsiveCardWidth + gap) * totalCards - viewportWidth + 100; // Use px for precise calculation
        setTotalWidth(calculatedWidth); // Store total scrollable width in px
        setWindowWidth(viewportWidth);
      }
    };

    // Initial calculation
    calculateWidth();

    // Recalculate on resize
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
    [0, -totalWidth] // Use px directly for transform
  );

  return (
    <div className="relative w-full min-h-[95vh] py-16">
      <TitleLabel>Projects</TitleLabel>


      <div 
        className="w-full" 
        style={{ 
          height: `${totalWidth + windowWidth}px` // Adjust height using px
        }}
        aria-hidden="true"
      />
      
      <div className="fixed top-0 left-0 w-full h-screen flex items-center overflow-hidden">
        <motion.div 
          ref={containerRef}
          style={{ x }} 
          className="flex gap-8 px-0 md:px-10 -translate-x-2 md:-translate-x-0"
        >
          {projectsData.map((project, index) => (
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
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;