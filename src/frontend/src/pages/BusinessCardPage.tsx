import React, { useState } from 'react';
import { useGetBusinessCard, useSaveBusinessCard } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';
import EmptyState from '../components/empty-states/EmptyState';
import { SkeletonForm } from '../components/loading/SkeletonLoader';
import type { BusinessCard } from '../backend';

export default function BusinessCardPage() {
  const { data: businessCard, isLoading } = useGetBusinessCard();
  const saveBusinessCard = useSaveBusinessCard();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessCard>({
    fullName: '',
    title: '',
    phone: '',
    email: '',
    website: '',
    bio: '',
  });

  React.useEffect(() => {
    if (businessCard) {
      setFormData(businessCard);
    }
  }, [businessCard]);

  const handleSave = async () => {
    await saveBusinessCard.mutateAsync(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (businessCard) {
      setFormData(businessCard);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto fade-in">
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Business Card</CardTitle>
          </CardHeader>
          <CardContent>
            <SkeletonForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!businessCard && !isEditing) {
    return (
      <div className="max-w-2xl mx-auto fade-in">
        <EmptyState
          title="No Business Card Yet"
          description="Create your digital business card to share your professional information."
        />
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsEditing(true)} size="lg" className="interactive-scale button-press">
            Create Business Card
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto scale-in">
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Business Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Software Engineer"
                className="focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                className="focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                className="focus-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                className="focus-ring"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saveBusinessCard.isPending}
                className="flex-1 interactive-scale button-press"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveBusinessCard.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={saveBusinessCard.isPending}
                className="interactive-scale button-press"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // At this point businessCard must exist
  if (!businessCard) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <Card className="shadow-elevated interactive-lift">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Business Card</CardTitle>
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="interactive-scale">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-1">{businessCard.fullName}</h2>
            <p className="text-lg text-muted-foreground">{businessCard.title}</p>
          </div>
          {businessCard.phone && (
            <div>
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <p className="text-base font-medium">{businessCard.phone}</p>
            </div>
          )}
          {businessCard.email && (
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-base font-medium">{businessCard.email}</p>
            </div>
          )}
          {businessCard.website && (
            <div>
              <Label className="text-xs text-muted-foreground">Website</Label>
              <a
                href={businessCard.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium text-primary hover:underline"
              >
                {businessCard.website}
              </a>
            </div>
          )}
          {businessCard.bio && (
            <div>
              <Label className="text-xs text-muted-foreground">Bio</Label>
              <p className="text-base leading-relaxed mt-1">{businessCard.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
