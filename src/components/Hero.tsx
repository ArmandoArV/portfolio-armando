"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import MagneticButton from "./MagneticButton";

const SolarSystem = dynamic(() => import("./SolarSystem"), { ssr: false });

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <SolarSystem />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Dark radial backdrop for readability */}
        <div className="absolute inset-0 -m-20 bg-radial-[ellipse_at_center] from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none rounded-full blur-2xl" />

        {/* Profile picture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mb-6 mx-auto"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto overflow-hidden ring-4 ring-blue-400/20 shadow-lg shadow-blue-500/15">
            <img
              src="/images/Armando-5.jpg"
              alt="Armando Arredondo Valle"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-blue-400 text-sm tracking-[0.3em] uppercase mb-4 font-medium"
        >
          Welcome to my universe
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-[0_0_30px_rgba(96,165,250,0.2)]"
        >
          <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            {profile.name}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl md:text-2xl text-slate-300 mb-2 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
        >
          {profile.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-base text-slate-400 mb-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
        >
          {profile.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <MagneticButton>
          <a
            href="#explore"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            Explore My Universe <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </a>
          </MagneticButton>
          <MagneticButton>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-slate-600 text-slate-300 rounded-full font-medium hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGithub} className="w-4 h-4" /> GitHub
          </a>
          </MagneticButton>
          <MagneticButton>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-slate-600 text-slate-300 rounded-full font-medium hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faLinkedin} className="w-4 h-4" /> LinkedIn
          </a>
          </MagneticButton>
          <MagneticButton>
          <a
            href={`mailto:${profile.email}`}
            className="px-8 py-3 border border-slate-600 text-slate-300 rounded-full font-medium hover:border-blue-400 hover:text-blue-400 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" /> Contact
          </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator — outside the content div, anchored to section bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-blue-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
