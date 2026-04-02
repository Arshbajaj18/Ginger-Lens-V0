import { Employee, listDesignationsByHeadcount } from '@/data/employees';
import { Users, TrendingUp, Star, ArrowUpRight, Trophy, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { useMemo, useState } from 'react';
import EmployeeDetail from './EmployeeDetail';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface DashboardStatsProps {
  employees: Employee[];
  onAtGlanceOpenLeaderboard: (position: string) => void;
}

export default function DashboardStats({ employees, onAtGlanceOpenLeaderboard }: DashboardStatsProps) {
  const [topPerformerDetail, setTopPerformerDetail] = useState<Employee | null>(null);

  const totalEmployees = employees.length;
  const avgScore = totalEmployees ? Math.round(employees.reduce((s, e) => s + e.finalScore, 0) / totalEmployees) : 0;
  const topPerformer = [...employees].sort((a, b) => b.finalScore - a.finalScore)[0];
  const uniqueHotels = new Set(employees.map((e) => e.hotel)).size;

  const eightLargestGroups = useMemo(() => listDesignationsByHeadcount(employees).slice(0, 8), [employees]);

  const atAGlanceData = useMemo(() => {
    return eightLargestGroups.map((designation) => {
      const top3 = employees
        .filter((e) => e.designation === designation)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, 3);
      return { designation, top3 };
    });
  }, [employees, eightLargestGroups]);

  const uniqueDeptCount = useMemo(() => new Set(employees.map((e) => e.department).filter(Boolean)).size, [employees]);

  const avgExperienceYears = totalEmployees
    ? Math.round(employees.reduce((s, e) => s + e.experience, 0) / totalEmployees)
    : 0;

  return (
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Employees" value={totalEmployees} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Average Score" value={avgScore} />
        </motion.div>
        <motion.div variants={item}>
          <StatCard icon={<Building2 className="h-5 w-5" />} label="Business units" value={uniqueHotels} />
        </motion.div>
        <motion.div variants={item}>
          <button
            type="button"
            disabled={!topPerformer}
            onClick={() => topPerformer && setTopPerformerDetail(topPerformer)}
            className="relative w-full text-left overflow-hidden rounded-xl p-4 text-primary-foreground transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'var(--gradient-warm)' }}
            aria-label={topPerformer ? `View details for ${topPerformer.name}` : 'Top performer'}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-1 text-sm font-medium opacity-90 mb-1">
                <Star className="h-4 w-4" /> Top Performer
              </div>
              <p className="text-xl font-bold">{topPerformer?.name ?? '—'}</p>
              <div className="flex items-center gap-1 text-sm mt-1 opacity-90">
                <span>{topPerformer?.designation ?? '—'}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span className="font-bold">{topPerformer?.finalScore ?? 0}</span>
              </div>
              {topPerformer && <p className="text-[11px] mt-2 opacity-80">Tap to view profile</p>}
            </div>
          </button>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Avg Experience', value: `${avgExperienceYears} yrs` },
            { label: 'Programmes', value: `${uniqueDeptCount}` },
            { label: 'Score ≥ 70', value: `${employees.filter((e) => e.finalScore >= 70).length}` },
            { label: 'Score < 40', value: `${employees.filter((e) => e.finalScore < 40).length}` },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-3 text-center transition-all duration-200 hover:scale-[1.02]">
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          At a Glance
        </h3>
        {atAGlanceData.length === 0 ? (
          <p className="text-sm text-muted-foreground">Rankings will show after employee data is available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {atAGlanceData.map(({ designation, top3 }) => (
              <motion.button
                key={designation}
                type="button"
                onClick={() => onAtGlanceOpenLeaderboard(designation)}
                className="glass-card rounded-xl p-4 text-left transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                whileHover={{ y: -2 }}
                aria-label={`Open leaderboard for ${designation}`}
              >
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3 truncate" title={designation}>
                  {designation}
                </p>
                <div className="space-y-2">
                  {top3.length === 0 ? (
                    <p className="text-xs text-muted-foreground">—</p>
                  ) : (
                    top3.map((emp, i) => (
                      <div key={emp.id} className="flex items-center gap-2.5 text-sm pointer-events-none">
                        <div
                          className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0
                      ${i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-silver/20 text-silver' : 'bg-bronze/20 text-bronze'}`}
                        >
                          {i + 1}
                        </div>
                        <span className="truncate text-foreground font-medium">{emp.name}</span>
                        <span className="ml-auto text-muted-foreground text-xs font-semibold shrink-0">{emp.finalScore}</span>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-wide">View leaderboard →</p>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      <EmployeeDetail employee={topPerformerDetail} open={!!topPerformerDetail} onClose={() => setTopPerformerDetail(null)} />
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02]">
      <div className="p-2.5 bg-primary/10 rounded-xl text-primary">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          <AnimatedCounter value={value} />
        </p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
