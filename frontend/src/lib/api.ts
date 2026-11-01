/**
 * Wedora / AI Wedding Timeline Orchestrator — Frontend API Client SDK
 * Direct binding to backend on http://localhost:5001/api
 */

const BASE_URL = (typeof window !== 'undefined' && (window as any).VITE_API_URL) 
  || (typeof process !== 'undefined' && process.env?.VITE_API_URL) 
  || 'http://localhost:5001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('wedora_token') || localStorage.getItem('orchestrator_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('wedora_token', token);
      } else {
        localStorage.removeItem('wedora_token');
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('wedora_token') || localStorage.getItem('orchestrator_token');
    }
    return this.token;
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: Request failed`);
    }

    return data;
  }

  // --- Authentication ---
  public auth = {
    register: (payload: {
      name: string;
      email: string;
      phone: string;
      password: string;
      role: 'VENDOR' | 'PLANNER' | 'CUSTOMER';
      vendorDetails?: any;
    }) => this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

    login: async (credentials: { email: string; password: string }) => {
      const res = await this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
      if (res.data?.token) {
        this.setToken(res.data.token);
      }
      return res;
    },

    me: () => this.request('/auth/me', { method: 'GET' }),

    logout: () => {
      this.setToken(null);
      return this.request('/auth/logout', { method: 'POST' });
    },
  };

  // --- AI Discovery Assistant ---
  public ai = {
    chat: (payload: {
      message: string;
      conversationId?: string;
      eventId?: string;
      role?: 'CUSTOMER' | 'VENDOR' | 'PLANNER';
      eventContext?: any;
      vendorContext?: any;
    }) => this.request('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),

    getStatus: () => this.request('/ai/status', { method: 'GET' }),
    getConversation: (id: string) => this.request(`/ai/conversations/${id}`, { method: 'GET' }),
    listConversations: () => this.request('/ai/conversations', { method: 'GET' }),
  };

  // --- Vendors & Discovery ---
  public vendors = {
    search: (filters: {
      category?: string;
      city?: string;
      areas?: string[];
      date?: string;
      guestCount?: number;
      maxBudget?: number;
      sortBy?: 'completed_orders' | 'aov_desc' | 'aov_asc' | 'price_asc' | 'price_desc';
    }) => this.request('/vendors/search', { method: 'POST', body: JSON.stringify(filters) }),

    list: (params?: { city?: string; category?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.request(`/vendors${q ? `?${q}` : ''}`, { method: 'GET' });
    },

    getById: (id: string) => this.request(`/vendors/${id}`, { method: 'GET' }),

    getAvailability: (id: string, params?: { startDate?: string; endDate?: string; serviceId?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.request(`/vendors/${id}/availability${q ? `?${q}` : ''}`, { method: 'GET' });
    },

    setAvailability: (id: string, payload: {
      vendorServiceId: string;
      date: string;
      status: 'AVAILABLE' | 'TENTATIVELY_RESERVED' | 'FULLY_BOOKED' | 'UNAVAILABLE';
      availableCapacity?: number;
    }) => this.request(`/vendors/${id}/availability`, { method: 'PUT', body: JSON.stringify(payload) }),

    checkAvailability: (id: string, payload: {
      serviceId: string;
      date: string;
      guestCount?: number;
    }) => this.request(`/vendors/${id}/check-availability`, { method: 'POST', body: JSON.stringify(payload) }),

    getDashboard: () => this.request('/vendors/dashboard/me', { method: 'GET' }),
  };

  // --- Categories ---
  public categories = {
    list: () => this.request('/categories', { method: 'GET' }),
  };

  // --- Events ---
  public events = {
    create: (payload: {
      eventName: string;
      eventType?: string;
      eventDate: string;
      city: string;
      area: string;
      guestCount: number;
      estimatedBudget?: number;
      description?: string;
    }) => this.request('/events', { method: 'POST', body: JSON.stringify(payload) }),

    list: () => this.request('/events', { method: 'GET' }),
    getById: (id: string) => this.request(`/events/${id}`, { method: 'GET' }),
    update: (id: string, payload: any) => this.request(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    getTimeline: (id: string) => this.request(`/events/${id}/timeline`, { method: 'GET' }),
  };

  // --- Inquiries & Quotations ---
  public inquiries = {
    create: (payload: {
      eventId: string;
      vendorServiceId: string;
      requirements: string;
      guestCount?: number;
      budget?: number;
    }) => this.request('/inquiries', { method: 'POST', body: JSON.stringify(payload) }),

    list: (params?: { eventId?: string; status?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.request(`/inquiries${q ? `?${q}` : ''}`, { method: 'GET' });
    },
  };

  public quotations = {
    create: (payload: {
      inquiryId: string;
      quotedAmount: number;
      serviceScope: string;
      includedServices?: string;
      additionalCharges?: number;
      validDays?: number;
      paymentTerms?: string;
    }) => this.request('/quotations', { method: 'POST', body: JSON.stringify(payload) }),

    getById: (id: string) => this.request(`/quotations/${id}`, { method: 'GET' }),

    respond: (id: string, action: 'ACCEPT' | 'REJECT') =>
      this.request(`/quotations/${id}/respond`, { method: 'PATCH', body: JSON.stringify({ action }) }),
  };

  // --- Bookings ---
  public bookings = {
    confirm: (quotationId: string) =>
      this.request('/bookings', { method: 'POST', body: JSON.stringify({ quotationId }) }),

    list: (params?: { eventId?: string; status?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.request(`/bookings${q ? `?${q}` : ''}`, { method: 'GET' });
    },

    getById: (id: string) => this.request(`/bookings/${id}`, { method: 'GET' }),

    updateStatus: (id: string, status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') =>
      this.request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  };

  // --- Simulated Payments ---
  public payments = {
    simulate: (payload: {
      bookingId?: string;
      eventId: string;
      payeeId: string;
      amount: number;
      paymentPurpose?: string;
      paymentType?: 'CUSTOMER_TO_VENDOR' | 'PLANNER_TO_VENDOR' | 'CUSTOMER_TO_PLANNER';
      idempotencyKey?: string;
    }) => this.request('/payments/simulate', { method: 'POST', body: JSON.stringify(payload) }),

    list: (params?: { eventId?: string; bookingId?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return this.request(`/payments${q ? `?${q}` : ''}`, { method: 'GET' });
    },
  };

  // --- Timeline Tasks ---
  public timeline = {
    createTask: (payload: {
      eventId: string;
      taskName: string;
      deadline?: string;
      assignedUserId?: string;
      relatedBookingId?: string;
      status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    }) => this.request('/timeline/tasks', { method: 'POST', body: JSON.stringify(payload) }),

    updateTask: (id: string, payload: any) =>
      this.request(`/timeline/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

    deleteTask: (id: string) =>
      this.request(`/timeline/tasks/${id}`, { method: 'DELETE' }),
  };
}

export const api = new ApiClient();
export default api;
