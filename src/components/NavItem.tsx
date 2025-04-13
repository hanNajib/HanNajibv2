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
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <Link
        href={link}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          className="cursor-none z-50 w-10 h-10 flex items-center justify-center rounded-md bg-yellow-300 text-gray-800 md:bg-gray-800 md:text-white shadow-md"
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <i className={icon}></i>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default NavItem;
