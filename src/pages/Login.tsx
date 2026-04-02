import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gingerLogo from '@/assets/ginger-logo.png';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyCredentialsFromGoogleSheet } from '@/data/verifyGoogleSheetCreds';
import { toast } from 'sonner';
import { EyeOff, Lock, User } from 'lucide-react';

const AUTH_USER_KEY = 'ginger_auth_user';
const AUTO_SYNC_SESSION_KEY = 'ginger_autosynced_v1';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthed = !!sessionStorage.getItem(AUTH_USER_KEY);

  useEffect(() => {
    if (isAuthed) navigate('/', { replace: true });
  }, [isAuthed, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      toast.error('Please enter username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await verifyCredentialsFromGoogleSheet(u, p);
      if (!ok) {
        toast.error('Invalid credentials.');
        return;
      }

      sessionStorage.setItem(AUTH_USER_KEY, u);
      sessionStorage.removeItem(AUTO_SYNC_SESSION_KEY);
      // Notify the router guard in App.tsx to re-evaluate auth state.
      window.dispatchEvent(new Event('ginger_auth_update'));
      toast.success('Login successful.');
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-5">
          <img src={gingerLogo} alt="Ginger Hotels" className="h-10 object-contain" />
        </div>

        <Card className="glass-card">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-xl">Ginger Lens Login</CardTitle>
            <CardDescription>Sign in to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pl-9 bg-card"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-9 pr-9 bg-card"
                    type="password"
                    autoComplete="current-password"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <EyeOff className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                style={{ background: 'var(--gradient-primary)' }}
              >
                {isSubmitting ? 'Logging in…' : 'Login'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

