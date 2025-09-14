import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with minimal test data...')

  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count()
    const existingStations = await prisma.station.count()
    
    if (existingUsers === 0) {
      // Create one test user
      const user = await prisma.user.create({
        data: {
          email: 'admin@firedepartment.com',
          name: 'Admin User',
          role: 'ADMIN',
          badgeNumber: 'ADMIN-001',
          phone: '+91 98765 43210',
          isActive: true,
          preferences: {}
        }
      })
      console.log('✅ Created admin user')
    }

    if (existingStations === 0) {
      // Create one test station
      const station = await prisma.station.create({
        data: {
          name: 'Main Fire Station',
          address: '123 Fire Station Road, Delhi 110001',
          latitude: 28.6139,
          longitude: 77.2090,
          phone: '+91 11 2345 6789',
          email: 'main@firedepartment.com',
          capacity: 50,
          isActive: true,
          coverage: 5.2,
          population: 45000,
          established: new Date('2015-01-01')
        }
      })
      console.log('✅ Created main station')
    }

    // Create some test vehicles
    const existingVehicles = await prisma.vehicle.count()
    if (existingVehicles === 0) {
      const station = await prisma.station.findFirst()
      if (station) {
        await prisma.vehicle.create({
          data: {
            unitId: 'ENG-001',
            type: 'ENGINE',
            name: 'Engine 1',
            stationId: station.id,
            status: 'IN_SERVICE',
            latitude: 28.6139,
            longitude: 77.2090,
            fuelLevel: 85,
            capabilities: ['Fire Suppression', 'Rescue'],
            year: 2020,
            make: 'Rosenbauer',
            model: 'AT',
            isActive: true
          }
        })
        console.log('✅ Created test vehicle')
      }
    }

    // Create some test incidents
    const existingIncidents = await prisma.incident.count()
    if (existingIncidents === 0) {
      const station = await prisma.station.findFirst()
      if (station) {
        await prisma.incident.create({
          data: {
            incidentNumber: '20250509-001',
            type: 'FIRE',
            severity: 'HIGH',
            status: 'ACTIVE',
            title: 'Test Structure Fire',
            description: 'Test incident for admin dashboard',
            latitude: 28.6139,
            longitude: 77.2090,
            address: '123 Test Street, Delhi 110001',
            stationId: station.id,
            callerName: 'Test Caller',
            callerPhone: '+91 98765 43210',
            reportedAt: new Date(),
            injuries: 0,
            fatalities: 0,
            estimatedLoss: 50000,
            tags: ['test', 'structure_fire']
          }
        })
        console.log('✅ Created test incident')
      }
    }

    // Create some test hydrants
    const existingHydrants = await prisma.hydrant.count()
    if (existingHydrants === 0) {
      const station = await prisma.station.findFirst()
      if (station) {
        await prisma.hydrant.create({
          data: {
            hydrantId: 'H-001',
            stationId: station.id,
            latitude: 28.6140,
            longitude: 77.2095,
            flowRate: 1000,
            pressure: 80,
            capacity: 5000,
            status: 'ACTIVE',
            type: 'DRY_BARREL',
            isActive: true
          }
        })
        console.log('✅ Created test hydrant')
      }
    }

    console.log('🎉 Minimal database seeding completed!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
