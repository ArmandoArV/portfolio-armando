"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export default function Contact() {
  return (
    <div id="contact" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent relative"
          >
            Let&apos;s Build Something Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 mb-10 max-w-lg mx-auto relative"
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center relative"
          >
            <a
              href={`mailto:${profile.email}`}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" /> Email Me
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-slate-600 text-slate-300 rounded-full font-medium hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" /> LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-slate-600 text-slate-300 rounded-full font-medium hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faGithub} className="w-4 h-4" /> GitHub
            </a>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
}
