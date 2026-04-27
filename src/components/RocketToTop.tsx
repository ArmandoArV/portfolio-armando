"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default function RocketToTop() {
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setLaunching(false), 800);
    }, 300);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={handleLaunch}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 group"
        >
          <motion.div
            animate={launching ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
            className="relative flex flex-col items-center"
          >
            {/* Rocket */}
            <div className="text-xl text-blue-400 group-hover:text-blue-300 group-hover:-translate-y-1 transition-all duration-300">
              <FontAwesomeIcon icon={faStar} className="w-5 h-5" />
            </div>

            {/* Stardust trail particles */}
            <div className="flex gap-[2px] -mt-0.5">
              <motion.div
                animate={{ height: [3, 8, 5, 10, 3], opacity: [0.4, 0.8, 0.6, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-[2px] rounded-full bg-gradient-to-b from-blue-300 to-transparent"
              />
              <motion.div
                animate={{ height: [6, 12, 8, 14, 6], opacity: [0.6, 1, 0.8, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className="w-[2px] rounded-full bg-gradient-to-b from-blue-400 via-indigo-400 to-transparent"
              />
              <motion.div
                animate={{ height: [3, 8, 5, 10, 3], opacity: [0.4, 0.8, 0.6, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-[2px] rounded-full bg-gradient-to-b from-blue-300 to-transparent"
              />
            </div>

            {/* Glow base */}
            <div className="absolute -bottom-2 w-8 h-4 bg-blue-500/20 rounded-full blur-md group-hover:bg-blue-500/30 transition-all" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
