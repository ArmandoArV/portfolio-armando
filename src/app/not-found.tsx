import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-200/40 animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Floating astronaut */}
        <div className="text-8xl mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
          🧑‍🚀
        </div>

        <h1 className="text-7xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        <h2 className="text-2xl text-slate-300 mb-2 font-medium">
          Lost in Space
        </h2>

        <p className="text-slate-500 mb-8 max-w-md">
          This page has drifted beyond the observable universe.
          Let&apos;s navigate you back to familiar coordinates.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
          Return Home
        </Link>
      </div>

      {/* Floating debris */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-600 rounded-sm animate-spin opacity-30" style={{ animationDuration: "8s" }} />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-slate-600 rounded-sm animate-spin opacity-20" style={{ animationDuration: "12s" }} />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-3 bg-slate-700 rounded-sm animate-spin opacity-20" style={{ animationDuration: "15s" }} />
    </div>
  );
}
