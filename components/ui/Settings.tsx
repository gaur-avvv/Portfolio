import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Settings as SettingsIcon, X, Save, User, Briefcase, Plus, Trash2, Image as ImageIcon, Layout, Palette, Volume2, Mic, Wand2, Loader2 } from 'lucide-react';
import { Project, Section, SocialLink } from '../../types';
import { generateImage } from '../../services/geminiService';

export const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    userName, userTitle, setUserInfo, 
    profileImage, location, availability, skills, socialLinks, setProfessionalInfo,
    projects, setProjects,
    themeColor, setThemeColor,
    fontFamily, setFontFamily,
    textColor, setTextColor,
    cursorType, setCursorType,
    sections, setSections,
    aiProvider, apiKeys, isAiEnabled, setAiProvider, setApiKey, toggleAiEnabled
  } = useStore();
  
  const [tempName, setTempName] = useState(userName);
  const [tempTitle, setTempTitle] = useState(userTitle);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempAvailability, setTempAvailability] = useState(availability);
  const [tempSkills, setTempSkills] = useState<string[]>([...skills]);
  const [tempSocialLinks, setTempSocialLinks] = useState<SocialLink[]>([...socialLinks]);
  const [tempProjects, setTempProjects] = useState<Project[]>([...projects]);
  const [tempThemeColor, setTempThemeColor] = useState(themeColor);
  const [tempFontFamily, setTempFontFamily] = useState(fontFamily);
  const [tempTextColor, setTempTextColor] = useState(textColor);
  const [tempCursorType, setTempCursorType] = useState(cursorType);
  const [tempSections, setTempSections] = useState<Section[]>([...sections]);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [generatingProjectIds, setGeneratingProjectIds] = useState<Record<string, boolean>>({});

  const fonts = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Outfit', value: "'Outfit', sans-serif" },
    { name: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
    { name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
    { name: 'Orbitron', value: "'Orbitron', sans-serif" },
    { name: 'Rajdhani', value: "'Rajdhani', sans-serif" },
    { name: 'Syncopate', value: "'Syncopate', sans-serif" },
    { name: 'Michroma', value: "'Michroma', sans-serif" },
    { name: 'Bebas Neue', value: "'Bebas Neue', cursive" },
    { name: 'Exo 2', value: "'Exo 2', sans-serif" },
  ];

  const cursors = [
    { name: 'Default_Link', value: 'default' },
    { name: 'Crosshair_Target', value: 'crosshair' },
    { name: 'Minimal_Dot', value: 'minimal' },
    { name: 'Tactical_Target', value: 'target' },
    { name: 'Data_Scanner', value: 'scanner' },
    { name: 'Neural_Link', value: 'neural' },
    { name: 'Neon_Pulse', value: 'neon' },
    { name: 'Glitch_Core', value: 'glitch' },
    { name: 'Liquid_Void', value: 'liquid' },
  ];

  const handleGenerateProfileImage = async () => {
    setIsGeneratingProfile(true);
    try {
      const prompt = `A highly stylized, tech-noir, cyberpunk avatar for a professional named ${tempName}, who is a ${tempTitle}. The image should be abstract, futuristic, and use a color palette centered around ${tempThemeColor}. No text in the image.`;
      const imageUrl = await generateImage(prompt);
      if (imageUrl) {
        setTempProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Failed to generate profile image:", error);
    } finally {
      setIsGeneratingProfile(false);
    }
  };

  const handleGenerateProjectImage = async (projectId: string, title: string, description: string) => {
    setGeneratingProjectIds(prev => ({ ...prev, [projectId]: true }));
    try {
      const prompt = `A futuristic, abstract, tech-noir representation of a project titled "${title}". Description: ${description}. The image should be highly stylized, cinematic, and use a color palette centered around ${tempThemeColor}. No text in the image.`;
      const imageUrl = await generateImage(prompt);
      if (imageUrl) {
        updateProject(projectId, { imageUrl });
      }
    } catch (error) {
      console.error("Failed to generate project image:", error);
    } finally {
      setGeneratingProjectIds(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Secret Access Shortcut: Alt + S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = () => {
    setUserInfo(tempName, tempTitle);
    setProfessionalInfo(
      tempProfileImage, 
      tempLocation, 
      tempAvailability, 
      tempSkills, 
      tempSocialLinks
    );
    setProjects(tempProjects);
    setThemeColor(tempThemeColor);
    setFontFamily(tempFontFamily);
    setTextColor(tempTextColor);
    setCursorType(tempCursorType);
    setSections(tempSections);
    setIsOpen(false);
  };

  const addSkill = () => setTempSkills([...tempSkills, 'New Skill']);
  const removeSkill = (index: number) => setTempSkills(tempSkills.filter((_, i) => i !== index));
  const updateSkill = (index: number, value: string) => {
    const newSkills = [...tempSkills];
    newSkills[index] = value;
    setTempSkills(newSkills);
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'Platform',
      url: 'https://',
    };
    setTempSocialLinks([...tempSocialLinks, newLink]);
  };
  const removeSocialLink = (id: string) => setTempSocialLinks(tempSocialLinks.filter(l => l.id !== id));
  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setTempSocialLinks(tempSocialLinks.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addSection = () => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'custom',
      title: 'New Section',
      manifesto: 'Section Manifesto',
      description: 'Section Description',
      color: undefined,
    };
    setTempSections([...tempSections, newSection]);
  };
  const removeSection = (id: string) => setTempSections(tempSections.filter(s => s.id !== id));
  const updateSection = (id: string, updates: Partial<Section>) => {
    setTempSections(tempSections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Project',
      description: 'Project description goes here.',
      imageUrl: 'https://picsum.photos/seed/' + Math.random() + '/800/1200',
    };
    setTempProjects([...tempProjects, newProject]);
  };

  const removeProject = (id: string) => {
    setTempProjects(tempProjects.filter(p => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setTempProjects(tempProjects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <>
      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-zinc-950 border border-blue-900/50 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-blue-900/20 bg-blue-950/10 shrink-0">
              <div className="flex items-center gap-3">
                <SettingsIcon size={18} className="text-blue-500" />
                <h2 className="text-blue-100 font-mono tracking-widest text-sm uppercase">System_Configuration</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Identity Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <User size={12} />
                    Identity_Name
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Briefcase size={12} />
                    Designation
                  </label>
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                      <ImageIcon size={12} />
                      Profile_Image_URL
                    </label>
                    <button
                      onClick={handleGenerateProfileImage}
                      disabled={isGeneratingProfile}
                      className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors font-mono disabled:opacity-50"
                    >
                      {isGeneratingProfile ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                      {isGeneratingProfile ? 'Generating...' : 'Generate_AI'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={tempProfileImage}
                    onChange={(e) => setTempProfileImage(e.target.value)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Layout size={12} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Briefcase size={12} />
                    Availability_Status
                  </label>
                  <input
                    type="text"
                    value={tempAvailability}
                    onChange={(e) => setTempAvailability(e.target.value)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                      <Layout size={12} />
                      Skills
                    </label>
                    <button 
                      onClick={addSkill}
                      className="text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
                    >
                      <Plus size={10} /> Add_Skill
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {tempSkills.map((skill, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(idx, e.target.value)}
                          className="flex-1 bg-black border border-blue-900/30 rounded-lg px-3 py-2 text-blue-100 font-mono text-xs focus:outline-none focus:border-blue-500/50"
                        />
                        <button 
                          onClick={() => removeSkill(idx)}
                          className="text-zinc-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <User size={12} />
                    Social_Links
                  </label>
                  <button 
                    onClick={addSocialLink}
                    className="text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
                  >
                    <Plus size={10} /> Add_Link
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {tempSocialLinks.map((link) => (
                    <div key={link.id} className="flex gap-3 items-center bg-zinc-900/30 p-3 rounded-lg border border-blue-900/10">
                      <input
                        type="text"
                        value={link.platform}
                        onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                        placeholder="Platform"
                        className="w-1/3 bg-black border border-blue-900/20 rounded px-3 py-2 text-blue-100 font-mono text-xs focus:outline-none focus:border-blue-500/30"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                        placeholder="URL"
                        className="flex-1 bg-black border border-blue-900/20 rounded px-3 py-2 text-blue-100 font-mono text-xs focus:outline-none focus:border-blue-500/30"
                      />
                      <button 
                        onClick={() => removeSocialLink(link.id)}
                        className="text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferences Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Palette size={12} />
                    Theme_Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={tempThemeColor}
                      onChange={(e) => setTempThemeColor(e.target.value)}
                      className="w-10 h-10 bg-transparent border-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-blue-100/50">{tempThemeColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Palette size={12} />
                    Text_Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={tempTextColor}
                      onChange={(e) => setTempTextColor(e.target.value)}
                      className="w-10 h-10 bg-transparent border-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-blue-100/50">{tempTextColor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Layout size={12} />
                    Font_Family
                  </label>
                  <select
                    value={tempFontFamily}
                    onChange={(e) => setTempFontFamily(e.target.value)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    {fonts.map((font) => (
                      <option key={font.name} value={font.value}>{font.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Layout size={12} />
                    Cursor_Style
                  </label>
                  <select
                    value={tempCursorType}
                    onChange={(e) => setTempCursorType(e.target.value as any)}
                    className="w-full bg-black border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  >
                    {cursors.map((c) => (
                      <option key={c.name} value={c.value}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Wand2 size={12} />
                    AI_Features
                  </label>
                  <button
                    onClick={toggleAiEnabled}
                    className={`w-full px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-colors ${isAiEnabled ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    {isAiEnabled ? 'AI_Enabled' : 'AI_Disabled'}
                  </button>
                </div>
              </div>

              {/* AI Configuration Section */}
              {isAiEnabled && (
                <div className="space-y-4 p-4 bg-black/50 border border-blue-900/20 rounded-xl">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Wand2 size={12} />
                    AI_Provider_Configuration
                  </label>
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full bg-zinc-900 border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI GPT</option>
                    <option value="anthropic">Anthropic Claude</option>
                  </select>
                  <input
                    type="password"
                    placeholder={`${aiProvider.toUpperCase()}_API_KEY`}
                    value={apiKeys[aiProvider] || ''}
                    onChange={(e) => setApiKey(aiProvider, e.target.value)}
                    className="w-full bg-zinc-900 border border-blue-900/30 rounded-lg px-4 py-3 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              )}

              {/* Section Content Editors */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Layout size={12} />
                    Section_Manifests
                  </label>
                  <button 
                    onClick={addSection}
                    className="text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1"
                  >
                    <Plus size={10} /> Add_Section
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {tempSections.map((section) => (
                    <div key={section.id} className="p-4 bg-black/50 border border-blue-900/10 rounded-xl space-y-3 relative group/section">
                      <button 
                        onClick={() => removeSection(section.id)}
                        className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex justify-between items-center pr-8">
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-mono text-blue-500 uppercase">{section.type}_SECTOR</span>
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center gap-2">
                              <input
                                type="color"
                                value={section.color || tempThemeColor}
                                onChange={(e) => updateSection(section.id, { color: e.target.value })}
                                className="w-4 h-4 bg-transparent border-none cursor-pointer"
                              />
                              <span className={`text-[8px] font-mono uppercase tracking-tighter ${section.color ? 'text-blue-100/30' : 'text-blue-500/50'}`}>
                                {section.color || 'DEFAULT'}
                              </span>
                              {section.color && (
                                <button 
                                  onClick={() => updateSection(section.id, { color: undefined })}
                                  className="text-[7px] font-mono text-blue-400 hover:text-blue-300 uppercase tracking-tighter border border-blue-900/30 px-1 rounded"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <select
                          value={section.type}
                          onChange={(e) => updateSection(section.id, { type: e.target.value as any })}
                          className="bg-zinc-900 border border-blue-900/20 rounded px-2 py-1 text-[9px] font-mono text-blue-100 focus:outline-none"
                        >
                          <option value="hero">Hero</option>
                          <option value="about">About</option>
                          <option value="projects">Projects</option>
                          <option value="experience">Experience</option>
                          <option value="contact">Contact</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-blue-900/10 rounded px-3 py-2 text-blue-100 font-mono text-xs focus:outline-none focus:border-blue-500/30"
                        placeholder="Title"
                      />
                      <input
                        type="text"
                        value={section.manifesto}
                        onChange={(e) => updateSection(section.id, { manifesto: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-blue-900/10 rounded px-3 py-2 text-blue-100/80 font-mono text-[10px] focus:outline-none focus:border-blue-500/30"
                        placeholder="Manifesto"
                      />
                      <textarea
                        value={section.description}
                        onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        className="w-full bg-zinc-900/50 border border-blue-900/10 rounded px-3 py-2 text-blue-100/60 font-mono text-[9px] focus:outline-none focus:border-blue-500/30 h-16 resize-none"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">
                    <Layout size={12} />
                    Project_Manifests
                  </label>
                  <button 
                    onClick={addProject}
                    className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors font-mono"
                  >
                    <Plus size={10} /> Add_Project
                  </button>
                </div>

                <div className="space-y-4">
                  {tempProjects.map((project, idx) => (
                    <div key={project.id} className="p-4 bg-black/50 border border-blue-900/20 rounded-xl space-y-4 relative group/item">
                      <button 
                        onClick={() => removeProject(project.id)}
                        className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => updateProject(project.id, { title: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-blue-900/10 rounded-md px-3 py-2 text-blue-100 font-mono text-xs focus:outline-none focus:border-blue-500/30"
                            placeholder="Project Title"
                          />
                          <textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, { description: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-blue-900/10 rounded-md px-3 py-2 text-blue-100/70 font-mono text-[10px] focus:outline-none focus:border-blue-500/30 h-20 resize-none"
                            placeholder="Project Description"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[9px] text-blue-900 uppercase font-mono">
                            <div className="flex items-center gap-2">
                              <ImageIcon size={10} /> Image_URL
                            </div>
                            <button
                              onClick={() => handleGenerateProjectImage(project.id, project.title, project.description)}
                              disabled={generatingProjectIds[project.id]}
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                            >
                              {generatingProjectIds[project.id] ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                              {generatingProjectIds[project.id] ? 'Generating...' : 'Generate_AI'}
                            </button>
                          </div>
                          <input
                            type="text"
                            value={project.imageUrl}
                            onChange={(e) => updateProject(project.id, { imageUrl: e.target.value })}
                            className="w-full bg-zinc-900/50 border border-blue-900/10 rounded-md px-3 py-2 text-blue-100/50 font-mono text-[9px] focus:outline-none focus:border-blue-500/30"
                            placeholder="https://..."
                          />
                          <div className="aspect-video rounded-md overflow-hidden border border-blue-900/20 bg-zinc-900 relative">
                            {generatingProjectIds[project.id] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-sm">
                                <Loader2 size={24} className="text-blue-500 animate-spin" />
                              </div>
                            )}
                            <img src={project.imageUrl} alt="" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-[0.2em] py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Save size={14} />
                  Commit_Changes
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-blue-950/5 border-t border-blue-900/10 shrink-0">
              <p className="text-[9px] text-blue-900/50 font-mono uppercase text-center">
                Neural_Link_Status: Stable // Encryption: Active // Projects: {tempProjects.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
