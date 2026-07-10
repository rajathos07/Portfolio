import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * ThreeDCard Component
 * Wraps children with a dynamic 3D perspective mouse-tracking tilt effect using Framer Motion.
 */
export default function ThreeDCard({ children, className = "", isPeriwinkle = false }) {
  // Normalize cursor positions between 0 and 1
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Maps mouse coordinates to rotation values (tilt range +/- 8 degrees)
  const tiltX = useTransform(y, [0, 1], [8, -8]);
  const tiltY = useTransform(x, [0, 1], [-8, 8]);

  // Apply a smooth spring transition to the rotation coordinates
  const rotateX = useSpring(tiltX, { damping: 25, stiffness: 220 });
  const rotateY = useSpring(tiltY, { damping: 25, stiffness: 220 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    // Reset back to center when mouse departs
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      className={`perspective-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        display: 'flex'
      }}
    >
      <motion.div
        className={`dashboard-card-3d ${isPeriwinkle ? 'periwinkle-card' : ''}`}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Child items wrapped inside 3D preserve context */}
        <div style={{ transform: 'translateZ(20px)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
