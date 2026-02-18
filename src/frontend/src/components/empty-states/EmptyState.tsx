import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  imageSrc?: string;
}

export default function EmptyState({ title, description, imageSrc = '/assets/generated/empty-state.dim_1200x800.png' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center fade-in">
      <img
        src={imageSrc}
        alt="Empty state"
        className="w-64 h-auto mb-6 opacity-80 animate-float"
        style={{ animationDuration: '3s' }}
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
