-- ====================================
-- SET USER ROLES
-- Run this AFTER creating auth users
-- ====================================

-- This script assigns roles to your auth users based on their email

-- Update admin role
UPDATE users 
SET role = 'admin', full_name = 'Admin User'
WHERE email = 'admin@school.com';

-- Update teacher role
UPDATE users 
SET role = 'teacher', full_name = 'John Teacher'
WHERE email = 'teacher1@school.com';

-- Update student role
UPDATE users 
SET role = 'student', full_name = 'Sarah Student'
WHERE email = 'student1@school.com';

-- Update parent role
UPDATE users 
SET role = 'parent', full_name = 'Mike Parent'
WHERE email = 'parent1@school.com';

-- Create teacher profile
INSERT INTO teachers (user_id, subject, phone, hire_date, status)
SELECT id, 'Mathematics', '555-0101', '2024-01-01', 'active'
FROM users WHERE email = 'teacher1@school.com'
ON CONFLICT DO NOTHING;

-- Create student profile
INSERT INTO students (user_id, student_id, grade_level, date_of_birth, status, phone)
SELECT id, 'STU001', 10, '2008-05-15', 'active', '555-0102'
FROM users WHERE email = 'student1@school.com'
ON CONFLICT DO NOTHING;

-- Create parent profile
INSERT INTO parents (user_id, phone, relationship)
SELECT id, '555-0103', 'Father'
FROM users WHERE email = 'parent1@school.com'
ON CONFLICT DO NOTHING;

-- Add some sample courses
INSERT INTO courses (course_code, course_name, teacher_id, schedule, room_number, capacity, status) 
SELECT 'MATH101', 'Algebra I', t.id, 'Mon/Wed/Fri 9:00-10:00', '201', 30, 'active'
FROM teachers t
JOIN users u ON t.user_id = u.id
WHERE u.email = 'teacher1@school.com'
ON CONFLICT (course_code) DO NOTHING;

INSERT INTO courses (course_code, course_name, teacher_id, schedule, room_number, capacity, status) 
SELECT 'MATH201', 'Geometry', t.id, 'Tue/Thu 10:00-11:00', '202', 25, 'active'
FROM teachers t
JOIN users u ON t.user_id = u.id
WHERE u.email = 'teacher1@school.com'
ON CONFLICT (course_code) DO NOTHING;

-- Enroll student in courses
INSERT INTO enrollments (student_id, course_id, status)
SELECT s.id, c.id, 'active'
FROM students s
CROSS JOIN courses c
JOIN users u ON s.user_id = u.id
WHERE u.email = 'student1@school.com'
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ USER ROLES AND SAMPLE DATA ADDED!';
    RAISE NOTICE 'You can now login with:';
    RAISE NOTICE '• admin@school.com / admin123';
    RAISE NOTICE '• teacher1@school.com / teacher123';
    RAISE NOTICE '• student1@school.com / student123';
    RAISE NOTICE '• parent1@school.com / parent123';
END $$;
