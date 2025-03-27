"use client";

import { Lexend } from "next/font/google";
import "./globals.css";
import Background from "./Background";
import { useEffect, createContext, useContext } from "react";
import { useSpring, animated, SpringRef } from "@react-spring/web";
import Div from "@/components/Div";
import NavItem from "@/components/NavItem";

const lexendFont = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

// Create a cursor context
type CursorContextType = {
  api: SpringRef;
};

const CursorContext = createContext<CursorContextType | null>(null);

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [springProps, api] = useSpring(() => ({
    x: -50,
    y: -50,
    scale: 1,
    rounded: 50,
    config: { mass: 1, tension: 300, friction: 20 },
  }));

  // Track mouse movement
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      api.start({ x: e.clientX - 20, y: e.clientY - 20 });
    };

    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [api]);

  return (
    <CursorContext.Provider value={{ api }}>
      <html lang="en" className={`${lexendFont.variable} cursor-none`}>
        <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>HanNajib</title>
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" 
            integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" 
            crossOrigin="anonymous" 
            referrerPolicy="no-referrer" 
          />
        </head>
        <body className="antialiased overflow-x-hidden">
          {/* Cursor */}
          <animated.div
            className="w-6 h-6 md:w-8 md:h-8 bg-yellow-300 mix-blend-difference opacity-90 fixed z-[99999] pointer-events-none"
            style={{ 
              x: springProps.x, 
              y: springProps.y, 
              scale: springProps.scale, 
              borderRadius: springProps.rounded.to((r: number) => `${r}%`) 
            }}
          />

          {/* Line animations */}
          <Div initial={{ x: 300 }} animate={{ x: -300 }} transition={{ duration: 1, delay: 1 }} className="scale-75 md:scale-100 w-82 h-8 -rotate-45 -translate-x-20 translate-y-14 fixed bg-yellow-300 mdshow"></Div>
          <Div initial={{ x: 300 }} animate={{ x: -300 }} transition={{ duration: 1, delay: 1 }} className="scale-75 md:scale-100 w-52 h-8 -rotate-45 -translate-x-10 fixed bg-yellow-300 mdshow"></Div>
          <Div initial={{ x: -300 }} animate={{ x: 300 }} transition={{ duration: 1, delay: 2.2 }} className="scale-75 md:scale-100 w-82 h-8 rotate-45 -translate-x-20 bottom-0 fixed bg-yellow-300 mdshow"></Div>
          <Div initial={{ x: -300 }} animate={{ x: 300 }} transition={{ duration: 1, delay: 2.2 }} className="scale-75 md:scale-100 w-52 h-8 rotate-45 bottom-12 fixed bg-yellow-300 mdshow"></Div>
          <Div initial={{ x: -300 }} animate={{ x: 600 }} transition={{ duration: 1.5, delay: 3.2 }} className="scale-75 md:scale-100 w-82 h-8 -rotate-45 bottom-10 right-0 fixed bg-yellow-300 mdshow"></Div>
          <Div initial={{ x: -300 }} animate={{ x: 300 }} transition={{ duration: 1, delay: 3.2 }} className="scale-75 md:scale-100 w-52 h-8 -rotate-45 bottom-12 right-0 fixed bg-yellow-300 mdshow"></Div>
          <Div initial={{ x: 400 }} animate={{ x: 0 }} transition={{ duration: 1, delay: 4.2 }} className="scale-75 md:scale-100 w-80 h-8 right-0 top-5 fixed bg-yellow-300 mdshow"></Div>
          
          {/* Navigation */}
          <Div 
            initial={{ x: 350 }} 
            animate={{ x: 0 }} 
            transition={{ duration: 1, delay: 5 }} 
            className="w-80 scale-75 md:scale-100 h-16 right-0 top-5 p-5 fixed gap-4 bg-yellow-300 flex items-center justify-between z-50 cursor-none mdshow"
          >
            <NavItem delay={6} icon="fa-solid fa-home" link="/" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={6.6} icon="fa-solid fa-code" link="/tech" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={6.8} icon="fa-solid fa-folder-open" link="/project" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={7} icon="fa-solid fa-trophy" link="/achievement" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={7.2} icon="fa-solid fa-envelope" link="/contact" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
          </Div>

          {/* Mobile Navigation */}
          <div className="w-screen flex justify-center items-center hide-on-desktop">
          <Div 
            initial={{ y: 600, filter: "blur(10px)", opacity: 0 }} 
            animate={{ y: 0, filter: "blur(0px)", opacity: 1}} 
            transition={{ duration: 1, delay: 1 }} 
            className="w-full scale-75 md:scale-100 h-16 bottom-16 p-5 rounded-2xl fixed gap-4 bg-yellow-300 flex items-center justify-between z-50 cursor-none"
          >
            <NavItem delay={2} icon="fa-solid fa-home" link="/" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={2.6} icon="fa-solid fa-code" link="/tech" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={2.8} icon="fa-solid fa-folder-open" link="/project" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={3} icon="fa-solid fa-trophy" link="/achievement" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
            <NavItem delay={3.2} icon="fa-solid fa-envelope" link="/contact" onMouseEnter={() => api.start({ rounded: 0, scale: 0.3 })} onMouseLeave={() => api.start({ scale: 1, rounded: 50 })}/>
          </Div>
          </div>
          
          {children}
          <Background />
        </body>
      </html>
    </CursorContext.Provider>
  );
}