"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import TiltCard from "./TiltCard";

const TECH_COLORS: Record<string, string> = {
  React: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  TypeScript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Python: "bg-green-500/10 text-green-400 border-green-500/20",
  "Next.js": "bg-slate-500/10 text-slate-300 border-slate-500/20",
  Go: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "C++": "bg-red-500/10 text-red-400 border-red-500/20",
  PyTorch: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Flask: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  Pandas: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Arduino: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PostgreSQL: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Soroban Smart Contracts": "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function getTechColor(tech: string) {
  return TECH_COLORS[tech] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export default function Projects() {
  return (
    <div id="projects" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Projects
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 group/list">
        {projects.map((project, i) => (
          <AnimatedSection key={project.name} delay={i * 0.1}>
            <div className="lg:group-hover/list:opacity-50 hover:!opacity-100 transition-opacity duration-300 h-full">
            <TiltCard className="h-full">
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 h-full group"
            >
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faGithub} className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-xs text-slate-500 group-hover:text-blue-400/60 transition-colors">View on GitHub</span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors leading-tight">
                {project.name}
              </h3>

              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.split(", ").map((t) => (
                  <span
                    key={t}
                    className={`px-2 py-0.5 text-xs rounded-full border ${getTechColor(t)}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.a>
            </TiltCard>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
