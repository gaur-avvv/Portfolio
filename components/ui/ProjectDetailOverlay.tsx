import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import { X, ExternalLink, Github } from 'lucide-react';

export const ProjectDetailOverlay: React.FC = () => {
  const activeProject3D = useStore((state) => state.activeProject3D);
  const setActiveProject3D = useStore((state) => state.setActiveProject3D);
  const projects = useStore((state) => state.projects);
  const themeColor = useStore((state) => state.themeColor);
  const textColor = useStore((state) => state.textColor);
  const isHacked = useStore((state) => state.isHacked);

  const [isVisible, setIsVisible] = useState(false);

  // Delay the overlay slightly to let the camera dive happen first
  useEffect(() => {
    if (activeProject3D) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [activeProject3D]);

  const project = projects.find((p) => p.id === activeProject3D);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsVisible(false);
    // Slight delay before zooming camera back out
    setTimeout(() => setActiveProject3D(null), 300);
  };

  return (
    <AnimatePresence>
      {activeProject3D && isVisible && project && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/60 pointer-events-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-black/80 border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row interactive"
            style={{ 
              boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px ${isHacked ? '#ff0000' : themeColor}20` 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-50 interactive pointer-events-auto"
            >
              <X size={24} className="text-white/70 hover:text-white" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 md:hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 hidden md:block" />
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Glitch overlay if hacked */}
              {isHacked && (
                <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay glitch z-20 pointer-events-none" />
              )}
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px]" style={{ backgroundColor: isHacked ? '#ff0000' : themeColor }} />
                <span className="text-xs font-mono tracking-widest uppercase text-white/50">Project Data Stream</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight" style={{ textShadow: isHacked ? '0 0 10px #ff0000' : 'none', color: isHacked ? undefined : textColor }}>
                {project.title}
              </h2>
              
              <p className="text-lg leading-relaxed mb-8 font-light opacity-70" style={{ color: textColor }}>
                {project.description}
              </p>

              <div className="space-y-6 mb-10">
                <div>
                  <h4 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'Three.js', 'WebGL', 'GLSL'].map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs font-mono rounded-full border border-white/10 bg-white/5 text-white/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <a 
                  href="#" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <ExternalLink size={18} />
                  <span>Launch Live</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <Github size={18} />
                  <span>Source Code</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
