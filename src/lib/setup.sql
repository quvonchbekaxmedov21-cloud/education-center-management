-- Education Center Database Setup
-- Run this SQL in Supabase SQL Editor: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  enrolled_courses TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  join_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructors Table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialization TEXT[] DEFAULT '{}',
  courses TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  join_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
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
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES courses(id),
  date DATE NOT NULL,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES courses(id),
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Results Table
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  course_id UUID REFERENCES courses(id),
  test_name TEXT NOT NULL,
  score DECIMAL(5, 2) NOT NULL,
  max_score DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homework Table
CREATE TABLE IF NOT EXISTS homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  assigned_date DATE NOT NULL,
  status TEXT DEFAULT 'assigned',
  student_id UUID REFERENCES students(id),
  grade DECIMAL(5, 2),
  submission_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials Table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_by TEXT,
  uploaded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  parent_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Placement Tests Table
CREATE TABLE IF NOT EXISTS placement_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  test_date DATE NOT NULL,
  level TEXT,
  score DECIMAL(5, 2),
  recommended_course TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_test_results_student ON test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_course ON homework(course_id);
CREATE INDEX IF NOT EXISTS idx_materials_course ON materials(course_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for development/learning purposes)
-- In production, you should implement proper authentication and authorization

CREATE POLICY "Enable read access for all users" ON students FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON students FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON students FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON instructors FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON instructors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON instructors FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON instructors FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON courses FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON courses FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON courses FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON groups FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON groups FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON groups FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON attendance FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON attendance FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON payments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON payments FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON test_results FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON test_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON test_results FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON test_results FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON homework FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON homework FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON homework FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON homework FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON materials FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON materials FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON materials FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON messages FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON messages FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON placement_tests FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON placement_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON placement_tests FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON placement_tests FOR DELETE USING (true);
