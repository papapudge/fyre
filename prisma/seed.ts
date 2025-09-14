import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with test data...')

  try {
    // Create test users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'john.smith@firedepartment.com' },
        update: {},
        create: {
          email: 'john.smith@firedepartment.com',
          name: 'John Smith',
          role: 'ADMIN',
          badgeNumber: 'FD-001',
          phone: '+91 98765 43210',
          isActive: true,
          preferences: {}
        }
      }),
      prisma.user.upsert({
        where: { email: 'sarah.johnson@firedepartment.com' },
        update: {},
        create: {
          email: 'sarah.johnson@firedepartment.com',
          name: 'Sarah Johnson',
          role: 'SUPERVISOR',
          badgeNumber: 'FD-002',
          phone: '+91 98765 43211',
          isActive: true,
          preferences: {}
        }
      }),
      prisma.user.upsert({
        where: { email: 'mike.davis@firedepartment.com' },
        update: {},
        create: {
          email: 'mike.davis@firedepartment.com',
          name: 'Mike Davis',
          role: 'FIELD_RESPONDER',
          badgeNumber: 'FD-003',
          phone: '+91 98765 43212',
          isActive: true,
          preferences: {}
        }
      })
    ])

    console.log('✅ Created users')

    // Create test stations
    const existingStations = await prisma.station.findMany()
    let stations = existingStations
    
    if (existingStations.length === 0) {
      stations = await Promise.all([
        prisma.station.create({
          data: {
            name: 'Delhi Fire Station 1',
            address: '123 Fire Station Road, Delhi 110001',
            latitude: 28.6139,
            longitude: 77.2090,
            phone: '+91 11 2345 6789',
            email: 'station1@firedepartment.com',
            capacity: 50,
            isActive: true,
            coverage: 5.2,
            population: 45000,
            established: new Date('2015-01-01')
          }
        }),
        prisma.station.create({
          data: {
            name: 'Delhi Fire Station 2',
            address: '456 Emergency Way, Delhi 110002',
            latitude: 28.6149,
            longitude: 77.2100,
            phone: '+91 11 2345 6790',
            email: 'station2@firedepartment.com',
            capacity: 40,
            isActive: true,
            coverage: 4.8,
            population: 38000,
            established: new Date('2018-01-01')
          }
        })
      ])
    }

    console.log('✅ Created stations')

    // Create test personnel
    const existingPersonnel = await prisma.personnel.findMany()
    let personnel = existingPersonnel
    
    if (existingPersonnel.length === 0) {
      personnel = await Promise.all([
        prisma.personnel.create({
          data: {
            userId: users[0].id,
            employeeId: 'FD-001',
            rank: 'Chief',
            certifications: ['Firefighter I', 'Firefighter II', 'EMT'],
            qualifications: ['Driver/Operator', 'Rescue Specialist'],
            stationId: stations[0].id,
            status: 'ON_DUTY',
            trainingHours: 120
          }
        }),
        prisma.personnel.create({
          data: {
            userId: users[1].id,
            employeeId: 'FD-002',
            rank: 'Captain',
            certifications: ['Firefighter I', 'Firefighter II'],
            qualifications: ['Driver/Operator'],
            stationId: stations[0].id,
            status: 'ON_DUTY',
            trainingHours: 95
          }
        }),
        prisma.personnel.create({
          data: {
            userId: users[2].id,
            employeeId: 'FD-003',
            rank: 'Lieutenant',
            certifications: ['Firefighter I'],
            qualifications: ['Driver/Operator'],
            stationId: stations[1].id,
            status: 'OFF_DUTY',
            trainingHours: 80
          }
        })
      ])
    }

    console.log('✅ Created personnel')

    // Create test vehicles
    const vehicles = await Promise.all([
      prisma.vehicle.create({
        data: {
          unitId: 'ENG-001',
          type: 'ENGINE',
          name: 'Engine 1',
          stationId: stations[0].id,
          status: 'IN_SERVICE',
          latitude: 28.6139,
          longitude: 77.2090,
          fuelLevel: 85,
          capabilities: ['Fire Suppression', 'Rescue', 'Hazmat'],
          year: 2020,
          make: 'Rosenbauer',
          model: 'AT',
          isActive: true
        }
      }),
      prisma.vehicle.create({
        data: {
          unitId: 'LAD-002',
          type: 'LADDER',
          name: 'Ladder 2',
          stationId: stations[0].id,
          status: 'EN_ROUTE',
          latitude: 28.6149,
          longitude: 77.2100,
          fuelLevel: 92,
          capabilities: ['Aerial Operations', 'Rescue', 'Ventilation'],
          year: 2019,
          make: 'Pierce',
          model: 'Ascendant',
          isActive: true
        }
      }),
      prisma.vehicle.create({
        data: {
          unitId: 'AMB-003',
          type: 'AMBULANCE',
          name: 'Ambulance 3',
          stationId: stations[1].id,
          status: 'IN_SERVICE',
          latitude: 28.6129,
          longitude: 77.2080,
          fuelLevel: 78,
          capabilities: ['Medical Transport', 'Basic Life Support'],
          year: 2021,
          make: 'Ford',
          model: 'F-450',
          isActive: true
        }
      })
    ])

    console.log('✅ Created vehicles')

    // Create test hydrants
    const hydrants = await Promise.all([
      prisma.hydrant.create({
        data: {
          hydrantId: 'H-001',
          stationId: stations[0].id,
          latitude: 28.6140,
          longitude: 77.2095,
          flowRate: 1000,
          pressure: 80,
          capacity: 5000,
          status: 'ACTIVE',
          type: 'DRY_BARREL',
          isActive: true
        }
      }),
      prisma.hydrant.create({
        data: {
          hydrantId: 'H-002',
          stationId: stations[0].id,
          latitude: 28.6145,
          longitude: 77.2105,
          flowRate: 1200,
          pressure: 85,
          capacity: 6000,
          status: 'ACTIVE',
          type: 'WET_BARREL',
          isActive: true
        }
      }),
      prisma.hydrant.create({
        data: {
          hydrantId: 'H-003',
          stationId: stations[1].id,
          latitude: 28.6135,
          longitude: 77.2085,
          flowRate: 0,
          pressure: 0,
          capacity: 0,
          status: 'DAMAGED',
          type: 'DRY_BARREL',
          isActive: true
        }
      })
    ])

    console.log('✅ Created hydrants')

    // Create test incidents
    const incidents = await Promise.all([
      prisma.incident.create({
        data: {
          incidentNumber: '20250509-001',
          type: 'FIRE',
          severity: 'HIGH',
          status: 'ON_SCENE',
          title: 'Structure Fire - Residential Building',
          description: 'Reported structure fire in residential building. Heavy smoke visible from second floor.',
          latitude: 28.6139,
          longitude: 77.2090,
          address: '123 Main Street, Delhi 110001',
          stationId: stations[0].id,
          callerName: 'John Doe',
          callerPhone: '+91 98765 43210',
          reportedAt: new Date(),
          dispatchedAt: new Date(Date.now() - 10 * 60 * 1000),
          arrivedAt: new Date(Date.now() - 5 * 60 * 1000),
          injuries: 0,
          fatalities: 0,
          estimatedLoss: 150000,
          tags: ['residential', 'structure_fire', 'smoke']
        }
      }),
      prisma.incident.create({
        data: {
          incidentNumber: '20250509-002',
          type: 'MEDICAL',
          severity: 'MEDIUM',
          status: 'EN_ROUTE',
          title: 'Medical Emergency - Cardiac Arrest',
          description: '65-year-old male experiencing chest pain and shortness of breath.',
          latitude: 28.6149,
          longitude: 77.2100,
          address: '456 Oak Avenue, Delhi 110002',
          stationId: stations[1].id,
          callerName: 'Jane Smith',
          callerPhone: '+91 98765 43211',
          reportedAt: new Date(Date.now() - 5 * 60 * 1000),
          dispatchedAt: new Date(Date.now() - 4 * 60 * 1000),
          injuries: 1,
          fatalities: 0,
          estimatedLoss: 0,
          tags: ['medical', 'cardiac', 'emergency']
        }
      })
    ])

    console.log('✅ Created incidents')

    // Create some incident logs for activity
    await Promise.all([
      prisma.incidentLog.create({
        data: {
          incidentId: incidents[0].id,
          userId: users[0].id,
          personnelId: personnel[0].id,
          vehicleId: vehicles[0].id,
          action: 'Incident dispatched',
          description: 'Engine 1 dispatched to structure fire',
          timestamp: new Date(Date.now() - 10 * 60 * 1000)
        }
      }),
      prisma.incidentLog.create({
        data: {
          incidentId: incidents[0].id,
          userId: users[0].id,
          personnelId: personnel[0].id,
          vehicleId: vehicles[0].id,
          action: 'Arrived on scene',
          description: 'Engine 1 arrived at incident location',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        }
      }),
      prisma.incidentLog.create({
        data: {
          incidentId: incidents[1].id,
          userId: users[1].id,
          personnelId: personnel[1].id,
          vehicleId: vehicles[2].id,
          action: 'Medical emergency dispatched',
          description: 'Ambulance 3 dispatched to medical emergency',
          timestamp: new Date(Date.now() - 4 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created incident logs')

    // Create some audit logs
    await Promise.all([
      prisma.auditLog.create({
        data: {
          userId: users[0].id,
          action: 'User login',
          resource: 'system',
          details: { ip: '192.168.1.100', userAgent: 'Mozilla/5.0...' },
          timestamp: new Date(Date.now() - 2 * 60 * 1000)
        }
      }),
      prisma.auditLog.create({
        data: {
          userId: users[1].id,
          action: 'Incident created',
          resource: 'incident',
          resourceId: incidents[1].id,
          details: { incidentNumber: incidents[1].incidentNumber },
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        }
      })
    ])

    console.log('✅ Created audit logs')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`Created ${users.length} users, ${stations.length} stations, ${personnel.length} personnel, ${vehicles.length} vehicles, ${hydrants.length} hydrants, and ${incidents.length} incidents.`)

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
