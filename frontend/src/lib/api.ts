// API configuration and utilities for connecting to backend on port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      data: data
    };
  }
  
  return data;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

// Auth APIs
export const authApi = {
  registerTenant: async (data: {
    tenantName: string;
    subdomain: string;
    adminEmail: string;
    adminPassword: string;
    adminFullName: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register-tenant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  login: async (data: {
    email: string;
    password: string;
    tenantSubdomain: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{
      user: User;
      token: string;
      expiresIn: number;
    }>(response);
  },

  me: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<User & { tenant: Tenant }>(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Tenant APIs
export const tenantApi = {
  getDetails: async (tenantId: string) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Tenant & { stats: TenantStats }>(response);
  },

  update: async (tenantId: string, data: Partial<Tenant>) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  list: async (params?: { page?: number; limit?: number; status?: string; subscriptionPlan?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.subscriptionPlan) queryParams.set('subscriptionPlan', params.subscriptionPlan);

    const response = await fetch(`${API_BASE_URL}/tenants?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ tenants: Tenant[]; pagination: Pagination }>(response);
  }
};

// User APIs
export const userApi = {
  list: async (tenantId: string, params?: { search?: string; role?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.role) queryParams.set('role', params.role);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}/users?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ users: User[]; total: number; pagination: Pagination }>(response);
  },

  create: async (tenantId: string, data: CreateUserData) => {
    const response = await fetch(`${API_BASE_URL}/tenants/${tenantId}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<User>(response);
  },

  update: async (userId: string, data: Partial<User>) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<User>(response);
  },

  delete: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Project APIs
export const projectApi = {
  list: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/projects?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ projects: Project[]; total: number; pagination: Pagination }>(response);
  },

  get: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Project>(response);
  },

  create: async (data: CreateProjectData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Project>(response);
  },

  update: async (projectId: string, data: Partial<Project>) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Project>(response);
  },

  delete: async (projectId: string) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Task APIs
export const taskApi = {
  list: async (projectId: string, params?: { status?: string; assignedTo?: string; priority?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.assignedTo) queryParams.set('assignedTo', params.assignedTo);
    if (params?.priority) queryParams.set('priority', params.priority);
    if (params?.search) queryParams.set('search', params.search);

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks?${queryParams}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ tasks: Task[]; total: number; pagination: Pagination }>(response);
  },

  create: async (projectId: string, data: CreateTaskData) => {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Task>(response);
  },

  update: async (taskId: string, data: Partial<Task>) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Task>(response);
  },

  updateStatus: async (taskId: string, status: TaskStatus) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse<Task>(response);
  },

  delete: async (taskId: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Types
export type UserRole = 'super_admin' | 'tenant_admin' | 'user';
export type TenantStatus = 'active' | 'suspended' | 'trial';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
export type ProjectStatus = 'active' | 'archived' | 'completed';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  tenantId: string | null;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: TenantStatus;
  subscriptionPlan: SubscriptionPlan;
  maxUsers: number;
  maxProjects: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TenantStats {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdBy: string | { id: string; fullName: string };
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  tenantId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string | { id: string; fullName: string; email: string } | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalTenants?: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assignedTo?: string;
  priority?: TaskPriority;
  dueDate?: string;
}
