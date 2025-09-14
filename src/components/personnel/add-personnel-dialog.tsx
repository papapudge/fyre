"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface AddPersonnelDialogProps {
  onPersonnelAdded: (personnel: any) => void
}

export function AddPersonnelDialog({ onPersonnelAdded }: AddPersonnelDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    badgeNumber: "",
    rank: "",
    station: "",
    phone: "",
    email: "",
    emergencyContact: "",
    medicalInfo: "",
    notes: "",
    certifications: [] as string[],
    qualifications: [] as string[]
  })

  const [newCertification, setNewCertification] = useState("")
  const [newQualification, setNewQualification] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create new personnel object with API-compatible fields
    const newPersonnel = {
      userId: formData.email || `user-${Date.now()}`, // Use email as userId or generate one
      employeeId: formData.badgeNumber,
      rank: formData.rank,
      certifications: formData.certifications,
      qualifications: formData.qualifications,
      status: "ON_DUTY",
      trainingHours: 0,
      // Additional frontend fields for UI (not sent to API)
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      emergencyContact: formData.emergencyContact,
      medicalInfo: formData.medicalInfo,
      notes: formData.notes,
      station: formData.station
    }

    // Call the callback to add the personnel
    onPersonnelAdded(newPersonnel)
    
    // Reset form and close dialog
    setFormData({
      name: "",
      badgeNumber: "",
      rank: "",
      station: "",
      phone: "",
      email: "",
      emergencyContact: "",
      medicalInfo: "",
      notes: "",
      certifications: [],
      qualifications: []
    })
    setOpen(false)
  }

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }))
      setNewCertification("")
    }
  }

  const removeCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }))
  }

  const addQualification = () => {
    if (newQualification.trim() && !formData.qualifications.includes(newQualification.trim())) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }))
      setNewQualification("")
    }
  }

  const removeQualification = (qual: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(q => q !== qual)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Personnel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
          <DialogDescription>
            Add a new fire department personnel member
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Smith"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="badgeNumber">Badge Number *</Label>
              <Input
                id="badgeNumber"
                value={formData.badgeNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, badgeNumber: e.target.value }))}
                placeholder="FD-001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rank">Rank *</Label>
              <Select value={formData.rank} onValueChange={(value) => setFormData(prev => ({ ...prev, rank: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Firefighter">Firefighter</SelectItem>
                  <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                  <SelectItem value="Captain">Captain</SelectItem>
                  <SelectItem value="Chief">Chief</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="station">Station *</Label>
              <Select value={formData.station} onValueChange={(value) => setFormData(prev => ({ ...prev, station: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Station 1">Station 1</SelectItem>
                  <SelectItem value="Station 2">Station 2</SelectItem>
                  <SelectItem value="Station 3">Station 3</SelectItem>
                  <SelectItem value="Headquarters">Headquarters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.smith@firedepartment.gov"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              placeholder="Jane Smith - (555) 123-4568"
            />
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <Label>Certifications</Label>
            <div className="flex space-x-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Add certification"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              />
              <Button type="button" onClick={addCertification}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="bg-blue-100 px-2 py-1 rounded text-sm flex items-center">
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(cert)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <Label>Qualifications</Label>
            <div className="flex space-x-2">
              <Input
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="Add qualification"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
              />
              <Button type="button" onClick={addQualification}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.qualifications.map((qual, index) => (
                <div key={index} className="bg-green-100 px-2 py-1 rounded text-sm flex items-center">
                  {qual}
                  <button
                    type="button"
                    onClick={() => removeQualification(qual)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-2">
            <Label htmlFor="medicalInfo">Medical Information</Label>
            <Textarea
              id="medicalInfo"
              value={formData.medicalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalInfo: e.target.value }))}
              placeholder="Allergies, medical conditions, etc."
              rows={2}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this personnel"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Personnel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}