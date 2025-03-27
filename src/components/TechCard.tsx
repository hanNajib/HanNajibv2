"use client";

import React from "react";
import { useCursor } from "@/app/layout";
import Div from "./Div";

type Props = {
    label: string;
    children: React.ReactNode;
    delay?: number;
};

const TechCard = (props: Props) => {
    const { api } = useCursor();

    return (
        <Div
            initial={{ 
                y: 50, 
                scale: 0.9, 
                opacity: 0 
            }}
            animate={{ 
                y: 0, 
                scale: 1, 
                opacity: 1 
            }}
            transition={{ 
                type: "tween",
                duration: 0.5,
                ease: "anticipate",
                delay: props.delay || 0
            }}
            onMouseEnter={() => api.start({ scale: 0, rounded: 0 })}
            onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}
            className="flex flex-col items-center justify-around w-[120px] h-[120px] bg-[#1c1c1c] p-1 rounded-md relative group scale-100 hover:scale-110 transition-all duration-300 overflow-hidden shadow-lg"
        >
            <div className="absolute inset-0 bg-yellow-300 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out rounded-md"></div>

            <Div
                className="relative z-10 text-white duration-300 group-hover:text-black transition-all text-4xl block"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 200, 
                    damping: 10 
                }}
            >
                {props.children}
            </Div>
            <div className="relative z-10 text-white font-medium text-sm group-hover:text-black">
                {props.label}
            </div>
        </Div>
    );
};

export default TechCard;