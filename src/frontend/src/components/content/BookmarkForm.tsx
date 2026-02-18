import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateSavedContent, useUpdateSavedContent } from '../../hooks/useQueries';
import { ContentType } from '../../backend';
import type { SavedContent } from '../../backend';

interface BookmarkFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingBookmark: SavedContent | null;
}

export default function BookmarkForm({ isOpen, onClose, editingBookmark }: BookmarkFormProps) {
  const createSavedContent = useCreateSavedContent();
  const updateSavedContent = useUpdateSavedContent();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (editingBookmark) {
      setTitle(editingBookmark.linkTitle);
      setUrl(editingBookmark.content);
    } else {
      setTitle('');
      setUrl('');
    }
  }, [editingBookmark, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content: SavedContent = {
      id: editingBookmark?.id || crypto.randomUUID(),
      linkTitle: title,
      content: url,
      contentType: ContentType.bookmark,
    };

    if (editingBookmark) {
      await updateSavedContent.mutateAsync({ id: editingBookmark.id, content });
    } else {
      await createSavedContent.mutateAsync(content);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">{editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Favorite Website"
              required
              className="focus-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="focus-ring"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createSavedContent.isPending || updateSavedContent.isPending}
              className="flex-1 interactive-scale button-press"
            >
              {createSavedContent.isPending || updateSavedContent.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="interactive-scale button-press">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
