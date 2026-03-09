-- ====================================
-- FIX USER SYNC ISSUE
-- This updates the database to match your actual auth users
-- ====================================

-- First, let's see what auth users exist
-- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/auth/users
-- Copy the UUID for each user and paste below

-- STEP 1: Delete old user records
DELETE FROM messages WHERE sender_id IN (SELECT id FROM users);
DELETE FROM messages WHERE recipient_id IN (SELECT id FROM users);
DELETE FROM homework_submissions WHERE student_id IN (SELECT id FROM students);
DELETE FROM test_results WHERE student_id IN (SELECT id FROM students);
DELETE FROM attendance WHERE student_id IN (SELECT id FROM students);
DELETE FROM enrollments;
DELETE FROM payments;
DELETE FROM homework;
DELETE FROM courses;
DELETE FROM parents;
DELETE FROM students;
DELETE FROM teachers;
DELETE FROM users;

-- STEP 2: You need to manually insert users with ACTUAL auth UUIDs
-- Instructions:
-- 1. Go to: Supabase Dashboard → Authentication → Users
-- 2. Click on admin@school.com → Copy the UUID (ID field)
-- 3. Replace 'PASTE_ADMIN_UUID_HERE' below with that UUID
-- 4. Repeat for each user (teacher, student, parent)
-- 5. Then run this script

-- Example format (REPLACE THE UUIDs):
/*
INSERT INTO users (id, email, role, full_name) VALUES
('PASTE_ADMIN_UUID_HERE', 'admin@school.com', 'admin', 'Admin User'),
('PASTE_TEACHER_UUID_HERE', 'teacher1@school.com', 'teacher', 'John Teacher'),
('PASTE_STUDENT_UUID_HERE', 'student1@school.com', 'student', 'Sarah Student'),
('PASTE_PARENT_UUID_HERE', 'parent1@school.com', 'parent', 'Mike Parent');
*/

-- After inserting users, we'll add the related records...
