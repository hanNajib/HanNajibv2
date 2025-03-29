"use client";
import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCursor } from '@/app/layout';
import Image from 'next/image';


export interface Project {
    title: string;
    description: string;
    technologies: string[];
    imageUrl: string;
    githubLink?: string;
    liveLink?: string;
    ImagePosition?: string;
}

const ProjectCard: React.FC<Project> = ({
    title,
    description,
    technologies,
    imageUrl,
    githubLink,
    liveLink,
    ImagePosition = 'center'
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { api } = useCursor();

    return (
        <motion.div
            initial={{ 
                opacity: 0, 
                scale: 0.95,
                y: 30 
            }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0 
            }}
            transition={{ 
                type: "spring",
                stiffness: 120,
                damping: 10
            }}
            className="group bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-800 hover:border-yellow-300 transition-all duration-300 w-[400px] h-[480px] scale-75 md:scale-100" // Fixed width and height
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-[250px] w-full overflow-hidden">
            <motion.div 
                className="w-full h-full"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.5, ease: "easeInOut" } }}
            >
                <Image 
                    src={imageUrl} 
                    alt={title} 
                    fill
                    style={{ objectFit: "cover", objectPosition: ImagePosition }}
                />
            </motion.div>
                <motion.div 
                    className={`
                        absolute inset-0 bg-black bg-opacity-60 
                        flex items-center justify-center 
                        space-x-4 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300
                    `}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.9 : 0 }}
                >
                    {githubLink && (
                        <motion.a 
                            href={githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white bg-neutral-800 p-3 rounded-full hover:bg-yellow-300 hover:text-black transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onMouseEnter={() => api.start({ scale: 0 })}
                            onMouseLeave={() => api.start({ scale: 1 })}
                        >
                            <FaGithub size={24} />
                        </motion.a>
                    )}
                    {liveLink && (
                        <motion.a 
                            href={liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white bg-neutral-800 p-3 rounded-full hover:bg-yellow-300 hover:text-black transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onMouseEnter={() => api.start({ scale: 0 })}
                            onMouseLeave={() => api.start({ scale: 1 })}
                        >
                            <FaExternalLinkAlt size={24} />
                        </motion.a>
                    )}
                </motion.div>
            </div>

            {/* Project Details */}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-neutral-400 mb-4 line-clamp-3 text-base">
                    {description}
                </p>

                {/* Technology Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {technologies.map((tech, index) => (
                        <motion.span 
                            key={index} 
                            className="bg-neutral-800 text-yellow-300 text-xs px-3 py-1 rounded-full"
                            whileHover={{ scale: 1.05 }}
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;