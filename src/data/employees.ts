/** In-memory employee roster; populated when the app loads organization data. */

export interface Training {
  name: string;
  score: number;
}

export interface Achievement {
  title: string;
  year: number;
}

export interface Employee {
  id: number;
  employeeNo: string;
  name: string;
  position: string;
  businessUnit: string;
  email: string;
  phone: string;
  dateOfJoining: string;
  age: number;
  area: string;
  highestEducation: string;
  educationGrade: string;
  dateAssumingCurrentRole: string;
  programme: string;
  currentLevelOfPosition: string;
  trainingsDone: string;
  skillsGained: string;
  educationScore: number;
  experienceScore: number;
  trainingScore: number;
  skillScore: number;
  overallPoints: number;
  eligibleForPromotion: string;
  achievementsStarPoints: string;
  hmRemarks: string;

  /** Rank within same `designation` (Overall Points desc). */
  rank: number;
  /** Rounded Overall Points for cards, charts, leaderboard. */
  finalScore: number;
  /** Years since Date of Joining (0 if unknown). */
  experience: number;
  /** Stable seed for avatar. */
  photoSeed: number;

  /** Alias: position */
  designation: string;
  /** Alias: programme */
  department: string;
  /** Alias: businessUnit */
  hotel: string;
  /** Alias: area */
  hotelCity: string;
  /** ISO or yyyy-mm-dd for Date of Joining */
  joinDate: string;
  /** Alias: highestEducation */
  education: string;
  /** Alias: educationGrade */
  college: string;
  trainings: Training[];
  skills: string[];
  achievements: Achievement[];
  performanceReview: number;
}

export const employees: Employee[] = [];

export function listDesignations(employeesList: Employee[]): string[] {
  return [...new Set(employeesList.map((e) => e.designation).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function listDepartments(employeesList: Employee[]): string[] {
  return [...new Set(employeesList.map((e) => e.department).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function listEducationLevels(employeesList: Employee[]): string[] {
  return [...new Set(employeesList.map((e) => e.education).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}
