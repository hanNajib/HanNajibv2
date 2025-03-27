import TechCard from "@/components/TechCard";
import React from "react";
import { SiNextdotjs, SiExpress, SiTailwindcss, SiPhp, SiTypescript } from "react-icons/si";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaLaravel,
  FaReact,
  FaJava,
  FaBootstrap,
  FaDatabase,
  FaGitAlt,
} from "react-icons/fa";
import TitleLabel from "@/components/TitleLabel";

const techStack = {
  HTML: <FaHtml5 />,
  CSS: <FaCss3Alt />,
  JavaScript: <FaJs />,
  TypeScript: <SiTypescript />,
  PHP: <SiPhp/>,
  Laravel: <FaLaravel />,
  React: <FaReact />,
  "Next.js": <SiNextdotjs />,
  Express: <SiExpress />,
  Java: <FaJava />,
  Bootstrap: <FaBootstrap />,
  Tailwind: <SiTailwindcss />,
  MySQL: <FaDatabase />,
  Git: <FaGitAlt />,
};

function Tech() {
  return (
    <>
    <TitleLabel>Tech Stack</TitleLabel>
    <div className="flex flex-wrap items-center justify-center w-screen mt-32 md:mt-0 md:h-screen">
    <div className="p-10 flex flex-wrap items-center justify-center w-screen mt-32 md:mt-0 md:h-fit gap-5">
      {Object.entries(techStack).map(([name, icon], index) => (
        <TechCard key={name} label={name} delay={index / 10}>
          {icon}
        </TechCard>
      ))}
    </div>
    </div>
    </>
  );
}

export default Tech;
