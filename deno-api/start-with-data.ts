#!/usr/bin/env -S deno run --allow-all

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { createRouter } from "./utils/router.ts";
import { kv, KVStore, type Station, type Vehicle, type Hydrant, type Incident } from "./utils/kv.ts";

// Import all route handlers
import { authRoutes } from "./routes/auth.ts";
import { userRoutes } from "./routes/users.ts";
import { personnelRoutes } from "./routes/personnel.ts";
import { stationRoutes } from "./routes/stations.ts";
import { vehicleRoutes } from "./routes/vehicles.ts";
import { hydrantRoutes } from "./routes/hydrants.ts";
import { incidentRoutes } from "./routes/incidents.ts";
import { assignmentRoutes } from "./routes/assignments.ts";
import { notificationRoutes } from "./routes/notifications.ts";
import { reportRoutes } from "./routes/reports.ts";
import { equipmentRoutes } from "./routes/equipment.ts";
import { maintenanceRoutes } from "./routes/maintenance.ts";
import { auditRoutes } from "./routes/audit.ts";
import { configRoutes } from "./routes/config.ts";

// Seed data function
async function seedData() {
  console.log("🌱 Seeding database with test data...");
  
  try {
    // Create test stations
    const stations: Partial<Station>[] = [
      {
        name: "Delhi Fire Station 1",
        address: "123 Fire Station Road, Delhi 110001",
        latitude: 28.6139,
        longitude: 77.2090,
        phone: "+91 11 2345 6789",
        email: "station1@firedepartment.com",
        capacity: 50,
        isActive: true,
        coverage: 5.2,
        population: 45000,
        established: "2015"
      },
      {
        name: "Delhi Fire Station 2", 
        address: "456 Emergency Way, Delhi 110002",
        latitude: 28.6149,
        longitude: 77.2100,
        phone: "+91 11 2345 6790",
        email: "station2@firedepartment.com",
        capacity: 40,
        isActive: true,
        coverage: 4.8,
        population: 38000,
        established: "2018"
      },
      {
        name: "Delhi Fire Station 3",
        address: "789 Rescue Boulevard, Delhi 110003", 
        latitude: 28.6129,
        longitude: 77.2080,
        phone: "+91 11 2345 6791",
        email: "station3@firedepartment.com",
        capacity: 60,
        isActive: true,
        coverage: 6.1,
        population: 52000,
        established: "2020"
      }
    ];

    console.log("Creating stations...");
    const createdStations = [];
    for (const stationData of stations) {
      const station = await KVStore.create<Station>("stations", stationData);
      createdStations.push(station);
      console.log(`✅ Created station: ${station.name}`);
    }

    // Create test vehicles
    const vehicles: Partial<Vehicle>[] = [
      {
        unitId: "ENG-001",
        type: "ENGINE",
        name: "Engine 1",
        stationId: createdStations[0].id,
        status: "IN_SERVICE",
        latitude: 28.6139,
        longitude: 77.2090,
        fuelLevel: 85,
        capabilities: ["Fire Suppression", "Rescue", "Hazmat"],
        lastService: "2025-04-15",
        nextService: "2025-05-15",
        year: 2020,
        make: "Rosenbauer",
        model: "AT",
        isActive: true
      },
      {
        unitId: "LAD-002", 
        type: "LADDER",
        name: "Ladder 2",
        stationId: createdStations[0].id,
        status: "EN_ROUTE",
        latitude: 28.6149,
        longitude: 77.2100,
        fuelLevel: 92,
        capabilities: ["Aerial Operations", "Rescue", "Ventilation"],
        lastService: "2025-04-20",
        nextService: "2025-05-20",
        year: 2019,
        make: "Pierce",
        model: "Ascendant",
        isActive: true
      },
      {
        unitId: "AMB-003",
        type: "AMBULANCE", 
        name: "Ambulance 3",
        stationId: createdStations[1].id,
        status: "IN_SERVICE",
        latitude: 28.6129,
        longitude: 77.2080,
        fuelLevel: 78,
        capabilities: ["Medical Transport", "Basic Life Support", "Advanced Life Support"],
        lastService: "2025-04-10",
        nextService: "2025-05-10",
        year: 2021,
        make: "Ford",
        model: "F-450",
        isActive: true
      }
    ];

    console.log("Creating vehicles...");
    const createdVehicles = [];
    for (const vehicleData of vehicles) {
      const vehicle = await KVStore.create<Vehicle>("vehicles", vehicleData);
      createdVehicles.push(vehicle);
      console.log(`✅ Created vehicle: ${vehicle.name}`);
    }

    // Create test hydrants
    const hydrants: Partial<Hydrant>[] = [
      {
        hydrantId: "H-001",
        stationId: createdStations[0].id,
        latitude: 28.6140,
        longitude: 77.2095,
        flowRate: 1000,
        pressure: 80,
        capacity: 5000,
        status: "ACTIVE",
        type: "DRY_BARREL",
        lastInspection: "2025-04-01",
        nextInspection: "2025-07-01",
        isActive: true
      },
      {
        hydrantId: "H-002",
        stationId: createdStations[0].id,
        latitude: 28.6145,
        longitude: 77.2105,
        flowRate: 1200,
        pressure: 85,
        capacity: 6000,
        status: "ACTIVE", 
        type: "WET_BARREL",
        lastInspection: "2025-04-05",
        nextInspection: "2025-07-05",
        isActive: true
      },
      {
        hydrantId: "H-003",
        stationId: createdStations[1].id,
        latitude: 28.6135,
        longitude: 77.2085,
        flowRate: 0,
        pressure: 0,
        capacity: 0,
        status: "DAMAGED",
        type: "DRY_BARREL",
        lastInspection: "2025-03-15",
        nextInspection: "2025-06-15",
        isActive: true
      }
    ];

    console.log("Creating hydrants...");
    const createdHydrants = [];
    for (const hydrantData of hydrants) {
      const hydrant = await KVStore.create<Hydrant>("hydrants", hydrantData);
      createdHydrants.push(hydrant);
      console.log(`✅ Created hydrant: ${hydrant.hydrantId}`);
    }

    // Create test incidents
    const incidents: Partial<Incident>[] = [
      {
        incidentNumber: "20250509-001",
        type: "FIRE",
        severity: "HIGH",
        status: "ON_SCENE",
        title: "Structure Fire - Residential Building",
        description: "Reported structure fire in residential building. Heavy smoke visible from second floor.",
        latitude: 28.6139,
        longitude: 77.2090,
        address: "123 Main Street, Delhi 110001",
        stationId: createdStations[0].id,
        callerName: "John Doe",
        callerPhone: "+91 98765 43210",
        reportedAt: new Date().toISOString(),
        dispatchedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        arrivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        injuries: 0,
        fatalities: 0,
        estimatedLoss: 150000,
        tags: ["residential", "structure_fire", "smoke"]
      },
      {
        incidentNumber: "20250509-002",
        type: "MEDICAL",
        severity: "MEDIUM", 
        status: "EN_ROUTE",
        title: "Medical Emergency - Cardiac Arrest",
        description: "65-year-old male experiencing chest pain and shortness of breath.",
        latitude: 28.6149,
        longitude: 77.2100,
        address: "456 Oak Avenue, Delhi 110002",
        stationId: createdStations[1].id,
        callerName: "Jane Smith",
        callerPhone: "+91 98765 43211",
        reportedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        dispatchedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 minutes ago
        injuries: 1,
        fatalities: 0,
        estimatedLoss: 0,
        tags: ["medical", "cardiac", "emergency"]
      }
    ];

    console.log("Creating incidents...");
    const createdIncidents = [];
    for (const incidentData of incidents) {
      const incident = await KVStore.create<Incident>("incidents", incidentData);
      createdIncidents.push(incident);
      console.log(`✅ Created incident: ${incident.incidentNumber}`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(`Created ${createdStations.length} stations, ${createdVehicles.length} vehicles, ${createdHydrants.length} hydrants, and ${createdIncidents.length} incidents.`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Create the main router
const router = createRouter();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/personnel", personnelRoutes);
router.use("/stations", stationRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/hydrants", hydrantRoutes);
router.use("/incidents", incidentRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/audit", auditRoutes);
router.use("/config", configRoutes);

// Health check endpoint
router.get("/health", () => {
  return new Response(JSON.stringify({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// Root endpoint
router.get("/", () => {
  return new Response(JSON.stringify({ 
    message: "Fire Department Resource Management API",
    version: "1.0.0",
    endpoints: [
      "/auth - Authentication",
      "/users - User management",
      "/personnel - Personnel management", 
      "/stations - Station management",
      "/vehicles - Vehicle management",
      "/hydrants - Hydrant management",
      "/incidents - Incident management",
      "/assignments - Assignment management",
      "/notifications - Notification system",
      "/reports - Reporting system",
      "/equipment - Equipment management",
      "/maintenance - Maintenance records",
      "/audit - Audit logs",
      "/config - System configuration"
    ]
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// Handle CORS preflight requests
const handleCORS = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    // Route the request
    const response = await router.handle(req);
    
    // Add CORS headers to all responses
    if (response) {
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    // 404 for unmatched routes
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error",
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

// Start the server with seeded data
async function startServer() {
  console.log("🚀 Starting Fire Department API server...");
  
  // Seed data first
  await seedData();
  
  // Start the server
  console.log("🌐 Server starting on port 8000...");
  serve(handler, { port: 8000 });
}

startServer();
