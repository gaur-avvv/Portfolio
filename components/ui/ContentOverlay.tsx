import React from 'react';
import { useStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';

export const ContentOverlay: React.FC = () => {
  const { scrollProgress, projects, sections: storeSections, themeColor, textColor, profileImage, location, availability, skills, socialLinks, setActiveProject3D } = useStore();

  const sections = storeSections.map((s, index) => {
    const sectionSize = 1 / storeSections.length;
    return {
      ...s,
      range: [index * sectionSize, (index + 1) * sectionSize]
    };
  });

  const activeSection = sections.find(
    (s) => scrollProgress >= s.range[0] && scrollProgress < s.range[1]
  ) || sections[sections.length - 1];

  const activeColor = activeSection.color || themeColor;

  // Specific project details for the Monolith section
  const projectSection = sections.find(s => s.type === 'projects');
  let activeProject = null;
  let projectIndex = 0;

  if (projectSection && scrollProgress >= projectSection.range[0] && scrollProgress < projectSection.range[1]) {
    const sectionProgress = (scrollProgress - projectSection.range[0]) / (projectSection.range[1] - projectSection.range[0]);
    projectIndex = Math.min(
      Math.floor(sectionProgress * projects.length),
      projects.length - 1
    );
    activeProject = projects[projectIndex];
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center p-12">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 transition-all duration-1000 opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 70%)`
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection.id + (activeSection.type === 'projects' ? projectIndex : '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-center"
        >
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.6em] font-sans font-semibold uppercase" style={{ color: activeColor }}>
              {activeSection.type === 'projects' && activeProject 
                ? `Project ${String(projectIndex + 1).padStart(2, '0')}` 
                : activeSection.title}
            </span>
          </div>
          
          <h2 
            className={`text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight leading-[1.1] ${activeSection.type === 'projects' ? 'pointer-events-auto cursor-pointer hover:text-blue-400 transition-colors' : ''}`}
            style={{ color: textColor }}
            onClick={() => {
              if (activeSection.type === 'projects' && activeProject) {
                setActiveProject3D(activeProject.id);
              }
            }}
          >
            {activeSection.type === 'projects' && activeProject 
              ? activeProject.title 
              : activeSection.manifesto}
          </h2>
          
          <p 
            className="font-sans text-sm md:text-base tracking-wide leading-relaxed max-w-xl mx-auto opacity-70"
            style={{ color: textColor }}
          >
            {activeSection.type === 'projects' && activeProject 
              ? activeProject.description 
              : activeSection.description}
          </p>

          {activeSection.type === 'about' && skills.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center gap-3 max-w-lg mx-auto"
            >
              {skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-full border bg-black/50 backdrop-blur-sm"
                  style={{ borderColor: `${activeColor}30`, color: `${activeColor}90` }}
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          )}

          {activeSection.type === 'contact' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 flex flex-wrap gap-4 justify-center pointer-events-auto"
            >
              {socialLinks.map((link) => (
                <a 
                  key={link.id}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:bg-zinc-800 transition-all font-sans text-[11px] font-medium tracking-widest border border-zinc-700 px-8 py-4 rounded-full bg-zinc-900/50 backdrop-blur-sm"
                  style={link.platform.toLowerCase() === 'email' ? { borderColor: `${activeColor}80`, backgroundColor: `${activeColor}1a`, color: textColor } : { color: textColor }}
                >
                  {link.platform.toUpperCase()}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
