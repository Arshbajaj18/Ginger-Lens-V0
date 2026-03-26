import { Employee } from '@/data/employees';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Award, BookOpen, Calendar, GraduationCap, Hotel, Mail, MapPin, Phone, Star, User, Wrench } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Props {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

export default function EmployeeDetail({ employee, open, onClose }: Props) {
  if (!employee) return null;

  const avgTraining = employee.trainings.length > 0
    ? Math.round(employee.trainings.reduce((s, t) => s + t.score, 0) / employee.trainings.length)
    : 0;

  const educationWeight: Record<string, number> = {
    '10th Pass': 15, '12th Pass': 25, 'ITI / Diploma': 40,
    'Graduate': 55, 'Hotel Management Diploma': 65, 'Postgraduate': 80, 'MBA': 100,
  };

  const expNorm = Math.min(employee.experience / 25, 1) * 100;
  const eduNorm = educationWeight[employee.education] || 50;
  const skillNorm = Math.min(employee.skills.length / 8, 1) * 100;

  const scoreBreakdown = [
    { label: 'Education', value: eduNorm, weight: '30%', icon: <GraduationCap className="h-4 w-4 text-primary" /> },
    { label: 'Experience', value: Math.round(expNorm), weight: '30%', icon: <Calendar className="h-4 w-4 text-primary" /> },
    { label: 'Skills & Trainings', value: Math.round(skillNorm * 0.4 + avgTraining * 0.6), weight: '20%', icon: <Wrench className="h-4 w-4 text-primary" /> },
    { label: 'Performance Review', value: employee.performanceReview, weight: '20%', icon: <Star className="h-4 w-4 text-primary" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'var(--gradient-warm)' }} />
          <div className="relative flex items-start gap-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.photoSeed}`}
              alt={employee.name}
              className="h-16 w-16 rounded-full bg-muted border-2 border-primary/20"
            />
            <div className="flex-1 min-w-0">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">{employee.name}</DialogTitle>
                <p className="text-sm text-primary font-medium">{employee.designation}</p>
                <p className="text-xs text-muted-foreground">{employee.department} · Age {employee.age}</p>
              </DialogHeader>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-6 space-y-5">
          {/* Contact & hotel info */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Hotel className="h-3.5 w-3.5 text-primary" />
              <span>{employee.hotel}, {employee.hotelCity}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Joined {format(parseISO(employee.joinDate), 'dd MMM yyyy')} · {employee.experience} yrs experience</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>{employee.education} — {employee.college}</span>
            </div>
          </div>

          {/* Final score hero */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between rounded-xl p-4"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <span className="text-sm font-semibold text-primary-foreground">Final Score</span>
            <span className="text-3xl font-extrabold text-primary-foreground">{employee.finalScore}</span>
          </motion.div>

          {/* Score breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Score Breakdown
            </h4>
            <div className="space-y-3">
              {scoreBreakdown.map(m => (
                <div key={m.label} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-muted/30">
                  {m.icon}
                  <span className="text-muted-foreground flex-1">{m.label}</span>
                  <span className="text-xs text-muted-foreground w-8">{m.weight}</span>
                  <Progress value={m.value} className="w-20 h-1.5" />
                  <span className={`w-8 text-right font-semibold ${m.value >= 75 ? 'text-success' : m.value >= 50 ? 'text-foreground' : 'text-destructive'}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {employee.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" /> Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map(skill => (
                  <span key={skill} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {employee.achievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Achievements
              </h4>
              <div className="space-y-1.5">
                {employee.achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                    <Star className="h-3.5 w-3.5 text-gold" />
                    <span className="text-foreground flex-1">{a.title}</span>
                    <span className="text-xs text-muted-foreground">{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Training details */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Training Details</h4>
            <div className="space-y-2">
              {employee.trainings.map((t, idx) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                  className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-muted-foreground truncate mr-3">{t.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Progress value={t.score} className="w-20 h-1.5" />
                    <span className={`w-8 text-right font-semibold ${t.score >= 75 ? 'text-success' : t.score >= 50 ? 'text-foreground' : 'text-destructive'}`}>{t.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
