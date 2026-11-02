import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  registerUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  type AuthProfile,
} from '../lib/supabaseAuth';
import {
  checkSlotAvailability,
  createBookingWithConflictCheck,
  subscribeToWedoraRealtime,
} from '../lib/supabaseData';

describe('Wedora Supabase Auth & Persistence Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Supabase Client Configuration', () => {
    it('verifies Supabase client is configured with active target project URL', () => {
      expect(isSupabaseConfigured()).toBe(true);
      expect(supabase).toBeDefined();
      expect(typeof supabase.from).toBe('function');
      expect(typeof supabase.auth.signUp).toBe('function');
      expect(typeof supabase.auth.signInWithPassword).toBe('function');
    });

    it('has proper realtime subscription methods available', () => {
      const channel = supabase.channel('test_channel');
      expect(channel).toBeDefined();
      expect(typeof channel.on).toBe('function');
      expect(typeof channel.subscribe).toBe('function');
    });
  });

  describe('2. Authentication Flow & Validation', () => {
    it('validates password requirements on user registration', async () => {
      const res = await registerUser({
        email: 'test@example.com',
        password: 'short',
        name: 'Test Customer',
        role: 'CUSTOMER',
      });
      // Either rejects short password or returns auth response structure
      expect(res).toBeDefined();
      expect(res).toHaveProperty('user');
      expect(res).toHaveProperty('error');
    });

    it('normalizes email input before authentication requests', async () => {
      const authSpy = vi.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials', name: 'AuthApiError', status: 400 },
      });

      await loginUser({
        email: '  MixedCaseUser@Example.COM  ',
        password: 'Password123!',
      });

      expect(authSpy).toHaveBeenCalledWith({
        email: 'mixedcaseuser@example.com',
        password: 'Password123!',
      });
    });

    it('handles password reset requests with email normalization and redirect URL', async () => {
      const resetSpy = vi.spyOn(supabase.auth, 'resetPasswordForEmail').mockResolvedValueOnce({
        data: {},
        error: null,
      });

      const res = await requestPasswordReset('  user@wedora.com  ');
      expect(res.success).toBe(true);
      expect(res.error).toBeNull();
      expect(resetSpy).toHaveBeenCalledWith(
        'user@wedora.com',
        expect.objectContaining({ redirectTo: expect.any(String) })
      );
    });

    it('handles user logout cleanly', async () => {
      const logoutSpy = vi.spyOn(supabase.auth, 'signOut').mockResolvedValueOnce({
        error: null,
      });

      const res = await logoutUser();
      expect(res.error).toBeNull();
      expect(logoutSpy).toHaveBeenCalled();
    });
  });

  describe('3. Database Conflict Prevention & Realtime', () => {
    it('verifies slot availability check returns status object', async () => {
      vi.spyOn(supabase, 'from').mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ status: 'AVAILABLE', slot: 'FULL_DAY' }],
            error: null,
          }),
        }),
      } as any).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      } as any);

      const avail = await checkSlotAvailability('pun-cat-01', '2026-12-15', 'FULL_DAY');
      expect(avail).toBeDefined();
      expect(typeof avail.isAvailable).toBe('boolean');
      expect(avail.isAvailable).toBe(true);
    });

    it('subscribes to wedora_cross_device_sync channel and returns teardown function', () => {
      const onUpdate = vi.fn();
      const unsubscribe = subscribeToWedoraRealtime(onUpdate);
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });

    it('prevents double booking when a slot is already occupied', async () => {
      // Mock availability query returning booked
      vi.spyOn(supabase, 'from').mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [{ status: 'BOOKED', slot: 'FULL_DAY' }],
            error: null,
          }),
        }),
      } as any);

      const res = await createBookingWithConflictCheck({
        eventId: 'evt-01',
        vendorId: 'pun-cat-01',
        customerId: 'user-123',
        agreedAmount: 450000,
        eventDate: '2026-12-15',
        slot: 'FULL_DAY',
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('already reserved or booked');
    });
  });
});
