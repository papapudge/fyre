"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { incidentApi } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User, 
  Clock,
  Building,
  Car,
  Droplets,
  FileText,
  Camera,
  Navigation,
  Users,
  Truck,
  Shield,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Zap
} from "lucide-react"

interface FormData {
  // Incident Details
  type: string
  severity: string
  title: string
  description: string
  
  // Location Details
  location: string
  city: string
  state: string
  pincode: string
  district: string
  zone: string
  
  // Caller Information
  callerName: string
  callerPhone: string
  
  // Impact Assessment
  injuries: string
  fatalities: string
  estimatedLoss: string
  
  // Dispatch Information
  selectedUnits: string[]
  selectedPersonnel: string[]
  specialInstructions: string
}

const incidentTypes = [
  { value: "Fire", label: "Fire", icon: "🔥", color: "text-red-600" },
  { value: "Medical Emergency", label: "Medical Emergency", icon: "🚑", color: "text-blue-600" },
  { value: "Rescue", label: "Rescue", icon: "🚨", color: "text-orange-600" },
  { value: "Hazmat", label: "Hazmat", icon: "☢️", color: "text-yellow-600" },
  { value: "Building Collapse", label: "Building Collapse", icon: "🏢", color: "text-gray-600" },
  { value: "Road Accident", label: "Road Accident", icon: "🚗", color: "text-purple-600" },
  { value: "Industrial Accident", label: "Industrial Accident", icon: "🏭", color: "text-indigo-600" },
  { value: "Natural Disaster", label: "Natural Disaster", icon: "🌪️", color: "text-green-600" },
  { value: "Bomb Threat", label: "Bomb Threat", icon: "💣", color: "text-red-800" },
  { value: "Other", label: "Other", icon: "📞", color: "text-gray-500" }
]

const severityLevels = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "Critical", label: "Critical", color: "bg-red-100 text-red-800 border-red-200" }
]

const availableUnits = [
  { id: "engine1", name: "Engine 1", type: "Engine", status: "Available", location: "Station 1" },
  { id: "engine2", name: "Engine 2", type: "Engine", status: "Available", location: "Station 2" },
  { id: "engine3", name: "Engine 3", type: "Engine", status: "Available", location: "Station 3" },
  { id: "ladder1", name: "Ladder 1", type: "Ladder", status: "Available", location: "Station 1" },
  { id: "ladder2", name: "Ladder 2", type: "Ladder", status: "Available", location: "Station 2" },
  { id: "ladder3", name: "Ladder 3", type: "Ladder", status: "Available", location: "Station 3" },
  { id: "ambulance1", name: "Ambulance 1", type: "Ambulance", status: "Available", location: "Station 1" },
  { id: "ambulance2", name: "Ambulance 2", type: "Ambulance", status: "Available", location: "Station 2" },
  { id: "ambulance3", name: "Ambulance 3", type: "Ambulance", status: "Available", location: "Station 3" },
  { id: "rescue1", name: "Rescue 1", type: "Rescue", status: "Available", location: "Station 1" },
  { id: "rescue2", name: "Rescue 2", type: "Rescue", status: "Available", location: "Station 2" },
  { id: "command1", name: "Command 1", type: "Command", status: "Available", location: "Headquarters" },
  { id: "command2", name: "Command 2", type: "Command", status: "Available", location: "Headquarters" }
]

const availablePersonnel = [
  { id: "rajesh", name: "Rajesh Kumar", rank: "Captain", station: "Station 1", status: "Available", certifications: ["Firefighter I", "Firefighter II", "Hazmat Technician"] },
  { id: "priya", name: "Priya Sharma", rank: "Lieutenant", station: "Station 1", status: "Available", certifications: ["Firefighter I", "Paramedic", "Instructor"] },
  { id: "amit", name: "Amit Singh", rank: "Firefighter", station: "Station 2", status: "Available", certifications: ["Firefighter I", "EMT"] },
  { id: "sunita", name: "Sunita Patel", rank: "Firefighter", station: "Station 2", status: "Available", certifications: ["Firefighter I", "Paramedic"] },
  { id: "vikram", name: "Vikram Reddy", rank: "Lieutenant", station: "Station 3", status: "Available", certifications: ["Firefighter I", "Firefighter II", "Rescue Specialist"] },
  { id: "anjali", name: "Anjali Gupta", rank: "Firefighter", station: "Station 3", status: "Available", certifications: ["Firefighter I", "EMT"] }
]

export default function NewIncidentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    type: "",
    severity: "",
    title: "",
    description: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    district: "",
    zone: "",
    callerName: "",
    callerPhone: "",
    injuries: "",
    fatalities: "",
    estimatedLoss: "",
    selectedUnits: [],
    selectedPersonnel: [],
    specialInstructions: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps = [
    { id: 1, title: "Incident Details", icon: AlertTriangle, description: "Basic incident information" },
    { id: 2, title: "Location", icon: MapPin, description: "Incident location details" },
    { id: 3, title: "Caller Info", icon: User, description: "Reporter information" },
    { id: 4, title: "Dispatch", icon: Truck, description: "Resource allocation" },
    { id: 5, title: "Review", icon: CheckCircle, description: "Final review and submit" }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.type) newErrors.type = "Incident type is required"
        if (!formData.severity) newErrors.severity = "Severity level is required"
        if (!formData.description) newErrors.description = "Description is required"
        break
      case 2:
        if (!formData.location) newErrors.location = "Location is required"
        if (!formData.city) newErrors.city = "City is required"
        break
      case 3:
        if (!formData.callerName) newErrors.callerName = "Caller name is required"
        if (!formData.callerPhone) newErrors.callerPhone = "Caller phone is required"
        break
      case 4:
        if (formData.selectedUnits.length === 0) newErrors.units = "At least one unit must be selected"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleUnitToggle = (unitId: string) => {
    const unit = availableUnits.find(u => u.id === unitId)
    if (!unit) return

    setFormData(prev => ({
      ...prev,
      selectedUnits: prev.selectedUnits.includes(unitId)
        ? prev.selectedUnits.filter(id => id !== unitId)
        : [...prev.selectedUnits, unitId]
    }))
  }

  const handlePersonnelToggle = (personId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPersonnel: prev.selectedPersonnel.includes(personId)
        ? prev.selectedPersonnel.filter(id => id !== personId)
        : [...prev.selectedPersonnel, personId]
    }))
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const generateIncidentNumber = () => {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '')
    return `INC-${dateStr}-${timeStr}`
  }

  // Map form type values to enum values
  const mapFormTypeToEnum = (formType: string): "FIRE" | "MEDICAL" | "RESCUE" | "HAZMAT" | "OTHER" | "FALSE_ALARM" | "SERVICE_CALL" | "TRAINING" => {
    const typeMap: Record<string, "FIRE" | "MEDICAL" | "RESCUE" | "HAZMAT" | "OTHER" | "FALSE_ALARM" | "SERVICE_CALL" | "TRAINING"> = {
      "Fire": "FIRE",
      "Medical Emergency": "MEDICAL",
      "Rescue": "RESCUE",
      "Hazmat": "HAZMAT",
      "Building Collapse": "RESCUE",
      "Road Accident": "RESCUE",
      "Industrial Accident": "HAZMAT",
      "Natural Disaster": "RESCUE",
      "Bomb Threat": "OTHER",
      "Other": "OTHER"
    }
    return typeMap[formType] || "OTHER"
  }

  // Map form severity values to enum values
  const mapFormSeverityToEnum = (formSeverity: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" => {
    const severityMap: Record<string, "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"> = {
      "Low": "LOW",
      "Medium": "MEDIUM",
      "High": "HIGH",
      "Critical": "CRITICAL"
    }
    return severityMap[formSeverity] || "MEDIUM"
  }

  // Map form status values to enum values
  const mapFormStatusToEnum = (formStatus: string): "DISPATCHED" | "EN_ROUTE" | "ON_SCENE" | "ACTIVE" | "CONTAINED" | "CLOSED" | "CANCELLED" => {
    const statusMap: Record<string, "DISPATCHED" | "EN_ROUTE" | "ON_SCENE" | "ACTIVE" | "CONTAINED" | "CLOSED" | "CANCELLED"> = {
      "Dispatched": "DISPATCHED",
      "En Route": "EN_ROUTE",
      "On Scene": "ON_SCENE",
      "Active": "ACTIVE",
      "Contained": "CONTAINED",
      "Closed": "CLOSED",
      "Cancelled": "CANCELLED"
    }
    return statusMap[formStatus] || "DISPATCHED"
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      const newIncident = {
        id: generateIncidentNumber(),
        incidentNumber: generateIncidentNumber(),
        type: mapFormTypeToEnum(formData.type),
        severity: mapFormSeverityToEnum(formData.severity),
        status: mapFormStatusToEnum("Dispatched"),
        title: formData.title || `${formData.type} - ${formData.location}`,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        district: formData.district,
        zone: formData.zone,
        lat: 0, // Would be geocoded in real app
        lng: 0, // Would be geocoded in real app
        reportedAt: new Date().toISOString(),
        dispatchedAt: new Date().toISOString(),
        arrivedAt: undefined,
        units: formData.selectedUnits.map(id => availableUnits.find(u => u.id === id)?.name || id),
        personnel: formData.selectedPersonnel.map(id => availablePersonnel.find(p => p.id === id)?.name || id),
        caller: formData.callerName,
        callerPhone: formData.callerPhone,
        description: formData.description,
        injuries: parseInt(formData.injuries) || 0,
        fatalities: parseInt(formData.fatalities) || 0,
        estimatedLoss: parseInt(formData.estimatedLoss) || 0,
        timestamp: new Date(),
        specialInstructions: formData.specialInstructions
      }

      // Create incident via API
      const createdIncident = await incidentApi.create(newIncident)
      console.log("New incident created:", createdIncident)
      
      // Redirect to incidents page
      router.push('/incidents')
    } catch (error) {
      console.error("Error creating incident:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedTypeInfo = () => {
    return incidentTypes.find(type => type.value === formData.type)
  }

  const getSelectedSeverityInfo = () => {
    return severityLevels.find(severity => severity.value === formData.severity)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Incident</h1>
                <p className="text-gray-600">Report a new emergency incident and dispatch appropriate resources</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200
                      ${isActive ? 'bg-red-600 border-red-600 text-white' : 
                        isCompleted ? 'bg-green-600 border-green-600 text-white' : 
                        'bg-white border-gray-300 text-gray-400'}
                    `}>
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Step {currentStep}: {steps[currentStep - 1].title}</span>
                </CardTitle>
                <CardDescription className="text-red-100">
                  {steps[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Step 1: Incident Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="type" className="text-sm font-medium">Incident Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                          <SelectContent>
                            {incidentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center space-x-2">
                                  <span>{type.icon}</span>
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                      </div>

                      <div>
                        <Label htmlFor="severity" className="text-sm font-medium">Severity Level *</Label>
                        <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            {severityLevels.map((severity) => (
                              <SelectItem key={severity.value} value={severity.value}>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${severity.color.split(' ')[0]}`} />
                                  <span>{severity.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.severity && <p className="text-red-500 text-sm mt-1">{errors.severity}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Incident Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Brief description of the incident"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Detailed description of the incident..."
                        rows={4}
                        className="mt-1"
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Quick Impact Assessment */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="injuries" className="text-sm font-medium">Injuries</Label>
                        <Input
                          id="injuries"
                          type="number"
                          value={formData.injuries}
                          onChange={(e) => handleInputChange("injuries", e.target.value)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fatalities" className="text-sm font-medium">Fatalities</Label>
                        <Input
                          id="fatalities"
                          type="number"
                          value={formData.fatalities}
                          onChange={(e) => handleInputChange("fatalities", e.target.value)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedLoss" className="text-sm font-medium">Est. Loss (₹)</Label>
                        <Input
                          id="estimatedLoss"
                          type="number"
                          value={formData.estimatedLoss}
                          onChange={(e) => handleInputChange("estimatedLoss", e.target.value)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">Address/Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Street address, landmark, or specific location"
                        className="mt-1"
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          placeholder="City"
                          className="mt-1"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                          placeholder="State"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange("pincode", e.target.value)}
                          placeholder="Pincode"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="district" className="text-sm font-medium">District</Label>
                        <Input
                          id="district"
                          value={formData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          placeholder="District"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zone" className="text-sm font-medium">Fire Zone</Label>
                      <Input
                        id="zone"
                        value={formData.zone}
                        onChange={(e) => handleInputChange("zone", e.target.value)}
                        placeholder="Fire zone or area"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Caller Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="callerName" className="text-sm font-medium">Caller Name *</Label>
                      <Input
                        id="callerName"
                        value={formData.callerName}
                        onChange={(e) => handleInputChange("callerName", e.target.value)}
                        placeholder="Name of person reporting"
                        className="mt-1"
                      />
                      {errors.callerName && <p className="text-red-500 text-sm mt-1">{errors.callerName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="callerPhone" className="text-sm font-medium">Caller Phone *</Label>
                      <Input
                        id="callerPhone"
                        value={formData.callerPhone}
                        onChange={(e) => handleInputChange("callerPhone", e.target.value)}
                        placeholder="Phone number"
                        className="mt-1"
                      />
                      {errors.callerPhone && <p className="text-red-500 text-sm mt-1">{errors.callerPhone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="specialInstructions" className="text-sm font-medium">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                        placeholder="Any special instructions for responding units..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Dispatch Resources */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Available Units</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        {availableUnits.map((unit) => (
                          <div
                            key={unit.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              formData.selectedUnits.includes(unit.id)
                                ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                                : "hover:bg-gray-50 border-gray-200"
                            }`}
                            onClick={() => handleUnitToggle(unit.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{unit.name}</p>
                                <p className="text-xs text-gray-500">{unit.type} • {unit.location}</p>
                              </div>
                              <Badge variant={unit.status === "Available" ? "default" : "secondary"} className="text-xs">
                                {unit.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.units && <p className="text-red-500 text-sm mt-1">{errors.units}</p>}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Available Personnel</Label>
                      <div className="grid grid-cols-1 gap-3 mt-2 max-h-64 overflow-y-auto">
                        {availablePersonnel.map((person) => (
                          <div
                            key={person.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                              formData.selectedPersonnel.includes(person.id)
                                ? "bg-green-50 border-green-500 ring-2 ring-green-200"
                                : "hover:bg-gray-50 border-gray-200"
                            }`}
                            onClick={() => handlePersonnelToggle(person.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{person.name}</p>
                                <p className="text-xs text-gray-500">{person.rank} • {person.station}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {person.certifications.slice(0, 2).map((cert, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {cert}
                                    </Badge>
                                  ))}
                                  {person.certifications.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{person.certifications.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Badge variant={person.status === "Available" ? "default" : "secondary"} className="text-xs">
                                {person.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Review */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg mb-4">Incident Summary</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Incident Details</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Type:</span> {getSelectedTypeInfo()?.icon} {formData.type}</p>
                            <p><span className="font-medium">Severity:</span> 
                              <Badge className={`ml-2 ${getSelectedSeverityInfo()?.color}`}>
                                {formData.severity}
                              </Badge>
                            </p>
                            <p><span className="font-medium">Title:</span> {formData.title || "Not specified"}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Location</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Address:</span> {formData.location}</p>
                            <p><span className="font-medium">City:</span> {formData.city}</p>
                            <p><span className="font-medium">State:</span> {formData.state || "Not specified"}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Caller Information</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Name:</span> {formData.callerName}</p>
                            <p><span className="font-medium">Phone:</span> {formData.callerPhone}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Impact Assessment</h4>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-medium">Injuries:</span> {formData.injuries || "0"}</p>
                            <p><span className="font-medium">Fatalities:</span> {formData.fatalities || "0"}</p>
                            <p><span className="font-medium">Est. Loss:</span> ₹{formData.estimatedLoss || "0"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Dispatched Resources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Units ({formData.selectedUnits.length})</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.selectedUnits.map(unitId => {
                                const unit = availableUnits.find(u => u.id === unitId)
                                return (
                                  <Badge key={unitId} variant="outline" className="text-xs">
                                    {unit?.name || unitId}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Personnel ({formData.selectedPersonnel.length})</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.selectedPersonnel.map(personId => {
                                const person = availablePersonnel.find(p => p.id === personId)
                                return (
                                  <Badge key={personId} variant="secondary" className="text-xs">
                                    {person?.name || personId}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {formData.specialInstructions && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-2">Special Instructions</h4>
                          <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                            {formData.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center space-x-2">
                    {currentStep < steps.length ? (
                      <Button
                        onClick={nextStep}
                        className="flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            <span>Creating...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Create Incident</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Incident Type Preview */}
            {getSelectedTypeInfo() && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span className="text-2xl">{getSelectedTypeInfo()?.icon}</span>
                    <span>Incident Type</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{formData.type}</p>
                    <p className="text-sm text-gray-600">
                      {formData.type === "Fire" && "Structure or wildland fire requiring fire suppression"}
                      {formData.type === "Medical Emergency" && "Medical emergency requiring EMS response"}
                      {formData.type === "Rescue" && "Technical rescue operation required"}
                      {formData.type === "Hazmat" && "Hazardous materials incident"}
                      {formData.type === "Building Collapse" && "Structural collapse requiring rescue"}
                      {formData.type === "Road Accident" && "Vehicle accident with injuries"}
                      {formData.type === "Industrial Accident" && "Industrial facility incident"}
                      {formData.type === "Natural Disaster" && "Natural disaster response"}
                      {formData.type === "Bomb Threat" && "Potential explosive device threat"}
                      {formData.type === "Other" && "Other emergency requiring response"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Severity Level */}
            {getSelectedSeverityInfo() && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Severity Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className={`${getSelectedSeverityInfo()?.color} text-sm px-3 py-1`}>
                      {formData.severity}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      {formData.severity === "Low" && "Minor incident with minimal risk"}
                      {formData.severity === "Medium" && "Moderate incident requiring standard response"}
                      {formData.severity === "High" && "Serious incident requiring enhanced response"}
                      {formData.severity === "Critical" && "Life-threatening incident requiring maximum response"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Navigation className="h-4 w-4 mr-2" />
                  Open Map
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Notes
                </Button>
              </CardContent>
            </Card>

            {/* Dispatch Summary */}
            {(formData.selectedUnits.length > 0 || formData.selectedPersonnel.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dispatch Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Units</span>
                      <Badge variant="outline">{formData.selectedUnits.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Personnel</span>
                      <Badge variant="outline">{formData.selectedPersonnel.length}</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Resources</span>
                      <Badge variant="default">
                        {formData.selectedUnits.length + formData.selectedPersonnel.length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fire Department</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    101
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Police</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    100
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ambulance</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    108
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
