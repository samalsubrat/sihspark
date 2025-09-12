"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Shield, Users, Stethoscope, Briefcase, MessageSquare, Heart, UserCheck } from "lucide-react"

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

interface RoleDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onRoleUpdate: (userId: string, newRole: User["role"]) => void
  currentUserRole: "Admin" | "Local Leader" | "Doctor" | "Staff" | "Community Reporter" | "Volunteer" | "Guest"
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
    icon: MessageSquare,
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

export function RoleDialog({ isOpen, onClose, user, onRoleUpdate, currentUserRole }: RoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<User["role"] | "">("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role)
    }
  }, [user])

  const getAvailableRoles = (): User["role"][] => {
    const allRoles: User["role"][] = ["Admin", "Local Leader", "Doctor", "Staff", "Community Reporter", "Volunteer", "Guest"]
    
    if (currentUserRole === "Admin") {
      return allRoles
    } else if (currentUserRole === "Local Leader") {
      // Local Leaders cannot assign Admin or Local Leader roles
      return allRoles.filter(role => role !== "Admin" && role !== "Local Leader")
    }
    
    return []
  }

  const handleRoleUpdate = async () => {
    if (!user || !selectedRole || selectedRole === user.role) {
      onClose()
      return
    }

    setIsUpdating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    onRoleUpdate(user.id, selectedRole)
    setIsUpdating(false)
  }

  const handleClose = () => {
    if (!isUpdating) {
      setSelectedRole("")
      onClose()
    }
  }

  const availableRoles = getAvailableRoles()

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Edit User Role
          </DialogTitle>
          <DialogDescription>
            Update the role for <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Current User Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                Current: {user.role}
              </Badge>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select New Role</Label>
            <RadioGroup 
              value={selectedRole} 
              onValueChange={(value) => setSelectedRole(value as User["role"])}
              className="space-y-2"
            >
              {availableRoles.map((role) => {
                const RoleIcon = roleData[role].icon
                const isCurrentRole = role === user.role
                
                return (
                  <div key={role} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={role} 
                      id={role}
                      disabled={isUpdating}
                    />
                    <Label 
                      htmlFor={role} 
                      className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedRole === role 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isCurrentRole ? 'opacity-75' : ''}`}
                    >
                      <div className={`p-2 rounded-full ${roleData[role].bgColor}`}>
                        <RoleIcon className={`h-4 w-4 ${roleData[role].color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{role}</span>
                          {isCurrentRole && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
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

          {/* Permissions Notice */}
          {currentUserRole === "Local Leader" && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> As a Local Leader, you can only assign roles below Admin level.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRoleUpdate}
            disabled={isUpdating || !selectedRole || selectedRole === user.role}
            className="min-w-[100px]"
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              "Update Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RoleDialog
