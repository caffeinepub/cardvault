import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateSavedContent, useUpdateSavedContent } from '../../hooks/useQueries';
import { ContentType } from '../../backend';
import type { SavedContent } from '../../backend';

interface SavedContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingContent: SavedContent | null;
}

export default function SavedContentForm({ isOpen, onClose, editingContent }: SavedContentFormProps) {
  const createSavedContent = useCreateSavedContent();
  const updateSavedContent = useUpdateSavedContent();
  const [activeTab, setActiveTab] = useState<'link' | 'text'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (editingContent) {
      setTitle(editingContent.linkTitle);
      if (editingContent.content.startsWith('http')) {
        setUrl(editingContent.content);
        setActiveTab('link');
      } else {
        setText(editingContent.content);
        setActiveTab('text');
      }
    } else {
      setTitle('');
      setUrl('');
      setText('');
      setActiveTab('link');
    }
  }, [editingContent, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content: SavedContent = {
      id: editingContent?.id || crypto.randomUUID(),
      linkTitle: title,
      content: activeTab === 'link' ? url : text,
      contentType: ContentType.general,
    };

    if (editingContent) {
      await updateSavedContent.mutateAsync({ id: editingContent.id, content });
    } else {
      await createSavedContent.mutateAsync(content);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">{editingContent ? 'Edit Content' : 'Add Content'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'link' | 'text')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link" className="transition-all duration-200">Link</TabsTrigger>
              <TabsTrigger value="text" className="transition-all duration-200">Text</TabsTrigger>
            </TabsList>
            <TabsContent value="link" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="link-title">Title</Label>
                <Input
                  id="link-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article Title"
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
            </TabsContent>
            <TabsContent value="text" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="text-title">Title</Label>
                <Input
                  id="text-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  required
                  className="focus-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Content</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Your text content..."
                  rows={6}
                  required
                  className="focus-ring"
                />
              </div>
            </TabsContent>
          </Tabs>
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
