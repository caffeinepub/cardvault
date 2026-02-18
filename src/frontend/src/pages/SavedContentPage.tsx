import React, { useState } from 'react';
import { useListSavedContent, useDeleteSavedContent } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ExternalLink, Trash2, Edit } from 'lucide-react';
import SavedContentForm from '../components/content/SavedContentForm';
import EmptyState from '../components/empty-states/EmptyState';
import { SkeletonList } from '../components/loading/SkeletonLoader';
import { ContentType } from '../backend';
import type { SavedContent } from '../backend';

export default function SavedContentPage() {
  const { data: savedContent = [], isLoading } = useListSavedContent();
  const deleteSavedContent = useDeleteSavedContent();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<SavedContent | null>(null);

  const generalContent = savedContent.filter((item) => item.contentType === ContentType.general);

  const handleEdit = (content: SavedContent) => {
    setEditingContent(content);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      await deleteSavedContent.mutateAsync(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingContent(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <SkeletonList count={3} />
      </div>
    );
  }

  if (generalContent.length === 0) {
    return (
      <div className="max-w-4xl mx-auto fade-in">
        <EmptyState
          title="No Saved Content"
          description="Save links and text snippets for quick access later."
        />
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsFormOpen(true)} size="lg" className="interactive-scale button-press">
            <Plus className="mr-2 h-5 w-5" />
            Add Content
          </Button>
        </div>
        <SavedContentForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          editingContent={editingContent}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Content</h2>
        <Button onClick={() => setIsFormOpen(true)} className="interactive-scale button-press">
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="space-y-4">
        {generalContent.map((item, index) => (
          <Card
            key={item.id}
            className="shadow-soft interactive-lift stagger-item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-start justify-between gap-2">
                <span className="flex-1">{item.linkTitle || 'Untitled'}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="interactive-scale"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteSavedContent.isPending}
                    className="interactive-scale text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {item.content}
              </p>
              {item.content.startsWith('http') && (
                <a
                  href={item.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Link
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <SavedContentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        editingContent={editingContent}
      />
    </div>
  );
}
