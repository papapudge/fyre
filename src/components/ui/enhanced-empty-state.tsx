"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TutorialDrawer } from "@/components/ui/tutorial-drawer"
import { 
  BookOpen, 
  Plus, 
  ArrowRight,
  Users,
  Truck,
  MapPin,
  AlertTriangle,
  Building,
  Droplets,
  Bell,
  Activity,
  FileText,
  HelpCircle
} from "lucide-react"

interface EmptyStateConfig {
  icon: React.ReactNode
  title: string
  description: string
  actionText: string
  actionIcon: React.ReactNode
  tutorialSection: string
  suggestions: string[]
}

const emptyStateConfigs: Record<string, EmptyStateConfig> = {
  incidents: {
    icon: <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />,
    title: "No Active Incidents",
    description: "Great! No active emergencies at the moment. When incidents occur, they'll appear here for real-time monitoring and response coordination.",
    actionText: "Create New Incident",
    actionIcon: <Plus className="h-4 w-4 mr-2" />,
    tutorialSection: "incidents",
    suggestions: [
      "Click 'New Incident' to report an emergency",
      "Assign appropriate response units",
      "Track incident progress in real-time"
    ]
  },
  personnel: {
    icon: <Users className="h-16 w-16 text-blue-400 mx-auto mb-4" />,
    title: "No Personnel Data Available",
    description: "Personnel information helps you manage your fire department staff, track schedules, and coordinate emergency responses effectively.",
    actionText: "Add Personnel",
    actionIcon: <Plus className="h-4 w-4 mr-2" />,
    tutorialSection: "personnel",
    suggestions: [
      "Add firefighter profiles and certifications",
      "Set up work schedules and duty assignments",
      "Track training progress and qualifications"
    ]
  },
  vehicles: {
    icon: <Truck className="h-16 w-16 text-green-400 mx-auto mb-4" />,
    title: "No Vehicle Data Available",
    description: "Vehicle tracking enables real-time monitoring of your emergency fleet, ensuring optimal response times and resource allocation.",
    actionText: "Add Vehicle",
    actionIcon: <Plus className="h-4 w-4 mr-2" />,
    tutorialSection: "vehicles",
    suggestions: [
      "Register fire trucks and emergency vehicles",
      "Track real-time locations and status",
      "Schedule maintenance and inspections"
    ]
  },
  stations: {
    icon: <Building className="h-16 w-16 text-purple-400 mx-auto mb-4" />,
    title: "No Stations Found",
    description: "Fire stations are the backbone of emergency response. Add your stations to manage resources, coverage areas, and response capabilities.",
    actionText: "Add Station",
    actionIcon: <Plus className="h-4 w-4 mr-2" />,
    tutorialSection: "stations",
    suggestions: [
      "Register fire stations and facilities",
      "Assign personnel and vehicles",
      "Define coverage areas and response zones"
    ]
  },
  hydrants: {
    icon: <Droplets className="h-16 w-16 text-blue-400 mx-auto mb-4" />,
    title: "No Hydrants Found",
    description: "Fire hydrants are critical water sources for emergency response. Track their locations, status, and water pressure for effective firefighting.",
    actionText: "Add Hydrant",
    actionIcon: <Plus className="h-4 w-4 mr-2" />,
    tutorialSection: "hydrants",
    suggestions: [
      "Map all fire hydrants in your area",
      "Schedule regular inspections",
      "Monitor water pressure and availability"
    ]
  },
  notifications: {
    icon: <Bell className="h-16 w-16 text-orange-400 mx-auto mb-4" />,
    title: "No Notifications Found",
    description: "Stay informed with real-time alerts and notifications. Configure your notification preferences to receive important updates.",
    actionText: "Setup Notifications",
    actionIcon: <Bell className="h-4 w-4 mr-2" />,
    tutorialSection: "notifications",
    suggestions: [
      "Configure emergency alerts",
      "Set up notification preferences",
      "Manage communication channels"
    ]
  },
  activity: {
    icon: <Activity className="h-16 w-16 text-green-400 mx-auto mb-4" />,
    title: "No Recent Activity Found",
    description: "Activity logs help you track system usage, user actions, and important events. Activity will appear here as users interact with the system.",
    actionText: "View All Activity",
    actionIcon: <Activity className="h-4 w-4 mr-2" />,
    tutorialSection: "reports",
    suggestions: [
      "Monitor user actions and system events",
      "Review audit logs for security",
      "Track performance metrics"
    ]
  },
  reports: {
    icon: <FileText className="h-16 w-16 text-indigo-400 mx-auto mb-4" />,
    title: "No Report Data Available",
    description: "Generate comprehensive reports to analyze department performance, incident trends, and operational efficiency.",
    actionText: "Generate Report",
    actionIcon: <FileText className="h-4 w-4 mr-2" />,
    tutorialSection: "reports",
    suggestions: [
      "Create custom performance reports",
      "Analyze incident trends and patterns",
      "Export data for external analysis"
    ]
  }
}

interface EnhancedEmptyStateProps {
  type: string
  onAction?: () => void
  className?: string
}

export function EnhancedEmptyState({ type, onAction, className = "" }: EnhancedEmptyStateProps) {
  const [showTutorial, setShowTutorial] = useState(false)
  const config = emptyStateConfigs[type] || emptyStateConfigs.incidents

  return (
    <>
      <Card className={`text-center p-8 ${className}`}>
        <CardContent className="space-y-6">
          {config.icon}
          
          <div className="space-y-3">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {config.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-md mx-auto">
              {config.description}
            </CardDescription>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onAction && (
                <Button 
                  onClick={onAction}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {config.actionIcon}
                  {config.actionText}
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => setShowTutorial(true)}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Tutorial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">Quick Start Guide</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    {config.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TutorialDrawer 
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        section={config.tutorialSection}
      />
    </>
  )
}
