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
  React: "hover:border-cyan-400 hover:shadow-cyan-400/20",
  TypeScript: "hover:border-blue-400 hover:shadow-blue-400/20",
  Python: "hover:border-green-400 hover:shadow-green-400/20",
  Azure: "hover:border-sky-400 hover:shadow-sky-400/20",
  Go: "hover:border-teal-400 hover:shadow-teal-400/20",
  Rust: "hover:border-orange-400 hover:shadow-orange-400/20",
  "C++": "hover:border-red-400 hover:shadow-red-400/20",
  PyTorch: "hover:border-orange-400 hover:shadow-orange-400/20",
  CUDA: "hover:border-lime-400 hover:shadow-lime-400/20",
  PostgreSQL: "hover:border-indigo-400 hover:shadow-indigo-400/20",
  "Next.js": "hover:border-white hover:shadow-white/10",
  Docker: "hover:border-blue-400 hover:shadow-blue-400/20",
};

export default function Skills() {
  return (
    <div id="skills" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Technical Skills
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((cat, i) => (
          <AnimatedSection key={cat.label} delay={i * 0.1}>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={CATEGORY_ICONS[cat.label] || faWrench} className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">{cat.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1.5 text-sm bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded-lg cursor-default transition-all duration-200 hover:shadow-md hover:text-white ${
                      SKILL_GLOW[skill] || "hover:border-cyan-400/50"
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
