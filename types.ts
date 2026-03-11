
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export type SectionType = 'hero' | 'about' | 'projects' | 'experience' | 'contact' | 'custom';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  manifesto: string;
  description: string;
  color?: string;
}

export interface AppState {
  scrollProgress: number;
  userName: string;
  userTitle: string;
  profileImage: string;
  location: string;
  availability: string;
  skills: string[];
  socialLinks: SocialLink[];
  projects: Project[];
  themeColor: string;
  activeColor: string;
  fontFamily: string;
  textColor: string;
  cursorType: 'default' | 'crosshair' | 'minimal' | 'target' | 'scanner' | 'neural' | 'neon' | 'glitch' | 'liquid';
  isHacked: boolean;
  activeProject3D: string | null;
  sections: Section[];
  aiProvider: string;
  apiKeys: Record<string, string>;
  isAiEnabled: boolean;
  setScrollProgress: (progress: number) => void;
  setUserInfo: (name: string, title: string) => void;
  setProfessionalInfo: (profileImage: string, location: string, availability: string, skills: string[], socialLinks: SocialLink[]) => void;
  setProjects: (projects: Project[]) => void;
  setThemeColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setTextColor: (color: string) => void;
  setCursorType: (type: 'default' | 'crosshair' | 'minimal' | 'target' | 'scanner' | 'neural' | 'neon' | 'glitch' | 'liquid') => void;
  setSections: (sections: Section[]) => void;
  toggleHack: () => void;
  setActiveProject3D: (id: string | null) => void;
  setAiProvider: (provider: string) => void;
  setApiKey: (provider: string, key: string) => void;
  toggleAiEnabled: () => void;
  triggerGlitch: () => void;
}
