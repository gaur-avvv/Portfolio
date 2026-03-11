
import { create } from 'zustand';
import { AppState } from './types';
import { db } from './src/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const useStore = create<AppState>((set, get) => {
  // Initialize persistence
  const settingsRef = doc(db, 'settings', 'global');
  
  // Load initial settings
  getDoc(settingsRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      set((state) => ({ ...state, ...data }));
    }
  });

  // Listen for real-time updates
  onSnapshot(settingsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      set((state) => ({ ...state, ...data }));
    }
  });

  return {
  scrollProgress: 0,
  userName: 'Gaurav Singh',
  userTitle: 'Full-Stack Developer & 3D Artist',
  profileImage: 'https://picsum.photos/seed/avatar/400/400',
  location: 'San Francisco, CA',
  availability: 'Available for new opportunities',
  skills: ['React', 'TypeScript', 'Three.js', 'Node.js', 'WebGL', 'Tailwind CSS'],
  socialLinks: [
    { id: '1', platform: 'GitHub', url: 'https://github.com' },
    { id: '2', platform: 'LinkedIn', url: 'https://linkedin.com' },
    { id: '3', platform: 'Twitter', url: 'https://twitter.com' },
    { id: '4', platform: 'Email', url: 'mailto:g.singh200293@gmail.com' },
  ],
  themeColor: '#3b82f6', // Default blue-500
  activeColor: '#3b82f6',
  fontFamily: 'Inter',
  textColor: '#ffffff',
  cursorType: 'default',
  isHacked: false,
  activeProject3D: null,
  aiProvider: 'gemini',
  apiKeys: {},
  isAiEnabled: true,
  sections: [
    {
      id: 'hero',
      type: 'hero',
      title: 'Introduction',
      manifesto: 'Crafting digital experiences at the intersection of design and engineering.',
      description: 'Creative Technologist specializing in immersive web applications.',
      color: '#3b82f6',
    },
    {
      id: 'about',
      type: 'about',
      title: 'The Core',
      manifesto: 'Bridging the gap between complex logic and intuitive interaction.',
      description: 'Expertise in React, Three.js, and modern full-stack architectures.',
      color: '#06b6d4',
    },
    {
      id: 'projects',
      type: 'projects',
      title: 'Portfolio',
      manifesto: 'A selection of featured technical explorations.',
      description: 'Each project represents a unique challenge in creative engineering.',
      color: '#8b5cf6',
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Experience',
      manifesto: 'Delivering high-impact digital products.',
      description: 'From architectural visualization to enterprise-grade platforms.',
      color: '#ec4899',
    },
    {
      id: 'contact',
      type: 'contact',
      title: 'Contact',
      manifesto: 'Let’s collaborate on your next vision.',
      description: 'Available for select projects and technical consulting.',
      color: '#f59e0b',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Project Alpha',
      description: 'A high-performance 3D engine built with Three.js.',
      imageUrl: 'https://picsum.photos/seed/tech1/800/1200',
    },
    {
      id: '2',
      title: 'Project Beta',
      description: 'An AI-driven data visualization platform.',
      imageUrl: 'https://picsum.photos/seed/tech2/800/1200',
    },
    {
      id: '3',
      title: 'Project Gamma',
      description: 'Immersive VR experience for architectural visualization.',
      imageUrl: 'https://picsum.photos/seed/tech3/800/1200',
    },
  ],
  setScrollProgress: (progress) => set((state) => {
    // Calculate active color based on sections
    let activeColor = state.themeColor;
    if (state.sections.length > 0) {
      const sectionSize = 1 / state.sections.length;
      const index = Math.min(Math.floor(progress / sectionSize), state.sections.length - 1);
      const nextIndex = Math.min(index + 1, state.sections.length - 1);
      const factor = (progress % sectionSize) / sectionSize;
      
      const color1 = state.sections[index].color || state.themeColor;
      const color2 = state.sections[nextIndex].color || state.themeColor;
      
      // Simple linear interpolation for hex colors
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };
      const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
      };
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const r = rgb1.r + factor * (rgb2.r - rgb1.r);
      const g = rgb1.g + factor * (rgb2.g - rgb1.g);
      const b = rgb1.b + factor * (rgb2.b - rgb1.b);
      activeColor = rgbToHex(r, g, b);
    }

    return { scrollProgress: progress, activeColor };
  }),
  setUserInfo: (name, title) => {
    set({ userName: name, userTitle: title });
    setDoc(settingsRef, { userName: name, userTitle: title }, { merge: true });
  },
  setProfessionalInfo: (profileImage, location, availability, skills, socialLinks) => {
    set({ profileImage, location, availability, skills, socialLinks });
    setDoc(settingsRef, { profileImage, location, availability, skills, socialLinks }, { merge: true });
  },
  setProjects: (projects) => {
    set({ projects });
    setDoc(settingsRef, { projects }, { merge: true });
  },
  setThemeColor: (color) => {
    set({ themeColor: color });
    setDoc(settingsRef, { themeColor: color }, { merge: true });
  },
  setFontFamily: (font) => {
    set({ fontFamily: font });
    setDoc(settingsRef, { fontFamily: font }, { merge: true });
  },
  setTextColor: (color) => {
    set({ textColor: color });
    setDoc(settingsRef, { textColor: color }, { merge: true });
  },
  setCursorType: (type) => {
    set({ cursorType: type });
    setDoc(settingsRef, { cursorType: type }, { merge: true });
  },
  setSections: (sections) => {
    set({ sections });
    setDoc(settingsRef, { sections }, { merge: true });
  },
  toggleHack: () => set((state) => ({ 
    isHacked: !state.isHacked,
    themeColor: !state.isHacked ? '#00ffcc' : '#3b82f6'
  })),
  triggerGlitch: () => {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const state = get();
    const originalName = state.userName;
    const scrambledName = originalName.split('').sort(() => Math.random() - 0.5).join('');
    
    set({
      themeColor: randomColor,
      isHacked: Math.random() > 0.5 ? !state.isHacked : state.isHacked,
      userName: scrambledName,
    });
    
    setTimeout(() => {
      set({ userName: originalName });
    }, 500);
    
    // Trigger random visual effects
    const effects = ['glitch-shake', 'glitch-invert', 'glitch-rotate', 'glitch-font'];
    const activeEffects = effects.filter(() => Math.random() > 0.5);
    
    activeEffects.forEach(effect => document.body.classList.add(effect));
    
    setTimeout(() => {
      activeEffects.forEach(effect => document.body.classList.remove(effect));
    }, 500);
  },
  setActiveProject3D: (id) => set({ activeProject3D: id }),
  setAiProvider: (provider) => set({ aiProvider: provider }),
  setApiKey: (provider, key) => set((state) => ({ apiKeys: { ...state.apiKeys, [provider]: key } })),
  toggleAiEnabled: () => set((state) => ({ isAiEnabled: !state.isAiEnabled })),
  }
});

