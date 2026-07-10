import React, { useEffect, useRef, useState } from 'react';

/**
 * ThreeDWireframe Component
 * Renders an interactive 3D wireframe cube using pure React, math, and SVG.
 * Rotates automatically and reacts to user mouse movements.
 */
export default function ThreeDWireframe() {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5, z: 0.1 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isHovered = useRef(false);

  // 3D coordinates of a cube's 8 vertices
  const vertices = [
    { x: -1, y: -1, z: -1 }, // 0
    { x: 1, y: -1, z: -1 },  // 1
    { x: 1, y: 1, z: -1 },   // 2
    { x: -1, y: 1, z: -1 },  // 3
    { x: -1, y: -1, z: 1 },  // 4
    { x: 1, y: -1, z: 1 },   // 5
    { x: 1, y: 1, z: 1 },    // 6
    { x: -1, y: 1, z: 1 },   // 7
  ];

  // Cube's 12 edges connecting the vertices index numbers
  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0], // Back face
    [4, 5], [5, 6], [6, 7], [7, 4], // Front face
    [0, 4], [1, 5], [2, 6], [3, 7]  // Connector lines
  ];

  useEffect(() => {
    let animationId;
    
    const animate = () => {
      setRotation(prev => {
        // Slow auto-rotation offset
        let dx = 0.006;
        let dy = 0.008;

        // If user is hovering, skew rotation speed towards mouse position
        if (isHovered.current) {
          dx = mousePos.y * 0.03;
          dy = mousePos.x * 0.03;
        }

        return {
          x: prev.x + dx,
          y: prev.y + dy,
          z: prev.z + 0.003
        };
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [mousePos]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) - 0.5; // range -0.5 to 0.5
    const y = ((e.clientY - rect.top) / rect.height) - 0.5; // range -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    setMousePos({ x: 0, y: 0 });
  };

  // Projection math: 3D vertices -> 2D screen coordinates
  const scale = 50; // Size factor
  const distance = 3.2; // Camera perspective distance
  const width = 140;
  const height = 140;

  // Rotate vertices around 3D axes
  const projectedVertices = vertices.map(v => {
    // Rotate X
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    let y1 = v.y * cosX - v.z * sinX;
    let z1 = v.y * sinX + v.z * cosX;

    // Rotate Y
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    let x2 = v.x * cosY + z1 * sinY;
    let z2 = -v.x * sinY + z1 * cosY;

    // Rotate Z
    const cosZ = Math.cos(rotation.z);
    const sinZ = Math.sin(rotation.z);
    let x3 = x2 * cosZ - y1 * sinZ;
    let y3 = x2 * sinZ + y1 * cosZ;

    // Perspective projection formula
    const depth = distance - z2;
    const sx = width / 2 + (x3 * scale) / depth;
    const sy = height / 2 + (y3 * scale) / depth;

    return { x: sx, y: sy };
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '140px',
        height: '140px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Draw edges as lines */}
        {edges.map(([p1, p2], idx) => (
          <line
            key={idx}
            x1={projectedVertices[p1].x}
            y1={projectedVertices[p1].y}
            x2={projectedVertices[p2].x}
            y2={projectedVertices[p2].y}
            stroke="var(--color-lake-blue)"
            strokeWidth="1.2"
            opacity="0.8"
          />
        ))}

        {/* Draw vertex points */}
        {projectedVertices.map((v, idx) => (
          <circle
            key={idx}
            cx={v.x}
            cy={v.y}
            r="3"
            fill="var(--color-off-black)"
          />
        ))}
      </svg>
    </div>
  );
}
