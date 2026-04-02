import { Employee, listDesignations, listDepartments } from '@/data/employees';
import { Users, TrendingUp, Star, ArrowUpRight, Trophy, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { useMemo } from 'react';

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
}

export default function DashboardStats({ employees }: DashboardStatsProps) {
  const totalEmployees = employees.length;
  const avgScore = totalEmployees ? Math.round(employees.reduce((s, e) => s + e.finalScore, 0) / totalEmployees) : 0;
  const topPerformer = [...employees].sort((a, b) => b.finalScore - a.finalScore)[0];
  const uniqueHotels = new Set(employees.map((e) => e.hotel)).size;

  const designationsWithPeople = useMemo(() => listDesignations(employees), [employees]);

  const top3ByDesig = useMemo(() => {
    return designationsWithPeople.slice(0, 8).map((designation) => {
      const sorted = employees.filter((e) => e.designation === designation).sort((a, b) => b.finalScore - a.finalScore);
      return { designation, top3: sorted.slice(0, 3) };
    });
  }, [employees, designationsWithPeople]);

  const uniqueDeptCount = listDepartments(employees).length;

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
          <div className="relative overflow-hidden rounded-xl p-4 text-primary-foreground" style={{ background: 'var(--gradient-warm)' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
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
            </div>
          </div>
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
          Top Performers by Position
        </h3>
        {top3ByDesig.length === 0 ? (
          <p className="text-sm text-muted-foreground">Rankings will show after employee data is available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {top3ByDesig.map(({ designation, top3 }) => (
              <motion.div
                key={designation}
                className="glass-card rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]"
                whileHover={{ y: -2 }}
              >
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3 truncate" title={designation}>
                  {designation}
                </p>
                <div className="space-y-2">
                  {top3.map((emp, i) => (
                    <div key={emp.id} className="flex items-center gap-2.5 text-sm">
                      <div
                        className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold
                      ${i === 0 ? 'bg-gold/20 text-gold' : i === 1 ? 'bg-silver/20 text-silver' : 'bg-bronze/20 text-bronze'}`}
                      >
                        {i + 1}
                      </div>
                      <span className="truncate text-foreground font-medium">{emp.name}</span>
                      <span className="ml-auto text-muted-foreground text-xs font-semibold">{emp.finalScore}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
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
