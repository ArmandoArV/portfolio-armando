export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
      {/* Orbit loader */}
      <div className="relative w-20 h-20">
        {/* Central star */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-[0_0_20px_rgba(96,165,250,0.5)]" />

        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-full border border-slate-700/30" />

        {/* Orbiting planet */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "1.5s" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 shadow-[0_0_10px_rgba(45,212,191,0.4)]" />
        </div>

        {/* Second orbit */}
        <div className="absolute inset-[-10px] rounded-full border border-slate-700/15" />

        {/* Second orbiting body */}
        <div className="absolute inset-[-10px] animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500 tracking-widest uppercase animate-pulse">
        Traversing the cosmos
      </p>
    </div>
  );
}
