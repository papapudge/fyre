// API service functions for Fire Department Resource Management
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Types
export interface Incident {
  id: string;
  incidentNumber: string;
  type: "FIRE" | "MEDICAL" | "RESCUE" | "HAZMAT" | "FALSE_ALARM" | "SERVICE_CALL" | "TRAINING" | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "DISPATCHED" | "EN_ROUTE" | "ON_SCENE" | "CONTAINED" | "CLOSED" | "CANCELLED";
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  stationId?: string;
  callerName?: string;
  callerPhone?: string;
  reportedAt: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  containedAt?: string;
  closedAt?: string;
  estimatedLoss?: number;
  injuries: number;
  fatalities: number;
  cause?: string;
  weather?: string;
  temperature?: number;
  windSpeed?: number;
  windDirection?: string;
  humidity?: number;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  unitId: string;
  type: "ENGINE" | "LADDER" | "RESCUE" | "AMBULANCE" | "HAZMAT" | "COMMAND" | "TANKER" | "BRUSH" | "UTILITY" | "OTHER";
  name: string;
  stationId: string;
  status: "IN_SERVICE" | "OUT_OF_SERVICE" | "EN_ROUTE" | "ON_SCENE" | "MAINTENANCE" | "RESERVE";
  latitude?: number;
  longitude?: number;
  lastLocationUpdate?: string;
  fuelLevel?: number;
  capabilities: string[];
  lastService?: string;
  nextService?: string;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  vin?: string;
  licensePlate?: string;
  insuranceExpiry?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  capacity?: number;
  isActive: boolean;
  coverage?: number;
  population?: number;
  established?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hydrant {
  id: string;
  hydrantId: string;
  stationId?: string;
  latitude: number;
  longitude: number;
  flowRate?: number;
  pressure?: number;
  capacity?: number;
  lastInspection?: string;
  nextInspection?: string;
  accessibility?: string;
  status: "ACTIVE" | "INACTIVE" | "DAMAGED" | "UNKNOWN" | "OUT_OF_SERVICE";
  type: "DRY_BARREL" | "WET_BARREL" | "WALL_HYDRANT" | "PRIVATE";
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Personnel {
  id: string;
  userId: string;
  employeeId: string;
  rank?: string;
  certifications: string[];
  qualifications: string[];
  hireDate?: string;
  stationId?: string;
  status: "ON_DUTY" | "OFF_DUTY" | "EN_ROUTE" | "ON_SCENE" | "UNAVAILABLE" | "ON_LEAVE" | "TRAINING";
  currentAssignment?: string;
  emergencyContact?: string;
  medicalInfo?: string;
  trainingHours: number;
  performanceScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: "ADMIN" | "CC_OPERATOR" | "FIELD_RESPONDER" | "DISPATCHER" | "SUPERVISOR" | "TRAINER";
  badgeNumber?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  preferences?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "INCIDENT_DISPATCH" | "INCIDENT_UPDATE" | "ASSIGNMENT" | "SYSTEM_ALERT" | "MAINTENANCE_REMINDER" | "TRAINING_REMINDER" | "GENERAL" | "EMERGENCY";
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | "CRITICAL";
  expiresAt?: string;
  createdAt: string;
}

// Incident API functions
export const incidentApi = {
  getAll: (params?: { limit?: number; offset?: number; status?: string; type?: string; severity?: string; stationId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.severity) searchParams.set('severity', params.severity);
    if (params?.stationId) searchParams.set('stationId', params.stationId);
    
    return apiRequest<{ incidents: Incident[]; total: number; limit: number; offset: number }>(`/incidents?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<Incident>(`/incidents/${id}`),
  
  create: (data: Partial<Incident>) => apiRequest<Incident>('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<Incident>) => apiRequest<Incident>(`/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  updateStatus: (id: string, status: string, timestamp?: string) => apiRequest<Incident>(`/incidents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, timestamp }),
  }),
  
  getActive: () => apiRequest<Incident[]>('/incidents/active'),
  
  getNearby: (lat: number, lng: number, radius: number = 10) => 
    apiRequest<Incident[]>(`/incidents/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Vehicle API functions
export const vehicleApi = {
  getAll: (params?: { limit?: number; offset?: number; status?: string; type?: string; stationId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.stationId) searchParams.set('stationId', params.stationId);
    
    return apiRequest<{ vehicles: Vehicle[]; total: number; limit: number; offset: number }>(`/vehicles?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<Vehicle>(`/vehicles/${id}`),
  
  create: (data: Partial<Vehicle>) => apiRequest<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<Vehicle>) => apiRequest<Vehicle>(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  updateLocation: (id: string, latitude: number, longitude: number) => apiRequest<Vehicle>(`/vehicles/${id}/location`, {
    method: 'PATCH',
    body: JSON.stringify({ latitude, longitude }),
  }),
  
  updateStatus: (id: string, status: string) => apiRequest<Vehicle>(`/vehicles/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  getByStation: (stationId: string) => apiRequest<Vehicle[]>(`/vehicles/station/${stationId}`),
  
  getByStatus: (status: string) => apiRequest<Vehicle[]>(`/vehicles/status/${status}`),
  
  getNearby: (lat: number, lng: number, radius: number = 10) => 
    apiRequest<Vehicle[]>(`/vehicles/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Station API functions
export const stationApi = {
  getAll: (params?: { limit?: number; offset?: number; isActive?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    
    return apiRequest<{ stations: Station[]; total: number; limit: number; offset: number }>(`/stations?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<Station>(`/stations/${id}`),
  
  create: (data: Partial<Station>) => apiRequest<Station>('/stations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<Station>) => apiRequest<Station>(`/stations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getNearby: (lat: number, lng: number, radius: number = 10) => 
    apiRequest<Station[]>(`/stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Hydrant API functions
export const hydrantApi = {
  getAll: (params?: { limit?: number; offset?: number; status?: string; stationId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.stationId) searchParams.set('stationId', params.stationId);
    
    return apiRequest<{ hydrants: Hydrant[]; total: number; limit: number; offset: number }>(`/hydrants?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<Hydrant>(`/hydrants/${id}`),
  
  create: (data: Partial<Hydrant>) => apiRequest<Hydrant>('/hydrants', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<Hydrant>) => apiRequest<Hydrant>(`/hydrants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getNearby: (lat: number, lng: number, radius: number = 10) => 
    apiRequest<Hydrant[]>(`/hydrants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};

// Personnel API functions
export const personnelApi = {
  getAll: (params?: { limit?: number; offset?: number; status?: string; stationId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.stationId) searchParams.set('stationId', params.stationId);
    
    return apiRequest<{ personnel: Personnel[]; total: number; limit: number; offset: number }>(`/personnel?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<Personnel>(`/personnel/${id}`),
  
  create: (data: Partial<Personnel>) => apiRequest<Personnel>('/personnel', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<Personnel>) => apiRequest<Personnel>(`/personnel/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getByStation: (stationId: string) => apiRequest<Personnel[]>(`/personnel/station/${stationId}`),
  
  getByStatus: (status: string) => apiRequest<Personnel[]>(`/personnel/status/${status}`),
};

// User API functions
export const userApi = {
  getAll: (params?: { limit?: number; offset?: number; role?: string; isActive?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.role) searchParams.set('role', params.role);
    if (params?.isActive !== undefined) searchParams.set('isActive', params.isActive.toString());
    
    return apiRequest<{ users: User[]; total: number; limit: number; offset: number }>(`/users?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<User>(`/users/${id}`),
  
  create: (data: Partial<User>) => apiRequest<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: Partial<User>) => apiRequest<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Notification API functions
export const notificationApi = {
  getAll: (params?: { limit?: number; offset?: number; userId?: string; isRead?: boolean; type?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.userId) searchParams.set('userId', params.userId);
    if (params?.isRead !== undefined) searchParams.set('isRead', params.isRead.toString());
    if (params?.type) searchParams.set('type', params.type);
    
    return apiRequest<{ notifications: Notification[]; total: number; limit: number; offset: number }>(`/notifications?${searchParams}`);
  },
  
  getById: (id: string) => apiRequest<Notification>(`/notifications/${id}`),
  
  markAsRead: (id: string) => apiRequest<Notification>(`/notifications/${id}/read`, {
    method: 'PATCH',
  }),
  
  markAllAsRead: (userId: string) => apiRequest<{ count: number }>(`/notifications/read-all`, {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  }),
  
  create: (data: Partial<Notification>) => apiRequest<Notification>('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Health check
export const healthApi = {
  check: () => apiRequest<{ status: string; timestamp: string; version: string }>('/health'),
};
