"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserManagementDialog } from "@/components/admin/user-management-dialog"
import { SystemSettingsDialog } from "@/components/admin/system-settings-dialog"
import { getAdminStats, getRecentActivity, getSystemStatus, type AdminStats, type RecentActivity } from "@/lib/admin"
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  Bell,
  MapPin,
  Truck,
  Building2,
  AlertTriangle,
  BarChart3,
  Key,
  Globe,
  Download,
  Upload,
  Eye,
  Trash2,
  RefreshCw,
  Loader2
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const [statsData, activityData, statusData] = await Promise.all([
        getAdminStats(),
        getRecentActivity(),
        getSystemStatus()
      ])
      setStats(statsData)
      setRecentActivity(activityData)
      setSystemStatus(statusData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSectionClick = (sectionTitle: string, itemName: string) => {
    // Navigate to appropriate pages based on section and item
    if (sectionTitle === "Asset Management") {
      switch (itemName) {
        case "Stations":
          router.push("/assets/stations")
          break
        case "Vehicles":
          router.push("/assets/vehicles")
          break
        case "Hydrants":
          router.push("/assets/hydrants")
          break
        default:
          break
      }
    }
    // Add more navigation logic for other sections as needed
  }

  const adminSections = stats ? [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      items: [
        { name: "Users", count: stats.users.total, status: stats.users.active > 0 ? "active" : "inactive" },
        { name: "Active Users", count: stats.users.active, status: "active" },
        { name: "Personnel", count: stats.personnel.total, status: stats.personnel.onDuty > 0 ? "on_duty" : "off_duty" }
      ]
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      items: [
        { name: "Database", count: 1, status: systemStatus?.database === 'connected' ? "connected" : "disconnected" },
        { name: "API Status", count: 1, status: systemStatus?.api === 'online' ? "online" : "offline" },
        { name: "Notifications", count: 1, status: systemStatus?.notifications === 'active' ? "active" : "inactive" }
      ]
    },
    {
      title: "Asset Management",
      description: "Manage stations, vehicles, and equipment",
      icon: Truck,
      items: [
        { name: "Stations", count: stats.stations.total, status: stats.stations.active > 0 ? "active" : "inactive" },
        { name: "Vehicles", count: stats.vehicles.total, status: stats.vehicles.inService > 0 ? "in_service" : "out_of_service" },
        { name: "Hydrants", count: stats.hydrants.total, status: stats.hydrants.active > 0 ? "active" : "inactive" }
      ]
    },
    {
      title: "Incident Management",
      description: "Monitor incidents and emergency response",
      icon: AlertTriangle,
      items: [
        { name: "Total Incidents", count: stats.incidents.total, status: "monitored" },
        { name: "Active Incidents", count: stats.incidents.active, status: stats.incidents.active > 0 ? "active" : "none" },
        { name: "Closed Incidents", count: stats.incidents.closed, status: "resolved" }
      ]
    }
  ] : []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "configured":
      case "connected":
      case "in_service":
      case "monitored":
      case "current":
      case "online":
      case "on_duty":
      case "resolved":
        return "success"
      case "warning":
        return "warning"
      case "error":
      case "disconnected":
      case "offline":
      case "out_of_service":
      case "damaged":
        return "destructive"
      case "inactive":
      case "off_duty":
      case "none":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600"
      case "warning": return "text-yellow-600"
      case "error": return "text-red-600"
      default: return "text-blue-600"
    }
  }

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin & Settings</h1>
            <p className="text-gray-600">System administration and configuration</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/reports')}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <SystemSettingsDialog />
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  systemStatus?.system === 'operational' ? 'bg-green-500' : 
                  systemStatus?.system === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-gray-600">
                    {systemStatus?.system === 'operational' ? 'All systems operational' : 
                     systemStatus?.system === 'error' ? 'System error' : 'Loading...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Database className={`h-5 w-5 ${
                  systemStatus?.database === 'connected' ? 'text-green-600' : 'text-red-600'
                }`} />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-gray-600">
                    {systemStatus?.database === 'connected' ? 'Connected' : 
                     systemStatus?.database === 'disconnected' ? 'Disconnected' : 'Loading...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Globe className={`h-5 w-5 ${
                  systemStatus?.api === 'online' ? 'text-green-600' : 'text-red-600'
                }`} />
                <div>
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-gray-600">
                    {systemStatus?.api === 'online' ? 'Online' : 
                     systemStatus?.api === 'offline' ? 'Offline' : 'Loading...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Bell className={`h-5 w-5 ${
                  systemStatus?.notifications === 'active' ? 'text-green-600' : 'text-red-600'
                }`} />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-gray-600">
                    {systemStatus?.notifications === 'active' ? 'Active' : 
                     systemStatus?.notifications === 'inactive' ? 'Inactive' : 'Loading...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading admin data...</span>
            </div>
          ) : (
            adminSections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <section.icon className="h-5 w-5" />
                    <span>{section.title}</span>
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.count} items</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSectionClick(section.title, item.name)}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              System activity and audit logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading recent activity...</span>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === "success" ? "bg-green-500" :
                        activity.type === "warning" ? "bg-yellow-500" :
                        activity.type === "error" ? "bg-red-500" :
                        "bg-blue-500"
                      }`}></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">by {activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity found</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/reports')}
              >
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <UserManagementDialog />
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => alert('Role management coming soon!')}
              >
                Manage Roles
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => alert('Permissions management coming soon!')}
              >
                View Permissions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={async () => {
                  try {
                    // In a real app, this would trigger an actual backup
                    alert('Database backup initiated! This will take a few minutes.')
                    // You could call an API endpoint here to start the backup
                  } catch (error) {
                    alert('Failed to initiate backup. Please try again.')
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Backup Database
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  if (stats) {
                    const exportData = {
                      users: `${stats.users.total} records`,
                      personnel: `${stats.personnel.total} records`, 
                      vehicles: `${stats.vehicles.total} records`,
                      stations: `${stats.stations.total} records`,
                      incidents: `${stats.incidents.total} records`,
                      hydrants: `${stats.hydrants.total} records`
                    }
                    // Create and download a JSON file
                    const dataStr = JSON.stringify(exportData, null, 2)
                    const dataBlob = new Blob([dataStr], {type: 'application/json'})
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `fyre-export-${new Date().toISOString().split('T')[0]}.json`
                    link.click()
                    URL.revokeObjectURL(url)
                  } else {
                    alert('No data available to export')
                  }
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/reports')}
              >
                <Eye className="h-4 w-4 mr-2" />
                System Logs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  const apiKeys = [
                    { name: "Google Maps API", status: "Active", lastUsed: "2 minutes ago" },
                    { name: "SMS Gateway API", status: "Active", lastUsed: "5 minutes ago" },
                    { name: "Weather API", status: "Inactive", lastUsed: "1 hour ago" }
                  ]
                  const apiKeysData = apiKeys.map(key => `${key.name}: ${key.status} (${key.lastUsed})`).join('\n')
                  const dataStr = JSON.stringify(apiKeys, null, 2)
                  const dataBlob = new Blob([dataStr], {type: 'application/json'})
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `api-keys-${new Date().toISOString().split('T')[0]}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Key className="h-4 w-4 mr-2" />
                API Keys
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => router.push('/reports')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Audit Logs
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  const securitySettings = {
                    "Two-Factor Auth": "Enabled",
                    "Password Policy": "Strong (8+ chars, numbers, symbols)",
                    "Session Timeout": "8 hours",
                    "IP Whitelist": "192.168.1.0/24, 10.0.0.0/8",
                    "Failed Login Lockout": "5 attempts, 15 min lockout"
                  }
                  const dataStr = JSON.stringify(securitySettings, null, 2)
                  const dataBlob = new Blob([dataStr], {type: 'application/json'})
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `security-settings-${new Date().toISOString().split('T')[0]}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
