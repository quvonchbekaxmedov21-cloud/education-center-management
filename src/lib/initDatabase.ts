import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    console.log('Initializing database tables...');

    // Check if tables exist by trying to query them
    const { error: usersError } = await supabase.from('users').select('count').limit(1);
    
    if (usersError && usersError.message.includes('does not exist')) {
      console.log('⚠️  Database tables not found!');
      console.log('📋 Please run the SQL setup script in Supabase SQL Editor:');
      console.log('👉 Go to: https://supabase.com/dashboard/project/fzjyftkvrrsiglkuvwlt/sql/new');
      console.log('\n📝 Copy and paste the SQL from /src/lib/database-complete.sql\n');
      return false;
    }

    console.log('✅ Database tables are ready!');
    
    // Auto-create demo auth users if they don't exist
    await createDemoUsers();
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Auto-create demo users with auth accounts
async function createDemoUsers() {
  try {
    console.log('🔑 Checking demo users...');
    
    const demoUsers = [
      { email: 'admin@school.com', password: 'admin123', role: 'admin', full_name: 'Admin User' },
      { email: 'teacher1@school.com', password: 'teacher123', role: 'teacher', full_name: 'John Teacher' },
      { email: 'student1@school.com', password: 'student123', role: 'student', full_name: 'Sarah Student' },
      { email: 'parent1@school.com', password: 'parent123', role: 'parent', full_name: 'Mike Parent' },
    ];
    
    for (const user of demoUsers) {
      // Check if user already exists in database
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (!existingUser) {
        console.log(`Creating demo user: ${user.email}`);
        
        // Try to sign up the user (creates auth account + database record via trigger)
        const { error: signUpError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: {
              full_name: user.full_name,
              role: user.role,
            },
          },
        });
        
        if (signUpError) {
          // User might already exist in auth, just create database record
          console.log(`Auth user exists, creating database record for: ${user.email}`);
          
          // Try to get the auth user ID
          const { data: authData } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password,
          });
          
          if (authData.user) {
            // Create database record
            await supabase.from('users').insert([
              {
                id: authData.user.id,
                email: user.email,
                role: user.role,
                full_name: user.full_name,
              },
            ]);
            
            // Sign out after creating
            await supabase.auth.signOut();
          }
        }
      }
    }
    
    console.log('✅ Demo users ready!');
  } catch (error) {
    console.error('Error creating demo users:', error);
  }
}

// Helper function to add sample data
export async function addSampleData() {
  try {
    // Check if data already exists
    const { data: existingStudents, error: checkError } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking existing data:', checkError);
      return;
    }

    if (existingStudents && existingStudents.length > 0) {
      console.log('Sample data already exists');
      return;
    }

    console.log('Adding sample data...');

    // Add sample instructors
    const { data: instructors, error: instructorsError } = await supabase
      .from('instructors')
      .insert([
        {
          name: 'John',
          surname: 'Smith',
          email: 'john.smith@educenter.com',
          phone: '+1234567890',
          specialization: ['Mathematics', 'Physics'],
          courses: [],
          status: 'active',
          join_date: '2023-01-15'
        },
        {
          name: 'Sarah',
          surname: 'Johnson',
          email: 'sarah.johnson@educenter.com',
          phone: '+1234567891',
          specialization: ['English', 'Literature'],
          courses: [],
          status: 'active',
          join_date: '2023-02-01'
        },
        {
          name: 'Michael',
          surname: 'Brown',
          email: 'michael.brown@educenter.com',
          phone: '+1234567892',
          specialization: ['Computer Science', 'Programming'],
          courses: [],
          status: 'active',
          join_date: '2023-03-10'
        }
      ])
      .select();

    if (instructorsError) {
      console.error('Failed to add instructors:', instructorsError);
      return;
    }

    if (!instructors || instructors.length === 0) {
      console.error('Failed to add instructors: No data returned');
      return;
    }

    console.log('✅ Added instructors');

    // Add sample courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .insert([
        {
          name: 'Advanced Mathematics',
          code: 'MATH301',
          description: 'Advanced calculus and linear algebra',
          instructor_id: instructors[0].id,
          schedule: 'Mon, Wed, Fri 10:00-12:00',
          duration: '12 weeks',
          capacity: 25,
          enrolled: 18,
          status: 'active',
          start_date: '2024-01-10',
          end_date: '2024-04-05'
        },
        {
          name: 'English Literature',
          code: 'ENG201',
          description: 'Classic and modern literature analysis',
          instructor_id: instructors[1].id,
          schedule: 'Tue, Thu 14:00-16:00',
          duration: '10 weeks',
          capacity: 30,
          enrolled: 22,
          status: 'active',
          start_date: '2024-01-15',
          end_date: '2024-03-22'
        },
        {
          name: 'Web Development',
          code: 'CS401',
          description: 'Full-stack web development with React and Node.js',
          instructor_id: instructors[2].id,
          schedule: 'Mon, Wed 16:00-18:00',
          duration: '16 weeks',
          capacity: 20,
          enrolled: 20,
          status: 'full',
          start_date: '2024-01-08',
          end_date: '2024-04-26'
        }
      ])
      .select();

    if (coursesError) {
      console.error('Failed to add courses:', coursesError);
      return;
    }

    if (!courses || courses.length === 0) {
      console.error('Failed to add courses: No data returned');
      return;
    }

    console.log('✅ Added courses');

    // Add sample students
    const { error: studentsError } = await supabase
      .from('students')
      .insert([
        {
          name: 'Emma',
          surname: 'Wilson',
          email: 'emma.wilson@email.com',
          phone: '+1234567893',
          parent_name: 'Robert Wilson',
          parent_phone: '+1234567894',
          enrolled_courses: [courses[0].id, courses[1].id],
          status: 'active',
          join_date: '2024-01-05'
        },
        {
          name: 'James',
          surname: 'Davis',
          email: 'james.davis@email.com',
          phone: '+1234567895',
          parent_name: 'Linda Davis',
          parent_phone: '+1234567896',
          enrolled_courses: [courses[2].id],
          status: 'active',
          join_date: '2024-01-03'
        },
        {
          name: 'Olivia',
          surname: 'Martinez',
          email: 'olivia.martinez@email.com',
          phone: '+1234567897',
          parent_name: 'Carlos Martinez',
          parent_phone: '+1234567898',
          enrolled_courses: [courses[0].id, courses[2].id],
          status: 'active',
          join_date: '2024-01-07'
        }
      ]);

    if (studentsError) {
      console.error('Failed to add students:', studentsError);
      return;
    }

    console.log('✅ Added students');
    console.log('✅ Sample data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}