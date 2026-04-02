import type { Achievement, Employee, Training } from '@/data/employees';

const SHEET_ID = '1cI0GAXoiaZmg-6q11Z1zqWTw2BUKba4OypQ1EFGJlx8';
const EMPLOYEE_TAB_GID = '23940764';

const PHONE_PLACEHOLDER = '-';

type SheetRow = Record<string, string>;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  out.push(current.trim());
  return out;
}

function parseCsv(csv: string): SheetRow[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows: SheetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: SheetRow = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return rows;
}

function parseDate(value: string): string | null {
  if (!value?.trim()) return null;
  const date = new Date(value.trim());
  if (Number.isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function experienceFromJoinDate(joinDate: string | null): number {
  if (!joinDate) return 0;
  const joined = new Date(joinDate);
  if (Number.isNaN(joined.getTime())) return 0;
  const now = new Date();
  const diffMs = now.getTime() - joined.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.round(years * 10) / 10);
}

function parseNumber(raw: string): number {
  const n = parseFloat(String(raw).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
}

function splitList(raw: string): string[] {
  return raw
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildTrainings(trainingsDoneRaw: string, trainingScore: number): Training[] {
  const names = splitList(trainingsDoneRaw);
  if (!names.length) return [];
  const per = trainingScore / names.length;
  return names.map((name) => ({
    name,
    score: Math.round(Math.min(100, Math.max(0, per)) * 10) / 10,
  }));
}

function buildAchievements(raw: string): Achievement[] {
  return splitList(raw).map((title) => ({ title, year: 0 }));
}

function photoSeedFrom(employeeNo: string, name: string): number {
  const s = `${employeeNo}|${name}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 100000 || 1;
}

function rowKey(row: SheetRow): boolean {
  const no = (row['EMPLOYEE NO'] ?? '').trim();
  const name = (row['EMPLOYEE NAME'] ?? '').trim();
  return !!(no || name);
}

function buildCsvUrl(sheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

function reRankWithinDesignation(list: Employee[]): Employee[] {
  const cloned = list.map((e) => ({ ...e }));
  const group = new Map<string, Employee[]>();

  for (const emp of cloned) {
    const key = emp.designation || '—';
    const arr = group.get(key) ?? [];
    arr.push(emp);
    group.set(key, arr);
  }

  for (const arr of group.values()) {
    arr.sort((a, b) => b.finalScore - a.finalScore);
    arr.forEach((emp, idx) => {
      emp.rank = idx + 1;
    });
  }

  return cloned;
}

function employeeFromRow(row: SheetRow, id: number): Employee {
  const employeeNo = (row['EMPLOYEE NO'] ?? '').trim();
  const name = (row['EMPLOYEE NAME'] ?? '').trim() || '—';
  const position = (row['POSITION'] ?? '').trim();
  const businessUnit = (row['BUSINESS UNIT'] ?? '').trim();
  const email = (row['BUSINESS EMAIL ADDRESS'] ?? '').trim();
  const joinRaw = row['Date of Joining'] ?? '';
  const joinDate = parseDate(joinRaw) ?? '';
  const age = Math.round(parseNumber(row['AGE'] ?? '')) || 0;
  const area = (row['AREA'] ?? '').trim();
  const highestEducation = (row['Highest Education'] ?? '').trim();
  const educationGrade = (row['Education Grade'] ?? '').trim();
  const dateAssumingRaw = (row['Date of Assuming current role'] ?? '').trim();
  const dateAssuming = parseDate(dateAssumingRaw) ?? dateAssumingRaw;
  const programme = (row['Programme'] ?? '').trim();
  const currentLevel = (row['Current level of Position'] ?? '').trim();
  const trainingsDone = (row['Trainings Done'] ?? '').trim();
  const skillsGained = (row['Skills gained'] ?? '').trim();
  const educationScore = parseNumber(row['Education Score'] ?? '');
  const experienceScore = parseNumber(row['Experience Score'] ?? '');
  const trainingScore = parseNumber(row['Training Score'] ?? '');
  const skillScore = parseNumber(row['Skill Score'] ?? '');
  const overallPoints = parseNumber(row['Overall Points'] ?? '');
  const eligible = (row['Eligible for Promotion'] ?? '').trim();
  const achievementsRaw = (row['Achievements / STAR Points'] ?? '').trim();
  const hmRemarks = (row['HM Remarks'] ?? '').trim();

  const finalScore = Math.round(overallPoints);
  const experience = experienceFromJoinDate(joinDate || null);
  const trainings = buildTrainings(trainingsDone, trainingScore);
  const skills = splitList(skillsGained);
  const achievements = buildAchievements(achievementsRaw);

  return {
    id,
    employeeNo,
    name,
    position,
    businessUnit,
    email,
    phone: PHONE_PLACEHOLDER,
    dateOfJoining: joinDate,
    age,
    area,
    highestEducation,
    educationGrade,
    dateAssumingCurrentRole: dateAssuming,
    programme,
    currentLevelOfPosition: currentLevel,
    trainingsDone,
    skillsGained,
    educationScore,
    experienceScore,
    trainingScore,
    skillScore,
    overallPoints,
    eligibleForPromotion: eligible,
    achievementsStarPoints: achievementsRaw,
    hmRemarks,
    rank: 0,
    finalScore,
    experience,
    photoSeed: photoSeedFrom(employeeNo || String(id), name),
    designation: position,
    department: programme || '—',
    hotel: businessUnit,
    hotelCity: area,
    joinDate: joinDate || joinRaw.trim(),
    education: highestEducation,
    college: educationGrade,
    trainings,
    skills,
    achievements,
    performanceReview: Math.round(Math.min(100, Math.max(0, skillScore))),
  };
}

export async function syncEmployeesFromGoogleSheet(
  _currentEmployees: Employee[],
  options?: { sheetId?: string; gid?: string },
): Promise<{ mergedEmployees: Employee[]; syncedRows: number }> {
  const sheetId = options?.sheetId ?? SHEET_ID;
  const gid = options?.gid ?? EMPLOYEE_TAB_GID;
  const response = await fetch(buildCsvUrl(sheetId, gid));
  if (!response.ok) {
    throw new Error(`Update failed (${response.status}). Please try again.`);
  }

  const csv = await response.text();
  const rows = parseCsv(csv).filter(rowKey);

  if (!rows.length) {
    return { mergedEmployees: [], syncedRows: 0 };
  }

  const employees = rows.map((row, idx) => employeeFromRow(row, idx + 1));
  const mergedEmployees = reRankWithinDesignation(employees);

  return { mergedEmployees, syncedRows: mergedEmployees.length };
}
