# MVC Rebuild Roadmap

## Current State
- Frontend: React + Vite + Tailwind
- Auth/Data: Supabase
- Status: Hybrid architecture (some pages use Supabase directly, several pages use mock state)

## MVC Direction
Use this folder structure:

- `src/mvc/models/`: domain models and input/output contracts
- `src/mvc/services/`: data access (Supabase and external APIs)
- `src/mvc/controllers/`: business rules + validation + orchestration
- `src/app/components/`: UI only (consume controllers)

## What Is Already Migrated
- Students domain:
  - `src/mvc/models/studentModel.ts`
  - `src/mvc/services/studentService.ts`
  - `src/mvc/controllers/studentController.ts`
  - `src/app/components/StudentsSupabase.tsx` now consumes the controller
- Instructors domain:
  - `src/mvc/models/instructorModel.ts`
  - `src/mvc/services/instructorService.ts`
  - `src/mvc/controllers/instructorController.ts`
  - `src/app/components/Instructors.tsx` now consumes the controller
- Groups domain:
  - `src/mvc/models/groupModel.ts`
  - `src/mvc/services/groupService.ts`
  - `src/mvc/controllers/groupController.ts`
  - `src/app/components/Groups.tsx` now consumes the controller
- Attendance domain:
  - `src/mvc/models/attendanceModel.ts`
  - `src/mvc/services/attendanceService.ts`
  - `src/mvc/controllers/attendanceController.ts`
  - `src/app/components/Attendance.tsx` now consumes the controller
- Payments domain:
  - `src/mvc/models/paymentModel.ts`
  - `src/mvc/services/paymentService.ts`
  - `src/mvc/controllers/paymentController.ts`
  - `src/app/components/Payments.tsx` now consumes the controller
- Materials domain:
  - `src/mvc/models/materialModel.ts`
  - `src/mvc/services/materialService.ts`
  - `src/mvc/controllers/materialController.ts`
  - `src/app/components/Materials.tsx` now consumes the controller

## Route Activation Progress
- Teacher routes activated:
  - `/teacher/students` -> Students (real data)
  - `/teacher/attendance` -> Attendance (real data)
  - `/teacher/homework` -> HomeworkPage
- Student routes activated:
  - `/student/materials` -> Materials
  - `/student/quick-links` -> QuickLinks
  - `/student/homework` -> HomeworkPage

## Full Functional Scope (To Complete)
1. Migrate remaining domains to MVC:
- Instructors
- Groups
- Attendance
- Payments
- Homework
- Materials
- Test results
- Placement tests
- Messaging

2. Remove mock state completely:
- Replace all `mockData` usage with controller calls
- Ensure every role page uses Supabase-backed data

3. Complete placeholder routes:
- Teacher: students, attendance, homework, salary, messages
- Student: payments, homework progress, attendance details, messages
- Parent: child details pages for grades/homework/attendance/payments/messages

4. Messaging backend (real bulk sending):
- Add Supabase Edge Function for bulk notification dispatch
- Integrate Twilio (SMS) and/or Resend (email)
- Persist delivery status per recipient

5. Public level test funnel:
- Add public route for anonymous placement test
- Store candidate leads
- Add admin lead management + contact actions

6. File storage and materials:
- Upload files to Supabase Storage
- Save signed/public URLs in materials table
- Add role-based upload/download permissions

7. Security hardening:
- Add role-aware RLS policies (replace permissive ALL policies)
- Add server-side authorization checks in edge functions

8. Deployment:
- Frontend: Netlify or Vercel
- Backend: Supabase project + Edge Functions
- Environment variables configured in deployment platform

## Recommended Build Order
1. Instructors + Groups MVC migration
2. Teacher pages (students, attendance, homework)
3. Payments and salary visibility
4. Messaging backend and UI wiring
5. Public placement funnel
6. Final RLS and production deployment

## Notes
- The project can absolutely be made fully operational.
- It is already a strong foundation; remaining work is mostly replacing mock pages and placeholders with MVC-backed real flows.
