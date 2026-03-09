# Education Center Management System - Deployment Guide

## 🚀 Demo Mode Deployment

This application is configured to run in **Demo Mode** using localStorage for data persistence. Perfect for portfolio demonstrations and learning projects!

### Features
- ✅ 4 Role-based portals (Admin, Teacher, Student, Parent)
- ✅ Full authentication system (sign up, login, logout)
- ✅ 20+ management features
- ✅ Data visualization and dashboards
- ✅ All data stored in browser localStorage

---

## 📦 Deploy to Vercel

### Method 1: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the Vite configuration
5. Click "Deploy"

---

## 📦 Deploy to Netlify

### Method 1: Using Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy
   ```

4. **Deploy to Production**
   ```bash
   netlify deploy --prod
   ```

### Method 2: Using Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder (after running `npm run build`)
3. Or connect your Git repository for automatic deployments

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

---

## 🧪 Testing Before Deployment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the production build locally
npx vite preview
```

---

## 🎭 Demo Accounts

Share these credentials with visitors to test different portals:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@school.com | admin123 |
| **Teacher** | teacher1@school.com | teacher123 |
| **Student** | student1@school.com | student123 |
| **Parent** | parent1@school.com | parent123 |

Users can also create their own accounts via the sign-up page!

---

## 📝 Important Notes

### Data Persistence
- All data is stored in **browser localStorage**
- Data is **per-browser** and not shared between devices
- Clearing browser data will reset the application
- Perfect for demos, not suitable for production multi-user systems

### Future Production Deployment
When you rebuild this with MERN stack and real backend:
- Connect to MongoDB/PostgreSQL database
- Implement real authentication with JWT tokens
- Add API endpoints for CRUD operations
- Enable cross-device data synchronization

---

## 🔧 Environment Variables

For demo mode, no environment variables are required! The app will automatically use localStorage when Supabase is not connected.

If you want to connect real Supabase later:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎯 Project Structure

```
/src
  /app
    /components
      /admin      - Admin portal components
      /student    - Student portal components
      /teacher    - Teacher portal components
      /parent     - Parent portal components
      /auth       - Login/Signup pages
      /ui         - Shared UI components
  /lib
    auth.ts       - Authentication logic with mock mode
    supabase.ts   - Supabase client (falls back to mock)
  /styles         - Global styles and themes
```

---

## ✨ Features Overview

### Admin Portal
- Dashboard with analytics
- Student management
- Course management
- Instructor management
- Group management
- Attendance tracking
- Payment management
- Test results
- Homework assignments
- Parent messaging
- Placement tests
- Learning materials

### Teacher Portal
- View assigned courses and groups
- Take attendance
- Grade homework
- Enter test results
- Upload materials
- View student progress

### Student Portal
- View enrolled courses
- Check grades and test results
- Submit homework
- Download materials
- View attendance records
- Check payment status

### Parent Portal
- View children's progress
- Check attendance
- View grades and test results
- Check payment status
- Receive messages from school

---

## 📞 Support

This is a demo/learning project. Data is stored locally in your browser.

For questions about rebuilding with MERN stack, refer to your course materials!

---

## 🎉 Good Luck!

This project is your **reference** for when you rebuild it from scratch with your MERN course! 

**Key learning points:**
- Multi-portal architecture with role-based access
- React Router for navigation
- Authentication flow
- Data management and state
- UI/UX best practices
- Deployment process

Happy coding! 🚀
