import React from 'react';
import { CreditCard, FileText, Bookmark, Lightbulb, CheckSquare } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import { useGetCallerUserProfile } from '../../hooks/useQueries';

interface HeaderProps {
  activeSection: string;
}

const sectionIcons = {
  card: CreditCard,
  content: FileText,
  bookmarks: Bookmark,
  ideas: Lightbulb,
  reminders: CheckSquare,
};

const sectionTitles = {
  card: 'Business Card',
  content: 'Saved Content',
  bookmarks: 'Bookmarks',
  ideas: 'Ideas',
  reminders: 'Reminders',
};

export default function Header({ activeSection }: HeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const Icon = sectionIcons[activeSection as keyof typeof sectionIcons] || CreditCard;
  const title = sectionTitles[activeSection as keyof typeof sectionTitles] || 'CardVault';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-top">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 slide-in-down">
          <Icon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-4 slide-in-down">
          {userProfile && (
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              {userProfile.name}
            </span>
          )}
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
