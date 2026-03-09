# 🚀 Supabase Backend Setup Instructions

## Step 1: Run the SQL Setup Script

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/sql/new

2. **Copy the SQL from `/src/lib/setup.sql`**

3. **Paste it into the SQL Editor and click "Run"**

4. **Wait for success message** - You should see "Success. No rows returned"

## Step 2: Verify Tables Were Created

1. Go to: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/editor
2. You should see all these tables:
   - ✅ students
   - ✅ instructors
   - ✅ courses
   - ✅ groups
   - ✅ attendance
   - ✅ payments
   - ✅ test_results
   - ✅ homework
   - ✅ materials
   - ✅ messages
   - ✅ placement_tests

## Step 3: Run Your App

```bash
npm run dev
```

The app will automatically:
- ✅ Connect to Supabase
- ✅ Check if tables exist
- ✅ Add sample data (students, instructors, courses)

## Step 4: Test It!

Open your browser and:
1. Check the Dashboard - you'll see real data from Supabase!
2. Add a new student - it will save to the database!
3. Refresh the page - data persists! 🎉

## What Changed?

- ❌ **Before:** Mock data (resets on refresh)
- ✅ **After:** Real PostgreSQL database with Supabase!

## Troubleshooting

**If you see "Database tables not found":**
- Make sure you ran the SQL setup script in Step 1

**If you see errors in console:**
- Check that your Supabase project is running
- Verify the URL and API key in `/src/lib/supabase.ts`

**Need help?**
- Check Supabase Dashboard: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim
- View logs: https://supabase.com/dashboard/project/qwmflgaoxlwverxrxmim/logs/explorer

## Next Steps

Once everything works, you can:
1. 🎓 Study the code and learn how it works
2. 🔧 Modify features and see changes in real-time
3. 📊 View data in Supabase Dashboard
4. 🚀 Later, swap Supabase for MongoDB as practice!

Happy Learning! 🎉
