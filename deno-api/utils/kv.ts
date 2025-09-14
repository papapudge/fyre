// Initialize Deno KV - using the built-in Deno KV
let kv: Deno.Kv;

try {
  kv = await Deno.openKv();
} catch (error) {
  console.warn("KV not available, using in-memory implementation");
  // In-memory KV for local development
  const memoryStore = new Map<string, any>();
  
  kv = {
    get: async (key: Deno.KvKey) => {
      const keyStr = JSON.stringify(key);
      const value = memoryStore.get(keyStr);
      return { value, versionstamp: value ? "memory" : null };
    },
    set: async (key: Deno.KvKey, value: any) => {
      const keyStr = JSON.stringify(key);
      memoryStore.set(keyStr, value);
      return { ok: true, versionstamp: "memory" };
    },
    delete: async (key: Deno.KvKey) => {
      const keyStr = JSON.stringify(key);
      memoryStore.delete(keyStr);
      return { ok: true, versionstamp: "memory" };
    },
    list: async function* (selector: Deno.KvListSelector) {
      const prefix = JSON.stringify(selector.prefix);
      console.log("🔍 List operation - looking for prefix:", prefix);
      console.log("🔍 Memory store keys:", Array.from(memoryStore.keys()));
      
      for (const [key, value] of memoryStore.entries()) {
        // Check if the key starts with the prefix
        // For array keys like ["stations","id"], we need to check if it starts with ["stations",
        const matches = key.startsWith(prefix.slice(0, -1) + ',"') || key === prefix;
        if (matches) {
          yield { key: JSON.parse(key), value, versionstamp: "memory" };
        }
      }
    },
    atomic: () => ({
      set: (key: Deno.KvKey, value: any) => {
        const keyStr = JSON.stringify(key);
        memoryStore.set(keyStr, value);
        return { ok: true, versionstamp: "memory" };
      },
      delete: (key: Deno.KvKey) => {
        const keyStr = JSON.stringify(key);
        memoryStore.delete(keyStr);
        return { ok: true, versionstamp: "memory" };
      },
      commit: async () => ({ ok: true, versionstamp: "memory" })
    })
  } as any;
}

export { kv };

// Helper functions for KV operations
export class KVStore {
  // Generic CRUD operations
  static async create<T>(key: string, data: T): Promise<T> {
    const id = crypto.randomUUID();
    const fullKey = [key, id];
    await kv.set(fullKey, { ...data, id, createdAt: new Date().toISOString() });
    return { ...data, id, createdAt: new Date().toISOString() } as T;
  }

  static async get<T>(key: string, id: string): Promise<T | null> {
    const fullKey = [key, id];
    const result = await kv.get(fullKey);
    return result.value as T | null;
  }

  static async update<T>(key: string, id: string, data: Partial<T>): Promise<T | null> {
    const fullKey = [key, id];
    const existing = await kv.get(fullKey);
    if (!existing.value) return null;
    
    const updated = { ...existing.value, ...data, updatedAt: new Date().toISOString() };
    await kv.set(fullKey, updated);
    return updated as T;
  }

  static async delete(key: string, id: string): Promise<boolean> {
    const fullKey = [key, id];
    await kv.delete(fullKey);
    return true;
  }

  static async list<T>(key: string, limit = 100, offset = 0): Promise<T[]> {
    const results: T[] = [];
    const entries = kv.list({ prefix: [key] }, { limit, offset });
    
    for await (const entry of entries) {
      results.push(entry.value as T);
    }
    
    return results;
  }

  static async search<T>(key: string, filter: (item: T) => boolean): Promise<T[]> {
    const results: T[] = [];
    const entries = kv.list({ prefix: [key] });
    
    for await (const entry of entries) {
      const item = entry.value as T;
      if (filter(item)) {
        results.push(item);
      }
    }
    
    return results;
  }

  // Specific operations for relationships
  static async findByField<T>(key: string, field: string, value: any): Promise<T[]> {
    return this.search<T>(key, (item: any) => item[field] === value);
  }

  static async findByMultipleFields<T>(key: string, filters: Record<string, any>): Promise<T[]> {
    return this.search<T>(key, (item: any) => {
      return Object.entries(filters).every(([field, value]) => item[field] === value);
    });
  }

  // Index operations for better performance
  static async createIndex(key: string, indexKey: string, id: string, value: string): Promise<void> {
    const indexFullKey = [key, "index", indexKey, value, id];
    await kv.set(indexFullKey, { id, value });
  }

  static async getByIndex<T>(key: string, indexKey: string, value: string): Promise<T[]> {
    const results: T[] = [];
    const entries = kv.list({ prefix: [key, "index", indexKey, value] });
    
    for await (const entry of entries) {
      const indexEntry = entry.value as { id: string };
      const item = await this.get<T>(key, indexEntry.id);
      if (item) results.push(item);
    }
    
    return results;
  }

  // Batch operations
  static async batchCreate<T>(key: string, items: T[]): Promise<T[]> {
    const results: T[] = [];
    const atomic = kv.atomic();
    
    for (const item of items) {
      const id = crypto.randomUUID();
      const fullKey = [key, id];
      const data = { ...item, id, createdAt: new Date().toISOString() };
      atomic.set(fullKey, data);
      results.push(data as T);
    }
    
    await atomic.commit();
    return results;
  }

  static async batchDelete(key: string, ids: string[]): Promise<void> {
    const atomic = kv.atomic();
    
    for (const id of ids) {
      const fullKey = [key, id];
      atomic.delete(fullKey);
    }
    
    await atomic.commit();
  }
}

// Type definitions for our entities
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

export interface Assignment {
  id: string;
  incidentId: string;
  userId: string;
  personnelId?: string;
  vehicleId?: string;
  role: "COMMAND" | "FIREFIGHTER" | "PARAMEDIC" | "DRIVER" | "OBSERVER" | "SUPPORT" | "INVESTIGATOR" | "SAFETY_OFFICER";
  status: "ASSIGNED" | "ACCEPTED" | "EN_ROUTE" | "ON_SCENE" | "COMPLETED" | "CANCELLED" | "REJECTED";
  assignedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  notes?: string;
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

export interface Equipment {
  id: string;
  name: string;
  type: "BREATHING_APPARATUS" | "HOSE" | "NOZZLE" | "LADDER" | "TOOLS" | "COMMUNICATION" | "MEDICAL" | "OTHER";
  stationId: string;
  serialNumber?: string;
  status: "IN_SERVICE" | "OUT_OF_SERVICE" | "MAINTENANCE" | "RESERVE";
  lastInspection?: string;
  nextInspection?: string;
  warrantyExpiry?: string;
  purchaseDate?: string;
  cost?: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  stationId?: string;
  equipmentId?: string;
  vehicleId?: string;
  type: "PREVENTIVE" | "CORRECTIVE" | "EMERGENCY" | "INSPECTION";
  description: string;
  performedBy: string;
  performedAt: string;
  cost?: number;
  notes?: string;
}

export interface Report {
  id: string;
  title: string;
  type: "INCIDENT_SUMMARY" | "MONTHLY_REPORT" | "ANNUAL_REPORT" | "PERFORMANCE_REPORT" | "MAINTENANCE_REPORT" | "TRAINING_REPORT" | "CUSTOM";
  incidentId?: string;
  userId: string;
  content: Record<string, any>;
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "PUBLISHED" | "ARCHIVED";
  generatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: Record<string, any>;
  category: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: string;
}
