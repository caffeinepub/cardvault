import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReminder, useUpdateReminder } from '../../hooks/useQueries';
import type { Reminder } from '../../backend';

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingReminder: Reminder | null;
}

export default function ReminderForm({ isOpen, onClose, editingReminder }: ReminderFormProps) {
  const createReminder = useCreateReminder();
  const updateReminder = useUpdateReminder();
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  useEffect(() => {
    if (editingReminder) {
      setContent(editingReminder.content);
      if (editingReminder.dueDate) {
        const date = new Date(Number(editingReminder.dueDate) / 1000000);
        setDueDate(date.toISOString().split('T')[0]);
        setDueTime(date.toTimeString().slice(0, 5));
      } else {
        setDueDate('');
        setDueTime('');
      }
    } else {
      setContent('');
      setDueDate('');
      setDueTime('');
    }
  }, [editingReminder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let dueDateTimestamp: bigint | undefined;
    if (dueDate) {
      const dateTimeString = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T00:00`;
      dueDateTimestamp = BigInt(new Date(dateTimeString).getTime() * 1000000);
    }

    const reminder: Reminder = {
      id: editingReminder?.id || crypto.randomUUID(),
      content,
      dueDate: dueDateTimestamp,
      completed: editingReminder?.completed || false,
      createdAt: editingReminder?.createdAt || BigInt(Date.now() * 1000000),
    };

    if (editingReminder) {
      await updateReminder.mutateAsync({ id: editingReminder.id, reminder });
    } else {
      await createReminder.mutateAsync(reminder);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">{editingReminder ? 'Edit Reminder' : 'Add Reminder'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Reminder</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you need to remember?"
              rows={3}
              required
              className="focus-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Time (Optional)</Label>
              <Input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                disabled={!dueDate}
                className="focus-ring"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createReminder.isPending || updateReminder.isPending}
              className="flex-1 interactive-scale button-press"
            >
              {createReminder.isPending || updateReminder.isPending ? 'Saving...' : 'Save'}
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
