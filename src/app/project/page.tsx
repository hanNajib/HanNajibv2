import ProjectCard from "@/components/ProjectCard";

const projectsData = [ 
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
  { 
      title: "Portfolio Website", 
      description: "Responsive personal portfolio website showcasing skills.", 
      technologies: ["Next.js", "Tailwind", "Framer Motion"], 
      imageUrl: "/path/to/portfolio-screenshot.png", 
      githubLink: "https://github.com/yourusername/portfolio", 
      liveLink: "https://yourportfolio.com" 
  },
];


const ProjectsPage = () => {
  return (
    <div className="overflow-y-hidden">
          <div className="flex-wrap gap-2 justify-center overflow-y-auto flex items-center overflow-y-scroll p-5 mt-12">
                  {projectsData.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                  ))}
          </div>
    </div>
  );
};

export default ProjectsPage;