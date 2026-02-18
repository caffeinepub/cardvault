import React from 'react';
import { CreditCard, FileText, Bookmark, Lightbulb, CheckSquare } from 'lucide-react';

interface BottomNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'card', icon: CreditCard, label: 'Card' },
  { id: 'content', icon: FileText, label: 'Content' },
  { id: 'bookmarks', icon: Bookmark, label: 'Links' },
  { id: 'ideas', icon: Lightbulb, label: 'Ideas' },
  { id: 'reminders', icon: CheckSquare, label: 'Tasks' },
];

export default function BottomNav({ activeSection, onSectionChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-bottom">
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 interactive-scale ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
