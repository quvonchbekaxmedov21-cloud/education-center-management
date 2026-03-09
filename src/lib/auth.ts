// Authentication helper functions
import { supabase } from './supabase';

export type UserRole = 'admin' | 'student' | 'teacher' | 'parent';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: string;
  phone?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Mock users for demo mode
const MOCK_USERS: Record<string, User> = {
  'admin@school.com': {
    id: 'mock-admin-1',
    email: 'admin@school.com',
    full_name: 'Admin User',
    role: 'admin',
    status: 'active',
  },
  'teacher1@school.com': {
    id: 'mock-teacher-1',
    email: 'teacher1@school.com',
    full_name: 'John Teacher',
    role: 'teacher',
    status: 'active',
  },
  'student1@school.com': {
    id: 'mock-student-1',
    email: 'student1@school.com',
    full_name: 'Sarah Student',
    role: 'student',
    status: 'active',
  },
  'parent1@school.com': {
    id: 'mock-parent-1',
    email: 'parent1@school.com',
    full_name: 'Mike Parent',
    role: 'parent',
    status: 'active',
  },
};

/**
 * Sign in user
 */
export async function signIn(email: string, password: string) {
  try {
    // Check if we should use mock mode
    const useMockMode = await shouldUseMockMode();
    
    if (useMockMode) {
      console.log('🎭 Using MOCK authentication mode');
      
      // Check hardcoded mock users
      const mockUser = MOCK_USERS[email.toLowerCase()];
      
      if (mockUser && password.length >= 6) {
        // Store mock session in localStorage
        localStorage.setItem('mock_session', JSON.stringify(mockUser));
        
        return {
          success: true,
          user: mockUser,
          session: { access_token: 'mock-token' },
        };
      }
      
      // Check if user was created via signup (stored in localStorage)
      const storedUsers = localStorage.getItem('mock_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const createdUser = users[email.toLowerCase()];
        
        if (createdUser && password.length >= 6) {
          // Store mock session
          localStorage.setItem('mock_session', JSON.stringify(createdUser));
          
          return {
            success: true,
            user: createdUser,
            session: { access_token: 'mock-token' },
          };
        }
      }
      
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }
    
    // Real Supabase authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Get user role and details from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) throw userError;

    return {
      success: true,
      user: userData as User,
      session: authData.session,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sign in',
    };
  }
}

/**
 * Check if we should use mock mode (when Supabase is not available)
 */
async function shouldUseMockMode(): Promise<boolean> {
  try {
    // Prefer real Supabase auth in production; fallback to mock only when backend is unavailable.
    const { error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.log('⚠️ Database not available, using MOCK mode:', error.message);
      return true;
    }

    console.log('✅ Database is available, using real auth');
    return false;
  } catch (error) {
    console.log('⚠️ Connection error, using MOCK mode:', error);
    return true;
  }
}

/**
 * Sign up new user
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  phone?: string
) {
  try {
    // Check if we should use mock mode
    const useMockMode = await shouldUseMockMode();
    
    if (useMockMode) {
      console.log('🎭 Using MOCK signup mode');
      
      // In mock mode, just create a mock user and store it
      const mockUser: User = {
        id: `mock-${role}-${Date.now()}`,
        email: email.toLowerCase(),
        full_name: fullName,
        role,
        status: 'active',
        phone,
      };
      
      // Store mock session
      localStorage.setItem('mock_session', JSON.stringify(mockUser));
      
      // Store user credentials (email + password) and user data in localStorage
      const storedUsers = localStorage.getItem('mock_users');
      const users = storedUsers ? JSON.parse(storedUsers) : {};
      users[email.toLowerCase()] = { ...mockUser, password }; // Store password for login
      localStorage.setItem('mock_users', JSON.stringify(users));
      
      console.log('✅ Mock user created and stored:', mockUser);
      
      return {
        success: true,
        user: mockUser,
      };
    }
    
    // Real Supabase signup
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) throw authError;

    // Create user record in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          auth_user_id: authData.user?.id,
          email,
          full_name: fullName,
          role,
          phone,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (userError) throw userError;

    // Create role-specific record
    if (role === 'student') {
      const [firstName, ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      await supabase.from('students').insert([
        {
          user_id: userData.id,
          name: firstName,
          surname: lastName,
          email,
          phone,
          status: 'active',
          join_date: new Date().toISOString().split('T')[0],
        },
      ]);
    } else if (role === 'teacher') {
      const [firstName, ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      await supabase.from('instructors').insert([
        {
          user_id: userData.id,
          name: firstName,
          surname: lastName,
          email,
          phone,
          status: 'active',
          join_date: new Date().toISOString().split('T')[0],
        },
      ]);
    }

    return {
      success: true,
      user: userData as User,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sign up',
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    // Clear mock session
    localStorage.removeItem('mock_session');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to sign out',
    };
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const useMockMode = await shouldUseMockMode();

    if (useMockMode) {
      const mockSession = localStorage.getItem('mock_session');
      console.log('📦 Mock session in localStorage:', mockSession);

      if (mockSession) {
        const user = JSON.parse(mockSession) as User;
        console.log('✅ Returning mock user:', user);
        return user;
      }
    }
    
    console.log('🔍 No mock session, checking Supabase...');
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log('❌ No Supabase session found');
      return null;
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();

    if (error) {
      // Fallback to email lookup if auth_user_id not found
      const { data: emailData } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      return emailData as User;
    }

    return userData as User;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send reset email',
    };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update password',
    };
  }
}

/**
 * Check if user has permission for action
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean {
  const roles: UserRole[] = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  // Admin has all permissions
  if (userRole === 'admin') return true;
  
  return roles.includes(userRole);
}

/**
 * Get redirect path based on user role
 */
export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'student':
      return '/student';
    case 'teacher':
      return '/teacher';
    case 'parent':
      return '/parent';
    default:
      return '/';
  }
}