"use client";

import { motion, TargetAndTransition, VariantLabels, Transition } from "framer-motion"
import { MouseEventHandler } from "react";

type Props = {
    children?: string,
    className?: string,
    animate?: TargetAndTransition | VariantLabels,
    initial?: TargetAndTransition | VariantLabels,
    transition?: Transition,
    onMouseEnter?: MouseEventHandler,
    onMouseLeave?: MouseEventHandler

}

const Paragraph = (props: Props) => {
  return (
    <motion.p 
      className={props.className}
      animate={props.animate}
      initial={props.initial}
      transition={props.transition}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </motion.p>
  )
}

export default Paragraph