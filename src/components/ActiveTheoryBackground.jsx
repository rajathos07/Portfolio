import React, { useEffect, useState, useRef } from 'react';

/**
 * ActiveTheoryBackground Component
 * Renders a fixed full-screen SVG 3D wireframe sphere portal and particle constellation
 * that responds dynamically to page scroll values.
 */
export default function ActiveTheoryBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const timeRef = useRef(0);
  const [tick, setTick] = useState(0);

  // Track window size and page scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Initial size
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Infinite clock ticks for autonomous rotation animation
  useEffect(() => {
    let animId;
    const update = () => {
      timeRef.current += 0.03;
      setTick(timeRef.current);
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 1. Generate 3D sphere vertices (latitude & longitude)
  const spherePoints = [];
  const sphereEdges = [];
  const latBands = 6;
  const lonBands = 8;
  const radius = 180;

  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon < lonBands; lon++) {
      const phi = (lon * 2 * Math.PI) / lonBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const x = cosPhi * sinTheta;
      const y = cosTheta;
      const z = sinPhi * sinTheta;

      spherePoints.push({ x: x * radius, y: y * radius, z: z * radius });
    }
  }

  // Connect sphere edges
  for (let lat = 0; lat < latBands; lat++) {
    for (let lon = 0; lon < lonBands; lon++) {
      const current = lat * lonBands + lon;
      const nextLon = lat * lonBands + ((lon + 1) % lonBands);
      const nextLat = (lat + 1) * lonBands + lon;

      // Longitude rings
      sphereEdges.push([current, nextLon]);
      // Latitude arches
      if (lat < latBands) {
        sphereEdges.push([current, nextLat]);
      }
    }
  }

  // 2. Static random stars (constellation background)
  const starCount = 60;
  const starsRef = useRef([]);
  if (starsRef.current.length === 0) {
    for (let i = 0; i < starCount; i++) {
      starsRef.current.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 400,
        size: Math.random() * 1.5 + 0.5,
      });
    }
  }

  // Calculate dynamic rotation angle based on Time + Scroll position
  const angleX = tick * 0.15 + scrollY * 0.0018;
  const angleY = tick * 0.25 + scrollY * 0.0025;
  const angleZ = tick * 0.05;

  // Zoom/Scale factor changes on page scroll
  const scrollRatio = Math.min(scrollY / 1500, 1); // Clamp to 1 max
  const scale = 1.0 + scrollRatio * 0.45; // Grow by up to 45% on scroll
  
  // Center coordinates: Shift visual side-to-side on scroll (Active Theory style layout asymmetry)
  const centerX = windowSize.width / 2 + (scrollRatio * windowSize.width * 0.18);
  const centerY = windowSize.height / 2 - (scrollRatio * windowSize.height * 0.08);

  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const cosZ = Math.cos(angleZ);
  const sinZ = Math.sin(angleZ);

  // Projected 3D point converter function
  const project = (p) => {
    // 3D rotations
    // Rot X
    let y1 = p.y * cosX - p.z * sinX;
    let z1 = p.y * sinX + p.z * cosX;

    // Rot Y
    let x2 = p.x * cosY + z1 * sinY;
    let z2 = -p.x * sinY + z1 * cosY;

    // Rot Z
    let x3 = x2 * cosZ - y1 * sinZ;
    let y3 = x2 * sinZ + y1 * cosZ;

    // Apply scale & translate
    const distance = 4.0;
    const depth = distance - (z2 / 300);
    const px = centerX + (x3 * scale) / depth;
    const py = centerY + (y3 * scale) / depth;

    return { x: px, y: py, depth: z2 };
  };

  // Convert points
  const projectedPoints = spherePoints.map(p => project(p));
  const projectedStars = starsRef.current.map(p => project(p));

  return (
    <div className="fixed-cosmic-canvas">
      <svg width={windowSize.width} height={windowSize.height} style={{ overflow: 'visible' }}>
        <defs>
          {/* Cyan to Magenta gradient glow for wireframe emblem */}
          <linearGradient id="portal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00b3dd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#dd90d8" stopOpacity="0.8" />
          </linearGradient>

          {/* Floating background Aurora Wash */}
          <radialGradient id="aurora-glow" cx="20%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#847dff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00b3dd" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          
          <filter id="blur-filter">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>

        {/* Floating Atmospheric Aurora Wash */}
        <rect
          x="0"
          y="0"
          width={windowSize.width}
          height={windowSize.height}
          fill="url(#aurora-glow)"
          filter="url(#blur-filter)"
        />

        {/* Ambient Portal Outer Rims (Glitch wireframe rings) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * scale * 1.25}
          stroke="url(#portal-gradient)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.12"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * scale * 1.45}
          stroke="#343755"
          strokeWidth="0.4"
          fill="none"
          opacity="0.25"
        />

        {/* Ambient star particle field */}
        {projectedStars.map((s, idx) => (
          <circle
            key={`star-${idx}`}
            cx={s.x}
            cy={s.y}
            r={s.size * (s.depth > 0 ? 1.4 : 0.7)}
            fill="#ffffff"
            opacity={s.depth > 0 ? 0.35 : 0.15}
          />
        ))}

        {/* 3D Sphere Edge Lines */}
        {sphereEdges.map(([p1, p2], idx) => {
          const pt1 = projectedPoints[p1];
          const pt2 = projectedPoints[p2];
          // Simple depth sorting to make back lines thinner
          const avgDepth = (pt1.depth + pt2.depth) / 2;
          const isFront = avgDepth > 0;

          return (
            <line
              key={`edge-${idx}`}
              x1={pt1.x}
              y1={pt1.y}
              x2={pt2.x}
              y2={pt2.y}
              stroke="var(--color-ash-border)"
              strokeWidth={isFront ? "0.85" : "0.35"}
              opacity={isFront ? "0.45" : "0.15"}
            />
          );
        })}

        {/* 3D Sphere Highlight Nodes */}
        {projectedPoints.map((pt, idx) => {
          const isFront = pt.depth > 0;
          if (!isFront) return null; // Only draw front nodes for visual clarity

          return (
            <circle
              key={`node-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="2.2"
              fill="var(--color-ghost-white)"
              opacity="0.85"
            />
          );
        })}
      </svg>
    </div>
  );
}
