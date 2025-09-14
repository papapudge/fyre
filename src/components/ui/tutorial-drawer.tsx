"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  BookOpen, 
  Play, 
  CheckCircle, 
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
  Settings
} from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action?: string
  completed?: boolean
}

interface TutorialSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  steps: TutorialStep[]
}

interface TutorialDrawerProps {
  isOpen: boolean
  onClose: () => void
  section?: string
}

const tutorialSections: Record<string, TutorialSection> = {
  incidents: {
    id: "incidents",
    title: "Incident Management",
    description: "Learn how to create, manage, and track emergency incidents",
    icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
    steps: [
      {
        id: "create-incident",
        title: "Create New Incident",
        description: "Click the 'New Incident' button to report an emergency",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        action: "Go to New Incident",
        completed: false
      },
      {
        id: "assign-units",
        title: "Assign Response Units",
        description: "Select appropriate vehicles and personnel for the incident",
        icon: <Truck className="h-5 w-5 text-blue-500" />,
        action: "View Available Units",
        completed: false
      },
      {
        id: "track-progress",
        title: "Track Incident Progress",
        description: "Monitor real-time updates and status changes",
        icon: <Activity className="h-5 w-5 text-green-500" />,
        action: "View Live Tracking",
        completed: false
      }
    ]
  },
  personnel: {
    id: "personnel",
    title: "Personnel Management",
    description: "Manage fire department staff, schedules, and assignments",
    icon: <Users className="h-6 w-6 text-blue-600" />,
    steps: [
      {
        id: "add-personnel",
        title: "Add New Personnel",
        description: "Register new firefighters and staff members",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        action: "Add Personnel",
        completed: false
      },
      {
        id: "manage-schedules",
        title: "Manage Schedules",
        description: "Set up work schedules and duty assignments",
        icon: <Settings className="h-5 w-5 text-gray-500" />,
        action: "View Schedules",
        completed: false
      },
      {
        id: "track-training",
        title: "Track Training",
        description: "Monitor certifications and training progress",
        icon: <BookOpen className="h-5 w-5 text-purple-500" />,
        action: "View Training",
        completed: false
      }
    ]
  },
  vehicles: {
    id: "vehicles",
    title: "Vehicle Management",
    description: "Manage fire trucks, ambulances, and emergency vehicles",
    icon: <Truck className="h-6 w-6 text-green-600" />,
    steps: [
      {
        id: "add-vehicle",
        title: "Add New Vehicle",
        description: "Register new emergency vehicles to the fleet",
        icon: <Truck className="h-5 w-5 text-green-500" />,
        action: "Add Vehicle",
        completed: false
      },
      {
        id: "track-location",
        title: "Track Vehicle Location",
        description: "Monitor real-time vehicle positions and status",
        icon: <MapPin className="h-5 w-5 text-red-500" />,
        action: "View Map",
        completed: false
      },
      {
        id: "maintenance",
        title: "Schedule Maintenance",
        description: "Set up regular maintenance and inspections",
        icon: <Settings className="h-5 w-5 text-orange-500" />,
        action: "View Maintenance",
        completed: false
      }
    ]
  },
  stations: {
    id: "stations",
    title: "Station Management",
    description: "Manage fire stations and their resources",
    icon: <Building className="h-6 w-6 text-purple-600" />,
    steps: [
      {
        id: "add-station",
        title: "Add New Station",
        description: "Register new fire stations and facilities",
        icon: <Building className="h-5 w-5 text-purple-500" />,
        action: "Add Station",
        completed: false
      },
      {
        id: "manage-resources",
        title: "Manage Resources",
        description: "Assign personnel and vehicles to stations",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        action: "Manage Resources",
        completed: false
      },
      {
        id: "view-coverage",
        title: "View Coverage Area",
        description: "Monitor station coverage and response zones",
        icon: <MapPin className="h-5 w-5 text-green-500" />,
        action: "View Coverage",
        completed: false
      }
    ]
  },
  hydrants: {
    id: "hydrants",
    title: "Hydrant Management",
    description: "Manage fire hydrants and water sources",
    icon: <Droplets className="h-6 w-6 text-blue-600" />,
    steps: [
      {
        id: "add-hydrant",
        title: "Add New Hydrant",
        description: "Register new fire hydrants and water sources",
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
        action: "Add Hydrant",
        completed: false
      },
      {
        id: "schedule-inspection",
        title: "Schedule Inspections",
        description: "Set up regular hydrant inspections and maintenance",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        action: "Schedule Inspection",
        completed: false
      },
      {
        id: "track-status",
        title: "Track Status",
        description: "Monitor hydrant availability and water pressure",
        icon: <Activity className="h-5 w-5 text-orange-500" />,
        action: "View Status",
        completed: false
      }
    ]
  },
  notifications: {
    id: "notifications",
    title: "Notification System",
    description: "Manage alerts, notifications, and communication",
    icon: <Bell className="h-6 w-6 text-orange-600" />,
    steps: [
      {
        id: "setup-alerts",
        title: "Setup Alerts",
        description: "Configure emergency alerts and notifications",
        icon: <Bell className="h-5 w-5 text-orange-500" />,
        action: "Setup Alerts",
        completed: false
      },
      {
        id: "manage-subscriptions",
        title: "Manage Subscriptions",
        description: "Control who receives which notifications",
        icon: <Users className="h-5 w-5 text-blue-500" />,
        action: "Manage Subscriptions",
        completed: false
      },
      {
        id: "view-history",
        title: "View History",
        description: "Review past notifications and communications",
        icon: <FileText className="h-5 w-5 text-gray-500" />,
        action: "View History",
        completed: false
      }
    ]
  },
  reports: {
    id: "reports",
    title: "Reports & Analytics",
    description: "Generate reports and analyze department performance",
    icon: <FileText className="h-6 w-6 text-indigo-600" />,
    steps: [
      {
        id: "generate-report",
        title: "Generate Report",
        description: "Create custom reports for incidents and performance",
        icon: <FileText className="h-5 w-5 text-indigo-500" />,
        action: "Generate Report",
        completed: false
      },
      {
        id: "view-analytics",
        title: "View Analytics",
        description: "Analyze trends and performance metrics",
        icon: <Activity className="h-5 w-5 text-green-500" />,
        action: "View Analytics",
        completed: false
      },
      {
        id: "export-data",
        title: "Export Data",
        description: "Export reports and data for external use",
        icon: <ArrowRight className="h-5 w-5 text-blue-500" />,
        action: "Export Data",
        completed: false
      }
    ]
  }
}

export function TutorialDrawer({ isOpen, onClose, section = "incidents" }: TutorialDrawerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const tutorial = tutorialSections[section] || tutorialSections.incidents

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
  }

  const handleNextStep = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white/80 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {tutorial.icon}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tutorial.title}</h2>
                  <p className="text-sm text-gray-600">{tutorial.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedSteps.size} of {tutorial.steps.length} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.size / tutorial.steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {tutorial.steps.map((step, index) => (
                <Card 
                  key={step.id} 
                  className={`transition-all duration-200 ${
                    index === currentStep 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : completedSteps.has(step.id)
                      ? 'bg-green-50 border-green-200'
                      : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          completedSteps.has(step.id) 
                            ? 'bg-green-100 text-green-600' 
                            : index === currentStep
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {completedSteps.has(step.id) ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                      {completedSteps.has(step.id) && (
                        <Badge variant="success" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  {step.action && !completedSteps.has(step.id) && (
                    <CardContent className="pt-0">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStepComplete(step.id)}
                        className="w-full"
                      >
                        {step.action}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200/50 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextStep}
                  disabled={currentStep === tutorial.steps.length - 1}
                >
                  Next
                </Button>
              </div>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Tutorial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
