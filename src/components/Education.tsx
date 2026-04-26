"use client";

import { education } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

export default function Education() {
  return (
    <div id="education" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Education
        </h2>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6">
        {education.map((edu, i) => (
          <AnimatedSection key={edu.school} delay={i * 0.15}>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300 h-full group">
              <div className="flex items-start justify-between mb-3">
                {edu.logo ? (
                  <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center shrink-0 p-1.5">
                    <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faGraduationCap} className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="text-sm text-slate-400 font-medium">{edu.dates}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {edu.school}
              </h3>
              <p className="text-slate-300 text-sm">{edu.degree}</p>
              {edu.gpa && (
                <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                  GPA: {edu.gpa}
                </span>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
