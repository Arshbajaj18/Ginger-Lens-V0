export type Department = 'Front Office' | 'Food & Beverage' | 'Housekeeping' | 'Engineering' | 'Finance' | 'Sales & Marketing' | 'Kitchen' | 'Administration';

export type Designation =
  | 'Apprentice' | 'DIWA' | 'GLP Trainee'
  | 'Room Attendant' | 'Janitor' | 'Utility Worker'
  | 'Guest Service Associate' | 'F&B Associate' | 'Commis III' | 'Commis II' | 'Commis I'
  | 'Housekeeping Supervisor' | 'Engineering Supervisor' | 'Restaurant Supervisor' | 'Front Office Executive'
  | 'Accounts Assistant' | 'Finance Executive' | 'Sales Executive'
  | 'Demi Chef de Partie' | 'Chef de Partie' | 'Sous Chef'
  | 'Assistant Restaurant Manager' | 'Assistant Sales Manager' | 'Assistant Manager Finance'
  | 'Assistant Hotel Manager' | 'Restaurant Manager' | 'Sales Manager'
  | 'Hotel Manager' | 'Cluster Manager' | 'Area General Manager' | 'Director of Sales';

export type Education = '10th Pass' | '12th Pass' | 'ITI / Diploma' | 'Graduate' | 'Postgraduate' | 'Hotel Management Diploma' | 'MBA';

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
  name: string;
  designation: Designation;
  department: Department;
  experience: number;
  education: Education;
  college: string;
  trainings: Training[];
  skills: string[];
  performanceReview: number;
  finalScore: number;
  rank: number;
  age: number;
  email: string;
  phone: string;
  hotel: string;
  hotelCity: string;
  joinDate: string;
  achievements: Achievement[];
  photoSeed: number;
}

const firstNames = [
  'Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Ayaan','Krishna','Ishaan',
  'Shaurya','Atharv','Advik','Pranav','Advaith','Dhruv','Kabir','Ritvik','Aarush','Kayaan',
  'Ananya','Diya','Myra','Sara','Aanya','Aadhya','Aaradhya','Anvi','Prisha','Riya',
  'Isha','Kavya','Navya','Saanvi','Aisha','Meera','Tara','Zara','Kiara','Nisha',
  'Rohan','Karan','Rahul','Amit','Vikram','Suresh','Rajesh','Deepak','Nikhil','Manish',
  'Pooja','Neha','Shreya','Tanvi','Simran','Priya','Divya','Swati','Anjali','Pallavi',
  'Harshit','Yash','Dev','Aryan','Kunal','Siddharth','Varun','Akash','Gaurav','Tushar',
  'Sneha','Ritika','Megha','Komal','Bhavna','Jyoti','Sonal','Nandini','Aanchal','Kritika',
  'Mohit','Pankaj','Sachin','Ajay','Ravi','Ashish','Vishal','Ankur','Mayank','Sumit',
  'Aparna','Rashmi','Garima','Preeti','Vandana','Madhuri','Shilpa','Rachna','Deepika','Sunita',
  'Hemant','Tarun','Lalit','Paresh','Dinesh','Girish','Hitesh','Jitesh','Kedar','Lokesh',
  'Rekha','Seema','Uma','Veena','Chitra','Geeta','Indira','Lakshmi','Mala','Padma',
  'Abhishek','Brijesh','Chandan','Devendra','Eshan','Farhan','Gopal','Harsh','Ishan','Jai',
  'Kamini','Latika','Manju','Nalini','Omana','Pushpa','Radha','Savita','Tanuja','Usha',
  'Vinod','Wasim','Yogesh','Zubin','Alok','Bharat','Chetan','Dilip','Ehsan','Faisal',
];

const lastNames = [
  'Sharma','Verma','Gupta','Singh','Kumar','Patel','Reddy','Nair','Iyer','Joshi',
  'Mehta','Shah','Rao','Pillai','Menon','Desai','Kulkarni','Bhat','Mishra','Pandey',
  'Chatterjee','Banerjee','Mukherjee','Das','Roy','Sen','Bose','Ghosh','Dutta','Sinha',
  'Agarwal','Jain','Kapoor','Malhotra','Chopra','Khanna','Arora','Sethi','Batra','Grover',
  'Thakur','Yadav','Chauhan','Rathore','Saxena','Trivedi','Shukla','Dwivedi','Tiwari','Dubey',
];

const gingerHotels: { name: string; city: string }[] = [
  { name: 'Ginger Goa', city: 'Goa' },
  { name: 'Ginger Mumbai Andheri', city: 'Mumbai' },
  { name: 'Ginger Pune Wakad', city: 'Pune' },
  { name: 'Ginger Ahmedabad SG Road', city: 'Ahmedabad' },
  { name: 'Ginger Bangalore IRR', city: 'Bangalore' },
  { name: 'Ginger Chennai', city: 'Chennai' },
  { name: 'Ginger Delhi Rail Yatri Niwas', city: 'New Delhi' },
  { name: 'Ginger Noida', city: 'Noida' },
  { name: 'Ginger Jaipur', city: 'Jaipur' },
  { name: 'Ginger Vadodara', city: 'Vadodara' },
  { name: 'Ginger Surat City Centre', city: 'Surat' },
  { name: 'Ginger Indore', city: 'Indore' },
  { name: 'Ginger Bhubaneswar', city: 'Bhubaneswar' },
  { name: 'Ginger Chandigarh', city: 'Chandigarh' },
  { name: 'Ginger Thiruvananthapuram', city: 'Thiruvananthapuram' },
  { name: 'Ginger Mysore', city: 'Mysore' },
  { name: 'Ginger Agartala', city: 'Agartala' },
  { name: 'Ginger Aurangabad', city: 'Aurangabad' },
  { name: 'Ginger Pondicherry', city: 'Pondicherry' },
  { name: 'Ginger Vizag', city: 'Visakhapatnam' },
  { name: 'Ginger Mangalore', city: 'Mangalore' },
  { name: 'Ginger Tirupur', city: 'Tirupur' },
  { name: 'Ginger Sanand Ahmedabad', city: 'Ahmedabad' },
  { name: 'Ginger Kalinganagar', city: 'Kalinganagar' },
  { name: 'Ginger Guwahati', city: 'Guwahati' },
  { name: 'Ginger Nashik', city: 'Nashik' },
  { name: 'Ginger Katra', city: 'Katra' },
  { name: 'Ginger Kolkata', city: 'Kolkata' },
  { name: 'Ginger Lucknow', city: 'Lucknow' },
  { name: 'Ginger Nagpur', city: 'Nagpur' },
];

const colleges: Record<Education, string[]> = {
  '10th Pass': ['Local Government School', 'Kendriya Vidyalaya', 'Jawahar Navodaya Vidyalaya'],
  '12th Pass': ['DPS', 'Kendriya Vidyalaya', 'DAV Public School', 'St. Xavier\'s School'],
  'ITI / Diploma': ['ITI Delhi', 'ITI Mumbai', 'Govt. Polytechnic Pune', 'ITI Bangalore', 'ITI Ahmedabad'],
  'Graduate': ['Mumbai University', 'Delhi University', 'Pune University', 'Gujarat University', 'Bangalore University', 'Calcutta University', 'Madras University', 'Osmania University'],
  'Postgraduate': ['JNU', 'Mumbai University', 'Delhi University', 'TISS Mumbai', 'Symbiosis Pune', 'Christ University Bangalore'],
  'Hotel Management Diploma': ['IHM Mumbai', 'IHM Delhi Pusa', 'IHM Bangalore', 'IHM Hyderabad', 'IHM Chennai', 'IHM Goa', 'IHM Jaipur', 'IHM Lucknow', 'WGSHA Manipal'],
  'MBA': ['IIM Indore', 'IIM Lucknow', 'XLRI Jamshedpur', 'SIBM Pune', 'IMT Ghaziabad', 'NMIMS Mumbai', 'Great Lakes Chennai', 'MDI Gurgaon'],
};

const trainingNames = [
  'Guest Relations Excellence','Fire Safety & Emergency','Food Safety & Hygiene',
  'Revenue Management','Leadership Development','Communication Skills',
  'Digital Marketing for Hotels','Housekeeping Standards','Front Desk Operations',
  'Conflict Resolution','Time Management','Customer Complaint Handling',
  'Brand Standards - Ginger','Financial Literacy','Team Building Workshop',
  'Cross-Cultural Sensitivity','First Aid Certification','POS System Training',
  'POSH Training','SOP Compliance','Swagat Program','TCOC Certification',
  'Upselling Techniques','Inventory Management','Sustainability Training',
  'Operational Excellence','Process Champion','Art of Business Storytelling',
];

const skillsList: Record<Department, string[]> = {
  'Front Office': ['Opera PMS', 'Guest Check-in/out', 'Reservation Management', 'Concierge Services', 'Billing & Invoicing', 'CRM Software', 'Multi-language', 'Complaint Resolution'],
  'Food & Beverage': ['Menu Planning', 'Table Service', 'Wine Knowledge', 'POS Systems', 'Banquet Operations', 'Buffet Management', 'Food Pairing', 'Mixology'],
  'Housekeeping': ['Room Inspection', 'Laundry Operations', 'Inventory Control', 'Chemical Safety', 'Deep Cleaning', 'Linen Management', 'Pest Control Coord.'],
  'Engineering': ['HVAC Systems', 'Electrical Maintenance', 'Plumbing', 'Fire Systems', 'Energy Management', 'Generator Operations', 'BMS Operations'],
  'Finance': ['Tally ERP', 'SAP', 'GST Compliance', 'Accounts Payable', 'Budgeting', 'Payroll Management', 'Audit Preparation', 'Revenue Analysis'],
  'Sales & Marketing': ['Lead Generation', 'Corporate Sales', 'OTA Management', 'Revenue Strategy', 'Social Media', 'Event Planning', 'CRM Tools', 'Market Analysis'],
  'Kitchen': ['HACCP Standards', 'Menu Development', 'Cost Control', 'Plate Presentation', 'Baking', 'Indian Cuisine', 'Continental Cuisine', 'Garde Manger'],
  'Administration': ['MS Office', 'HR Operations', 'Vendor Management', 'Compliance', 'Report Generation', 'Scheduling', 'Document Management'],
};

const achievementTitles = [
  'Employee of the Month','Best Guest Feedback Score','100% Attendance Award',
  'Fire Safety Champion','Top Upseller of Quarter','Brand Audit Excellence',
  'CSAT Score Above 95%','Zero Complaint Month','Cross-Training Completion',
  'Best Team Player Award','Innovation Award','Sustainability Champion',
  'Revenue Target Exceeded','Training Excellence Award','Customer Delight Award',
];

// Designation hierarchy with distribution and department mapping
const designationConfig: { designation: Designation; count: number; minExp: number; maxExp: number; departments: Department[] }[] = [
  { designation: 'Apprentice', count: 40, minExp: 0, maxExp: 1, departments: ['Front Office','Food & Beverage','Kitchen','Housekeeping'] },
  { designation: 'DIWA', count: 25, minExp: 0, maxExp: 2, departments: ['Front Office','Food & Beverage','Housekeeping'] },
  { designation: 'GLP Trainee', count: 15, minExp: 0, maxExp: 1, departments: ['Front Office','Food & Beverage','Administration'] },
  { designation: 'Room Attendant', count: 15, minExp: 1, maxExp: 4, departments: ['Housekeeping'] },
  { designation: 'Guest Service Associate', count: 55, minExp: 1, maxExp: 5, departments: ['Front Office'] },
  { designation: 'F&B Associate', count: 50, minExp: 1, maxExp: 5, departments: ['Food & Beverage'] },
  { designation: 'Commis III', count: 25, minExp: 1, maxExp: 3, departments: ['Kitchen'] },
  { designation: 'Commis II', count: 25, minExp: 2, maxExp: 5, departments: ['Kitchen'] },
  { designation: 'Commis I', count: 20, minExp: 3, maxExp: 6, departments: ['Kitchen'] },
  { designation: 'Housekeeping Supervisor', count: 20, minExp: 3, maxExp: 8, departments: ['Housekeeping'] },
  { designation: 'Engineering Supervisor', count: 18, minExp: 3, maxExp: 10, departments: ['Engineering'] },
  { designation: 'Restaurant Supervisor', count: 15, minExp: 3, maxExp: 7, departments: ['Food & Beverage'] },
  { designation: 'Front Office Executive', count: 20, minExp: 2, maxExp: 6, departments: ['Front Office'] },
  { designation: 'Accounts Assistant', count: 12, minExp: 1, maxExp: 5, departments: ['Finance'] },
  { designation: 'Finance Executive', count: 15, minExp: 2, maxExp: 7, departments: ['Finance'] },
  { designation: 'Sales Executive', count: 10, minExp: 2, maxExp: 6, departments: ['Sales & Marketing'] },
  { designation: 'Demi Chef de Partie', count: 8, minExp: 4, maxExp: 8, departments: ['Kitchen'] },
  { designation: 'Chef de Partie', count: 12, minExp: 5, maxExp: 10, departments: ['Kitchen'] },
  { designation: 'Sous Chef', count: 10, minExp: 6, maxExp: 12, departments: ['Kitchen'] },
  { designation: 'Assistant Restaurant Manager', count: 8, minExp: 4, maxExp: 8, departments: ['Food & Beverage'] },
  { designation: 'Assistant Sales Manager', count: 8, minExp: 4, maxExp: 8, departments: ['Sales & Marketing'] },
  { designation: 'Assistant Manager Finance', count: 6, minExp: 4, maxExp: 8, departments: ['Finance'] },
  { designation: 'Restaurant Manager', count: 8, minExp: 5, maxExp: 10, departments: ['Food & Beverage'] },
  { designation: 'Sales Manager', count: 6, minExp: 5, maxExp: 10, departments: ['Sales & Marketing'] },
  { designation: 'Assistant Hotel Manager', count: 15, minExp: 5, maxExp: 12, departments: ['Administration'] },
  { designation: 'Hotel Manager', count: 20, minExp: 7, maxExp: 18, departments: ['Administration'] },
  { designation: 'Cluster Manager', count: 6, minExp: 10, maxExp: 20, departments: ['Administration'] },
  { designation: 'Area General Manager', count: 4, minExp: 12, maxExp: 22, departments: ['Administration'] },
  { designation: 'Director of Sales', count: 3, minExp: 10, maxExp: 18, departments: ['Sales & Marketing'] },
];

const educationByDesignation: Record<string, Education[]> = {
  'Apprentice': ['10th Pass', '12th Pass'],
  'DIWA': ['12th Pass', 'ITI / Diploma'],
  'GLP Trainee': ['Graduate', 'Hotel Management Diploma'],
  'Room Attendant': ['10th Pass', '12th Pass'],
  'Janitor': ['10th Pass'],
  'Utility Worker': ['10th Pass', '12th Pass'],
  'Guest Service Associate': ['12th Pass', 'Graduate', 'Hotel Management Diploma'],
  'F&B Associate': ['12th Pass', 'Graduate', 'Hotel Management Diploma'],
  'Commis III': ['10th Pass', '12th Pass', 'ITI / Diploma'],
  'Commis II': ['12th Pass', 'ITI / Diploma'],
  'Commis I': ['ITI / Diploma', 'Hotel Management Diploma'],
  'Housekeeping Supervisor': ['12th Pass', 'Graduate', 'ITI / Diploma'],
  'Engineering Supervisor': ['ITI / Diploma', 'Graduate'],
  'Restaurant Supervisor': ['Graduate', 'Hotel Management Diploma'],
  'Front Office Executive': ['Graduate', 'Hotel Management Diploma'],
  'Accounts Assistant': ['Graduate'],
  'Finance Executive': ['Graduate', 'Postgraduate'],
  'Sales Executive': ['Graduate', 'Hotel Management Diploma'],
  'Demi Chef de Partie': ['ITI / Diploma', 'Hotel Management Diploma'],
  'Chef de Partie': ['Hotel Management Diploma', 'Graduate'],
  'Sous Chef': ['Hotel Management Diploma', 'Graduate'],
  'Assistant Restaurant Manager': ['Graduate', 'Hotel Management Diploma', 'Postgraduate'],
  'Assistant Sales Manager': ['Graduate', 'Postgraduate', 'MBA'],
  'Assistant Manager Finance': ['Graduate', 'Postgraduate', 'MBA'],
  'Restaurant Manager': ['Graduate', 'Hotel Management Diploma', 'Postgraduate'],
  'Sales Manager': ['Postgraduate', 'MBA'],
  'Assistant Hotel Manager': ['Graduate', 'Postgraduate', 'MBA'],
  'Hotel Manager': ['Postgraduate', 'MBA'],
  'Cluster Manager': ['MBA'],
  'Area General Manager': ['MBA', 'Postgraduate'],
  'Director of Sales': ['MBA', 'Postgraduate'],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const random = seededRandom(42);

function randInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

const educationWeight: Record<Education, number> = {
  '10th Pass': 15,
  '12th Pass': 25,
  'ITI / Diploma': 40,
  'Graduate': 55,
  'Hotel Management Diploma': 65,
  'Postgraduate': 80,
  'MBA': 100,
};

function computeScore(emp: { education: Education; experience: number; trainings: Training[]; performanceReview: number; skills: string[] }): number {
  const eduNorm = educationWeight[emp.education];
  const expNorm = Math.min(emp.experience / 25, 1) * 100;
  const avgTraining = emp.trainings.length > 0 ? emp.trainings.reduce((s, t) => s + t.score, 0) / emp.trainings.length : 0;
  const skillNorm = Math.min(emp.skills.length / 8, 1) * 100;
  const combinedSkillTraining = (skillNorm * 0.4 + avgTraining * 0.6); // blend skills and trainings

  return Math.round(
    eduNorm * 0.30 +
    expNorm * 0.30 +
    combinedSkillTraining * 0.20 +
    emp.performanceReview * 0.20
  );
}

function generateEmployees(): Employee[] {
  const employees: Employee[] = [];
  let id = 1;
  const usedNames = new Set<string>();

  for (const { designation, count, minExp, maxExp, departments } of designationConfig) {
    for (let i = 0; i < count; i++) {
      let name: string;
      do {
        name = `${pick(firstNames)} ${pick(lastNames)}`;
      } while (usedNames.has(name));
      usedNames.add(name);

      const department = pick(departments);
      const experience = randInt(minExp, maxExp);
      const age = 18 + experience + randInt(0, 8);
      const eduOptions = educationByDesignation[designation] || ['Graduate'];
      const education = pick(eduOptions);
      const college = pick(colleges[education]);

      const numTrainings = randInt(3, 8);
      const shuffled = [...trainingNames].sort(() => random() - 0.5);
      const trainings: Training[] = shuffled.slice(0, numTrainings).map(t => ({
        name: t,
        score: randInt(40, 100),
      }));

      const deptSkills = skillsList[department];
      const numSkills = randInt(2, Math.min(6, deptSkills.length));
      const skills = [...deptSkills].sort(() => random() - 0.5).slice(0, numSkills);

      const hotel = pick(gingerHotels);

      const joinYear = 2026 - experience - randInt(0, 1);
      const joinMonth = randInt(1, 12);
      const joinDay = randInt(1, 28);
      const joinDate = `${joinYear}-${String(joinMonth).padStart(2, '0')}-${String(joinDay).padStart(2, '0')}`;

      const numAchievements = randInt(0, 3);
      const achievements: Achievement[] = [...achievementTitles]
        .sort(() => random() - 0.5)
        .slice(0, numAchievements)
        .map(title => ({ title, year: randInt(joinYear, 2026) }));

      const firstName = name.split(' ')[0].toLowerCase();
      const lastName = name.split(' ')[1].toLowerCase();
      const email = `${firstName}.${lastName}@gingerhotels.com`;
      const phone = `+91 ${randInt(70000, 99999)} ${randInt(10000, 99999)}`;

      const performanceReview = randInt(30, 100);

      const base = {
        id: id++,
        name,
        designation,
        department,
        experience,
        education,
        college,
        trainings,
        skills,
        performanceReview,
        age,
        email,
        phone,
        hotel: hotel.name,
        hotelCity: hotel.city,
        joinDate,
        achievements,
        photoSeed: randInt(1, 999),
        finalScore: 0,
        rank: 0,
      };

      base.finalScore = computeScore(base);
      employees.push(base as Employee);
    }
  }

  // Compute ranks within each designation
  const desigGroups = new Map<Designation, Employee[]>();
  for (const emp of employees) {
    if (!desigGroups.has(emp.designation)) desigGroups.set(emp.designation, []);
    desigGroups.get(emp.designation)!.push(emp);
  }
  for (const group of desigGroups.values()) {
    group.sort((a, b) => b.finalScore - a.finalScore);
    group.forEach((emp, idx) => { emp.rank = idx + 1; });
  }

  return employees;
}

export const employees = generateEmployees();

export const allDesignations: Designation[] = [
  'Apprentice','DIWA','GLP Trainee','Room Attendant',
  'Guest Service Associate','F&B Associate','Commis III','Commis II','Commis I',
  'Housekeeping Supervisor','Engineering Supervisor','Restaurant Supervisor','Front Office Executive',
  'Accounts Assistant','Finance Executive','Sales Executive',
  'Demi Chef de Partie','Chef de Partie','Sous Chef',
  'Assistant Restaurant Manager','Assistant Sales Manager','Assistant Manager Finance',
  'Restaurant Manager','Sales Manager',
  'Assistant Hotel Manager','Hotel Manager','Cluster Manager','Area General Manager','Director of Sales',
];

export const allDepartments: Department[] = [
  'Front Office','Food & Beverage','Housekeeping','Engineering','Finance','Sales & Marketing','Kitchen','Administration',
];
