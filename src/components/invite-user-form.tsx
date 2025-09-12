"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UserPlus, Mail, MessageSquare, Shield, Users, Stethoscope, Briefcase, MessageSquare as Reporter, Heart, UserCheck } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "Admin" | "Local Leader" | "Doctor" | "Staff" | "Community Reporter" | "Volunteer" | "Guest"
  status: "Active" | "Suspended"
  region?: string
  createdAt: string
  lastLogin?: string
}

interface InviteUserFormProps {
  isOpen: boolean
  onClose: () => void
  onInviteUser: (userData: Omit<User, "id" | "createdAt">) => void
  currentUserRole: "Admin" | "Local Leader" | "Doctor" | "Staff" | "Community Reporter" | "Volunteer" | "Guest"
  currentUserRegion?: string
}

const roleData = {
  "Admin": {
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Full system access and user management"
  },
  "Local Leader": {
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Regional oversight and team management"
  },
  "Doctor": {
    icon: Stethoscope,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Medical expertise and health assessments"
  },
  "Staff": {
    icon: Briefcase,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "General staff with operational access"
  },
  "Community Reporter": {
    icon: Reporter,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Report community health issues"
  },
  "Volunteer": {
    icon: Heart,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "Community volunteer with limited access"
  },
  "Guest": {
    icon: UserCheck,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    description: "Read-only access for visitors"
  }
}

const regions = [
  "North District",
  "South District",
  "East District",
  "West District",
  "Central District",
  "Coastal Region",
  "Mountain Region",
  "Rural Areas"
]

export function InviteUserForm({ 
  isOpen, 
  onClose, 
  onInviteUser, 
  currentUserRole
}: InviteUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as User["role"] | "",
    status: "Active" as User["status"],
    region: "",
    customMessage: ""
  })
  const [inviteMethod, setInviteMethod] = useState<"email" | "sms" | "both">("email")
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getAvailableRoles = (): User["role"][] => {
    const allRoles: User["role"][] = ["Admin", "Local Leader", "Doctor", "Staff", "Community Reporter", "Volunteer", "Guest"]
    
    if (currentUserRole === "Admin") {
      return allRoles
    } else if (currentUserRole === "Local Leader") {
      // Local Leaders can only invite certain roles
      return allRoles.filter(role => role !== "Admin" && role !== "Local Leader")
    }
    
    return []
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.role) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const userData: Omit<User, "id" | "createdAt"> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      role: formData.role as User["role"],
      status: formData.status,
      region: formData.region || undefined
    }

    onInviteUser(userData)
    handleReset()
    setIsSubmitting(false)
  }

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "Active",
      region: "",
      customMessage: ""
    })
    setInviteMethod("email")
    setSendWelcomeEmail(true)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      handleReset()
      onClose()
    }
  }

  const availableRoles = getAvailableRoles()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the system and assign their role and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>Enter the user&apos;s personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1-555-0123"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Role Assignment</CardTitle>
              <CardDescription>Choose the user&apos;s role and access level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Select Role *</Label>
                <RadioGroup 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value as User["role"] })}
                  className="space-y-2"
                  disabled={isSubmitting}
                >
                  {availableRoles.map((role) => {
                    const RoleIcon = roleData[role].icon
                    
                    return (
                      <div key={role} className="flex items-center space-x-3">
                        <RadioGroupItem 
                          value={role} 
                          id={`role-${role}`}
                          disabled={isSubmitting}
                        />
                        <Label 
                          htmlFor={`role-${role}`} 
                          className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.role === role 
                              ? 'border-blue-200 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${roleData[role].bgColor}`}>
                            <RoleIcon className={`h-4 w-4 ${roleData[role].color}`} />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">{role}</span>
                            <p className="text-sm text-gray-600 mt-1">
                              {roleData[role].description}
                            </p>
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Initial Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value as User["status"] })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invitation Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Invitation Settings</CardTitle>
              <CardDescription>Configure how the invitation will be sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Send Invitation Via</Label>
                <RadioGroup 
                  value={inviteMethod} 
                  onValueChange={(value) => setInviteMethod(value as "email" | "sms" | "both")}
                  className="flex gap-6"
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-method" />
                    <Label htmlFor="email-method" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                  </div>
                  {formData.phone && (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sms" id="sms-method" />
                        <Label htmlFor="sms-method" className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both-method" />
                        <Label htmlFor="both-method">Both</Label>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="welcome-email"
                  checked={sendWelcomeEmail}
                  onCheckedChange={setSendWelcomeEmail}
                  disabled={isSubmitting}
                />
                <Label htmlFor="welcome-email">Send welcome email with getting started guide</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.customMessage}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  placeholder="Add a personal message to the invitation..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          {/* Permissions Notice */}
          {currentUserRole === "Local Leader" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> As a Local Leader, you can only invite users with roles below Admin level.
              </p>
            </div>
          )}
        </form>

        <DialogFooter className="gap-2">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.email || !formData.role}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              "Send Invitation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InviteUserForm
