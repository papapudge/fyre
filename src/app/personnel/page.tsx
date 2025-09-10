"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  Phone,
  Mail,
  Shield,
  Award,
  Calendar,
  User,
  Truck,
  Building2
} from "lucide-react"
import { useState, useEffect } from "react"
import { AddPersonnelDialog } from "@/components/personnel/add-personnel-dialog"

// Mock data
const mockPersonnel = [
  {
    id: "1",
    name: "John Smith",
    badgeNumber: "FD-001",
    rank: "Captain",
    station: "Station 1",
    status: "On Scene",
    location: "123 Main St",
    phone: "(555) 123-4567",
    email: "john.smith@firedepartment.gov",
    certifications: ["Firefighter I", "Firefighter II", "Hazmat Technician", "EMT"],
    qualifications: ["Driver/Operator", "Rescue Specialist", "Hazmat Team"],
    hireDate: "2015-03-15",
    currentAssignment: "Engine 1 - Captain",
    emergencyContact: "Jane Smith - (555) 123-4568",
    medicalInfo: "No known allergies",
    notes: "Experienced in high-rise firefighting"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    badgeNumber: "FD-002",
    rank: "Lieutenant",
    station: "Station 1",
    status: "En Route",
    location: "456 Oak Ave",
    phone: "(555) 234-5678",
    email: "sarah.johnson@firedepartment.gov",
    certifications: ["Firefighter I", "Firefighter II", "Paramedic", "Instructor"],
    qualifications: ["Paramedic", "Training Officer", "Rescue Specialist"],
    hireDate: "2018-07-20",
    currentAssignment: "Ambulance 3 - Paramedic",
    emergencyContact: "Mike Johnson - (555) 234-5679",
    medicalInfo: "Penicillin allergy",
    notes: "Lead paramedic for medical calls"
  },
  {
    id: "3",
    name: "Mike Davis",
    badgeNumber: "FD-003",
    rank: "Firefighter",
    station: "Station 2",
    status: "On Duty",
    location: "Station 2",
    phone: "(555) 345-6789",
    email: "mike.davis@firedepartment.gov",
    certifications: ["Firefighter I", "Firefighter II", "EMT"],
    qualifications: ["Driver/Operator", "Pump Operator"],
    hireDate: "2020-01-10",
    currentAssignment: "Engine 2 - Firefighter",
    emergencyContact: "Lisa Davis - (555) 345-6790",
    medicalInfo: "No known allergies",
    notes: "Specializes in pump operations"
  },
  {
    id: "4",
    name: "Lisa Wilson",
    badgeNumber: "FD-004",
    rank: "Firefighter",
    station: "Station 2",
    status: "On Duty",
    location: "Station 2",
    phone: "(555) 456-7890",
    email: "lisa.wilson@firedepartment.gov",
    certifications: ["Firefighter I", "Firefighter II", "Paramedic"],
    qualifications: ["Paramedic", "Rescue Specialist"],
    hireDate: "2019-05-15",
    currentAssignment: "Ambulance 1 - Paramedic",
    emergencyContact: "Tom Wilson - (555) 456-7891",
    medicalInfo: "No known allergies",
    notes: "Expert in technical rescue"
  },
  {
    id: "5",
    name: "Tom Brown",
    badgeNumber: "FD-005",
    rank: "Lieutenant",
    station: "Station 3",
    status: "Dispatched",
    location: "789 Pine Rd",
    phone: "(555) 567-8901",
    email: "tom.brown@firedepartment.gov",
    certifications: ["Firefighter I", "Firefighter II", "Hazmat Technician", "EMT"],
    qualifications: ["Hazmat Team Leader", "Rescue Specialist", "Driver/Operator"],
    hireDate: "2016-09-12",
    currentAssignment: "Rescue 1 - Lieutenant",
    emergencyContact: "Amy Brown - (555) 567-8902",
    medicalInfo: "No known allergies",
    notes: "Hazmat team leader"
  }
]

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState([])
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load personnel from localStorage or use mock data
    if (typeof window !== 'undefined') {
      const savedPersonnel = localStorage.getItem('personnel')
      if (savedPersonnel) {
        try {
          const parsedPersonnel = JSON.parse(savedPersonnel)
          setPersonnel(parsedPersonnel)
        } catch (error) {
          console.error('Error parsing personnel from localStorage:', error)
          // Fallback to mock data if localStorage is corrupted
          setPersonnel(mockPersonnel)
          localStorage.setItem('personnel', JSON.stringify(mockPersonnel))
        }
      } else {
        // First time load - use mock data
        setPersonnel(mockPersonnel)
        localStorage.setItem('personnel', JSON.stringify(mockPersonnel))
      }
      setLoading(false)
    }
  }, [])

  const handlePersonnelAdded = (newPersonnel: any) => {
    const updatedPersonnel = [...personnel, newPersonnel]
    setPersonnel(updatedPersonnel)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('personnel', JSON.stringify(updatedPersonnel))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on scene": return "success"
      case "en route": return "warning"
      case "on duty": return "success"
      case "dispatched": return "info"
      case "off duty": return "secondary"
      default: return "secondary"
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case "captain": return "destructive"
      case "lieutenant": return "warning"
      case "firefighter": return "success"
      default: return "secondary"
    }
  }

  const filteredPersonnel = personnel.filter(person => {
    const matchesFilter = filter === "all" || person.status.toLowerCase().replace(" ", "_") === filter
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.rank.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent">Personnel</h1>
            <p className="text-gray-600">Fire department personnel management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <AddPersonnelDialog onPersonnelAdded={handlePersonnelAdded} />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search personnel..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            {["all", "on_duty", "en_route", "on_scene", "off_duty"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personnel List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredPersonnel.length > 0 ? (
              filteredPersonnel.map((person: any) => (
              <Card 
                key={person.id} 
                className={
                  selectedPerson === person.id ? "ring-2 ring-red-500" : ""
                }
                onClick={() => setSelectedPerson(person.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{person.name}</CardTitle>
                        <CardDescription>{person.badgeNumber} • {person.rank}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRankColor(person.rank)}>
                        {person.rank}
                      </Badge>
                      <Badge variant={getStatusColor(person.status)}>
                        {person.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span>{person.station}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{person.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span>{person.currentAssignment}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span>{person.certifications.length} certifications</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {person.certifications.slice(0, 3).map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {person.certifications.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{person.certifications.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No personnel found</p>
              </div>
            )}
          </div>

          {/* Personnel Details */}
          <div className="space-y-4">
            {selectedPerson ? (
              (() => {
                const person = personnel.find((p: any) => p.id === selectedPerson)
                if (!person) return null
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Personnel Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Left Column - Basic Info */}
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Name:</span> {person.name}</p>
                            <p><span className="font-medium">Badge:</span> {person.badgeNumber}</p>
                            <p><span className="font-medium">Rank:</span> 
                              <Badge variant={getRankColor(person.rank)} className="ml-2">
                                {person.rank}
                              </Badge>
                            </p>
                            <p><span className="font-medium">Status:</span>
                              <Badge variant={getStatusColor(person.status)} className="ml-2">
                                {person.status}
                              </Badge>
                            </p>
                            <p><span className="font-medium">Station:</span> {person.station}</p>
                            <p><span className="font-medium">Hire Date:</span> {new Date(person.hireDate).toLocaleDateString()}</p>
                          </div>
                          
                          {/* Right Column - Profile Picture */}
                          <div className="flex justify-center items-start">
                            <Avatar className="h-24 w-24">
                              <AvatarImage 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name.replace(' ', '+')}`} 
                                alt={person.name}
                              />
                              <AvatarFallback className="text-lg">
                                {person.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Contact Information</h4>
                        <div className="text-sm space-y-1">
                          <p className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{person.phone}</span>
                          </p>
                          <p className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{person.email}</span>
                          </p>
                        </div>
                      </div>

                      {/* Current Assignment */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Current Assignment</h4>
                        <div className="text-sm">
                          <p className="flex items-center space-x-2">
                            <Truck className="h-4 w-4" />
                            <span>{person.currentAssignment}</span>
                          </p>
                          <p className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{person.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Certifications</h4>
                        <div className="space-y-1">
                          {person.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Qualifications */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Qualifications</h4>
                        <div className="space-y-1">
                          {person.qualifications.map((qual, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Emergency Contact</h4>
                        <p className="text-sm">{person.emergencyContact}</p>
                      </div>

                      {/* Medical Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Medical Information</h4>
                        <p className="text-sm">{person.medicalInfo}</p>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Notes</h4>
                        <p className="text-sm text-gray-600">{person.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button size="sm" variant="outline">
                            <Shield className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a person to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  )
}
