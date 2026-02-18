import React, { useState } from 'react';
import { useListIdeas, useDeleteIdea } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit, Clock } from 'lucide-react';
import IdeaForm from '../components/ideas/IdeaForm';
import EmptyState from '../components/empty-states/EmptyState';
import { SkeletonList } from '../components/loading/SkeletonLoader';
import type { Idea } from '../backend';

export default function IdeasPage() {
  const { data: ideas = [], isLoading } = useListIdeas();
  const deleteIdea = useDeleteIdea();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this idea?')) {
      await deleteIdea.mutateAsync(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingIdea(null);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <SkeletonList count={3} />
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <EmptyState
          title="No Ideas Yet"
          description="Capture your thoughts and ideas as they come to you."
        />
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsFormOpen(true)} size="lg" className="interactive-scale button-press">
            <Plus className="mr-2 h-5 w-5" />
            Add Idea
          </Button>
        </div>
        <IdeaForm isOpen={isFormOpen} onClose={handleFormClose} editingIdea={editingIdea} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ideas</h2>
        <Button onClick={() => setIsFormOpen(true)} className="interactive-scale button-press">
          <Plus className="mr-2 h-4 w-4" />
          Add Idea
        </Button>
      </div>

      <div className="space-y-4">
        {ideas.map((idea, index) => (
          <Card
            key={idea.id}
            className="shadow-soft interactive-lift stagger-item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDate(idea.createdAt)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(idea)}
                    className="interactive-scale"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(idea.id)}
                    disabled={deleteIdea.isPending}
                    className="interactive-scale text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{idea.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <IdeaForm isOpen={isFormOpen} onClose={handleFormClose} editingIdea={editingIdea} />
    </div>
  );
}
