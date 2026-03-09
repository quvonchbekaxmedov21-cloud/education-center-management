export interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  enrollmentDate: string;
  courses: string[];
  groupId: string;
  status: 'active' | 'inactive';
  grade?: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  balance: number;
  discount: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  duration: string;
  price: number;
  status: 'active' | 'completed' | 'upcoming';
  groupId: string;
}

export interface Instructor {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  specialty: string;
  courses: string[];
  groups: string[];
  experience: string;
  rating: number;
  salary: number;
  salaryStatus: 'paid' | 'pending';
  lastPaymentDate?: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  day: string;
  time: string;
  room: string;
  duration: string;
}

export interface Group {
  id: string;
  name: string;
  level: 'elementary' | 'intermediate' | 'advanced';
  subject: string;
  teacherId: string;
  teacherName: string;
  students: string[];
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  testType: 'weekly' | 'monthly' | 'mock' | 'placement';
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  feedback?: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  subject: string;
  groupId: string;
  uploadDate: string;
  fileUrl: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherName: string;
  dueDate: string;
  assignedDate: string;
  subject: string;
  attachments?: string[];
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'cash' | 'card' | 'transfer';
  notes?: string;
}

export interface PlacementTest {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  subject: string;
  score: number;
  recommendedLevel: 'elementary' | 'intermediate' | 'advanced';
  date: string;
  status: 'completed' | 'pending' | 'assigned';
}

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Emma',
    surname: 'Johnson',
    email: 'emma.j@email.com',
    phone: '(555) 123-4567',
    parentName: 'Robert Johnson',
    parentPhone: '(555) 123-4560',
    parentEmail: 'robert.j@email.com',
    enrollmentDate: '2024-01-15',
    courses: ['CS101', 'MATH201'],
    groupId: 'g1',
    status: 'active',
    grade: 'A',
    paymentStatus: 'paid',
    balance: 0,
    discount: 10
  },
  {
    id: '2',
    name: 'Michael',
    surname: 'Chen',
    email: 'michael.c@email.com',
    phone: '(555) 234-5678',
    parentName: 'Linda Chen',
    parentPhone: '(555) 234-5670',
    parentEmail: 'linda.c@email.com',
    enrollmentDate: '2024-02-01',
    courses: ['CS101', 'ENG101'],
    groupId: 'g1',
    status: 'active',
    grade: 'B+',
    paymentStatus: 'pending',
    balance: 599,
    discount: 0
  },
  {
    id: '3',
    name: 'Sarah',
    surname: 'Williams',
    email: 'sarah.w@email.com',
    phone: '(555) 345-6789',
    parentName: 'James Williams',
    parentPhone: '(555) 345-6780',
    parentEmail: 'james.w@email.com',
    enrollmentDate: '2023-09-10',
    courses: ['MATH201', 'PHYS101'],
    groupId: 'g2',
    status: 'active',
    grade: 'A-',
    paymentStatus: 'paid',
    balance: 0,
    discount: 5
  },
  {
    id: '4',
    name: 'James',
    surname: 'Rodriguez',
    email: 'james.r@email.com',
    phone: '(555) 456-7890',
    parentName: 'Maria Rodriguez',
    parentPhone: '(555) 456-7891',
    parentEmail: 'maria.r@email.com',
    enrollmentDate: '2024-01-20',
    courses: ['ENG101'],
    groupId: 'g3',
    status: 'active',
    grade: 'B',
    paymentStatus: 'overdue',
    balance: 499,
    discount: 0
  },
  {
    id: '5',
    name: 'Lisa',
    surname: 'Anderson',
    email: 'lisa.a@email.com',
    phone: '(555) 567-8901',
    parentName: 'David Anderson',
    parentPhone: '(555) 567-8902',
    parentEmail: 'david.a@email.com',
    enrollmentDate: '2023-08-15',
    courses: ['CS101', 'MATH201', 'PHYS101'],
    groupId: 'g2',
    status: 'inactive',
    grade: 'A',
    paymentStatus: 'paid',
    balance: 0,
    discount: 15
  },
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    instructor: 'Dr. Robert Smith',
    schedule: 'Mon, Wed 10:00 AM',
    capacity: 30,
    enrolled: 25,
    duration: '12 weeks',
    price: 599,
    status: 'active',
    groupId: 'g1'
  },
  {
    id: '2',
    name: 'Advanced Mathematics',
    code: 'MATH201',
    instructor: 'Prof. Jennifer Lee',
    schedule: 'Tue, Thu 2:00 PM',
    capacity: 25,
    enrolled: 20,
    duration: '14 weeks',
    price: 649,
    status: 'active',
    groupId: 'g2'
  },
  {
    id: '3',
    name: 'English Literature',
    code: 'ENG101',
    instructor: 'Dr. David Brown',
    schedule: 'Mon, Wed 1:00 PM',
    capacity: 20,
    enrolled: 15,
    duration: '10 weeks',
    price: 499,
    status: 'active',
    groupId: 'g3'
  },
  {
    id: '4',
    name: 'Physics Fundamentals',
    code: 'PHYS101',
    instructor: 'Dr. Maria Garcia',
    schedule: 'Tue, Thu 10:00 AM',
    capacity: 28,
    enrolled: 22,
    duration: '12 weeks',
    price: 579,
    status: 'active',
    groupId: 'g2'
  },
  {
    id: '5',
    name: 'Web Development',
    code: 'CS202',
    instructor: 'Dr. Robert Smith',
    schedule: 'Fri 9:00 AM',
    capacity: 25,
    enrolled: 0,
    duration: '16 weeks',
    price: 799,
    status: 'upcoming',
    groupId: 'g1'
  },
];

export const mockInstructors: Instructor[] = [
  {
    id: '1',
    name: 'Robert',
    surname: 'Smith',
    email: 'robert.smith@education.com',
    phone: '(555) 111-2222',
    specialty: 'Computer Science',
    courses: ['CS101', 'CS202'],
    groups: ['g1'],
    experience: '10 years',
    rating: 4.8,
    salary: 5000,
    salaryStatus: 'paid',
    lastPaymentDate: '2026-02-01'
  },
  {
    id: '2',
    name: 'Jennifer',
    surname: 'Lee',
    email: 'jennifer.lee@education.com',
    phone: '(555) 222-3333',
    specialty: 'Mathematics',
    courses: ['MATH201'],
    groups: ['g2'],
    experience: '15 years',
    rating: 4.9,
    salary: 5500,
    salaryStatus: 'paid',
    lastPaymentDate: '2026-02-01'
  },
  {
    id: '3',
    name: 'David',
    surname: 'Brown',
    email: 'david.brown@education.com',
    phone: '(555) 333-4444',
    specialty: 'English Literature',
    courses: ['ENG101'],
    groups: ['g3'],
    experience: '8 years',
    rating: 4.7,
    salary: 4500,
    salaryStatus: 'pending',
    lastPaymentDate: '2026-01-01'
  },
  {
    id: '4',
    name: 'Maria',
    surname: 'Garcia',
    email: 'maria.garcia@education.com',
    phone: '(555) 444-5555',
    specialty: 'Physics',
    courses: ['PHYS101'],
    groups: ['g2'],
    experience: '12 years',
    rating: 4.9,
    salary: 5200,
    salaryStatus: 'paid',
    lastPaymentDate: '2026-02-01'
  },
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    courseId: '1',
    courseName: 'Introduction to Computer Science',
    instructor: 'Dr. Robert Smith',
    day: 'Monday',
    time: '10:00 AM - 12:00 PM',
    room: 'Room 101',
    duration: '2 hours'
  },
  {
    id: '2',
    courseId: '1',
    courseName: 'Introduction to Computer Science',
    instructor: 'Dr. Robert Smith',
    day: 'Wednesday',
    time: '10:00 AM - 12:00 PM',
    room: 'Room 101',
    duration: '2 hours'
  },
  {
    id: '3',
    courseId: '2',
    courseName: 'Advanced Mathematics',
    instructor: 'Prof. Jennifer Lee',
    day: 'Tuesday',
    time: '2:00 PM - 4:00 PM',
    room: 'Room 203',
    duration: '2 hours'
  },
  {
    id: '4',
    courseId: '2',
    courseName: 'Advanced Mathematics',
    instructor: 'Prof. Jennifer Lee',
    day: 'Thursday',
    time: '2:00 PM - 4:00 PM',
    room: 'Room 203',
    duration: '2 hours'
  },
  {
    id: '5',
    courseId: '3',
    courseName: 'English Literature',
    instructor: 'Dr. David Brown',
    day: 'Monday',
    time: '1:00 PM - 3:00 PM',
    room: 'Room 105',
    duration: '2 hours'
  },
  {
    id: '6',
    courseId: '3',
    courseName: 'English Literature',
    instructor: 'Dr. David Brown',
    day: 'Wednesday',
    time: '1:00 PM - 3:00 PM',
    room: 'Room 105',
    duration: '2 hours'
  },
  {
    id: '7',
    courseId: '4',
    courseName: 'Physics Fundamentals',
    instructor: 'Dr. Maria Garcia',
    day: 'Tuesday',
    time: '10:00 AM - 12:00 PM',
    room: 'Lab 301',
    duration: '2 hours'
  },
  {
    id: '8',
    courseId: '4',
    courseName: 'Physics Fundamentals',
    instructor: 'Dr. Maria Garcia',
    day: 'Thursday',
    time: '10:00 AM - 12:00 PM',
    room: 'Lab 301',
    duration: '2 hours'
  },
];

export const mockGroups: Group[] = [
  {
    id: 'g1',
    name: 'Computer Science - Elementary',
    level: 'elementary',
    subject: 'Computer Science',
    teacherId: '1',
    teacherName: 'Dr. Robert Smith',
    students: ['1', '2'],
    schedule: 'Mon, Wed 10:00 AM'
  },
  {
    id: 'g2',
    name: 'Mathematics - Advanced',
    level: 'advanced',
    subject: 'Mathematics',
    teacherId: '2',
    teacherName: 'Prof. Jennifer Lee',
    students: ['3', '5'],
    schedule: 'Tue, Thu 2:00 PM'
  },
  {
    id: 'g3',
    name: 'English Literature - Intermediate',
    level: 'intermediate',
    subject: 'English',
    teacherId: '3',
    teacherName: 'Dr. David Brown',
    students: ['4'],
    schedule: 'Mon, Wed 1:00 PM'
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Johnson',
    groupId: 'g1',
    date: '2026-02-17',
    status: 'present'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Michael Chen',
    groupId: 'g1',
    date: '2026-02-17',
    status: 'present'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Sarah Williams',
    groupId: 'g2',
    date: '2026-02-18',
    status: 'present'
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'James Rodriguez',
    groupId: 'g3',
    date: '2026-02-17',
    status: 'absent',
    notes: 'Sick leave'
  },
];

export const mockTestResults: TestResult[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Johnson',
    testType: 'weekly',
    subject: 'Computer Science',
    score: 95,
    maxScore: 100,
    date: '2026-02-10',
    feedback: 'Excellent work!'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Emma Johnson',
    testType: 'monthly',
    subject: 'Mathematics',
    score: 88,
    maxScore: 100,
    date: '2026-02-01',
    feedback: 'Good progress'
  },
  {
    id: '3',
    studentId: '2',
    studentName: 'Michael Chen',
    testType: 'weekly',
    subject: 'Computer Science',
    score: 82,
    maxScore: 100,
    date: '2026-02-10'
  },
  {
    id: '4',
    studentId: '3',
    studentName: 'Sarah Williams',
    testType: 'mock',
    subject: 'Mathematics',
    score: 92,
    maxScore: 100,
    date: '2026-02-15',
    feedback: 'Outstanding performance'
  },
];

export const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Introduction to Programming - Week 1',
    description: 'Basic concepts of programming and algorithms',
    type: 'pdf',
    subject: 'Computer Science',
    groupId: 'g1',
    uploadDate: '2026-02-01',
    fileUrl: '#'
  },
  {
    id: '2',
    title: 'Calculus Fundamentals Video',
    description: 'Understanding derivatives and integrals',
    type: 'video',
    subject: 'Mathematics',
    groupId: 'g2',
    uploadDate: '2026-02-05',
    fileUrl: '#'
  },
  {
    id: '3',
    title: 'Shakespeare Analysis',
    description: 'Literary analysis of Hamlet',
    type: 'document',
    subject: 'English',
    groupId: 'g3',
    uploadDate: '2026-02-10',
    fileUrl: '#'
  },
];

export const mockHomework: Homework[] = [
  {
    id: '1',
    title: 'Python Basics Assignment',
    description: 'Complete exercises 1-10 from the textbook',
    groupId: 'g1',
    groupName: 'Computer Science - Elementary',
    teacherId: '1',
    teacherName: 'Dr. Robert Smith',
    dueDate: '2026-02-25',
    assignedDate: '2026-02-18',
    subject: 'Computer Science'
  },
  {
    id: '2',
    title: 'Calculus Problem Set',
    description: 'Solve problems 15-30 on derivatives',
    groupId: 'g2',
    groupName: 'Mathematics - Advanced',
    teacherId: '2',
    teacherName: 'Prof. Jennifer Lee',
    dueDate: '2026-02-27',
    assignedDate: '2026-02-20',
    subject: 'Mathematics'
  },
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Johnson',
    amount: 599,
    date: '2026-02-01',
    status: 'completed',
    method: 'card'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Michael Chen',
    amount: 599,
    date: '2026-02-01',
    status: 'pending',
    method: 'cash'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Sarah Williams',
    amount: 649,
    date: '2026-01-15',
    status: 'completed',
    method: 'transfer'
  },
];

export const mockPlacementTests: PlacementTest[] = [
  {
    id: '1',
    studentName: 'Alex Martinez',
    email: 'alex.m@email.com',
    phone: '(555) 999-8888',
    subject: 'English',
    score: 75,
    recommendedLevel: 'intermediate',
    date: '2026-02-15',
    status: 'completed'
  },
  {
    id: '2',
    studentName: 'Sophie Turner',
    email: 'sophie.t@email.com',
    phone: '(555) 888-7777',
    subject: 'Mathematics',
    score: 45,
    recommendedLevel: 'elementary',
    date: '2026-02-18',
    status: 'completed'
  },
];

export const quickLinks = [
  {
    category: 'Test Registration',
    links: [
      { name: 'IELTS Registration', url: 'https://www.ielts.org/', icon: '📝' },
      { name: 'TOEFL Registration', url: 'https://www.ets.org/toefl.html', icon: '📝' },
      { name: 'SAT Registration', url: 'https://www.collegeboard.org/', icon: '📝' },
      { name: 'ACT Registration', url: 'https://www.act.org/', icon: '📝' },
    ]
  },
  {
    category: 'University Applications',
    links: [
      { name: 'Common App', url: 'https://www.commonapp.org/', icon: '🎓' },
      { name: 'UCAS (UK)', url: 'https://www.ucas.com/', icon: '🎓' },
      { name: 'Study in USA', url: 'https://www.educationusa.state.gov/', icon: '🎓' },
      { name: 'Study in Europe', url: 'https://www.studyineurope.eu/', icon: '🎓' },
    ]
  },
  {
    category: 'Learning Resources',
    links: [
      { name: 'Khan Academy', url: 'https://www.khanacademy.org/', icon: '📚' },
      { name: 'Coursera', url: 'https://www.coursera.org/', icon: '📚' },
      { name: 'edX', url: 'https://www.edx.org/', icon: '📚' },
      { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/', icon: '📚' },
    ]
  },
];