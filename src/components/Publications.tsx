"use client";

import { publications } from "@/data/portfolio";
import AnimatedSection from "./AnimatedSection";

export default function Publications() {
  return (
    <div id="publications" className="max-w-5xl mx-auto px-6 py-20">
      <AnimatedSection>
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Publications
        </h2>
      </AnimatedSection>

      <div className="space-y-6">
        {publications.map((pub, i) => (
          <AnimatedSection key={pub.title} delay={i * 0.15}>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {pub.year.slice(-2)}
                </div>
                <div>
                  <h3 className="text-white font-medium leading-snug mb-2">
                    <em>{pub.title}</em>
                  </h3>
                  <p className="text-sm text-slate-400 mb-1">{pub.authors}</p>
                  <span className="inline-block px-3 py-1 text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full">
                    {pub.venue}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
