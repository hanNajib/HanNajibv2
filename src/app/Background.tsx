import Squares from '@/components/Backgrounds/Squares/Squares'
import React from 'react'

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 mix-blend-darken">
        <Squares direction="diagonal" speed={0.5} borderColor="#262626" squareSize={70} hoverFillColor="#ff0000"/>
    </div>
  )
}

export default Background;