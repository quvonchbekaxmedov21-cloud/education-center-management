# 🔧 Troubleshooting Guide

Common issues and how to fix them!

---

## 🚨 "Database tables not found" Error

### Symptoms:
- Console shows: "⚠️  Database tables not found!"
- Students page is empty
- App shows instructions to run SQL

### Solution:
1. **Open Supabase SQL Editor:**
   https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/sql/new

2. **Copy SQL from `/src/lib/setup.sql`**
   - Open file in VS Code
   - Select ALL (Ctrl+A or Cmd+A)
   - Copy (Ctrl+C or Cmd+C)

3. **Paste into SQL Editor**
   - Paste (Ctrl+V or Cmd+V)
   - Click "RUN" button (bottom right)

4. **Wait for success message:**
   "Success. No rows returned"

5. **Refresh your app** (F5 or Cmd+R)

✅ **Should work now!**

---

## 🚨 Students Page is Blank/Empty

### Symptoms:
- Students page loads but shows nothing
- No error messages
- Sample data doesn't appear

### Solution:

**Check 1: Browser Console**
1. Press F12 (or Cmd+Option+I on Mac)
2. Click "Console" tab
3. Look for red error messages
4. Share the error to debug further

**Check 2: Verify Database**
1. Go to: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/editor
2. Click "students" table
3. Do you see data?
   - **Yes** → Frontend issue, check console
   - **No** → SQL didn't run, go back to step 1

**Check 3: Network Tab**
1. Press F12
2. Click "Network" tab
3. Refresh page
4. Look for requests to "supabase.co"
5. Click on request
6. Check response - any errors?

---

## 🚨 "Failed to load students" Error

### Symptoms:
- Toast notification shows error
- Console shows Supabase error
- Students list won't load

### Possible Causes:

**Cause 1: Internet Connection**
- Check your internet connection
- Try opening https://supabase.com in browser
- If Supabase site doesn't load, it's internet

**Cause 2: Supabase Project Paused**
- Free tier projects pause after inactivity
- Go to Supabase dashboard
- Check if project shows "Paused"
- Click "Resume Project"

**Cause 3: Wrong API Key**
1. Open `/src/lib/supabase.ts`
2. Check the URL and API key
3. Compare with Supabase dashboard:
   https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/settings/api
4. Make sure they match!

**Cause 4: CORS Error**
- Should NOT happen with Supabase
- If you see CORS error in console:
  - Check Supabase dashboard settings
  - Verify you're using the anon/public key (not service role!)

---

## 🚨 npm install Fails

### Symptoms:
- `npm install` shows errors
- Packages won't install
- Build fails

### Solutions:

**Solution 1: Clear cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2: Use correct Node version**
```bash
node --version
# Should be v16.0.0 or higher
```

If not, install latest Node.js from: https://nodejs.org

**Solution 3: Try pnpm instead**
```bash
npm install -g pnpm
pnpm install
pnpm dev
```

---

## 🚨 npm run dev Fails

### Symptoms:
- `npm run dev` shows error
- Vite won't start
- Port already in use

### Solutions:

**Error: Port 5173 is already in use**
```bash
# Option 1: Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill

# Option 2: Use different port
npm run dev -- --port 3000
```

**Error: Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
npm run dev
```

**Error: Permission denied**
```bash
# Mac/Linux:
sudo npm run dev

# Or fix permissions:
sudo chown -R $USER node_modules
```

---

## 🚨 "Cannot read property of undefined"

### Symptoms:
- App crashes with TypeError
- Console shows property access error
- Usually happens when adding students

### Common Issues:

**Issue 1: Required field is missing**
```typescript
// Bad:
const name = student.name.toUpperCase(); 
// Crashes if student is undefined!

// Good:
const name = student?.name?.toUpperCase() || 'N/A';
// Safe, uses optional chaining
```

**Issue 2: Data structure mismatch**
- Check if database field names match your code
- Database uses: `parent_name`
- Code might expect: `parentName`
- Fix: Update code to use snake_case

---

## 🚨 Changes Don't Appear After Refresh

### Symptoms:
- Add/edit student works
- But after refresh, changes are gone
- Data doesn't persist

### Diagnosis:

**Test 1: Check if data is actually saved**
1. Add a student
2. Go to Supabase dashboard immediately
3. Check students table
4. Is the student there?
   - **Yes** → Problem is with fetching
   - **No** → Problem is with saving

**Solution for Saving Problem:**
```typescript
// Make sure you're awaiting the insert
await supabase.from('students').insert([data]);
// Not:
supabase.from('students').insert([data]); // ❌ Missing await!
```

**Solution for Fetching Problem:**
```typescript
// Make sure useEffect calls fetchStudents
useEffect(() => {
  fetchStudents();
}, []); // Empty array = run once on mount
```

---

## 🚨 Supabase Connection Issues

### Symptoms:
- All Supabase calls fail
- "NetworkError" in console
- Can't connect to database

### Debug Steps:

**Step 1: Check Supabase Status**
- Visit: https://status.supabase.com
- Is there an outage? (rare but possible)

**Step 2: Verify API Key**
```typescript
// Check /src/lib/supabase.ts
const supabaseUrl = 'https://qwmflgaoxlwverxrxmim.supabase.co';
const supabaseKey = 'ey...'; // Should be LONG string

// Verify on Supabase dashboard:
// https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/settings/api
```

**Step 3: Test Connection**
```typescript
// Add this to App.tsx temporarily:
useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('count');
    console.log('Connection test:', { data, error });
  };
  testConnection();
}, []);
```

Check console - do you see data or error?

---

## 🚨 TypeScript Errors

### Symptoms:
- Red squiggly lines in VS Code
- Type errors in terminal
- Build fails with type issues

### Common Fixes:

**Error: Property doesn't exist on type**
```typescript
// Error: Property 'parent_name' does not exist
student.parent_name // ❌

// Fix: Add to interface
interface Student {
  // ... other fields
  parent_name?: string; // Add this
}
```

**Error: Argument of type X is not assignable to type Y**
```typescript
// Error: string | null not assignable to string
const name: string = student.parent_name; // ❌

// Fix: Handle null case
const name = student.parent_name || 'N/A'; // ✅
const name: string | null = student.parent_name; // ✅
```

**Error: Type 'undefined' is not assignable**
```typescript
// Error with array operations
const courses = student.enrolled_courses.map(...) // ❌

// Fix: Check if array exists
const courses = student.enrolled_courses?.map(...) || []; // ✅
```

---

## 🚨 UI Not Updating After Changes

### Symptoms:
- Made changes to code
- Saved file
- Browser doesn't show changes

### Solutions:

**Solution 1: Hard refresh**
- Windows: Ctrl + Shift + R
- Mac: Cmd + Shift + R
- Or: Ctrl/Cmd + F5

**Solution 2: Clear browser cache**
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

**Solution 3: Restart dev server**
```bash
# Stop server: Ctrl+C
# Start again:
npm run dev
```

**Solution 4: Check if file actually saved**
- Look at VS Code - is there a dot on the tab?
- Dot means unsaved changes
- Save: Ctrl+S or Cmd+S

---

## 🚨 SQL Script Errors

### Symptoms:
- SQL script fails to run
- Supabase shows error message
- Tables not created

### Common Errors:

**Error: "already exists"**
```
ERROR: relation "students" already exists
```
**Solution:** Tables already created! You're good! ✅

**Error: "syntax error"**
```
ERROR: syntax error at or near "..."
```
**Solution:** 
- Make sure you copied ALL the SQL
- Don't edit the SQL unless you know what you're doing
- Try copying and pasting again

**Error: "permission denied"**
```
ERROR: permission denied for schema public
```
**Solution:**
- Shouldn't happen with owner account
- Try logging out and back into Supabase
- Check you're on the right project

---

## 🆘 Still Need Help?

### Check These Resources:

1. **Browser Console (F12)**
   - Always check here first!
   - Red errors tell you exactly what's wrong

2. **Supabase Dashboard**
   - View your data: `/editor`
   - Check logs: `/logs/explorer`
   - API settings: `/settings/api`

3. **Documentation Files**
   - `/README.md` - Overview
   - `/QUICK_START_GUIDE.md` - Setup steps
   - `/ARCHITECTURE.md` - How it works
   - `/CHECKLIST.md` - Step by step

4. **Supabase Docs**
   - https://supabase.com/docs
   - JavaScript client reference
   - Database guides

### How to Ask for Help:

When seeking help, provide:
1. **What you were trying to do**
2. **What happened instead**
3. **Error messages** (copy from console)
4. **Code snippet** (if relevant)
5. **Steps you already tried**

Example:
```
I'm trying to add a student, but getting this error:
"Cannot read property 'insert' of undefined"

Code:
await supabase.from('students').insert([data]);

I already tried:
- Checking API key in supabase.ts
- Running SQL setup script
- Clearing cache and restarting
```

---

## 🎯 Prevention Tips

### Before Making Changes:

1. **Commit your working code**
   ```bash
   git add .
   git commit -m "Working version"
   ```

2. **Test in small steps**
   - Change one thing at a time
   - Test immediately
   - If it breaks, you know what caused it

3. **Keep DevTools open**
   - Always have console visible
   - Catch errors immediately
   - Don't wait until things break

4. **Read error messages**
   - Errors tell you exactly what's wrong
   - Google the error message
   - Most errors have been solved before

### Good Practices:

✅ **DO:**
- Save files before testing (Ctrl+S)
- Check console after every change
- Test changes immediately
- Read error messages carefully
- Google errors you don't understand

❌ **DON'T:**
- Make multiple changes without testing
- Ignore console errors
- Edit files you don't understand
- Delete code without backing up
- Panic when something breaks (it's fixable!)

---

**Remember:** Every developer faces these issues. Debugging is part of learning! 💪

**You got this!** 🚀
