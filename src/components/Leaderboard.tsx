import { useEffect, useMemo, useState } from 'react';
import { listDesignations, Employee } from '@/data/employees';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, Medal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import EmployeeDetail from './EmployeeDetail';

interface LeaderboardProps {
  employees: Employee[];
}

export default function Leaderboard({ employees }: LeaderboardProps) {
  const designations = useMemo(() => listDesignations(employees), [employees]);
  const [designation, setDesignation] = useState<string>('');
  const [selected, setSelected] = useState<Employee | null>(null);
  const [page, setPage] = useState(1);

  const activeDesignation =
    designation && designations.includes(designation) ? designation : designations[0] ?? '';

  const ranked = useMemo(
    () => employees.filter((e) => e.designation === activeDesignation).sort((a, b) => b.finalScore - a.finalScore),
    [activeDesignation, employees],
  );

  useEffect(() => {
    setPage(1);
  }, [activeDesignation]);

  const pageSize = 50;
  const shownTop = Math.min(3, ranked.length);
  const list = ranked.slice(shownTop);
  const listStartRank = shownTop + 1;

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedList = list.slice((safePage - 1) * pageSize, safePage * pageSize);

  if (!employees.length) {
    return <p className="text-sm text-muted-foreground">No employee records loaded yet.</p>;
  }

  if (!designations.length) {
    return <p className="text-sm text-muted-foreground">No role data available.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Select value={activeDesignation || undefined} onValueChange={setDesignation}>
          <SelectTrigger className="w-full sm:w-64 bg-card">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {designations.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{ranked.length} employees</span>
      </div>

      {ranked.length > 0 && (
        <div className="flex items-end justify-center gap-3 sm:gap-6 py-4">
          {ranked[1] && <PodiumCard emp={ranked[1]} rank={2} height="h-36" onClick={() => setSelected(ranked[1])} />}
          {ranked[0] && <PodiumCard emp={ranked[0]} rank={1} height="h-44" onClick={() => setSelected(ranked[0])} />}
          {ranked[2] && <PodiumCard emp={ranked[2]} rank={3} height="h-36" onClick={() => setSelected(ranked[2])} />}
        </div>
      )}

      <div className="space-y-2">
        {pagedList.map((emp, idx) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02, duration: 0.2 }}
            className="glass-card rounded-xl p-3 flex items-center gap-4 cursor-pointer hover:scale-[1.01] transition-all"
            onClick={() => setSelected(emp)}
          >
            <span className="w-8 text-center text-sm font-bold text-muted-foreground">
              #{listStartRank + (safePage - 1) * pageSize + idx}
            </span>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.photoSeed}`} alt={emp.name} className="h-8 w-8 rounded-full bg-muted" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{emp.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {emp.hotelCity} · {emp.experience} yrs
              </p>
            </div>
            <Progress value={emp.finalScore} className="w-20 h-1.5 hidden sm:block" />
            <span
              className={`font-bold text-sm ${emp.finalScore >= 75 ? 'text-success' : emp.finalScore >= 50 ? 'text-foreground' : 'text-destructive'}`}
            >
              {emp.finalScore}
            </span>
          </motion.div>
        ))}
      </div>

      {list.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-muted-foreground">
            Page <span className="font-medium text-foreground">{safePage}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
              Previous
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      <EmployeeDetail employee={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function PodiumCard({ emp, rank, height, onClick }: { emp: Employee; rank: number; height: string; onClick: () => void }) {
  const styles: Record<number, { gradient: string; icon: React.ReactNode }> = {
    1: { gradient: 'from-gold/20 to-gold/5 border-gold/30', icon: <Crown className="h-5 w-5 text-gold" /> },
    2: { gradient: 'from-silver/20 to-silver/5 border-silver/30', icon: <Medal className="h-5 w-5 text-silver" /> },
    3: { gradient: 'from-bronze/20 to-bronze/5 border-bronze/30', icon: <Medal className="h-5 w-5 text-bronze" /> },
  };
  const s = styles[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.4 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${height} w-28 sm:w-36 rounded-xl bg-gradient-to-b ${s.gradient} border cursor-pointer hover:scale-105 transition-transform p-2 sm:p-3`}
    >
      {s.icon}
      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.photoSeed}`} alt={emp.name} className="h-10 w-10 rounded-full bg-muted" />
      <p className="text-[10px] sm:text-xs font-semibold text-foreground text-center line-clamp-2 leading-tight w-full">{emp.name}</p>
      <p className="text-lg font-bold text-foreground">{emp.finalScore}</p>
    </motion.div>
  );
}
