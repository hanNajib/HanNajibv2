"use client";

import React, { createContext, useContext } from 'react';
import { useSpring, SpringValue } from '@react-spring/web';

type CursorContextType = {
  api: {
    x: SpringValue<number>;
    y: SpringValue<number>;
    scale: SpringValue<number>;
    rounded: SpringValue<number>;
  };
};

const CursorContext = createContext<CursorContextType | undefined>(undefined);  

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [api] = useSpring(() => ({
    x: -50,
    y: -50,
    scale: 1,
    rounded: 50,
    config: { mass: 1, tension: 300, friction: 20 },
  }));

  return (
    <CursorContext.Provider value={{ api }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}