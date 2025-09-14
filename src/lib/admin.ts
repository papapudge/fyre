import { db } from './db'

export interface AdminStats {
  users: {
    total: number
    active: number
    inactive: number
  }
  stations: {
    total: number
    active: number
  }
  vehicles: {
    total: number
    inService: number
    outOfService: number
  }
  incidents: {
    total: number
    active: number
    closed: number
  }
  personnel: {
    total: number
    onDuty: number
    offDuty: number
  }
  hydrants: {
    total: number
    active: number
    damaged: number
  }
}

export interface RecentActivity {
  id: string
  action: string
  user: string
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [
      userCount,
      activeUserCount,
      stationCount,
      activeStationCount,
      vehicleCount,
      inServiceVehicleCount,
      outOfServiceVehicleCount,
      incidentCount,
      activeIncidentCount,
      closedIncidentCount,
      personnelCount,
      onDutyPersonnelCount,
      offDutyPersonnelCount,
      hydrantCount,
      activeHydrantCount,
      damagedHydrantCount
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.station.count(),
      db.station.count({ where: { isActive: true } }),
      db.vehicle.count(),
      db.vehicle.count({ where: { status: 'IN_SERVICE' } }),
      db.vehicle.count({ where: { status: 'OUT_OF_SERVICE' } }),
      db.incident.count(),
      db.incident.count({ where: { status: { in: ['ACTIVE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE'] } } }),
      db.incident.count({ where: { status: 'CLOSED' } }),
      db.personnel.count(),
      db.personnel.count({ where: { status: 'ON_DUTY' } }),
      db.personnel.count({ where: { status: 'OFF_DUTY' } }),
      db.hydrant.count(),
      db.hydrant.count({ where: { status: 'ACTIVE' } }),
      db.hydrant.count({ where: { status: 'DAMAGED' } })
    ])

    return {
      users: {
        total: userCount,
        active: activeUserCount,
        inactive: userCount - activeUserCount
      },
      stations: {
        total: stationCount,
        active: activeStationCount
      },
      vehicles: {
        total: vehicleCount,
        inService: inServiceVehicleCount,
        outOfService: outOfServiceVehicleCount
      },
      incidents: {
        total: incidentCount,
        active: activeIncidentCount,
        closed: closedIncidentCount
      },
      personnel: {
        total: personnelCount,
        onDuty: onDutyPersonnelCount,
        offDuty: offDutyPersonnelCount
      },
      hydrants: {
        total: hydrantCount,
        active: activeHydrantCount,
        damaged: damagedHydrantCount
      }
    }
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    // Return default stats if database is not available
    return {
      users: { total: 0, active: 0, inactive: 0 },
      stations: { total: 0, active: 0 },
      vehicles: { total: 0, inService: 0, outOfService: 0 },
      incidents: { total: 0, active: 0, closed: 0 },
      personnel: { total: 0, onDuty: 0, offDuty: 0 },
      hydrants: { total: 0, active: 0, damaged: 0 }
    }
  }
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const [incidentLogs, auditLogs] = await Promise.all([
      db.incidentLog.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' },
        include: { user: true }
      }),
      db.auditLog.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' },
        include: { user: true }
      })
    ])

    const activities: RecentActivity[] = []

    // Add incident log activities
    incidentLogs.forEach(log => {
      activities.push({
        id: log.id,
        action: log.action,
        user: log.user?.name || 'Unknown User',
        timestamp: log.timestamp,
        type: 'info'
      })
    })

    // Add audit log activities
    auditLogs.forEach(log => {
      activities.push({
        id: log.id,
        action: log.action,
        user: log.user?.name || 'Unknown User',
        timestamp: log.timestamp,
        type: 'info'
      })
    })

    // Sort by timestamp and return top 10
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

export async function getSystemStatus() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    return {
      database: 'connected',
      api: 'online',
      notifications: 'active',
      system: 'operational'
    }
  } catch (error) {
    console.error('Error checking system status:', error)
    return {
      database: 'disconnected',
      api: 'offline',
      notifications: 'inactive',
      system: 'error'
    }
  }
}
