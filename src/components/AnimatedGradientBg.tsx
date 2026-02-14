export default function AnimatedGradientBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated flowing gradient blobs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(25 95% 55% / 0.6), transparent 70%)",
          top: "-20%",
          left: "-10%",
          animation: "floatBlob1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(270 80% 65% / 0.6), transparent 70%)",
          top: "10%",
          right: "-15%",
          animation: "floatBlob2 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10 blur-[80px]"
        style={{
          background: "radial-gradient(circle, hsl(330 80% 60% / 0.5), transparent 70%)",
          bottom: "0%",
          left: "30%",
          animation: "floatBlob3 10s ease-in-out infinite",
        }}
      />

      {/* Subtle grid/dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(0 0% 100%) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Fade edges */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to right, hsl(0 0% 0%) 0%, transparent 15%, transparent 85%, hsl(0 0% 0%) 100%)"
      }} />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, transparent 60%, hsl(0 0% 0%) 100%)"
      }} />

      <style>{`
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, 40px) scale(1.1); }
          66% { transform: translate(-40px, 60px) scale(0.95); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 50px) scale(1.05); }
          66% { transform: translate(40px, -30px) scale(0.9); }
        }
        @keyframes floatBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}