"use client";
import React, { useState } from 'react';
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Achievement {
    title: string;
    description: string;
    date: string;
    imageUrl: string;
    type: 'trophy' | 'star' | 'medal';
    organization: string;
}

const AchievementCard: React.FC<Achievement> = ({
    title,
    description,
    date,
    imageUrl,
    type,
    organization
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const getIconByType = () => {
        switch(type) {
            case 'trophy': return <FaTrophy size={32} className="text-yellow-300" />;
            case 'star': return <FaStar size={32} className="text-yellow-300" />;
            case 'medal': return <FaMedal size={32} className="text-yellow-300" />;
            default: return null;
        }
    };

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
            className="group bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-neutral-800 hover:border-yellow-300 transition-all duration-300 w-[400px] h-[480px] scale-75 md:scale-100"
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
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </motion.div>
            </div>

            {/* Achievement Details */}
            <div className="p-6">
                <div className="flex items-center mb-3">
                    {getIconByType()}
                    <h3 className="text-2xl font-bold text-white ml-3 group-hover:text-yellow-300 transition-colors duration-300">
                        {title}
                    </h3>
                </div>

                <p className="text-neutral-400 mb-4 line-clamp-3 text-base">
                    {description}
                </p>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-neutral-500">
                            {organization}
                        </p>
                        <p className="text-xs text-neutral-600">
                            {date}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AchievementCard;