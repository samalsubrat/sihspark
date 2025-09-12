"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  UserPlus, 
  Edit3, 
  UserX, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Users
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RoleDialog } from "./role-dialog"
import { InviteUserForm } from "./invite-user-form"

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

const roleColors = {
  "Admin": "bg-red-100 text-red-800 border-red-200",
  "Local Leader": "bg-purple-100 text-purple-800 border-purple-200",
  "Doctor": "bg-blue-100 text-blue-800 border-blue-200",
  "Staff": "bg-green-100 text-green-800 border-green-200",
  "Community Reporter": "bg-orange-100 text-orange-800 border-orange-200",
  "Volunteer": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Guest": "bg-gray-100 text-gray-800 border-gray-200"
}

const statusColors = {
  "Active": "bg-green-100 text-green-800 border-green-200",
  "Suspended": "bg-red-100 text-red-800 border-red-200"
}

// Mock data - replace with real API calls
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@health.gov",
    phone: "+1-555-0123",
    role: "Doctor",
    status: "Active",
    region: "North District",
    createdAt: "2024-01-15T08:00:00Z",
    lastLogin: "2024-01-20T14:30:00Z"
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@district.org",
    role: "Local Leader",
    status: "Active",
    region: "Central District",
    createdAt: "2024-01-10T09:15:00Z",
    lastLogin: "2024-01-20T16:45:00Z"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@volunteer.org",
    phone: "+1-555-0456",
    role: "Volunteer",
    status: "Active",
    region: "South District",
    createdAt: "2024-01-12T11:30:00Z",
    lastLogin: "2024-01-19T10:20:00Z"
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@system.gov",
    role: "Admin",
    status: "Active",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-01-20T18:00:00Z"
  },
  {
    id: "5",
    name: "John Reporter",
    email: "j.reporter@community.org",
    phone: "+1-555-0789",
    role: "Community Reporter",
    status: "Suspended",
    region: "East District",
    createdAt: "2024-01-18T13:45:00Z",
    lastLogin: "2024-01-19T09:15:00Z"
  }
]

interface UsersTableProps {
  currentUserRole?: "Admin" | "Local Leader" | "Doctor" | "Staff" | "Community Reporter" | "Volunteer" | "Guest"
  currentUserRegion?: string
}

export function UsersTable({ 
  currentUserRole = "Admin", 
  currentUserRegion = "All Regions" 
}: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<"suspend" | "remove" | null>(null)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const itemsPerPage = 10

  // Filter users based on permissions
  const getFilteredUsers = () => {
    let filteredUsers = users

    // Role-based filtering
    if (currentUserRole === "Local Leader") {
      filteredUsers = users.filter(user => 
        user.region === currentUserRegion || 
        (user.role !== "Admin" && user.role !== "Local Leader")
      )
    }

    // Search and filter
    filteredUsers = filteredUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })

    return filteredUsers
  }

  const filteredUsers = getFilteredUsers()
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleEditRole = (user: User) => {
    setSelectedUser(user)
    setIsRoleDialogOpen(true)
  }

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user)
    setActionType("suspend")
    setIsAlertDialogOpen(true)
  }

  const handleRemoveUser = (user: User) => {
    setSelectedUser(user)
    setActionType("remove")
    setIsAlertDialogOpen(true)
  }

  const confirmAction = () => {
    if (!selectedUser) return

    if (actionType === "suspend") {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" }
          : user
      ))
    } else if (actionType === "remove") {
      setUsers(users.filter(user => user.id !== selectedUser.id))
    }

    setIsAlertDialogOpen(false)
    setSelectedUser(null)
    setActionType(null)
  }

  const handleRoleUpdate = (userId: string, newRole: User["role"]) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
    setIsRoleDialogOpen(false)
    setSelectedUser(null)
  }

  const handleInviteUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setUsers([...users, newUser])
    setIsInviteFormOpen(false)
  }

  const canEditUser = (user: User) => {
    if (currentUserRole === "Admin") return true
    if (currentUserRole === "Local Leader") {
      return user.role !== "Admin" && (user.region === currentUserRegion || !user.region)
    }
    return false
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Users className="h-6 w-6 text-blue-600" />
              User Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users, roles, and permissions across the system
            </p>
          </div>
          {(currentUserRole === "Admin" || currentUserRole === "Local Leader") && (
            <Button onClick={() => setIsInviteFormOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite User
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Local Leader">Local Leader</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Community Reporter">Community Reporter</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email / Phone</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{user.name}</span>
                          <span className="text-xs text-gray-500">
                            Joined {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.email}</span>
                          {user.phone && (
                            <span className="text-xs text-gray-500">{user.phone}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[user.status]}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {user.region || "All Regions"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEditUser(user) && (
                              <DropdownMenuItem onClick={() => handleEditRole(user)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Role
                              </DropdownMenuItem>
                            )}
                            {canEditUser(user) && user.role !== "Admin" && (
                              <DropdownMenuItem onClick={() => handleSuspendUser(user)}>
                                <UserX className="mr-2 h-4 w-4" />
                                {user.status === "Active" ? "Suspend" : "Reactivate"}
                              </DropdownMenuItem>
                            )}
                            {canEditUser(user) && user.role !== "Admin" && (
                              <DropdownMenuItem 
                                onClick={() => handleRemoveUser(user)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Edit Dialog */}
      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={() => {
          setIsRoleDialogOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onRoleUpdate={handleRoleUpdate}
        currentUserRole={currentUserRole}
      />

      {/* Invite User Form */}
      <InviteUserForm
        isOpen={isInviteFormOpen}
        onClose={() => setIsInviteFormOpen(false)}
        onInviteUser={handleInviteUser}
        currentUserRole={currentUserRole}
        currentUserRegion={currentUserRegion}
      />

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "suspend" 
                ? (selectedUser?.status === "Active" ? "Suspend User" : "Reactivate User")
                : "Remove User"
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "suspend" 
                ? (selectedUser?.status === "Active" 
                    ? `Are you sure you want to suspend ${selectedUser?.name}? They will no longer be able to access the system.`
                    : `Are you sure you want to reactivate ${selectedUser?.name}? They will regain access to the system.`
                  )
                : `Are you sure you want to remove ${selectedUser?.name}? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === "remove" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {actionType === "suspend" 
                ? (selectedUser?.status === "Active" ? "Suspend" : "Reactivate")
                : "Remove"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default UsersTable
