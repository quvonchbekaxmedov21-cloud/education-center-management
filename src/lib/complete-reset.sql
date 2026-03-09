-- ====================================
-- COMPLETE RESET AND SETUP
-- Run this ONE script to fix everything!
-- ====================================

-- PART 1: Clean up existing tables
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS homework_submissions CASCADE;
DROP TABLE IF EXISTS homework CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- PART 2: Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PART 3: Create function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Try to insert user, if email already exists, update the id
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (email) 
    DO UPDATE SET id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow all for users" ON users;
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true);

-- PART 4: Create other tables
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT,
    phone TEXT,
    hire_date DATE,
    status TEXT DEFAULT 'active'
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE,
    grade_level INTEGER,
    date_of_birth DATE,
    parent_id UUID,
    status TEXT DEFAULT 'active',
    phone TEXT,
    address TEXT
);

CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT,
    address TEXT,
    relationship TEXT
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code TEXT UNIQUE NOT NULL,
    course_name TEXT NOT NULL,
    teacher_id UUID REFERENCES teachers(id),
    schedule TEXT,
    room_number TEXT,
    capacity INTEGER,
    description TEXT,
    status TEXT DEFAULT 'active'
);

CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active',
    grade TEXT,
    UNIQUE(student_id, course_id)
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    UNIQUE(student_id, course_id, date)
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    payment_type TEXT,
    status TEXT CHECK (status IN ('paid', 'pending', 'overdue')),
    notes TEXT
);

CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    test_date DATE,
    score DECIMAL(5, 2),
    max_score DECIMAL(5, 2),
    grade TEXT,
    notes TEXT
);

CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    max_points INTEGER
);

CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    score DECIMAL(5, 2),
    feedback TEXT,
    status TEXT DEFAULT 'pending',
    UNIQUE(homework_id, student_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE
);

-- Enable RLS on all tables
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create simple policies (allow all for demo)
CREATE POLICY "Allow all" ON teachers FOR ALL USING (true);
CREATE POLICY "Allow all" ON students FOR ALL USING (true);
CREATE POLICY "Allow all" ON parents FOR ALL USING (true);
CREATE POLICY "Allow all" ON courses FOR ALL USING (true);
CREATE POLICY "Allow all" ON enrollments FOR ALL USING (true);
CREATE POLICY "Allow all" ON attendance FOR ALL USING (true);
CREATE POLICY "Allow all" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all" ON test_results FOR ALL USING (true);
CREATE POLICY "Allow all" ON homework FOR ALL USING (true);
CREATE POLICY "Allow all" ON homework_submissions FOR ALL USING (true);
CREATE POLICY "Allow all" ON messages FOR ALL USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ DATABASE RESET COMPLETE!';
    RAISE NOTICE 'Now go to Authentication → Users and create 4 users with these emails:';
    RAISE NOTICE '1. admin@school.com (password: admin123)';
    RAISE NOTICE '2. teacher1@school.com (password: teacher123)';
    RAISE NOTICE '3. student1@school.com (password: student123)';
    RAISE NOTICE '4. parent1@school.com (password: parent123)';
    RAISE NOTICE 'The trigger will automatically create user profiles!';
END $$;
