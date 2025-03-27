import { motion } from "framer-motion";
import Link from "next/link";
import { MouseEventHandler } from "react";

type Props = {
  icon: string;
  link: string;
  delay: number;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
};

const NavItem = ({ icon, link, delay, onMouseEnter, onMouseLeave }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.8, delay: delay, ease: [0.25, 1, 0.5, 1] }}
    >
      <Link
        href={link}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          className="cursor-none z-50 w-10 h-10 flex items-center justify-center rounded-md bg-gray-800 text-white shadow-lg"
          whileHover={{
            scale: 1.2,
            rotate: 10,
            boxShadow: "0px 0px 20px rgba(255, 255, 0, 0.5)"
          }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <i className={`${icon}`}></i>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default NavItem;
