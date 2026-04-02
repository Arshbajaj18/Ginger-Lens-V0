import { Employee } from '@/data/employees';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, GraduationCap, Hash, Mail, MapPin } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Star, BookOpen, Wrench } from 'lucide-react';

interface Props {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

function formatDateLong(value: string): string {
  if (!value) return '—';
  try {
    const d = parseISO(value);
    if (isValid(d)) return format(d, 'dd MMM yyyy');
    const d2 = new Date(value);
    if (!Number.isNaN(d2.getTime())) return format(d2, 'dd MMM yyyy');
    return value;
  } catch {
    return value;
  }
}

function experienceInCurrentRole(roleStart: string): string {
  if (!roleStart?.trim()) return '—';
  let start: Date | null = null;
  try {
    const d = parseISO(roleStart);
    if (isValid(d)) start = d;
    else {
      const d2 = new Date(roleStart.trim());
      if (!Number.isNaN(d2.getTime())) start = d2;
    }
  } catch {
    return '—';
  }
  if (!start) return '—';
  const years = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const y = Math.max(0, Math.round(years * 10) / 10);
  return `${y} yrs`;
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm text-muted-foreground">
      <span className="text-primary shrink-0 mt-0.5">{icon}</span>
      <span className="min-w-0 leading-snug">{children}</span>
    </div>
  );
}

export default function EmployeeDetail({ employee, open, onClose }: Props) {
  if (!employee) return null;

  const expRole = experienceInCurrentRole(employee.dateAssumingCurrentRole);

  const education = clamp100(employee.educationScore);
  const experience = clamp100(employee.experienceScore);
  const training = clamp100(employee.trainingScore);
  const skill = clamp100(employee.skillScore);

  // Matches the original app logic weights: skills/training contribution blended.
  const skillsAndTrainings = Math.round(skill * 0.4 + training * 0.6);
  const performanceReview = clamp100(employee.performanceReview);

  const scoreRows = [
    { label: 'Education', weight: '30%', value: education, icon: <GraduationCap className="h-4 w-4 text-primary" /> },
    { label: 'Experience', weight: '30%', value: experience, icon: <Calendar className="h-4 w-4 text-primary" /> },
    {
      label: 'Skills & Trainings',
      weight: '20%',
      value: clamp100(skillsAndTrainings),
      icon: <Wrench className="h-4 w-4 text-primary" />,
    },
    { label: 'Performance Review', weight: '20%', value: performanceReview, icon: <Star className="h-4 w-4 text-primary" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md p-0 gap-0 max-h-[85vh] overflow-y-auto sm:rounded-xl">
        <div className="relative px-5 pt-5 pb-4 overflow-hidden border-b border-border/40">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-100/90 via-rose-50/80 to-background dark:from-orange-950/40 dark:via-rose-950/20 dark:to-background" />
          <div className="relative flex gap-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.photoSeed}`}
              alt=""
              className="h-16 w-16 rounded-full bg-card border-2 border-primary/25 shrink-0"
            />
            <div className="flex-1 min-w-0 pt-0.5">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-xl font-bold text-foreground tracking-tight">{employee.name}</DialogTitle>
                <p className="text-sm font-medium text-primary">{employee.position || '—'}</p>
                <p className="text-xs text-muted-foreground">
                  {employee.businessUnit || '—'} · Age {employee.age > 0 ? employee.age : '—'}
                </p>
              </DialogHeader>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4 bg-card">
          <InfoRow icon={<Hash className="h-4 w-4" />}>{employee.employeeNo || '—'}</InfoRow>
          <InfoRow icon={<Mail className="h-4 w-4" />}>{employee.email || '—'}</InfoRow>
          <InfoRow icon={<GraduationCap className="h-4 w-4" />}>{employee.highestEducation || '—'}</InfoRow>
          <InfoRow icon={<Clock className="h-4 w-4" />}>
            {expRole === '—' ? '—' : `${expRole} in current role`}
          </InfoRow>
          <InfoRow icon={<Calendar className="h-4 w-4" />}>
            {employee.joinDate
              ? `Joined ${formatDateLong(employee.joinDate)} · ${employee.experience} yrs experience`
              : '—'}
          </InfoRow>
          <InfoRow icon={<MapPin className="h-4 w-4" />}>{employee.area || '—'}</InfoRow>
        </div>

        <div className="mx-5 mb-5 rounded-xl px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-sm">
          <span className="text-sm font-semibold">Final Score</span>
          <span className="text-3xl font-extrabold tabular-nums leading-none">{employee.finalScore}</span>
        </div>

        <div className="px-5 pb-6 space-y-5">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Score Breakdown
            </h4>

            <div className="space-y-3">
              {scoreRows.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="text-primary">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground truncate">{r.label}</span>
                      <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">{r.weight}</span>
                    </div>
                    <Progress value={r.value} className="mt-1 h-1.5" />
                  </div>
                  <span className="w-10 text-right font-semibold tabular-nums">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" /> Skills
            </h4>
            <div className="flex flex-wrap gap-2 mt-3">
              {employee.skills.length > 0 ? (
                employee.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Training Details
            </h4>
            <div className="space-y-3 mt-3">
              {employee.trainings.length > 0 ? (
                employee.trainings.map((t, idx) => (
                  <div key={`${t.name}-${idx}`} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground truncate">{t.name}</span>
                    <div className="flex-1">
                      <Progress value={clamp100(t.score)} className="h-1.5" />
                    </div>
                    <span className="w-10 text-right font-semibold tabular-nums text-sm">{Math.round(t.score)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No trainings listed.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function clamp100(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}
