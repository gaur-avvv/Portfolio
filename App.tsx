
import React, { useEffect } from 'react';
import { Scene } from './components/3d/Scene';
import { HUD } from './components/ui/HUD';
import { Settings } from './components/ui/Settings';
import { ContentOverlay } from './components/ui/ContentOverlay';
import { CustomCursor } from './components/ui/CustomCursor';
import { ProjectDetailOverlay } from './components/ui/ProjectDetailOverlay';
import { useStore } from './store';

const App: React.FC = () => {
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const fontFamily = useStore((state) => state.fontFamily);
  const textColor = useStore((state) => state.textColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-primary', fontFamily);
    document.documentElement.style.setProperty('--font-display', fontFamily);
    document.body.style.color = textColor;
  }, [fontFamily, textColor]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return (
    <div className="relative min-h-[700vh]">
      <CustomCursor />
      {/* 3D Visuals */}
      <Scene />

      {/* 2D Interface Overlays */}
      <HUD />
      <Settings />
      <ContentOverlay />
      <ProjectDetailOverlay />

      {/* Simple scroll hints */}
      <div className="fixed bottom-12 left-12 pointer-events-none opacity-40 text-[9px] tracking-[0.4em] flex flex-col gap-2 font-sans">
        <div className="w-40 h-[1px] bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${scrollProgress * 100}%` }} 
          />
        </div>
        <span className="text-white/50 uppercase font-medium">Progress Tracker</span>
      </div>
    </div>
  );
};

export default App;
