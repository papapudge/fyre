#!/usr/bin/env -S deno run --allow-all

import { kv } from "./utils/kv.ts";
import { KVStore, type Station, type Vehicle, type Hydrant, type Incident } from "./utils/kv.ts";

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
  } finally {
    if (typeof kv.close === 'function') {
      await kv.close();
    }
  }
}

seedData();
