import React from 'react'
import Div from './Div'

interface TitleProps {
    children: React.ReactNode
}

const TitleLabel: React.FC<TitleProps> = ({ children }) => {
  return (
    <Div 
      initial={{ 
        x: -300,
        opacity: 0,
        scale: 0.9,
        rotateY: -45
      }}
      animate={{
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: 1
      }}
      className='w-fit bg-gradient-to-r from-yellow-300 to-yellow-400 
                 fixed top-5 left-0 
                 h-16 px-10 
                 text-gray-800 
                 font-semibold text-2xl 
                 flex items-center justify-center 
                 shadow-lg
                 hover:shadow-xl 
                 transition-all duration-300
                 origin-left scale-75 md:scale-100 z-[999]'
    >
      <Div
        whileTap={{ scale: 0.95 }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        className='tracking-wide flex items-center'
      >
        {children}
      </Div>
    </Div>
  )
}

export default TitleLabel