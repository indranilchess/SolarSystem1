import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  name: string;
  radius: number; // visual radius in pixels
  orbitRadius: number; // visual orbit radius in pixels
  color: string;
  realDiameter: string; // km
  realDistance: string; // million km from Sun
  orbitalPeriod: string; // Earth days/years
  angle: number; // current angle in radians
  speed: number; // radians per frame at 1x speed
  ringColor?: string;
  hasRing?: boolean;
}

const PLANETS_DATA: Planet[] = [
  {
    name: 'Mercury',
    radius: 4,
    orbitRadius: 60,
    color: '#b5b5b5',
    realDiameter: '4,879 km',
    realDistance: '57.9 million km',
    orbitalPeriod: '88 days',
    angle: Math.random() * Math.PI * 2,
    speed: 0.04,
  },
  {
    name: 'Venus',
    radius: 7,
    orbitRadius: 95,
    color: '#e8cda0',
    realDiameter: '12,104 km',
    realDistance: '108.2 million km',
    orbitalPeriod: '225 days',
    angle: Math.random() * Math.PI * 2,
    speed: 0.015,
  },
  {
    name: 'Earth',
    radius: 8,
    orbitRadius: 135,
    color: '#4b9cd3',
    realDiameter: '12,756 km',
    realDistance: '149.6 million km',
    orbitalPeriod: '365.25 days',
    angle: Math.random() * Math.PI * 2,
    speed: 0.01,
  },
  {
    name: 'Mars',
    radius: 5,
    orbitRadius: 175,
    color: '#e27b58',
    realDiameter: '6,792 km',
    realDistance: '227.9 million km',
    orbitalPeriod: '687 days',
    angle: Math.random() * Math.PI * 2,
    speed: 0.008,
  },
  {
    name: 'Jupiter',
    radius: 18,
    orbitRadius: 240,
    color: '#c88b3a',
    realDiameter: '142,984 km',
    realDistance: '778.6 million km',
    orbitalPeriod: '11.86 years',
    angle: Math.random() * Math.PI * 2,
    speed: 0.004,
  },
  {
    name: 'Saturn',
    radius: 15,
    orbitRadius: 310,
    color: '#e8d5a3',
    realDiameter: '120,536 km',
    realDistance: '1,433.5 million km',
    orbitalPeriod: '29.46 years',
    angle: Math.random() * Math.PI * 2,
    speed: 0.003,
    hasRing: true,
    ringColor: '#c4a96a',
  },
  {
    name: 'Uranus',
    radius: 11,
    orbitRadius: 375,
    color: '#7ec8e3',
    realDiameter: '51,118 km',
    realDistance: '2,872.5 million km',
    orbitalPeriod: '84.01 years',
    angle: Math.random() * Math.PI * 2,
    speed: 0.002,
  },
  {
    name: 'Neptune',
    radius: 10,
    orbitRadius: 430,
    color: '#4b70dd',
    realDiameter: '49,528 km',
    realDistance: '4,495.1 million km',
    orbitalPeriod: '164.8 years',
    angle: Math.random() * Math.PI * 2,
    speed: 0.001,
  },
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<Planet[]>(PLANETS_DATA.map(p => ({ ...p })));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const drawStar = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`;
    ctx.fill();
  }, []);

  const starsRef = useRef<{ x: number; y: number; size: number }[]>([]);

  const generateStars = useCallback((width: number, height: number) => {
    const stars = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
      });
    }
    starsRef.current = stars;
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    starsRef.current.forEach(star => {
      drawStar(ctx, star.x, star.y, star.size);
    });

    // Draw orbital paths
    planetsRef.current.forEach(planet => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffdd00');
    sunGradient.addColorStop(0.7, '#ff8c00');
    sunGradient.addColorStop(1, '#ff4500');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 55);
    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planetsRef.current.forEach(planet => {
      const x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const y = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Planet shadow/glow
      const planetGlow = ctx.createRadialGradient(x, y, planet.radius * 0.8, x, y, planet.radius * 1.5);
      planetGlow.addColorStop(0, planet.color);
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Planet body
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();

      // Highlight
      const highlight = ctx.createRadialGradient(
        x - planet.radius * 0.3,
        y - planet.radius * 0.3,
        0,
        x,
        y,
        planet.radius
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      highlight.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      // Saturn's ring
      if (planet.hasRing) {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius * 2, planet.radius * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = planet.ringColor || '#c4a96a';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Planet name label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '11px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, x, y + planet.radius + 14);
    });
  }, [drawStar]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (isPlayingRef.current) {
      planetsRef.current.forEach(planet => {
        planet.angle += planet.speed * speedRef.current;
      });
    }

    draw(ctx, width, height);
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, generateStars]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let found = false;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);

      if (dist <= planet.radius + 8) {
        setSelectedPlanet({ ...planet });
        found = true;
        break;
      }
    }

    if (!found) {
      setSelectedPlanet(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let hovered: string | null = null;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((mouseX - px) ** 2 + (mouseY - py) ** 2);

      if (dist <= planet.radius + 8) {
        hovered = planet.name;
        break;
      }
    }
    setHoveredPlanet(hovered);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        style={{ cursor: hoveredPlanet ? 'pointer' : 'default' }}
      />

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          🌌 Interactive Solar System
        </h1>
        <p className="text-sm text-gray-400 mt-1">Click on a planet to learn more</p>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 md:right-8 w-72 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-2xl z-20 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shadow-lg"
                style={{ backgroundColor: selectedPlanet.color }}
              />
              <h2 className="text-xl font-bold text-white">{selectedPlanet.name}</h2>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-gray-400 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Diameter</p>
              <p className="text-white font-semibold text-lg">{selectedPlanet.realDiameter}</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Distance from Sun</p>
              <p className="text-white font-semibold text-lg">{selectedPlanet.realDistance}</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Orbital Period</p>
              <p className="text-white font-semibold text-lg">{selectedPlanet.orbitalPeriod}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-full px-6 py-3 shadow-2xl z-20">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white shadow-lg"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Speed:</span>
          <button
            onClick={() => setSpeed(Math.max(0.25, speed - 0.25))}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
            disabled={speed <= 0.25}
          >
            −
          </button>
          <span className="text-white font-mono text-sm w-12 text-center">
            {speed}x
          </span>
          <button
            onClick={() => setSpeed(Math.min(5, speed + 0.25))}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
            disabled={speed >= 5}
          >
            +
          </button>
        </div>

        {/* Speed presets */}
        <div className="flex gap-1 ml-2">
          {[0.5, 1, 2, 5].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                speed === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Planet Legend */}
      <div className="absolute bottom-24 left-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 z-10 hidden md:block">
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Planets</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {PLANETS_DATA.map(planet => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet({ ...planet })}
              className="flex items-center gap-2 text-left hover:bg-gray-700/50 rounded px-1 py-0.5 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: planet.color }}
              />
              <span className="text-xs text-gray-300">{planet.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
