import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-accent/20 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/assets/generated/cardvault-logo.dim_512x512.png"
            alt="CardVault"
            className="h-24 w-24 rounded-2xl shadow-lg"
          />
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              CardVault
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personal vault for cards, links, ideas, and reminders
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="w-full gap-2 text-base"
          >
            {isLoggingIn ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Sign in to continue
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Secure authentication powered by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
