import { supabase, isSupabaseConfigured } from './supabase';
import type { UserRole } from '../hooks/useDemoSession';

export interface AuthProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  isDemo?: boolean;
}

/**
 * Register a new user with Supabase Auth
 * Automatically creates the linked profile in public.users via handle_new_user trigger
 */
export async function registerUser({
  email,
  password,
  name,
  role,
}: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<{
  user: AuthProfile | null;
  error: string | null;
  needsEmailConfirmation?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: 'Supabase authentication is not configured.',
    };
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: name.trim() || trimmedEmail.split('@')[0],
          role: role,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Registration failed to return user.' };
    }

    // Check if session was granted or if confirmation email is required
    const hasSession = Boolean(data.session);
    const authProfile: AuthProfile = {
      id: data.user.id,
      email: trimmedEmail,
      name: name.trim() || (data.user.user_metadata?.name as string) || trimmedEmail.split('@')[0],
      role: role,
      isDemo: false,
    };

    return {
      user: authProfile,
      error: null,
      needsEmailConfirmation: !hasSession,
    };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Registration failed' };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ user: AuthProfile | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error: 'Supabase authentication is not configured.',
    };
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Invalid user credentials.' };
    }

    // Fetch the linked public user profile to get verified role and metadata
    let role: UserRole = (data.user.user_metadata?.role as UserRole) || 'CUSTOMER';
    let name: string =
      (data.user.user_metadata?.name as string) || trimmedEmail.split('@')[0];

    try {
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (dbUser) {
        role = (dbUser.role as UserRole) || role;
        name = dbUser.name || name;
      }
    } catch {
      // Fallback to metadata
    }

    return {
      user: {
        id: data.user.id,
        email: trimmedEmail,
        name,
        role,
        isDemo: false,
      },
      error: null,
    };
  } catch (err: any) {
    return { user: null, error: err?.message || 'Login failed' };
  }
}

/**
 * Sign out current Supabase user
 */
export async function logoutUser(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null };
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err?.message || 'Signout error' };
  }
}

/**
 * Send password reset email
 */
export async function requestPasswordReset(
  email: string
): Promise<{ error: string | null; success: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured', success: false };
  }
  try {
    const trimmed = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/get-started` : undefined,
    });
    if (error) return { error: error.message, success: false };
    return { error: null, success: true };
  } catch (err: any) {
    return { error: err?.message || 'Password reset request failed', success: false };
  }
}

/**
 * Restore current session user profile
 */
export async function getSessionUserProfile(): Promise<AuthProfile | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase.auth.getSession();
    const authUser = data.session?.user;
    if (!authUser) return null;

    let role: UserRole = (authUser.user_metadata?.role as UserRole) || 'CUSTOMER';
    let name: string =
      (authUser.user_metadata?.name as string) || authUser.email?.split('@')[0] || 'User';

    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (dbUser) {
      role = (dbUser.role as UserRole) || role;
      name = dbUser.name || name;
    }

    return {
      id: authUser.id,
      email: authUser.email || '',
      name,
      role,
      isDemo: false,
    };
  } catch {
    return null;
  }
}

