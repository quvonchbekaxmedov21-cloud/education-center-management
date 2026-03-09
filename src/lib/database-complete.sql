-- ============================================================================
-- COMPLETE EDUCATION CENTER DATABASE SCHEMA
-- Multi-Portal System with Authentication
-- ============================================================================
-- Run this SQL in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/sql/new
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION TABLES
-- ============================================================================

-- Users table (extended from Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE, -- Links to Supabase auth.users
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student', 'teacher', 'parent')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent-Student relationships
CREATE TABLE IF NOT EXISTS parent_student (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent', -- parent, guardian, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- ============================================================================
-- CORE EDUCATION TABLES (Updated)
-- ============================================================================

-- Students Table (Enhanced)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  enrolled_courses TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  join_date DATE NOT NULL,
  profile_photo_url TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructors Table (Enhanced)
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialization TEXT[] DEFAULT '{}',
  courses TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  join_date DATE NOT NULL,
  hourly_rate DECIMAL(10, 2) DEFAULT 0,
  bio TEXT,
  qualifications TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table (Enhanced)
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES instructors(id),
  schedule TEXT,
  duration TEXT,
  capacity INTEGER DEFAULT 0,
  enrolled INTEGER DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  level TEXT, -- beginner, intermediate, advanced
  prerequisites TEXT,
  syllabus TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Enrollments (New - tracks student enrollments)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'pending')),
  grade DECIMAL(5, 2),
  completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Teacher-Course assignments (New)
CREATE TABLE IF NOT EXISTS teacher_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, course_id)
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),
  instructor_id UUID REFERENCES instructors(id),
  students TEXT[] DEFAULT '{}',
  schedule TEXT,
  room TEXT,
  capacity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  score DECIMAL(5, 2) NOT NULL,
  max_score DECIMAL(5, 2) NOT NULL,
  percentage DECIMAL(5, 2) GENERATED ALWAYS AS ((score / max_score) * 100) STORED,
  date DATE NOT NULL,
  remarks TEXT,
  graded_by UUID REFERENCES instructors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homework Table (Enhanced)
CREATE TABLE IF NOT EXISTS homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'assigned',
  assigned_by UUID REFERENCES instructors(id),
  max_points DECIMAL(5, 2) DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homework Submissions (New - tracks individual submissions)
CREATE TABLE IF NOT EXISTS homework_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  submission_date TIMESTAMP WITH TIME ZONE,
  submission_text TEXT,
  file_url TEXT,
  grade DECIMAL(5, 2),
  feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late', 'missing')),
  graded_by UUID REFERENCES instructors(id),
  graded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(homework_id, student_id)
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table (Enhanced)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  subject TEXT,
  message TEXT NOT NULL,
  sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placement Tests Table
CREATE TABLE IF NOT EXISTS placement_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  student_email TEXT,
  test_date DATE NOT NULL,
  level TEXT,
  score DECIMAL(5, 2),
  recommended_course TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NEW FEATURE TABLES
-- ============================================================================

-- Salaries Table (For Teachers)
CREATE TABLE IF NOT EXISTS salaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  base_salary DECIMAL(10, 2) NOT NULL,
  bonus DECIMAL(10, 2) DEFAULT 0,
  deductions DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) GENERATED ALWAYS AS (base_salary + bonus - deductions) STORED,
  payment_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(instructor_id, month, year)
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  target_audience TEXT[] DEFAULT '{}', -- ['all', 'students', 'teachers', 'parents']
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  certificate_number TEXT UNIQUE NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completion_date DATE NOT NULL,
  grade TEXT,
  certificate_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table (Track important changes)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

-- Instructors indexes
CREATE INDEX IF NOT EXISTS idx_instructors_email ON instructors(email);
CREATE INDEX IF NOT EXISTS idx_instructors_status ON instructors(status);
CREATE INDEX IF NOT EXISTS idx_instructors_user_id ON instructors(user_id);

-- Courses indexes
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);

-- Enrollments indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON course_enrollments(status);

-- Attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);

-- Test results indexes
CREATE INDEX IF NOT EXISTS idx_test_results_student ON test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_test_results_course ON test_results(course_id);

-- Homework indexes
CREATE INDEX IF NOT EXISTS idx_homework_course ON homework(course_id);
CREATE INDEX IF NOT EXISTS idx_homework_due_date ON homework(due_date);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_homework ON homework_submissions(homework_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON homework_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON homework_submissions(status);

-- Materials indexes
CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Salaries indexes
CREATE INDEX IF NOT EXISTS idx_salaries_instructor ON salaries(instructor_id);
CREATE INDEX IF NOT EXISTS idx_salaries_status ON salaries(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- For development: Allow all operations (TEMPORARY - should be restricted in production)
-- You can modify these policies later for proper role-based access control

CREATE POLICY "Allow all for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for parent_student" ON parent_student FOR ALL USING (true);
CREATE POLICY "Allow all for students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all for instructors" ON instructors FOR ALL USING (true);
CREATE POLICY "Allow all for courses" ON courses FOR ALL USING (true);
CREATE POLICY "Allow all for course_enrollments" ON course_enrollments FOR ALL USING (true);
CREATE POLICY "Allow all for teacher_courses" ON teacher_courses FOR ALL USING (true);
CREATE POLICY "Allow all for groups" ON groups FOR ALL USING (true);
CREATE POLICY "Allow all for attendance" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all for payments" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all for test_results" ON test_results FOR ALL USING (true);
CREATE POLICY "Allow all for homework" ON homework FOR ALL USING (true);
CREATE POLICY "Allow all for homework_submissions" ON homework_submissions FOR ALL USING (true);
CREATE POLICY "Allow all for materials" ON materials FOR ALL USING (true);
CREATE POLICY "Allow all for messages" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all for placement_tests" ON placement_tests FOR ALL USING (true);
CREATE POLICY "Allow all for salaries" ON salaries FOR ALL USING (true);
CREATE POLICY "Allow all for announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Allow all for notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow all for certificates" ON certificates FOR ALL USING (true);
CREATE POLICY "Allow all for audit_logs" ON audit_logs FOR ALL USING (true);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample users (Admin, Teachers, Students, Parents)
INSERT INTO users (email, full_name, role, status, phone) VALUES
('admin@school.com', 'Admin User', 'admin', 'active', '+1234567890'),
('teacher1@school.com', 'John Smith', 'teacher', 'active', '+1234567891'),
('teacher2@school.com', 'Sarah Johnson', 'teacher', 'active', '+1234567892'),
('student1@school.com', 'Michael Brown', 'student', 'active', '+1234567893'),
('student2@school.com', 'Emma Wilson', 'student', 'active', '+1234567894'),
('student3@school.com', 'James Davis', 'student', 'active', '+1234567895'),
('parent1@school.com', 'Robert Brown', 'parent', 'active', '+1234567896'),
('parent2@school.com', 'Jennifer Wilson', 'parent', 'active', '+1234567897')
ON CONFLICT (email) DO NOTHING;

-- Insert sample instructors
INSERT INTO instructors (name, surname, email, phone, specialization, status, join_date, hourly_rate) VALUES
('John', 'Smith', 'teacher1@school.com', '+1234567891', ARRAY['Mathematics', 'Physics'], 'active', '2023-01-15', 50.00),
('Sarah', 'Johnson', 'teacher2@school.com', '+1234567892', ARRAY['English', 'Literature'], 'active', '2023-02-20', 45.00),
('David', 'Williams', 'teacher3@school.com', '+1234567899', ARRAY['Chemistry', 'Biology'], 'active', '2023-03-10', 48.00)
ON CONFLICT (email) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (name, code, description, schedule, duration, capacity, price, status, start_date, level) VALUES
('Advanced Mathematics', 'MATH301', 'Comprehensive mathematics course covering calculus and algebra', 'Mon/Wed 10:00-12:00', '12 weeks', 30, 599.99, 'active', '2024-01-15', 'advanced'),
('English Literature', 'ENG201', 'Study of classic and modern literature', 'Tue/Thu 14:00-16:00', '10 weeks', 25, 499.99, 'active', '2024-01-20', 'intermediate'),
('Chemistry Fundamentals', 'CHEM101', 'Introduction to chemistry principles', 'Mon/Wed/Fri 09:00-11:00', '14 weeks', 20, 699.99, 'active', '2024-02-01', 'beginner')
ON CONFLICT (code) DO NOTHING;

-- Link instructors to courses
UPDATE courses SET instructor_id = (SELECT id FROM instructors WHERE email = 'teacher1@school.com' LIMIT 1) WHERE code = 'MATH301';
UPDATE courses SET instructor_id = (SELECT id FROM instructors WHERE email = 'teacher2@school.com' LIMIT 1) WHERE code = 'ENG201';
UPDATE courses SET instructor_id = (SELECT id FROM instructors WHERE email = 'teacher3@school.com' LIMIT 1) WHERE code = 'CHEM101';

-- Insert sample students
INSERT INTO students (name, surname, email, phone, parent_name, parent_phone, status, join_date) VALUES
('Michael', 'Brown', 'student1@school.com', '+1234567893', 'Robert Brown', '+1234567896', 'active', '2024-01-10'),
('Emma', 'Wilson', 'student2@school.com', '+1234567894', 'Jennifer Wilson', '+1234567897', 'active', '2024-01-12'),
('James', 'Davis', 'student3@school.com', '+1234567895', 'Patricia Davis', '+1234567898', 'active', '2024-01-15')
ON CONFLICT (email) DO NOTHING;

-- Insert sample announcements
INSERT INTO announcements (title, content, target_audience, priority, status) VALUES
('Welcome to New Semester', 'We are excited to start the new semester with you all!', ARRAY['all'], 'high', 'active'),
('Exam Schedule Released', 'Please check the schedule for upcoming exams.', ARRAY['students', 'teachers'], 'normal', 'active'),
('Parent-Teacher Meeting', 'Join us for our quarterly parent-teacher meeting.', ARRAY['parents', 'teachers'], 'normal', 'active');

-- ============================================================================
-- FUNCTIONS (Helper functions for common operations)
-- ============================================================================

-- Function to get student's enrolled courses
CREATE OR REPLACE FUNCTION get_student_courses(student_email TEXT)
RETURNS TABLE (
  course_id UUID,
  course_name TEXT,
  course_code TEXT,
  instructor_name TEXT,
  schedule TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.code,
    CONCAT(i.name, ' ', i.surname) as instructor_name,
    c.schedule,
    ce.status
  FROM course_enrollments ce
  JOIN students s ON ce.student_id = s.id
  JOIN courses c ON ce.course_id = c.id
  LEFT JOIN instructors i ON c.instructor_id = i.id
  WHERE s.email = student_email;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate student attendance percentage
CREATE OR REPLACE FUNCTION get_attendance_percentage(student_email TEXT, course_code TEXT DEFAULT NULL)
RETURNS DECIMAL AS $$
DECLARE
  total_classes INTEGER;
  attended_classes INTEGER;
BEGIN
  IF course_code IS NULL THEN
    SELECT COUNT(*) INTO total_classes
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE s.email = student_email;
    
    SELECT COUNT(*) INTO attended_classes
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    WHERE s.email = student_email AND a.status = 'present';
  ELSE
    SELECT COUNT(*) INTO total_classes
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN courses c ON a.course_id = c.id
    WHERE s.email = student_email AND c.code = course_code;
    
    SELECT COUNT(*) INTO attended_classes
    FROM attendance a
    JOIN students s ON a.student_id = s.id
    JOIN courses c ON a.course_id = c.id
    WHERE s.email = student_email AND c.code = course_code AND a.status = 'present';
  END IF;
  
  IF total_classes = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ROUND((attended_classes::DECIMAL / total_classes * 100), 2);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS (Convenient pre-joined data)
-- ============================================================================

-- View: Student Dashboard Summary
CREATE OR REPLACE VIEW student_dashboard_view AS
SELECT 
  s.id as student_id,
  s.email,
  s.name,
  s.surname,
  COUNT(DISTINCT ce.course_id) as total_courses,
  AVG(tr.percentage) as average_grade,
  (SELECT get_attendance_percentage(s.email)) as attendance_percentage,
  COUNT(DISTINCT CASE WHEN p.status = 'pending' THEN p.id END) as pending_payments
FROM students s
LEFT JOIN course_enrollments ce ON s.id = ce.student_id AND ce.status = 'active'
LEFT JOIN test_results tr ON s.id = tr.student_id
LEFT JOIN payments p ON s.id = p.student_id
GROUP BY s.id, s.email, s.name, s.surname;

-- View: Teacher Dashboard Summary
CREATE OR REPLACE VIEW teacher_dashboard_view AS
SELECT 
  i.id as instructor_id,
  i.email,
  i.name,
  i.surname,
  COUNT(DISTINCT tc.course_id) as total_courses,
  COUNT(DISTINCT ce.student_id) as total_students,
  i.hourly_rate,
  (SELECT COALESCE(SUM(total), 0) FROM salaries WHERE instructor_id = i.id AND status = 'paid') as total_earned
FROM instructors i
LEFT JOIN teacher_courses tc ON i.id = tc.teacher_id AND tc.status = 'active'
LEFT JOIN course_enrollments ce ON tc.course_id = ce.course_id AND ce.status = 'active'
GROUP BY i.id, i.email, i.name, i.surname, i.hourly_rate;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'DATABASE SETUP COMPLETE!';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'Created tables: users, students, instructors, courses, enrollments, etc.';
  RAISE NOTICE 'Sample data added: Admin, 3 Teachers, 3 Students, 2 Parents, 3 Courses';
  RAISE NOTICE 'Demo accounts created (password will be set via Supabase Auth):';
  RAISE NOTICE '  - admin@school.com (Admin)';
  RAISE NOTICE '  - teacher1@school.com (Teacher)';
  RAISE NOTICE '  - student1@school.com (Student)';
  RAISE NOTICE '  - parent1@school.com (Parent)';
  RAISE NOTICE '============================================================================';
END $$;
