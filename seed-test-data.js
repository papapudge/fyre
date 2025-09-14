const API_BASE = 'http://localhost:8000';

async function seedData() {
  console.log('🌱 Seeding test data...');
  
  // Add test stations
  const stations = [
    {
      name: "Fire Station 1",
      address: "123 Main St, Delhi",
      latitude: 28.6139,
      longitude: 77.2090,
      phone: "+91-11-2345-6789",
      email: "station1@firedepart.gov",
      isActive: true
    },
    {
      name: "Fire Station 2", 
      address: "456 Park Ave, Delhi",
      latitude: 28.6289,
      longitude: 77.2065,
      phone: "+91-11-2345-6790",
      email: "station2@firedepart.gov",
      isActive: true
    }
  ];

  // Add test vehicles
  const vehicles = [
    {
      unitId: "ENGINE-01",
      type: "ENGINE",
      name: "Engine 1",
      status: "IN_SERVICE",
      latitude: 28.6139,
      longitude: 77.2090,
      fuelLevel: 85,
      capabilities: ["Fire Suppression", "Rescue"],
      isActive: true
    },
    {
      unitId: "LADDER-01",
      type: "LADDER", 
      name: "Ladder 1",
      status: "EN_ROUTE",
      latitude: 28.6189,
      longitude: 77.2070,
      fuelLevel: 92,
      capabilities: ["Aerial Operations", "Rescue"],
      isActive: true
    }
  ];

  // Add test incidents
  const incidents = [
    {
      incidentNumber: "INC-2025-001",
      type: "FIRE",
      severity: "HIGH",
      status: "ACTIVE",
      title: "Structure Fire",
      description: "Residential building fire",
      latitude: 28.6150,
      longitude: 77.2080,
      address: "789 Oak Street, Delhi",
      injuries: 0,
      fatalities: 0,
      tags: ["structure", "residential"]
    },
    {
      incidentNumber: "INC-2025-002", 
      type: "MEDICAL",
      severity: "MEDIUM",
      status: "DISPATCHED",
      title: "Medical Emergency",
      description: "Chest pain complaint",
      latitude: 28.6120,
      longitude: 77.2100,
      address: "456 Elm Street, Delhi",
      injuries: 1,
      fatalities: 0,
      tags: ["medical", "chest-pain"]
    }
  ];

  // Add test personnel
  const personnel = [
    {
      userId: "john.smith@firedepart.gov",
      employeeId: "FD-001",
      rank: "Captain",
      certifications: ["Firefighter I", "Firefighter II", "EMT"],
      qualifications: ["Driver/Operator", "Rescue Specialist"],
      status: "ON_DUTY",
      trainingHours: 120
    },
    {
      userId: "sarah.johnson@firedepart.gov",
      employeeId: "FD-002", 
      rank: "Lieutenant",
      certifications: ["Firefighter I", "Firefighter II"],
      qualifications: ["Driver/Operator"],
      status: "ON_DUTY",
      trainingHours: 95
    }
  ];

  try {
    // Create stations
    console.log('📍 Creating stations...');
    for (const station of stations) {
      const response = await fetch(`${API_BASE}/stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(station)
      });
      if (response.ok) {
        const created = await response.json();
        console.log(`✅ Created station: ${created.name}`);
      }
    }

    // Create vehicles
    console.log('🚒 Creating vehicles...');
    for (const vehicle of vehicles) {
      const response = await fetch(`${API_BASE}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      if (response.ok) {
        const created = await response.json();
        console.log(`✅ Created vehicle: ${created.name}`);
      }
    }

    // Create incidents
    console.log('🚨 Creating incidents...');
    for (const incident of incidents) {
      const response = await fetch(`${API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (response.ok) {
        const created = await response.json();
        console.log(`✅ Created incident: ${created.title}`);
      }
    }

    // Create personnel
    console.log('👨‍🚒 Creating personnel...');
    for (const person of personnel) {
      const response = await fetch(`${API_BASE}/personnel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
      });
      if (response.ok) {
        const created = await response.json();
        console.log(`✅ Created personnel: ${created.employeeId}`);
      }
    }

    console.log('🎉 Test data seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

seedData();