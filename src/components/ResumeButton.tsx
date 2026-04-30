"use client";

import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function ResumeButton() {
  return (
    <motion.a
      href="/Armando_Arredondo_Valle_Resume.pdf"
      download="Armando_Arredondo_Valle_Resume.pdf"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-slate-900 border-2 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/20 flex items-center justify-center hover:scale-110 hover:border-blue-400 transition-all"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Download resume"
      title="Download Resume"
    >
      <FontAwesomeIcon icon={faFileArrowDown} className="w-5 h-5" />
    </motion.a>
  );
}
