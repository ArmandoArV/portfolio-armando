export interface Experience {
  company: string;
  location: string;
  roles: { title: string; dates: string; bullets: string[] }[];
}

export interface Education {
  school: string;
  degree: string;
  dates: string;
  gpa?: string;
  logo?: string;
}

export interface Project {
  name: string;
  url: string;
  tech: string;
  description: string;
}

export interface Publication {
  authors: string;
  year: string;
  title: string;
  venue: string;
}

export interface SkillCategory {
  label: string;
  items: string[];
}

export const profile = {
  name: "Armando Arredondo Valle",
  tagline: "Software Engineer @ Microsoft",
  subtitle: "Building cloud-native systems, AI solutions & real-time applications",
  email: "armando.arredondo.valle@gmail.com",
  phone: "+52 777 114 0555",
  linkedin: "https://www.linkedin.com/in/armando-av",
  github: "https://github.com/ArmandoArV",
};

export const experiences: Experience[] = [
  {
    company: "Microsoft",
    location: "Mexico City",
    roles: [
      {
        title: "Software Engineer",
        dates: "Sep 2025 – Present",
        bullets: [
          "Architected and operated cloud-native distributed systems on Azure, implementing HA and DR strategies across Azure SQL, Cosmos DB, and storage layers",
          "Designed CI/CD release pipelines (OneBranch YAML + EV2) with staged deployments, slot swaps, and automated validation gates",
          "Built end-to-end observability using Azure Monitor and Geneva, enabling sub-hour incident detection across production services",
          "Led live-site operations including incident response, root cause analysis, and DevOps governance in Azure DevOps",
        ],
      },
      {
        title: "Software Engineer Intern",
        dates: "Feb 2025 – Aug 2025",
        bullets: [
          "Developed an internal documentation chatbot using C#/.NET (MVC) with Azure OpenAI, improving knowledge retrieval for 300+ employees",
          "Built responsive front-end with React/TypeScript; implemented Azure Blob Storage and role-based authentication",
        ],
      },
    ],
  },
  {
    company: "Siemens Digital Industries",
    location: "Mexico City",
    roles: [
      {
        title: "Information Technology Intern",
        dates: "May 2024 – May 2025",
        bullets: [
          "Led end-to-end development of a full-stack production system using Java/Spring Boot with Oracle Database backend",
          "Delivered low-code interfaces in Mendix, driving adoption across cross-functional teams",
        ],
      },
    ],
  },
  {
    company: "Tecnocontrol Vehicular",
    location: "Cuernavaca",
    roles: [
      {
        title: "Software Engineer",
        dates: "Feb 2024 – Apr 2024",
        bullets: [
          "Developed backend services in Go and maintained legacy Node.js/PHP systems; optimized Oracle Database integrations",
        ],
      },
    ],
  },
  {
    company: "Sonder.mut",
    location: "Mexico",
    roles: [
      {
        title: "Software Developer",
        dates: "Apr 2023 – Jan 2024",
        bullets: [
          "Built and optimized Next.js front-end apps with SSR and Go/Fiber backend APIs for high-performance delivery",
        ],
      },
    ],
  },
];

export const education: Education[] = [
  {
    school: "Pontificia Universidad Católica de Chile",
    degree: "M.Sc. in Artificial Intelligence",
    dates: "Mar 2026 – Jul 2027",
    logo: "/images/Marca-uc.svg.png",
  },
  {
    school: "Tecnológico de Monterrey (ITESM)",
    degree: "B.S. in Computer Science and Technology",
    dates: "Aug 2021 – Jun 2025",
    gpa: "94/100",
    logo: "/images/Logo_del_ITESM.svg",
  },
];

export const projects: Project[] = [
  {
    name: "TECXOTIC – NASA Rover Telemetry Dashboard",
    url: "https://github.com/ArmandoArV/TECXOTIC-FRONT2023",
    tech: "JavaScript, React",
    description:
      "Real-time interface visualizing sensor telemetry from a human-powered rover; 1st Place at NASA HERC 2022.",
  },
  {
    name: "Healthcare Access Analysis",
    url: "https://github.com/ArmandoArV/IntroDataScienceProyecto",
    tech: "Python, Pandas",
    description:
      "Data-driven analysis of healthcare accessibility in Mexico post-Seguro Popular reform; published in Revista SAGA.",
  },
  {
    name: "Planty – IoT Smart Plant Monitor",
    url: "https://github.com/ArmandoArV/Planty-Mono",
    tech: "Next.js, Go, Arduino, PostgreSQL",
    description:
      "Full-stack IoT system with real-time sensor telemetry (moisture, temp, pH), automated pump control, and device authentication.",
  },
  {
    name: "Stellar Hackathon – Blockchain Bounty Engine",
    url: "https://github.com/ArmandoArV/stellarHackathon2025-App",
    tech: "TypeScript, Soroban Smart Contracts",
    description:
      "Decentralized bounty platform built on Stellar blockchain with smart contract integration for incentivized task completion.",
  },
  {
    name: "Dermatosis AI Classifier",
    url: "https://github.com/ArmandoArV/TC3002-Backend",
    tech: "Python, PyTorch, Flask",
    description:
      "Medical image classification system using VGG11 for dermatosis detection with a REST API inference endpoint.",
  },
  {
    name: "Quetzal Language Compiler",
    url: "https://github.com/ArmandoArV/TC3002-Compiler",
    tech: "C++",
    description:
      "Custom programming language compiler with lexer and recursive-descent parser (LL(1)) built from scratch.",
  },
];

export const publications: Publication[] = [
  {
    authors: "Velasco-Espinal J.A., et al., Arredondo-Valle A.",
    year: "2025",
    title:
      "Evolución del acceso a servicios de salud en México tras la eliminación del Seguro Popular",
    venue: "Revista SAGA",
  },
  {
    authors: "Fierro-Radilla A.N., et al., Arredondo-Valle A.",
    year: "2022",
    title:
      "White Blood Cell Detection and Classification in Blood Smear Images",
    venue: "Advances in Computational Intelligence",
  },
];

export const skills: SkillCategory[] = [
  { label: "Languages", items: ["Python", "TypeScript", "Java", "C#", "Go", "Rust", "C++"] },
  { label: "Frameworks", items: ["React", "Next.js", ".NET", "Spring Boot", "Node.js", "Tailwind CSS", "Vue.js"] },
  { label: "Cloud & DevOps", items: ["Azure", "AWS", "Docker", "Vercel", "CI/CD", "GitHub Actions"] },
  { label: "Data & AI", items: ["PyTorch", "CUDA", "Pandas", "Azure OpenAI"] },
  { label: "Databases", items: ["PostgreSQL", "Oracle", "SQL Server", "MongoDB", "MySQL", "Cosmos DB"] },
];

export const awards = [
  { name: "1st Place Overall", event: "NASA Human Rover Exploration Challenge", year: "2022" },
  { name: "2nd Place", event: "RPA Hackathon", year: "2023" },
  { name: "Cuauhnahuac Medal", event: "Academic Excellence", year: "2024" },
  { name: "Finalist", event: "Concurso Nacional de Programación Alan Turing", year: "" },
];

export const languages = [
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Professional" },
  { name: "French", level: "Professional" },
  { name: "German", level: "Elementary" },
];
