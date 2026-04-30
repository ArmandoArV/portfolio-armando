export interface PlanetDef {
  id: string;
  name: string;
  sectionLabel: string;
  texturePath: string;
  radius: number;
  orbitRadius: number;
  orbitalSpeed: number;
  rotationSpeed: number;
  initialAngle: number;
  accentColor: string;
}

export const PLANET_DEFS: PlanetDef[] = [
  {
    id: "mercury",
    name: "Mercury",
    sectionLabel: "Contact",
    texturePath: "/textures/2k_mercury.jpg",
    radius: 0.2,
    orbitRadius: 2.5,
    orbitalSpeed: 0.15,
    rotationSpeed: 0.05,
    initialAngle: Math.PI * 0.17,
    accentColor: "bg-amber-400",
  },
  {
    id: "venus",
    name: "Venus",
    sectionLabel: "Education",
    texturePath: "/textures/2k_venus_surface.jpg",
    radius: 0.3,
    orbitRadius: 3.5,
    orbitalSpeed: 0.12,
    rotationSpeed: -0.03,
    initialAngle: Math.PI * 0.44,
    accentColor: "bg-orange-400",
  },
  {
    id: "earth",
    name: "Earth",
    sectionLabel: "Experience",
    texturePath: "/textures/2k_earth_daymap.jpg",
    radius: 0.3,
    orbitRadius: 4.8,
    orbitalSpeed: 0.1,
    rotationSpeed: 0.1,
    initialAngle: Math.PI * 0.78,
    accentColor: "bg-blue-400",
  },
  {
    id: "mars",
    name: "Mars",
    sectionLabel: "Projects",
    texturePath: "/textures/2k_mars.jpg",
    radius: 0.22,
    orbitRadius: 6,
    orbitalSpeed: 0.08,
    rotationSpeed: 0.09,
    initialAngle: Math.PI * 1.11,
    accentColor: "bg-red-400",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    sectionLabel: "Skills",
    texturePath: "/textures/2k_jupiter.jpg",
    radius: 0.5,
    orbitRadius: 7.5,
    orbitalSpeed: 0.05,
    rotationSpeed: 0.15,
    initialAngle: Math.PI * 1.39,
    accentColor: "bg-yellow-400",
  },
  {
    id: "saturn",
    name: "Saturn",
    sectionLabel: "Publications & Awards",
    texturePath: "/textures/2k_saturn.jpg",
    radius: 0.45,
    orbitRadius: 9.2,
    orbitalSpeed: 0.035,
    rotationSpeed: 0.06,
    initialAngle: Math.PI * 1.67,
    accentColor: "bg-amber-300",
  },
  {
    id: "neptune",
    name: "Neptune",
    sectionLabel: "About",
    texturePath: "/textures/2k_neptune.jpg",
    radius: 0.28,
    orbitRadius: 11,
    orbitalSpeed: 0.025,
    rotationSpeed: 0.12,
    initialAngle: Math.PI * 1.94,
    accentColor: "bg-indigo-400",
  },
];
