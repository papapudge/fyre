"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserManagementDialog } from "@/components/admin/user-management-dialog"
import { SystemSettingsDialog } from "@/components/admin/system-settings-dialog"
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
  Trash2
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()

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
  const adminSections = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      items: [
        { name: "Users", count: 24, status: "active" },
        { name: "Roles", count: 3, status: "configured" },
        { name: "Permissions", count: 12, status: "active" }
      ]
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings",
      icon: Settings,
      items: [
        { name: "General", count: 8, status: "configured" },
        { name: "Notifications", count: 5, status: "active" },
        { name: "Integrations", count: 3, status: "connected" }
      ]
    },
    {
      title: "Asset Management",
      description: "Manage stations, vehicles, and equipment",
      icon: Truck,
      items: [
        { name: "Stations", count: 3, status: "active" },
        { name: "Vehicles", count: 8, status: "in_service" },
        { name: "Hydrants", count: 156, status: "active" }
      ]
    },
    {
      title: "Security & Access",
      description: "Security settings and access control",
      icon: Shield,
      items: [
        { name: "API Keys", count: 2, status: "active" },
        { name: "Audit Logs", count: 1247, status: "monitored" },
        { name: "Backups", count: 7, status: "current" }
      ]
    }
  ]

  const recentActivity = [
    { action: "User login", user: "John Smith", time: "2 minutes ago", type: "info" },
    { action: "Incident created", user: "Sarah Johnson", time: "5 minutes ago", type: "success" },
    { action: "Vehicle status updated", user: "Mike Davis", time: "8 minutes ago", type: "info" },
    { action: "System backup completed", user: "System", time: "1 hour ago", type: "success" },
    { action: "Failed login attempt", user: "Unknown", time: "2 hours ago", type: "warning" }
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "configured":
      case "connected":
      case "in_service":
      case "monitored":
      case "current":
        return "success"
      case "warning":
        return "warning"
      case "error":
        return "destructive"
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
            <Button variant="outline" size="sm" onClick={() => alert('Database management coming soon!')}>
              <Database className="h-4 w-4 mr-2" />
              Database
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert('Security dashboard coming soon!')}>
              <Shield className="h-4 w-4 mr-2" />
              Security
            </Button>
            <SystemSettingsDialog />
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-gray-600">All systems operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-gray-600">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-gray-600">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section, index) => (
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
                        {item.status}
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
          ))}
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
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
                onClick={() => {
                  alert('Database backup initiated! This will take a few minutes.')
                  // In a real app, this would trigger an actual backup
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Backup Database
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  // Simulate data export
                  const data = {
                    incidents: "156 records",
                    personnel: "24 records", 
                    vehicles: "8 records",
                    stations: "3 records"
                  }
                  alert(`Exporting data: ${JSON.stringify(data, null, 2)}`)
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  // Show system logs in a modal or new page
                  const logs = [
                    "2025-01-09 15:30:00 - INFO: System backup completed successfully",
                    "2025-01-09 15:25:00 - INFO: User john.smith logged in",
                    "2025-01-09 15:20:00 - WARN: High memory usage detected",
                    "2025-01-09 15:15:00 - INFO: New incident created: 20250509-003",
                    "2025-01-09 15:10:00 - ERROR: Database connection timeout"
                  ]
                  alert(`Recent System Logs:\n\n${logs.join('\n')}`)
                }}
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
                  alert(`API Keys Status:\n\n${apiKeys.map(key => `${key.name}: ${key.status} (${key.lastUsed})`).join('\n')}`)
                }}
              >
                <Key className="h-4 w-4 mr-2" />
                API Keys
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => {
                  const auditLogs = [
                    "2025-01-09 15:30:00 - User john.smith accessed admin panel",
                    "2025-01-09 15:25:00 - User sarah.johnson created new incident",
                    "2025-01-09 15:20:00 - System settings updated by mike.davis",
                    "2025-01-09 15:15:00 - Failed login attempt from IP 192.168.1.100",
                    "2025-01-09 15:10:00 - User lisa.wilson password changed"
                  ]
                  alert(`Recent Audit Logs:\n\n${auditLogs.join('\n')}`)
                }}
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
                  alert(`Security Settings:\n\n${Object.entries(securitySettings).map(([key, value]) => `${key}: ${value}`).join('\n')}`)
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
