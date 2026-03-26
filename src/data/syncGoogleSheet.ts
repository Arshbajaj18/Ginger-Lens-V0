import { Employee, employees as demoEmployees, Designation, Education } from '@/data/employees';

const SHEET_ID = '151TRaox4bkal5-EpdFtiN1B-wg-QtK4iln7Ndm0xdlI';
const DEFAULT_GID = '0';

type SheetRow = Record<string, string>;

const educationWeight: Record<Education, number> = {
  '10th Pass': 15,
  '12th Pass': 25,
  'ITI / Diploma': 40,
  'Graduate': 55,
  'Hotel Management Diploma': 65,
  'Postgraduate': 80,
  'MBA': 100,
};

const validDesignations = new Set<Designation>([
  'Apprentice', 'DIWA', 'GLP Trainee', 'Room Attendant', 'Janitor', 'Utility Worker',
  'Guest Service Associate', 'F&B Associate', 'Commis III', 'Commis II', 'Commis I',
  'Housekeeping Supervisor', 'Engineering Supervisor', 'Restaurant Supervisor', 'Front Office Executive',
  'Accounts Assistant', 'Finance Executive', 'Sales Executive', 'Demi Chef de Partie', 'Chef de Partie',
  'Sous Chef', 'Assistant Restaurant Manager', 'Assistant Sales Manager', 'Assistant Manager Finance',
  'Assistant Hotel Manager', 'Restaurant Manager', 'Sales Manager', 'Hotel Manager', 'Cluster Manager',
  'Area General Manager', 'Director of Sales',
]);

const designationAliases: Record<string, Designation> = {
  'glp trainee': 'GLP Trainee',
  'glp (trainee)': 'GLP Trainee',
  'guest service associate': 'Guest Service Associate',
  'guest service associate ': 'Guest Service Associate',
  'guest service associate.': 'Guest Service Associate',
  'assistant hotel manager ( independent charge)': 'Assistant Hotel Manager',
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

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
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function experienceFromJoinDate(joinDate: string | null): number | null {
  if (!joinDate) return null;
  const joined = new Date(joinDate);
  if (Number.isNaN(joined.getTime())) return null;
  const now = new Date();
  const years = now.getFullYear() - joined.getFullYear();
  return Math.max(0, years);
}

function mapEducation(raw: string): Education | null {
  const value = normalizeText(raw);
  if (!value) return null;
  if (value.includes('mba')) return 'MBA';
  if (value.includes('mhm') || value.includes('hotel management')) return 'Hotel Management Diploma';
  if (value.includes('m.com') || value.includes('mcom') || value.includes('postgraduate')) return 'Postgraduate';
  if (value.includes('b.tech') || value.includes('btech') || value.includes('b.com') || value.includes('bcom') || value.includes('b.sc') || value.includes('bsc') || value.includes('bba') || value.includes('ba') || value.includes('graduate')) {
    return 'Graduate';
  }
  if (value.includes('diploma') || value.includes('iti')) return 'ITI / Diploma';
  if (value.includes('12')) return '12th Pass';
  if (value.includes('10')) return '10th Pass';
  return null;
}

function mapDesignation(raw: string): Designation | null {
  const normalized = normalizeText(raw);
  if (!normalized) return null;
  const aliased = designationAliases[normalized] ?? raw.trim();
  if (validDesignations.has(aliased as Designation)) return aliased as Designation;
  return null;
}

function computeFinalScore(emp: Employee): number {
  const eduNorm = educationWeight[emp.education];
  const expNorm = Math.min(emp.experience / 25, 1) * 100;
  const avgTraining = emp.trainings.length
    ? emp.trainings.reduce((sum, t) => sum + t.score, 0) / emp.trainings.length
    : 0;
  const skillNorm = Math.min(emp.skills.length / 8, 1) * 100;
  const skillTraining = skillNorm * 0.4 + avgTraining * 0.6;

  return Math.round(
    eduNorm * 0.3 +
    expNorm * 0.3 +
    skillTraining * 0.2 +
    emp.performanceReview * 0.2
  );
}

function reRankWithinDesignation(list: Employee[]): Employee[] {
  const cloned = list.map((e) => ({ ...e }));
  const group = new Map<Designation, Employee[]>();

  for (const emp of cloned) {
    const arr = group.get(emp.designation) ?? [];
    arr.push(emp);
    group.set(emp.designation, arr);
  }

  for (const arr of group.values()) {
    arr.sort((a, b) => b.finalScore - a.finalScore);
    arr.forEach((emp, idx) => {
      emp.rank = idx + 1;
    });
  }

  return cloned;
}

function buildCsvUrl(sheetId: string, gid = DEFAULT_GID): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

function rowKey(row: SheetRow): { employeeNo: string; email: string; name: string } {
  return {
    employeeNo: normalizeText(row['EMPLOYEE NO'] ?? ''),
    email: normalizeText(row['BUSINESS EMAIL ADDRESS'] ?? ''),
    name: normalizeText(row['EMPLOYEE NAME'] ?? ''),
  };
}

function mergeEmployee(base: Employee, row: SheetRow): Employee {
  const mappedDesignation = mapDesignation(row['POSITION'] ?? '');
  const mappedEducation = mapEducation(row['Highest Education'] ?? '');
  const joinDate = parseDate(row['Date of Joining'] ?? '');
  const expFromDate = experienceFromJoinDate(joinDate);

  const merged: Employee = {
    ...base,
    name: row['EMPLOYEE NAME']?.trim() || base.name,
    email: row['BUSINESS EMAIL ADDRESS']?.trim() || base.email,
    designation: mappedDesignation ?? base.designation,
    education: mappedEducation ?? base.education,
    hotel: row['BUSINESS UNIT']?.trim() || base.hotel,
    hotelCity: row['REGION']?.trim() || base.hotelCity,
    age: Number(row['AGE']) > 0 ? Number(row['AGE']) : base.age,
    joinDate: joinDate ?? base.joinDate,
    experience: expFromDate ?? base.experience,
  };

  merged.finalScore = computeFinalScore(merged);
  return merged;
}

function createEmployeeFromRow(row: SheetRow, id: number): Employee {
  const base = demoEmployees[id % demoEmployees.length];
  const merged = mergeEmployee(
    {
      ...base,
      id,
      photoSeed: base.photoSeed + id,
      name: base.name,
      email: base.email,
    },
    row
  );
  return merged;
}

export async function syncEmployeesFromGoogleSheet(
  currentEmployees: Employee[],
  options?: { sheetId?: string; gid?: string }
): Promise<{ mergedEmployees: Employee[]; syncedRows: number }> {
  const sheetId = options?.sheetId ?? SHEET_ID;
  const gid = options?.gid ?? DEFAULT_GID;
  const response = await fetch(buildCsvUrl(sheetId, gid));
  if (!response.ok) {
    throw new Error(`Sheet sync failed with status ${response.status}`);
  }

  const csv = await response.text();
  const rows = parseCsv(csv);
  if (!rows.length) {
    return { mergedEmployees: currentEmployees, syncedRows: 0 };
  }

  const byEmail = new Map(currentEmployees.map((e) => [normalizeText(e.email), e]));
  const byName = new Map(currentEmployees.map((e) => [normalizeText(e.name), e]));
  const mergedMap = new Map<number, Employee>(currentEmployees.map((e) => [e.id, { ...e }]));

  let nextId = Math.max(...currentEmployees.map((e) => e.id), 0) + 1;
  let syncedRows = 0;

  for (const row of rows) {
    const key = rowKey(row);
    if (!key.employeeNo && !key.email && !key.name) continue;

    const matched =
      (key.email ? byEmail.get(key.email) : undefined) ??
      (key.name ? byName.get(key.name) : undefined);

    if (matched) {
      mergedMap.set(matched.id, mergeEmployee(mergedMap.get(matched.id) ?? matched, row));
      syncedRows++;
      continue;
    }

    mergedMap.set(nextId, createEmployeeFromRow(row, nextId));
    nextId++;
    syncedRows++;
  }

  const mergedEmployees = reRankWithinDesignation(Array.from(mergedMap.values()));
  return { mergedEmployees, syncedRows };
}
