import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/DashboardStats';
import EmployeeTable from '@/components/EmployeeTable';
import Leaderboard from '@/components/Leaderboard';
import ScoreDistribution from '@/components/ScoreDistribution';
import { LayoutDashboard, Users, Trophy, BarChart3, RefreshCw, LogOut, UserRound, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gingerLogo from '@/assets/ginger-logo.png';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/data/employees';
import { syncEmployeesFromGoogleSheet } from '@/data/syncGoogleSheet';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const AUTH_USER_KEY = 'ginger_auth_user';
  const [username, setUsername] = useState<string>(() => sessionStorage.getItem(AUTH_USER_KEY) ?? 'User');
  const [leaderboardJump, setLeaderboardJump] = useState<{ position: string; nonce: number } | undefined>(undefined);

  const openLeaderboardForPosition = (position: string) => {
    setLeaderboardJump({ position, nonce: Date.now() });
    setActiveTab('leaderboard');
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const result = await syncEmployeesFromGoogleSheet([]);
      setEmployees(result.mergedEmployees);
      const now = new Date();
      setLastSyncedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      toast.success('Employee data updated.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update employee data.';
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsBootstrapping(true);
      try {
        const result = await syncEmployeesFromGoogleSheet([]);
        if (cancelled) return;
        setEmployees(result.mergedEmployees);
        const now = new Date();
        setLastSyncedAt(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Could not update employee data.';
          toast.error(message);
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_USER_KEY);
    window.dispatchEvent(new Event('ginger_auth_update'));
    toast.success('Logged out.');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {isBootstrapping && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm">
          <img src={gingerLogo} alt="" className="h-12 object-contain opacity-90" />
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" aria-hidden />
            <p className="text-sm text-muted-foreground font-medium">Loading your workspace…</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40 backdrop-blur-md bg-card/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={gingerLogo} alt="Ginger Hotels" className="h-8 object-contain" />
            <div className="hidden sm:block h-6 w-px bg-border" />
            <p className="hidden sm:block text-xs text-muted-foreground font-medium tracking-wide uppercase">
              Employee Performance Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-[11px] text-muted-foreground leading-none">
              <span className="font-medium uppercase tracking-wide">Last Synced:</span> {lastSyncedAt ?? '—'}
            </div>

            <div className="text-[11px] text-muted-foreground leading-none sm:hidden">
              Last Synced: {lastSyncedAt ?? '—'}
            </div>

            <Button variant="outline" size="sm" onClick={() => void handleSync()} disabled={isSyncing || isBootstrapping} className="h-8">
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="ml-1">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-xs hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="User menu"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="h-4 w-4" />
                  </span>
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs">{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-xs text-destructive focus:text-destructive">
                  <span className="inline-flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero accent bar */}
      <div className="h-1 w-full" style={{ background: 'var(--gradient-warm)' }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border shadow-sm p-1 h-auto w-full flex overflow-x-auto">
            <TabsTrigger value="overview" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all flex-1 min-w-0">
              <LayoutDashboard className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Overview</span><span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all flex-1 min-w-0">
              <Users className="h-4 w-4 shrink-0" /> <span className="truncate">Employees</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all flex-1 min-w-0">
              <Trophy className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Leaderboard</span><span className="sm:hidden">Board</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all flex-1 min-w-0">
              <BarChart3 className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">Analytics</span><span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <TabsContent value="overview" className="mt-0">
                <DashboardStats employees={employees} onAtGlanceOpenLeaderboard={openLeaderboardForPosition} />
              </TabsContent>

              <TabsContent value="employees" className="mt-0">
                <EmployeeTable employees={employees} />
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-0">
                <Leaderboard employees={employees} jumpToPosition={leaderboardJump} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <ScoreDistribution employees={employees} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-muted-foreground text-center">
          <span>© 2026 Ginger Hotels — An IHCL Brand</span>
          <span>Ginger Internal Talent Pool</span>
        </div>
      </footer>
    </div>
  );
}
