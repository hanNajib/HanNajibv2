"use client";

import { motion, TargetAndTransition, VariantLabels, Transition, Variants, MotionStyle } from "framer-motion"
import React, { MouseEventHandler } from "react";

type Props = {
    children?: React.ReactNode | string,
    className?: string,
    animate?: TargetAndTransition | VariantLabels,
    initial?: TargetAndTransition | VariantLabels,
    transition?: Transition,
    variants?: Variants,
    onMouseEnter?: MouseEventHandler,
    onMouseLeave?: MouseEventHandler,
    whileHover?: TargetAndTransition | VariantLabels,
    whileTap?: TargetAndTransition | VariantLabels,
    style?: MotionStyle
}

const Div = (props: Props) => {
  return (
    <motion.div 
      className={props.className}
      animate={props.animate}
      initial={props.initial}
      transition={props.transition}
      variants={props.variants}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      whileHover={props.whileHover}
      whileTap={props.whileTap}
      style={props.style}
    >
      {props.children}
    </motion.div>
  )
}

export default Div