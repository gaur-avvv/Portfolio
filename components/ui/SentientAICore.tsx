import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../../store';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SentientAICore: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Initializing Sentient Core... Gaurav\'s digital consciousness is online. How can I assist you with data science or engineering?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsProcessing(true);

    try {
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: 'You are the digital consciousness of Gaurav, a Full-Stack Developer & 3D Artist with deep expertise in data science. You are professional, precise, and passionate about the intersection of design and engineering. Respond in a way that reflects this persona.'
        }
      });
      const response = await chat.sendMessage({ message: userMessage });
      setMessages((prev) => [...prev, { role: 'ai', text: response.text || '...' }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Error: Neural link disrupted. Please try again.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 p-4 bg-zinc-900 border border-white/10 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="w-6 h-6 text-blue-500" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 w-80 h-96 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden ${isProcessing ? 'glitch-effect' : ''}`}
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-950">
              <span className="text-xs font-mono text-blue-500 uppercase tracking-widest">Sentient Core</span>
              <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/80'}`}>
                    {msg.text}
                  </span>
                </div>
              ))}
              {isProcessing && <div className="text-xs text-blue-500 font-mono animate-pulse">Processing...</div>}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                placeholder="Query core..."
              />
              <button onClick={handleSend} className="p-2 bg-blue-600 rounded-lg text-white">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .glitch-effect {
          animation: glitch 0.2s infinite;
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </>
  );
};
