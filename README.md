# 🎓 Education Center Management System

A comprehensive multi-portal education management application built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

![Demo Mode](https://img.shields.io/badge/Mode-Demo-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-38bdf8)

---

## 🌟 Features

### 🔐 Multi-Role Authentication System
- **Admin Portal** - Full system management
- **Teacher Portal** - Course and student management
- **Student Portal** - Learning and progress tracking
- **Parent Portal** - Monitor children's progress

### 📚 Complete Management Suite
- ✅ Student & Course Management
- ✅ Instructor Management
- ✅ Group & Schedule Management
- ✅ Attendance Tracking
- ✅ Payment Management
- ✅ Test Results & Grading
- ✅ Homework Assignments
- ✅ Learning Materials
- ✅ Parent Communication
- ✅ Placement Tests
- ✅ Analytics Dashboard

### 🎨 Modern UI/UX
- Fully responsive design
- Beautiful shadcn/ui components
- Real-time charts with Recharts
- Toast notifications
- Form validation
- Loading states

---

## 🚀 Quick Deploy

**See [QUICKSTART.md](./QUICKSTART.md) for detailed deployment instructions!**

### Deploy to Vercel (Recommended)
```bash
# Push to GitHub, then import to Vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

---

## 🎭 Demo Mode

This app runs in **Demo Mode** using browser localStorage for data persistence.

**Demo Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher1@school.com | teacher123 |
| Student | student1@school.com | student123 |
| Parent | parent1@school.com | parent123 |

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
/src
  /app
    App.tsx              # Main app component
    routes.tsx           # React Router configuration
    /components
      /admin            # Admin portal components
      /student          # Student portal components
      /teacher          # Teacher portal components
      /parent           # Parent portal components
      /auth             # Login/Signup pages
      /ui               # Shared UI components (shadcn/ui)
  /lib
    auth.ts             # Authentication with mock mode
    supabase.ts         # Supabase client
    AuthContext.tsx     # Auth state management
  /styles
    globals.css         # Global styles
    theme.css          # Theme tokens
    fonts.css          # Font imports
/supabase
  /functions
    /server            # Edge functions (for future)
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **React Router 7** - Routing
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Motion** - Animations
- **React Hook Form** - Form handling
- **Sonner** - Toast notifications

### Backend (Demo Mode)
- **localStorage** - Client-side data storage
- **Supabase** (future) - Authentication & Database

---

## 📝 Important Notes

### Demo Mode vs Production

**Current Demo Mode:**
- ✅ Perfect for portfolios and demos
- ✅ Works instantly, no setup required
- ✅ All features fully functional
- ⚠️ Data is per-browser (localStorage)
- ⚠️ Not suitable for real multi-user deployment

**Future Production Mode (MERN):**
- MongoDB - Real database
- Express.js - REST API
- Node.js - Backend runtime
- JWT - Real authentication
- Cross-device data sync

---

## 🎯 Learning Reference

This project is designed as a **learning reference** for:

1. **Multi-portal architecture** with role-based access control
2. **React Router** with protected routes
3. **Authentication flow** (login, signup, logout)
4. **CRUD operations** for all entities
5. **State management** with Context API
6. **Form validation** and error handling
7. **Data visualization** with charts
8. **Responsive design** with Tailwind CSS
9. **TypeScript** best practices
10. **Deployment** to production hosting

---

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Deploy in 5 minutes
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide

---

## 🤝 Contributing

This is a learning project. Feel free to fork and modify for your own learning!

---

## 📄 License

MIT License - Use this project for learning and portfolio purposes.

---

## 🎉 Acknowledgments

Built as a learning project to demonstrate:
- Full-stack web application architecture
- Modern React development practices
- Multi-role authentication systems
- CRUD operations and data management
- Deployment to production hosting

**Perfect reference for rebuilding with MERN stack!** 🚀

---

## 📞 Support

This is a demo/learning project. Data is stored locally in your browser.

For questions about MERN stack implementation, refer to your course materials!

---

**Happy Learning! 🎓**
