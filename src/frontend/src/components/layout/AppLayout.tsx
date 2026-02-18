import React, { useState } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import BusinessCardPage from '../../pages/BusinessCardPage';
import SavedContentPage from '../../pages/SavedContentPage';
import BookmarksPage from '../../pages/BookmarksPage';
import IdeasPage from '../../pages/IdeasPage';
import RemindersPage from '../../pages/RemindersPage';

export default function AppLayout() {
  const [activeSection, setActiveSection] = useState('card');

  const renderSection = () => {
    const sectionKey = `${activeSection}-${Date.now()}`;
    
    switch (activeSection) {
      case 'card':
        return <BusinessCardPage key={sectionKey} />;
      case 'content':
        return <SavedContentPage key={sectionKey} />;
      case 'bookmarks':
        return <BookmarksPage key={sectionKey} />;
      case 'ideas':
        return <IdeasPage key={sectionKey} />;
      case 'reminders':
        return <RemindersPage key={sectionKey} />;
      default:
        return <BusinessCardPage key={sectionKey} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeSection={activeSection} />
      <main className="flex-1 container px-4 py-6 pb-24 fade-in">
        {renderSection()}
      </main>
      <BottomNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
}
