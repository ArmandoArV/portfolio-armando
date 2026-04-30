"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PLANET_DEFS } from "@/data/planets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Experience from "./Experience";
import Education from "./Education";
import Projects from "./Projects";
import Skills from "./Skills";
import Publications from "./Publications";
import Awards from "./Awards";
import Contact from "./Contact";

function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        About Me
      </h2>
      <div className="space-y-4 text-slate-300 leading-relaxed text-base">
        <p>
          I&apos;m Armando Arredondo Valle — a Software Engineer at Microsoft building
          cloud-native systems, AI solutions, and real-time applications. Currently
          pursuing a Master&apos;s in Artificial Intelligence at Pontificia Universidad
          Católica de Chile.
        </p>
        <p>
          My work spans React frontends, .NET/Go backends, Azure cloud infrastructure,
          and AI-powered systems. From designing compilers to deploying medical imaging
          AI, from winning NASA&apos;s Human Exploration Rover Challenge to building
          enterprise-scale applications — I thrive at the intersection of complex
          systems and elegant solutions.
        </p>
        <p>
          Before Microsoft, I shipped products at Siemens Digital Industries, built IoT
          systems at Tecnocontrol Vehicular, and co-founded web experiences at
          Sonder.mut. I&apos;m also a published researcher, an Alan Turing national
          programming competition finalist, and a lifelong builder.
        </p>
      </div>
    </div>
  );
}

const SECTION_MAP: Record<string, React.ReactNode> = {
  earth: <Experience />,
  venus: <Education />,
  mars: <Projects />,
  jupiter: <Skills />,
  saturn: (
    <>
      <Publications />
      <Awards />
    </>
  ),
  mercury: <Contact />,
  neptune: <About />,
};

export default function ContentDrawer({
  activePlanet,
  onClose,
}: {
  activePlanet: string | null;
  onClose: () => void;
}) {
  const planetDef = activePlanet
    ? PLANET_DEFS.find((p) => p.id === activePlanet)
    : null;

  return (
    <AnimatePresence mode="wait">
      {activePlanet && planetDef && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Drawer */}
          <motion.div
            key={`drawer-${activePlanet}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="fixed top-0 right-0 h-full w-full md:w-[550px] lg:w-[650px] bg-slate-950/95 backdrop-blur-xl border-l border-slate-700/50 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${planetDef.accentColor}`} />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {planetDef.sectionLabel}
                  </h2>
                  <p className="text-xs text-slate-400">{planetDef.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close drawer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>

            {/* Section content */}
            <div className="pb-20">{SECTION_MAP[activePlanet]}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
