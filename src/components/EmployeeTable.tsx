import { useEffect, useMemo, useState } from 'react';
import { allDesignations, allDepartments, Employee } from '@/data/employees';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowUpDown, Search, LayoutGrid, List, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import EmployeeDetail from './EmployeeDetail';

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  const isMobile = useIsMobile();
  const [desigFilter, setDesigFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [view, setView] = useState<'table' | 'card'>('card');
  const [page, setPage] = useState(1);

  const effectiveView = isMobile ? 'card' : view;

  const filtered = useMemo(() => {
    let result = employees;
    if (desigFilter !== 'all') result = result.filter(e => e.designation === desigFilter);
    if (deptFilter !== 'all') result = result.filter(e => e.department === deptFilter);
    if (search) result = result.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.hotel.toLowerCase().includes(search.toLowerCase()));
    return [...result].sort((a, b) => sortAsc ? a.finalScore - b.finalScore : b.finalScore - a.finalScore);
  }, [desigFilter, deptFilter, search, sortAsc]);

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedEmployees = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [desigFilter, deptFilter, search, sortAsc, effectiveView]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or hotel..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <Select value={desigFilter} onValueChange={setDesigFilter}>
          <SelectTrigger className="w-full sm:w-52 bg-card">
            <SelectValue placeholder="Designation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            {allDesignations.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-44 bg-card">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {allDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="hidden sm:flex gap-1 border border-border rounded-lg p-0.5 bg-card">
          <Button variant={view === 'table' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('table')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={view === 'card' ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('card')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">{filtered.length} employees found</div>

      <AnimatePresence mode="wait">
        {effectiveView === 'table' ? (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border text-muted-foreground">
                      <th className="text-left font-semibold px-4 py-3">Employee</th>
                      <th className="text-left font-semibold px-4 py-3">Designation</th>
                      <th className="text-left font-semibold px-4 py-3">Dept</th>
                      <th className="text-left font-semibold px-4 py-3">Hotel</th>
                      <th className="text-left font-semibold px-4 py-3">Exp</th>
                      <th className="text-left font-semibold px-4 py-3 cursor-pointer select-none group" onClick={() => setSortAsc(!sortAsc)}>
                        <span className="inline-flex items-center gap-1">Score <ArrowUpDown className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" /></span>
                      </th>
                      <th className="text-left font-semibold px-4 py-3">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedEmployees.map((emp, idx) => (
                      <motion.tr
                        key={emp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.005, duration: 0.2 }}
                        className="border-b border-border last:border-0 hover:bg-primary/5 cursor-pointer transition-colors"
                        onClick={() => setSelected(emp)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.photoSeed}`}
                              alt={emp.name}
                              className="h-8 w-8 rounded-full bg-muted"
                            />
                            <div>
                              <p className="font-medium text-foreground">{emp.name}</p>
                              <p className="text-xs text-muted-foreground">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{emp.designation}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{emp.department}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{emp.hotel.replace('Ginger ', '')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{emp.experience} yrs</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={emp.finalScore} className="w-16 h-1.5" />
                            <span className={`font-semibold ${emp.finalScore >= 75 ? 'text-success' : emp.finalScore >= 50 ? 'text-foreground' : 'text-destructive'}`}>
                              {emp.finalScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-medium">#{emp.rank}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No employees found.</div>
              )}
              {filtered.length > 0 && totalPages > 1 && (
                <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Page <span className="font-medium text-foreground">{safePage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
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
            </div>
          </motion.div>
        ) : (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pagedEmployees.map((emp, idx) => (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.015, duration: 0.3 }}
                  onClick={() => setSelected(emp)}
                  className="glass-card rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.photoSeed}`}
                      alt={emp.name}
                      className="h-10 w-10 rounded-full bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.designation} · {emp.department}</p>
                    </div>
                    <span className={`text-lg font-bold ${emp.finalScore >= 75 ? 'text-success' : emp.finalScore >= 50 ? 'text-foreground' : 'text-destructive'}`}>
                      {emp.finalScore}
                    </span>
                  </div>
                  <Progress value={emp.finalScore} className="h-1.5 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{emp.hotelCity}</span>
                    <span>Rank #{emp.rank} · {emp.experience} yrs</span>
                  </div>
                </motion.div>
              ))}
            </div>
            {filtered.length > 0 && totalPages > 1 && (
              <div className="mt-4 border-t border-border pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  Page <span className="font-medium text-foreground">{safePage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
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
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No employees found.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <EmployeeDetail employee={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
