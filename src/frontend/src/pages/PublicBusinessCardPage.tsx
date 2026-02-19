import React from 'react';
import { useGetBusinessCardByPrincipal } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import EmptyState from '../components/empty-states/EmptyState';
import { SkeletonForm } from '../components/loading/SkeletonLoader';
import { getPrincipalFromUrl } from '../utils/urlParams';
import { Principal } from '@dfinity/principal';

export default function PublicBusinessCardPage() {
  const principalString = getPrincipalFromUrl();
  
  let principal: Principal | null = null;
  try {
    if (principalString) {
      principal = Principal.fromText(principalString);
    }
  } catch (error) {
    console.error('Invalid principal:', error);
  }

  const { data: businessCard, isLoading, isError } = useGetBusinessCardByPrincipal(principal);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full fade-in">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/assets/generated/cardvault-logo.dim_512x512.png"
              alt="CardVault"
              className="h-12 w-auto"
            />
          </div>
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Loading Business Card...</CardTitle>
            </CardHeader>
            <CardContent>
              <SkeletonForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !principal || !businessCard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full fade-in">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/assets/generated/cardvault-logo.dim_512x512.png"
              alt="CardVault"
              className="h-12 w-auto"
            />
          </div>
          <EmptyState
            title="Business Card Not Found"
            description="This business card doesn't exist or has been removed."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full fade-in">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/assets/generated/cardvault-logo.dim_512x512.png"
            alt="CardVault"
            className="h-12 w-auto"
          />
        </div>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Business Card</CardTitle>
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
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              CardVault
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
