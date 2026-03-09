# ✅ Setup Checklist

Follow these steps in order. Check off each one as you complete it!

---

## 📦 Step 1: Project Setup in VS Code

- [ ] Downloaded ZIP file from Figma Make
- [ ] Extracted ZIP to a folder
- [ ] Opened folder in VS Code
- [ ] Ran `npm install` in terminal
- [ ] npm install completed successfully

---

## 🗄️ Step 2: Supabase Database Setup

- [ ] Created Supabase account at https://supabase.com
- [ ] Created new project: `education-center-app`
- [ ] Got Project URL: `https://qwmflgaoxlwverxrxmim.supabase.co`
- [ ] Got API Key (anon public)
- [ ] Opened SQL Editor: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/sql/new
- [ ] Opened `/src/lib/setup.sql` in VS Code
- [ ] Copied ALL SQL code (Ctrl+A, Ctrl+C)
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked "RUN" button
- [ ] Saw "Success. No rows returned" message ✅

---

## 🚀 Step 3: Run the Application

- [ ] In VS Code terminal, ran: `npm run dev`
- [ ] Opened browser to: http://localhost:5173
- [ ] App loaded successfully
- [ ] Saw dashboard with sample data

---

## 🧪 Step 4: Test Students Page

- [ ] Clicked "Students" in sidebar
- [ ] Saw list of 3 sample students
- [ ] Clicked "Add Student" button
- [ ] Filled in student form:
  - First Name: _______________
  - Surname: _______________
  - Email: _______________
  - Phone: _______________
  - Enrollment Date: _______________
- [ ] Clicked "Add Student" button
- [ ] Saw success toast notification
- [ ] New student appears in list
- [ ] **Refreshed page (F5)**
- [ ] Student data still there! ✅ (This means database is working!)

---

## 🔍 Step 5: Verify in Supabase Dashboard

- [ ] Opened Supabase Table Editor: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/editor
- [ ] Clicked on "students" table
- [ ] Saw 4 students (3 sample + 1 you added)
- [ ] Verified your student data is in the database ✅

---

## 🎯 Step 6: Test Edit & Delete

- [ ] Back in app, clicked Edit icon on a student
- [ ] Modified student name
- [ ] Clicked "Update Student"
- [ ] Saw success toast
- [ ] Changes reflected in list
- [ ] Clicked Delete icon on a student
- [ ] Saw success toast
- [ ] Student removed from list
- [ ] Refreshed page
- [ ] Changes persisted! ✅

---

## 🎉 Success Criteria

If you checked ALL boxes above, congratulations! 🎊

You now have:
- ✅ Full-stack app running locally
- ✅ React frontend working
- ✅ Supabase backend connected
- ✅ PostgreSQL database storing data
- ✅ Real-time CRUD operations
- ✅ Data persistence

---

## 🐛 If Something Doesn't Work:

### Students page is empty
→ Check browser console (F12) for errors  
→ Make sure SQL setup ran successfully  
→ Verify internet connection to Supabase

### "Database tables not found" error
→ You need to run the SQL setup (Step 2)  
→ Make sure you ran ALL the SQL code  
→ Check Supabase dashboard to verify tables exist

### App won't start
→ Make sure `npm install` completed  
→ Check for port conflicts (something else using port 5173)  
→ Try running `npm install` again

### Data doesn't persist after refresh
→ Check browser console for Supabase errors  
→ Verify API key in `/src/lib/supabase.ts`  
→ Check Supabase project is active (not paused)

---

## 📚 Next Steps After Checklist:

1. **Study the code**
   - Open `/src/app/components/StudentsSupabase.tsx`
   - Read through the CRUD functions
   - Understand how data flows

2. **Read documentation**
   - `/QUICK_START_GUIDE.md`
   - `/ARCHITECTURE.md`
   - `/README.md`

3. **Experiment**
   - Try modifying the Students form
   - Add a new field to students table
   - Update other pages to use Supabase

4. **Learn & Build**
   - Continue your MERN course
   - Compare Supabase vs MongoDB approaches
   - Build your own features!

---

## 🎓 You Did It!

You've successfully set up a **professional full-stack application**!

This is the same stack used by real companies:
- Vercel uses Supabase
- GitHub uses PostgreSQL
- Most modern apps use React + TypeScript

**Keep learning, keep building! 🚀**

---

**Need Help?** Check these files:
- `/QUICK_START_GUIDE.md` - Detailed setup
- `/ARCHITECTURE.md` - How it works
- `/TROUBLESHOOTING.md` - Common issues

Or check browser console (F12) for error messages!
