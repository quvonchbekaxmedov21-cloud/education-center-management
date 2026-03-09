-- ====================================
-- DATABASE CLEANUP SCRIPT
-- Run this FIRST if you get "already exists" errors
-- ====================================

-- Drop all existing tables (cascade removes dependencies)
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

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ CLEANUP COMPLETE! Now run database-complete.sql';
END $$;
