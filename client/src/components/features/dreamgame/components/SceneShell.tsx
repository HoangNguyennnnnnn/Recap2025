import { ReactNode, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  /** Top → bottom sky colours. */
  sky: [string, string, string];
  accent: string;
  stars?: number;
  /** Drifting motes: 'dust' | 'petal' | 'snow' | 'none' */
  motes?: 'dust' | 'petal' | 'snow' | 'none';
  /** Extra class for level-specific styling. */
  className?: string;
  vignette?: number;
}

/**
 * Shared backdrop for every level: gradient sky, twinkling stars,
 * drifting motes and a vignette. Levels draw their own SVG scenery
 * on top of this.
 */
const SceneShell = ({
  children, sky, accent, stars = 60, motes = 'dust', className = '', vignette = 0.85,
}: Props) => {
  const starField = useMemo(() =>
    Array.from({ length: stars }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 72,
      size: Math.random() < 0.15 ? 2.6 : Math.random() * 1.4 + 0.7,
      delay: Math.random() * 6,
      dur: 2.4 + Math.random() * 4,
    })), [stars]);

  const moteField = useMemo(() => {
    if (motes === 'none') return [];
    const count = motes === 'petal' ? 14 : motes === 'snow' ? 26 : 18;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: motes === 'petal' ? 6 + Math.random() * 6 : 2 + Math.random() * 3,
      delay: Math.random() * 12,
      dur: (motes === 'snow' ? 14 : 9) + Math.random() * 10,
      drift: (Math.random() - 0.5) * 160,
      rot: Math.random() * 360,
    }));
  }, [motes]);

  return (
    <div
      className={`scene-shell ${className}`}
      style={{
        background: `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} 52%, ${sky[2]} 100%)`,
        ['--accent' as string]: accent,
      }}
    >
      {/* stars */}
      <div className="scene-stars">
        {starField.map(s => (
          <span
            key={s.id}
            className="scene-star"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.size, height: s.size,
              ['--delay' as string]: `${s.delay}s`,
              ['--dur' as string]: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      {/* drifting motes */}
      <div className="scene-motes">
        {moteField.map(m => (
          <motion.span
            key={m.id}
            className={`scene-mote mote-${motes}`}
            style={{ left: `${m.x}%`, width: m.size, height: m.size }}
            initial={{ y: motes === 'dust' ? '105vh' : '-10vh', opacity: 0, rotate: m.rot }}
            animate={{
              y: motes === 'dust' ? '-10vh' : '105vh',
              x: [0, m.drift, m.drift * 0.4],
              opacity: [0, 0.75, 0.75, 0],
              rotate: m.rot + (motes === 'petal' ? 320 : 60),
            }}
            transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* scene content */}
      <div className="scene-content">{children}</div>

      {/* vignette */}
      <div
        className="scene-vignette"
        style={{ opacity: vignette }}
      />
    </div>
  );
};

export default SceneShell;
