import { useState, useEffect } from 'react';
import { PenLine, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export function QuickNote() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('architect-os-quick-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notes');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('architect-os-quick-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newNote = {
      id: Date.now().toString(),
      content: input.trim(),
      timestamp: Date.now()
    };
    
    setNotes([newNote, ...notes]);
    setInput('');
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="relative z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-3 w-80 sm:w-96 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 origin-bottom-right"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-zinc-400" /> Quick Notes
              </h4>
              <span className="text-xs text-zinc-500">{notes.length} saved</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              <AnimatePresence>
                {notes.map(note => (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="group flex gap-3 items-start justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50"
                  >
                    <p className="text-sm text-zinc-300 leading-relaxed break-words flex-1">
                      {note.content}
                    </p>
                    <button 
                      onClick={() => removeNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-300 transition-all p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
                {notes.length === 0 && (
                  <div className="text-sm text-zinc-600 text-center py-6">
                    No notes yet
                  </div>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={addNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type something..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-zinc-100 text-zinc-900 rounded-lg px-3 py-2 disabled:opacity-50 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium",
          isOpen 
            ? "bg-zinc-100 text-zinc-900 border-zinc-100" 
            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100 hover:bg-zinc-800"
        )}
      >
        <PenLine className="w-4 h-4" />
        Note
      </button>
    </div>
  );
}
