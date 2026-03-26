import { useMemo, useState } from 'react';
import { Employee, allDepartments } from '@/data/employees';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = [
  'hsl(38, 100%, 50%)', 'hsl(25, 100%, 55%)', 'hsl(350, 80%, 55%)', 'hsl(152, 60%, 40%)',
  'hsl(220, 60%, 55%)', 'hsl(280, 60%, 55%)', 'hsl(180, 60%, 40%)', 'hsl(43, 96%, 56%)',
];

interface ScoreDistributionProps {
  employees: Employee[];
}

export default function ScoreDistribution({ employees }: ScoreDistributionProps) {
  const [chartType, setChartType] = useState<'distribution' | 'departments' | 'education' | 'radar'>('distribution');

  const distributionData = useMemo(() => {
    const buckets = [
      { range: '0-30', count: 0 }, { range: '31-50', count: 0 },
      { range: '51-65', count: 0 }, { range: '66-75', count: 0 },
      { range: '76-85', count: 0 }, { range: '86-100', count: 0 },
    ];
    employees.forEach(e => {
      if (e.finalScore <= 30) buckets[0].count++;
      else if (e.finalScore <= 50) buckets[1].count++;
      else if (e.finalScore <= 65) buckets[2].count++;
      else if (e.finalScore <= 75) buckets[3].count++;
      else if (e.finalScore <= 85) buckets[4].count++;
      else buckets[5].count++;
    });
    return buckets;
  }, [employees]);

  const deptData = useMemo(() =>
    allDepartments.map(dept => {
      const group = employees.filter(e => e.department === dept);
      return {
        dept: dept.length > 12 ? dept.slice(0, 10) + '…' : dept,
        avg: group.length ? Math.round(group.reduce((s, e) => s + e.finalScore, 0) / group.length) : 0,
        count: group.length,
      };
    }), [employees]);

  const educationData = useMemo(() => {
    const groups = ['10th Pass', '12th Pass', 'ITI / Diploma', 'Graduate', 'Hotel Management Diploma', 'Postgraduate', 'MBA'] as const;
    return groups.map(edu => ({
      name: edu === 'Hotel Management Diploma' ? 'HM Diploma' : edu,
      count: employees.filter(e => e.education === edu).length,
    })).filter(d => d.count > 0);
  }, [employees]);

  const radarData = useMemo(() => {
    const avg = (fn: (e: typeof employees[0]) => number) =>
      Math.round(employees.reduce((s, e) => s + fn(e), 0) / employees.length);
    return [
      { metric: 'Performance', value: avg(e => e.performanceReview), fullMark: 100 },
      { metric: 'Experience', value: avg(e => Math.min(e.experience / 25, 1) * 100), fullMark: 100 },
      { metric: 'Score', value: avg(e => e.finalScore), fullMark: 100 },
      { metric: 'Skills', value: avg(e => Math.min(e.skills.length / 8, 1) * 100), fullMark: 100 },
    ];
  }, [employees]);

  const tabs = [
    { key: 'distribution', label: 'Score Distribution' },
    { key: 'departments', label: 'By Department' },
    { key: 'education', label: 'By Education' },
    { key: 'radar', label: 'Metrics Radar' },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setChartType(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              chartType === t.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl p-3 sm:p-6">
        <div className="h-64 sm:h-80">
          {chartType === 'distribution' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'hsl(20, 8%, 46%)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(20, 8%, 46%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(30, 10%, 90%)', borderRadius: '0.75rem', fontSize: 13 }} />
                <Bar dataKey="count" fill="hsl(38, 100%, 50%)" radius={[6, 6, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {chartType === 'departments' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 10%, 90%)" />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: 'hsl(20, 8%, 46%)' }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(20, 8%, 46%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(30, 10%, 90%)', borderRadius: '0.75rem', fontSize: 13 }} />
                <Bar dataKey="avg" fill="hsl(38, 100%, 50%)" radius={[6, 6, 0, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {chartType === 'education' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={educationData} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                  {educationData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(30, 10%, 90%)', borderRadius: '0.75rem', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {chartType === 'radar' && (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(30, 10%, 90%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: 'hsl(20, 8%, 46%)' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(20, 8%, 46%)' }} />
                <Radar name="Company Avg" dataKey="value" stroke="hsl(38, 100%, 50%)" fill="hsl(38, 100%, 50%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {deptData.slice(0, 4).map((r, i) => (
          <motion.div
            key={r.dept}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="glass-card rounded-xl p-4 text-center transition-all duration-200 hover:scale-[1.02]"
          >
            <p className="text-xs text-muted-foreground font-medium">{r.dept}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{r.avg}</p>
            <p className="text-xs text-primary font-medium">{r.count} employees</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
