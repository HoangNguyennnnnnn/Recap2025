const UniverseBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-deep-blue pointer-events-none z-[-1]">
      {/* Deep Space Gradient - pure CSS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,1)_0%,rgba(5,5,10,1)_100%)]" />
      
      {/* Subtle Color Spots for depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.1)_0%,transparent_60%)]" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,215,0,0.05)_0%,transparent_50%)]" />
      
      {/* CSS-only Static Stars */}
      <div 
          className="absolute inset-0 opacity-60"
          style={{
              backgroundImage: `radial-gradient(white 1.5px, transparent 0)`,
              backgroundSize: '50px 50px',
              maskImage: 'linear-gradient(to bottom, white, transparent)' 
          }}
      />
      {/* Secondary Star Layer for density */}
      <div 
          className="absolute inset-0 opacity-30"
          style={{
              backgroundImage: `radial-gradient(white 1px, transparent 0)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '10px 10px'
          }}
      />
    </div>
  );
};

export default UniverseBackground;
