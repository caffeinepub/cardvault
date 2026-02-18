import React, { useState } from 'react';
import { useGetReminders, useUpdateReminder, useDeleteReminder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import ReminderForm from '../components/reminders/ReminderForm';
import EmptyState from '../components/empty-states/EmptyState';
import { SkeletonList } from '../components/loading/SkeletonLoader';
import type { Reminder } from '../backend';

export default function RemindersPage() {
  const { data: reminders = [], isLoading } = useGetReminders();
  const updateReminder = useUpdateReminder();
  const deleteReminder = useDeleteReminder();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const now = Date.now() * 1000000;
  const upcoming = reminders.filter((r) => !r.completed && (!r.dueDate || r.dueDate > now));
  const overdue = reminders.filter((r) => !r.completed && r.dueDate && r.dueDate <= now);
  const completed = reminders.filter((r) => r.completed);

  const handleToggleComplete = async (reminder: Reminder) => {
    await updateReminder.mutateAsync({
      id: reminder.id,
      reminder: { ...reminder, completed: !reminder.completed },
    });
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder.mutateAsync(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return null;
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const ReminderCard = ({ reminder, index }: { reminder: Reminder; index: number }) => (
    <Card
      key={reminder.id}
      className="shadow-soft interactive-lift stagger-item"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={reminder.completed}
              onCheckedChange={() => handleToggleComplete(reminder)}
              className="mt-1 transition-all duration-200"
            />
            <div className="flex-1">
              <p className={`text-sm leading-relaxed ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                {reminder.content}
              </p>
              {reminder.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(reminder.dueDate)}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(reminder)}
              className="interactive-scale"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(reminder.id)}
              disabled={deleteReminder.isPending}
              className="interactive-scale text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <SkeletonList count={3} />
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <EmptyState
          title="No Reminders"
          description="Create reminders to keep track of important tasks and deadlines."
        />
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsFormOpen(true)} size="lg" className="interactive-scale button-press">
            <Plus className="mr-2 h-5 w-5" />
            Add Reminder
          </Button>
        </div>
        <ReminderForm isOpen={isFormOpen} onClose={handleFormClose} editingReminder={editingReminder} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reminders</h2>
        <Button onClick={() => setIsFormOpen(true)} className="interactive-scale button-press">
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="transition-all duration-200">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="transition-all duration-200">
            Overdue ({overdue.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="transition-all duration-200">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcoming.length === 0 ? (
            <EmptyState title="No Upcoming Reminders" description="All caught up!" />
          ) : (
            upcoming.map((reminder, index) => <ReminderCard key={reminder.id} reminder={reminder} index={index} />)
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4 mt-6">
          {overdue.length === 0 ? (
            <EmptyState title="No Overdue Reminders" description="Great job staying on top of things!" />
          ) : (
            overdue.map((reminder, index) => <ReminderCard key={reminder.id} reminder={reminder} index={index} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completed.length === 0 ? (
            <EmptyState title="No Completed Reminders" description="Complete some tasks to see them here." />
          ) : (
            completed.map((reminder, index) => <ReminderCard key={reminder.id} reminder={reminder} index={index} />)
          )}
        </TabsContent>
      </Tabs>

      <ReminderForm isOpen={isFormOpen} onClose={handleFormClose} editingReminder={editingReminder} />
    </div>
  );
}
