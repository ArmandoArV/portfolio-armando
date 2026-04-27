"use client";

interface Props {
  variant?: "blue" | "purple" | "teal";
}

export default function NebulaDivider({ variant = "blue" }: Props) {
  const colors = {
    blue: {
      from: "from-transparent",
      via: "via-blue-500/[0.07]",
      to: "to-transparent",
      glow: "bg-blue-500/10",
    },
    purple: {
      from: "from-transparent",
      via: "via-indigo-500/[0.07]",
      to: "to-transparent",
      glow: "bg-indigo-500/10",
    },
    teal: {
      from: "from-transparent",
      via: "via-teal-500/[0.05]",
      to: "to-transparent",
      glow: "bg-teal-500/8",
    },
  };

  const c = colors[variant];

  return (
    <div className="relative w-full h-24 overflow-hidden">
      {/* Main gradient band */}
      <div className={`absolute inset-0 bg-gradient-to-r ${c.from} ${c.via} ${c.to}`} />

      {/* Floating nebula blobs */}
      <div
        className={`absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-16 ${c.glow} rounded-full blur-3xl animate-pulse`}
        style={{ animationDuration: "4s" }}
      />
      <div
        className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-12 ${c.glow} rounded-full blur-3xl animate-pulse`}
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />

      {/* Thin center line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
    </div>
  );
}
