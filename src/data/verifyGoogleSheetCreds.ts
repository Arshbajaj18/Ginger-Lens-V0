const SHEET_ID = '1cI0GAXoiaZmg-6q11Z1zqWTw2BUKba4OypQ1EFGJlx8';
const CREDS_SHEET_NAME = 'Creds';

type CsvRow = Record<string, string>;

function normalize(value: string): string {
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

function parseCsv(csv: string): CsvRow[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: CsvRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return rows;
}

function getColumnKey(row: CsvRow, candidates: string[]): string | null {
  const keys = Object.keys(row);
  const normalized = keys.map((k) => k.trim().toLowerCase());

  for (const cand of candidates) {
    const c = cand.trim().toLowerCase();
    const idx = normalized.findIndex((k) => k === c || k.replace(/\s+/g, ' ') === c.replace(/\s+/g, ' '));
    if (idx >= 0) return keys[idx];
  }

  // Fallback: partial match
  for (const cand of candidates) {
    const c = cand.trim().toLowerCase();
    const idx = normalized.findIndex((k) => k.includes(c));
    if (idx >= 0) return keys[idx];
  }

  return null;
}

async function fetchCredsCsvFromSheetName(sheetName: string): Promise<string> {
  // Works without needing worksheet gid if the sheet is public.
  // https://developers.google.com/chart/interactive/docs/spreadsheets
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    sheetName,
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Sign-in verification is temporarily unavailable. Please try again.');
  return res.text();
}

export async function verifyCredentialsFromGoogleSheet(
  username: string,
  password: string,
): Promise<boolean> {
  const inputUser = normalize(username);
  const inputPass = password.trim();
  if (!inputUser || !inputPass) return false;

  const csv = await fetchCredsCsvFromSheetName(CREDS_SHEET_NAME);
  const rows = parseCsv(csv);
  if (!rows.length) return false;

  // Identify column names from the first row's header keys.
  const sample = rows[0];
  const userKey =
    getColumnKey(sample, ['username', 'user name', 'login', 'email']) ??
    Object.keys(sample).find((k) => normalize(k).includes('user')) ??
    null;

  const passKey =
    getColumnKey(sample, ['password', 'pass']) ??
    Object.keys(sample).find((k) => normalize(k).includes('pass')) ??
    null;

  if (!userKey || !passKey) return false;

  const creds = rows
    .map((r) => ({
      u: normalize(r[userKey] ?? ''),
      p: (r[passKey] ?? '').trim(),
    }))
    .filter((x) => x.u && x.p);

  return creds.some((c) => c.u === inputUser && c.p === inputPass);
}

