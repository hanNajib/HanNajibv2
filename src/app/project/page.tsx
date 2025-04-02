"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
];

const ProjectsPage = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate dimensions and set up scroll listener
  useEffect(() => {
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Update width initially and on resize
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    // Custom scroll handler
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / documentHeight;
      
      // Calculate total scroll width
      const cardWidth = windowWidth < 768 ? windowWidth * 0.8 : 400;
      const gap = 32;
      const totalWidth = projectsData.length * (cardWidth + gap);
      const maxScrollX = totalWidth - windowWidth + 100;
      
      // Set horizontal scroll position based on vertical scroll
      setScrollX(scrollProgress * maxScrollX);
    };
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Force initial scroll position to top
    window.scrollTo(0, 0);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [windowWidth]);
  
  return (
    <div className="relative w-full min-h-screen">
      <TitleLabel>Projects</TitleLabel>
      
      {/* Spacer for vertical scrolling */}
      <div style={{ height: "300vh" }} />
      
      {/* Fixed container for horizontal cards */}
      <div className="fixed top-0 left-0 w-full h-screen flex items-center overflow-hidden">
        <div 
          ref={containerRef}
          className="flex gap-8 px-4 md:px-10 ml-4 md:ml-8"
          style={{ 
            transform: `translateX(-${scrollX}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {projectsData.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: index * 0.1
                }
              }}
              className={`flex-shrink-0 ${
                windowWidth < 768 ? "w-[80vw] h-[60vh]" : "w-[400px] h-[500px]"
              }`} 
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;