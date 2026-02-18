import React, { useState } from 'react';
import { useListSavedContent, useDeleteSavedContent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ExternalLink, Trash2, Edit } from 'lucide-react';
import BookmarkForm from '../components/content/BookmarkForm';
import EmptyState from '../components/empty-states/EmptyState';
import { SkeletonList } from '../components/loading/SkeletonLoader';
import { ContentType } from '../backend';
import type { SavedContent } from '../backend';

export default function BookmarksPage() {
  const { data: savedContent = [], isLoading } = useListSavedContent();
  const deleteSavedContent = useDeleteSavedContent();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<SavedContent | null>(null);

  const bookmarks = savedContent.filter((item) => item.contentType === ContentType.bookmark);

  const handleEdit = (bookmark: SavedContent) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      await deleteSavedContent.mutateAsync(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBookmark(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <SkeletonList count={3} />
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <EmptyState
          title="No Bookmarks"
          description="Save your favorite links and websites for easy access."
        />
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsFormOpen(true)} size="lg" className="interactive-scale button-press">
            <Plus className="mr-2 h-5 w-5" />
            Add Bookmark
          </Button>
        </div>
        <BookmarkForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          editingBookmark={editingBookmark}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookmarks</h2>
        <Button onClick={() => setIsFormOpen(true)} className="interactive-scale button-press">
          <Plus className="mr-2 h-4 w-4" />
          Add Bookmark
        </Button>
      </div>

      <div className="space-y-4">
        {bookmarks.map((bookmark, index) => (
          <Card
            key={bookmark.id}
            className="shadow-soft interactive-lift stagger-item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-start justify-between gap-2">
                <span className="flex-1">{bookmark.linkTitle}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(bookmark)}
                    className="interactive-scale"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(bookmark.id)}
                    disabled={deleteSavedContent.isPending}
                    className="interactive-scale text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={bookmark.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {bookmark.content}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <BookmarkForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        editingBookmark={editingBookmark}
      />
    </div>
  );
}
