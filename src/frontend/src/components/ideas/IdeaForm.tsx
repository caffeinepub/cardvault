import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateIdea, useUpdateIdea } from '../../hooks/useQueries';
import type { Idea } from '../../backend';

interface IdeaFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingIdea: Idea | null;
}

export default function IdeaForm({ isOpen, onClose, editingIdea }: IdeaFormProps) {
  const createIdea = useCreateIdea();
  const updateIdea = useUpdateIdea();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingIdea) {
      setContent(editingIdea.content);
    } else {
      setContent('');
    }
  }, [editingIdea, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingIdea) {
      await updateIdea.mutateAsync({ id: editingIdea.id, content });
    } else {
      await createIdea.mutateAsync({ id: crypto.randomUUID(), content });
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">{editingIdea ? 'Edit Idea' : 'Add Idea'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Your Idea</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your idea here..."
              rows={6}
              required
              className="focus-ring"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createIdea.isPending || updateIdea.isPending}
              className="flex-1 interactive-scale button-press"
            >
              {createIdea.isPending || updateIdea.isPending ? 'Saving...' : 'Save'}
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
