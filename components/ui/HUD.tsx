import React, { useEffect, useState } from 'react';
import { useStore } from '../../store';

const HackedConsole: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines(prev => {
        const newLine = `[${new Date().toISOString()}] ERR_SYS_OVERRIDE: 0x${Math.random().toString(16).substring(2, 8).toUpperCase()} - SECURITY BREACH DETECTED`;
        const next = [...prev, newLine];
        if (next.length > 20) next.shift();
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0 flex flex-col justify-end p-8">
      {lines.map((line, i) => (
        <div key={i} className="text-red-500 font-mono text-[10px] whitespace-nowrap">
          {line}
        </div>
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={`float-${i}`} 
          className="absolute text-red-500 font-mono text-xs whitespace-nowrap opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export const HUD: React.FC = () => {
  const { userName, userTitle, themeColor, textColor, toggleHack, triggerGlitch, isHacked } = useStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 font-sans">
      {isHacked && <HackedConsole />}
      {/* Header */}
      <div className="flex justify-between items-start relative z-10">
        <div className="pl-6 py-2" style={{ borderLeft: `1px solid ${themeColor}80` }}>
          <h1 
            className={`interactive text-2xl font-display font-semibold tracking-tight uppercase pointer-events-auto cursor-pointer transition-all duration-300 ${isHacked ? 'text-red-500 animate-pulse glitch' : 'hover:text-white/80'}`}
            onClick={() => {
              toggleHack();
              triggerGlitch();
            }}
            style={{ 
              textShadow: isHacked ? `0 0 10px ${themeColor}` : 'none',
              color: isHacked ? undefined : textColor
            }}
          >
            {userName}
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] mt-1 transition-colors duration-300" style={{ color: themeColor }}>
            {isHacked ? 'SYSTEM COMPROMISED' : userTitle}
          </p>
        </div>
      </div>

      {/* Footer Instructions / CTA - Removed for professional look */}
      <div className="flex flex-col items-center mb-12">
        {/* Empty space for balance */}
      </div>

      {/* Grid Overlay lines - Subtler */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none border-[1px] border-blue-900/30 grid grid-cols-12 grid-rows-12">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-blue-900/10 relative">
             {i % 17 === 0 && <div className="absolute top-0 left-0 w-1 h-1 bg-blue-500/20" />}
          </div>
        ))}
      </div>
    </div>
  );
};