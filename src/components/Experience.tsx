"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";

export default function Experience() {
  return (
    <div id="experience" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Professional Experience
        </h2>
      </AnimatedSection>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-blue-500/30 to-transparent" />

        {experiences.map((exp, i) => (
          <AnimatedSection key={exp.company} delay={i * 0.1}>
            <div className="relative pl-8 md:pl-20 pb-12 last:pb-0 group">
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-8 top-1 w-3 h-3 -translate-x-[6px] rounded-full bg-cyan-400 ring-4 ring-slate-900 group-hover:ring-cyan-400/20 transition-all duration-300" />

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                  <span className="text-sm text-slate-400">{exp.location}</span>
                </div>

                {exp.roles.map((role, j) => (
                  <div key={j} className={j > 0 ? "mt-4 pt-4 border-t border-slate-700/50" : ""}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <p className="text-cyan-400 font-medium">{role.title}</p>
                      <p className="text-sm text-slate-400">{role.dates}</p>
                    </div>
                    <ul className="space-y-2">
                      {role.bullets.map((bullet, k) => (
                        <motion.li
                          key={k}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: k * 0.05 }}
                          className="flex gap-3 text-slate-300 text-sm leading-relaxed"
                        >
                          <span className="text-cyan-400 mt-1.5 shrink-0">▸</span>
                          {bullet}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
