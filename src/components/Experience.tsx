"use client";

import { experiences } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";
import TextScramble from "./TextScramble";

const COMPANY_PLANETS: Record<string, { bg: string; ring?: string; size?: string }> = {
  "Microsoft": {
    bg: "bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600",
    ring: "ring-blue-400/30",
  },
  "Siemens Digital Industries": {
    bg: "bg-gradient-to-br from-teal-400 to-emerald-600",
    ring: "ring-teal-400/30",
  },
  "Tecnocontrol Vehicular": {
    bg: "bg-gradient-to-br from-orange-400 via-red-400 to-red-600",
    ring: "ring-orange-400/30",
  },
  "Sonder.mut": {
    bg: "bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600",
    ring: "ring-purple-400/30",
  },
};

export default function Experience() {
  return (
    <div id="experience" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Professional Experience
        </h2>
      </AnimatedSection>

      <div className="relative">
        <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-indigo-500/20 to-transparent" />

        <ol className="group/list">
          {experiences.map((exp, i) => (
            <li key={exp.company} className="mb-12 last:mb-0">
              <AnimatedSection delay={i * 0.1}>
                <div className="relative pl-8 md:pl-20 lg:group-hover/list:opacity-50 hover:!opacity-100 transition-opacity duration-300">
                  <div className="absolute left-0 md:left-8 top-5 -translate-x-[7px]">
                    <div className={`w-4 h-4 rounded-full ${(COMPANY_PLANETS[exp.company]?.bg) || "bg-blue-400"} shadow-lg shadow-blue-500/20 ring-2 ${COMPANY_PLANETS[exp.company]?.ring || "ring-blue-400/30"} ring-offset-2 ring-offset-slate-950`}>
                      <div className="absolute inset-0 rounded-full bg-white/20 blur-[1px]" style={{ clipPath: "inset(0 50% 0 0)" }} />
                    </div>
                  </div>

                  <div className="group/card relative">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-lg transition-all duration-200 lg:-inset-x-6 lg:block lg:group-hover/card:bg-slate-800/50 lg:group-hover/card:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover/card:drop-shadow-lg" />

                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-200">{exp.company}</h3>
                        <span className="text-sm text-slate-500">{exp.location}</span>
                      </div>

                      {exp.roles.map((role, j) => (
                        <div key={j} className={j > 0 ? "mt-4 pt-4 border-t border-slate-700/30" : ""}>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                            <p className="text-blue-400 font-medium">{role.title}</p>
                            <p className="text-sm text-slate-500">{role.dates}</p>
                          </div>
                          <ul className="space-y-2">
                            {role.bullets.map((bullet, k) => (
                              <li key={k} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                                <span className="text-blue-400/60 mt-1.5 shrink-0">▸</span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
