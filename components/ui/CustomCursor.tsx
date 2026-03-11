import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useStore } from '../../store';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const themeColor = useStore(state => state.themeColor);
  const textColor = useStore(state => state.textColor);
  const cursorType = useStore(state => state.cursorType);
  const isHacked = useStore(state => state.isHacked);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring physics for the outer ring to create a smooth trailing effect
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const renderCursorContent = () => {
    switch (cursorType) {
      case 'minimal':
        return (
          <div 
            className="w-full h-full border-[1px] transition-all duration-300 rounded-full"
            style={{ 
              borderColor: isHovering ? themeColor : 'rgba(255,255,255,0.2)',
              backgroundColor: isHovering ? `${themeColor}20` : 'transparent'
            }}
          />
        );
      case 'crosshair':
        return (
          <div className="w-full h-full relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20" />
            <div 
              className="absolute inset-0 border border-white/10 rounded-sm"
              style={{ borderColor: isHovering ? themeColor : undefined }}
            />
          </div>
        );
      case 'target':
        return (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 border border-white/20 rounded-full" />
            <div className="absolute inset-2 border border-white/10 rounded-full border-dashed animate-spin-slow" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white/40" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white/40" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-white/40" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-white/40" />
            {isHovering && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 border-2 rounded-full"
                style={{ borderColor: themeColor }}
              />
            )}
          </div>
        );
      case 'scanner':
        return (
          <div className="w-full h-full relative overflow-hidden border border-white/10 rounded-sm">
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              style={{ backgroundColor: isHovering ? themeColor : undefined }}
            />
            <div className="absolute inset-0 bg-white/[0.02]" />
          </div>
        );
      case 'neural':
        return (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 border border-white/10 rounded-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.6,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 border border-white/20 rounded-full"
                style={{ borderColor: isHovering ? themeColor : undefined }}
              />
            ))}
          </div>
        );
      case 'neon':
        return (
          <div className="w-full h-full relative">
            <motion.div 
              animate={{ 
                boxShadow: [
                  `0 0 10px ${themeColor}`,
                  `0 0 30px ${themeColor}`,
                  `0 0 10px ${themeColor}`
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border-2 rounded-full"
              style={{ borderColor: themeColor }}
            />
            <div className="absolute inset-0 bg-white/5 rounded-full backdrop-blur-[1px]" />
          </div>
        );
      case 'glitch':
        return (
          <div className="w-full h-full relative">
            <motion.div 
              animate={{ 
                x: isHovering ? [-2, 2, -1, 0] : 0,
                y: isHovering ? [1, -1, 2, 0] : 0,
                skewX: isHovering ? [0, 10, -5, 0] : 0,
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute inset-0 border border-white/40"
              style={{ borderColor: isHovering ? themeColor : undefined }}
            />
            <motion.div 
              animate={{ 
                opacity: isHovering ? [0.2, 0.8, 0.4] : 0.2,
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/20 mix-blend-screen"
            />
            <motion.div 
              animate={{ 
                opacity: isHovering ? [0.2, 0.8, 0.4] : 0.2,
              }}
              transition={{ duration: 0.1, repeat: Infinity, delay: 0.05 }}
              className="absolute inset-0 bg-blue-500/20 mix-blend-screen"
            />
          </div>
        );
      case 'liquid':
        return (
          <div className="w-full h-full relative">
            <motion.div 
              animate={{ 
                borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 70%", "60% 40% 30% 70% / 50% 60% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 70%"],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-white/30 bg-white/5"
              style={{ borderColor: isHovering ? themeColor : undefined }}
            />
            {isHovering && (
              <motion.div 
                layoutId="liquid-inner"
                className="absolute inset-2 rounded-full blur-sm"
                style={{ backgroundColor: themeColor }}
              />
            )}
          </div>
        );
      default:
        return (
          <div 
            className="w-full h-full border-[1px] transition-all duration-300 relative"
            style={{ 
              borderColor: isHovering ? themeColor : 'rgba(255,255,255,0.4)',
              boxShadow: isHovering 
                ? `0 0 20px ${themeColor}80, inset 0 0 15px ${themeColor}60` 
                : `0 0 10px rgba(255,255,255,0.2)`,
              borderRadius: isHovering ? '4px' : '50%',
              backgroundColor: isHovering ? `${themeColor}10` : 'transparent'
            }}
          >
            {/* Crosshair ticks */}
            <motion.div 
              className="absolute top-1/2 -left-3 w-4 h-[1px] transition-all duration-300" 
              style={{ 
                backgroundColor: isHovering ? themeColor : 'rgba(255,255,255,0.6)',
                boxShadow: isHovering ? `0 0 8px ${themeColor}` : 'none'
              }}
            />
            <motion.div 
              className="absolute top-1/2 -right-3 w-4 h-[1px] transition-all duration-300" 
              style={{ 
                backgroundColor: isHovering ? themeColor : 'rgba(255,255,255,0.6)',
                boxShadow: isHovering ? `0 0 8px ${themeColor}` : 'none'
              }}
            />
            <motion.div 
              className="absolute -top-3 left-1/2 w-[1px] h-4 transition-all duration-300" 
              style={{ 
                backgroundColor: isHovering ? themeColor : 'rgba(255,255,255,0.6)',
                boxShadow: isHovering ? `0 0 8px ${themeColor}` : 'none'
              }}
            />
            <motion.div 
              className="absolute -bottom-3 left-1/2 w-[1px] h-4 transition-all duration-300" 
              style={{ 
                backgroundColor: isHovering ? themeColor : 'rgba(255,255,255,0.6)',
                boxShadow: isHovering ? `0 0 8px ${themeColor}` : 'none'
              }}
            />
          </div>
        );
    }
  };

  return (
    <>
      {/* Center Dot (Instant tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: textColor
        }}
        animate={{
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Outer Tech-Noir Crosshair (Spring tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : (isHacked ? Math.random() * 20 - 10 : 0),
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {renderCursorContent()}
      </motion.div>
    </>
  );
};
