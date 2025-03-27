"use client"
import React, { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Div from './Div';

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    imageUrl: string;
    githubLink?: string;
    liveLink?: string;
}

const ProjectCard: React.FC<Project> = ({
    title,
    description,
    technologies,
    imageUrl,
    githubLink,
    liveLink
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Div
            initial={{ 
                opacity: 0, 
                scale: 0.9,
                y: 50 
            }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0 
            }}
            transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            className="bg-neutral-900 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Project Image */}
            <div className="relative h-48 md:h-56 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out hover:scale-110"
                />
                {/* Overlay Links */}
                <div className={`
                    absolute inset-0 bg-black bg-opacity-50 
                    flex items-center justify-center 
                    space-x-4 
                    opacity-0 hover:opacity-100 
                    transition-opacity duration-300
                    ${isHovered ? 'opacity-100' : ''}
                `}>
                    {githubLink && (
                        <a 
                            href={githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white bg-neutral-800 p-3 rounded-full hover:bg-yellow-300 hover:text-black transition-all"
                        >
                            <FaGithub size={24} />
                        </a>
                    )}
                    {liveLink && (
                        <a 
                            href={liveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white bg-neutral-800 p-3 rounded-full hover:bg-yellow-300 hover:text-black transition-all"
                        >
                            <FaExternalLinkAlt size={24} />
                        </a>
                    )}
                </div>
            </div>

            {/* Project Details */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-neutral-400 mb-4 line-clamp-3">{description}</p>

                {/* Technology Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {technologies.map((tech, index) => (
                        <span 
                            key={index} 
                            className="bg-neutral-800 text-yellow-300 text-xs px-2 py-1 rounded-full"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </Div>
    );
};

export default ProjectCard;