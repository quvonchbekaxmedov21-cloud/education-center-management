-- ============================================================================
-- CREATE DEMO AUTHENTICATION ACCOUNTS
-- ============================================================================
-- This script creates authentication accounts for the demo users
-- Run this AFTER you've run database-complete.sql
--
-- IMPORTANT: This uses Supabase Auth Admin API
-- You'll need to run this through Supabase Dashboard SQL Editor
-- ============================================================================

-- Note: Unfortunately, SQL cannot directly create Supabase Auth users.
-- You need to use one of these methods:

-- METHOD 1: Use Supabase Dashboard (RECOMMENDED FOR DEMO)
-- =========================================================
-- 1. Go to: Authentication → Users
-- 2. Click "Add user" for each account below:

/*
DEMO ACCOUNTS TO CREATE:

1. Admin Account
   Email: admin@school.com
   Password: admin123
   Auto-confirm user: YES

2. Teacher Account
   Email: teacher1@school.com
   Password: teacher123
   Auto-confirm user: YES

3. Student Account
   Email: student1@school.com
   Password: student123
   Auto-confirm user: YES

4. Parent Account
   Email: parent1@school.com
   Password: parent123
   Auto-confirm user: YES
*/

-- METHOD 2: Use Sign-Up Page (BETTER FOR PRODUCTION)
-- ===================================================
-- 1. Go to your app: http://localhost:5173/signup
-- 2. Create each account through the UI
-- 3. The system will automatically link them to existing user records

-- METHOD 3: Use Supabase Auth API (ADVANCED)
-- ===========================================
-- You can create users programmatically using the Supabase Admin API
-- This requires the service role key and should be done server-side

-- ============================================================================
-- VERIFY USERS CREATED
-- ============================================================================
-- Run this query to check if users exist in your database:

SELECT 
  email, 
  full_name, 
  role, 
  status 
FROM users 
WHERE email IN (
  'admin@school.com',
  'teacher1@school.com',
  'student1@school.com',
  'parent1@school.com'
);

-- You should see 4 rows with the demo accounts

-- ============================================================================
-- LINK AUTH USERS TO DATABASE USERS (AUTOMATIC)
-- ============================================================================
-- The AuthContext will automatically link Supabase Auth users to the users table
-- by matching email addresses when users sign in

-- If you need to manually link an auth user:
-- UPDATE users 
-- SET auth_user_id = 'YOUR_AUTH_USER_ID_FROM_SUPABASE'
-- WHERE email = 'admin@school.com';

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If login fails, check:
-- 1. Auth user exists in Supabase Auth dashboard
-- 2. Database user exists in users table (query above)
-- 3. Email matches exactly (case-sensitive)
-- 4. Password is correct
-- 5. User status is 'active'

-- To reset a password in Supabase Auth:
-- Go to Authentication → Users → Click user → Reset password

-- ============================================================================
-- NOTES FOR PRODUCTION
-- ============================================================================

/*
For a production deployment, you should:

1. Use strong, unique passwords (not demo passwords like "admin123")
2. Enable email confirmation
3. Set up an email provider (SendGrid, Mailgun, etc.)
4. Implement password strength requirements
5. Add 2FA (two-factor authentication)
6. Set up password reset flow
7. Implement account lockout after failed attempts
8. Add CAPTCHA for sign-up
9. Use environment variables for sensitive data
10. Implement proper logging and monitoring

This demo setup is for LEARNING and TESTING only!
*/

-- ============================================================================
-- QUICK START SUMMARY
-- ============================================================================

/*
TO GET STARTED QUICKLY:

1. Run database-complete.sql (creates database structure)
2. Go to Supabase Auth Dashboard
3. Manually create 4 auth accounts (emails and passwords above)
4. Test login at your app URL
5. Each role will automatically connect to the right portal!

That's it! Your multi-portal system is ready to use!
*/
