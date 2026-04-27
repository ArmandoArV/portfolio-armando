"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faCubes, faCloud, faBrain, faDatabase, faWrench } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const CATEGORY_ICONS: Record<string, IconDefinition> = {
  Languages: faCode,
  Frameworks: faCubes,
  "Cloud & DevOps": faCloud,
  "Data & AI": faBrain,
  Databases: faDatabase,
};

const SKILL_GLOW: Record<string, string> = {
  React: "hover:border-blue-400 hover:shadow-blue-400/15",
  TypeScript: "hover:border-blue-400 hover:shadow-blue-400/15",
  Python: "hover:border-green-400 hover:shadow-green-400/15",
  Azure: "hover:border-sky-400 hover:shadow-sky-400/15",
  Go: "hover:border-teal-400 hover:shadow-teal-400/15",
  Rust: "hover:border-orange-400 hover:shadow-orange-400/15",
  "C++": "hover:border-red-400 hover:shadow-red-400/15",
  PyTorch: "hover:border-orange-400 hover:shadow-orange-400/15",
  CUDA: "hover:border-lime-400 hover:shadow-lime-400/15",
  PostgreSQL: "hover:border-indigo-400 hover:shadow-indigo-400/15",
  "Next.js": "hover:border-white hover:shadow-white/10",
  Docker: "hover:border-blue-400 hover:shadow-blue-400/15",
};

// Predefined constellation patterns per card (relative positions 0-100)
const CONSTELLATION_PATTERNS = [
  { stars: [[15,20],[40,15],[65,25],[85,18],[30,80],[55,75],[80,85]], lines: [[0,1],[1,2],[2,3],[4,5],[5,6]] },
  { stars: [[20,15],[50,10],[80,20],[25,85],[60,80],[90,75]], lines: [[0,1],[1,2],[3,4],[4,5]] },
  { stars: [[10,25],[35,12],[70,22],[90,30],[20,78],[55,85],[85,70]], lines: [[0,1],[1,2],[2,3],[4,5],[5,6]] },
  { stars: [[25,18],[55,12],[80,25],[15,82],[45,78],[75,88]], lines: [[0,1],[1,2],[3,4],[4,5]] },
  { stars: [[18,22],[45,15],[75,20],[30,82],[60,78],[88,82]], lines: [[0,1],[1,2],[3,4],[4,5]] },
  { stars: [[12,18],[38,25],[68,15],[92,22],[22,80],[52,85],[82,78]], lines: [[0,1],[1,2],[2,3],[4,5],[5,6]] },
];

export default function Skills() {
  return (
    <div id="skills" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Technical Skills
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((cat, i) => (
          <AnimatedSection key={cat.label} delay={i * 0.1}>
            <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 overflow-hidden group/skill">
              {/* Constellation background */}
              <svg className="absolute inset-0 w-full h-full opacity-0 group-hover/skill:opacity-100 transition-opacity duration-700" preserveAspectRatio="none">
                {CONSTELLATION_PATTERNS[i % CONSTELLATION_PATTERNS.length].lines.map(([a, b], li) => {
                  const pts = CONSTELLATION_PATTERNS[i % CONSTELLATION_PATTERNS.length].stars;
                  return (
                    <line
                      key={li}
                      x1={`${pts[a][0]}%`} y1={`${pts[a][1]}%`}
                      x2={`${pts[b][0]}%`} y2={`${pts[b][1]}%`}
                      stroke="rgba(96, 165, 250, 0.12)"
                      strokeWidth="0.5"
                    />
                  );
                })}
                {CONSTELLATION_PATTERNS[i % CONSTELLATION_PATTERNS.length].stars.map(([x, y], si) => (
                  <circle key={si} cx={`${x}%`} cy={`${y}%`} r="1.5" fill="rgba(147, 197, 253, 0.2)" />
                ))}
              </svg>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <FontAwesomeIcon icon={CATEGORY_ICONS[cat.label] || faWrench} className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">{cat.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2 relative z-10">
                {cat.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1.5 text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded-lg cursor-default transition-all duration-200 hover:shadow-md hover:text-white ${
                      SKILL_GLOW[skill] || "hover:border-blue-400/50"
                    }`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
