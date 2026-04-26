"use client";

import { motion } from "framer-motion";
import { awards, languages } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Awards() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Honors & Awards
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-4 mb-16">
        {awards.map((award, i) => (
          <AnimatedSection key={award.name + award.event} delay={i * 0.1}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/30 transition-all duration-300 flex items-start gap-4"
            >
              <FontAwesomeIcon icon={faTrophy} className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-bold">{award.name}</h3>
                <p className="text-sm text-slate-400">
                  {award.event} {award.year && `(${award.year})`}
                </p>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Languages
        </h2>
      </AnimatedSection>

      <div className="flex flex-wrap gap-4">
        {languages.map((lang, i) => (
          <AnimatedSection key={lang.name} delay={i * 0.1}>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-6 py-4 hover:border-cyan-500/30 transition-all duration-300 text-center">
              <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-cyan-400 mb-2" />
              <p className="text-white font-bold">{lang.name}</p>
              <p className="text-xs text-slate-400 mt-1">{lang.level}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
