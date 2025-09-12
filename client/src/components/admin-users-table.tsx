"use client"

import React, { useState, useEffect, useCallback } from "react"
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
  Trash2, 
  MoreHorizontal,
  Users,
  Loader2
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AdminService, type User, type CreateUserPayload, type UpdateUserPayload } from "@/lib/admin"

interface UsersTableProps {
  currentUser: {
    id: string
    email: string
    role: string
    name?: string
  }
}

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800 border-red-200"
    case "leader":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "asha":
      return "bg-green-100 text-green-800 border-green-200"
    case "public":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function formatRole(role: string) {
  switch (role) {
    case "admin":
      return "Admin"
    case "leader":
      return "Local Leader"
    case "asha":
      return "ASHA Worker"
    case "public":
      return "Public User"
    default:
      return role
  }
}

export function UsersTable({ currentUser }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Form states for create/edit
  const [formData, setFormData] = useState<{
    email: string
    password: string
    role: 'admin' | 'leader' | 'asha' | 'public'
    name: string
  }>({
    email: "",
    password: "",
    role: "public",
    name: ""
  })

  // Load users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = roleFilter !== "all" ? { role: roleFilter } : undefined
      const response = await AdminService.listUsers(params)
      setUsers(response.users)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users'
      setError(errorMessage)
      console.error('Error fetching users:', err)
      
      // For development, show some dummy data if backend is not available
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
        setUsers([
          {
            id: '1',
            email: 'admin@example.com',
            role: 'admin' as const,
            name: 'System Admin',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            email: 'leader@example.com',
            role: 'leader' as const,
            name: 'Local Leader',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            email: 'asha@example.com',
            role: 'asha' as const,
            name: 'ASHA Worker',
            createdAt: new Date().toISOString()
          }
        ])
        setError(`Backend not available (${errorMessage}). Showing demo data.`)
      }
    } finally {
      setLoading(false)
    }
  }, [roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = async () => {
    try {
      const payload: CreateUserPayload = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name || undefined
      }
      
      await AdminService.createUser(payload)
      await fetchUsers()
      setShowCreateDialog(false)
      setFormData({ email: "", password: "", role: "public", name: "" })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      setError(errorMessage)
    }
  }

  const handleUpdateUser = async () => {
    if (!editUser) return
    
    try {
      const payload: UpdateUserPayload = {
        email: formData.email || undefined,
        role: formData.role,
        name: formData.name || undefined
      }
      
      if (formData.password) {
        payload.password = formData.password
      }
      
      await AdminService.updateUser(editUser.id, payload)
      await fetchUsers()
      setEditUser(null)
      setFormData({ email: "", password: "", role: "public", name: "" })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteUserId) return
    
    try {
      await AdminService.deleteUser(deleteUserId)
      await fetchUsers()
      setDeleteUserId(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
    }
  }

  const openEditDialog = (user: User) => {
    setEditUser(user)
    setFormData({
      email: user.email,
      password: "",
      role: user.role,
      name: user.name || ""
    })
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <Card className="rounded-xl border-0 shadow-sm bg-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">User Management</CardTitle>
          </div>
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="leader">Local Leader</SelectItem>
              <SelectItem value="asha">ASHA Worker</SelectItem>
              <SelectItem value="public">Public User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div className={`text-sm p-3 rounded-lg border ${
            error.includes('Backend not available') 
              ? 'text-blue-600 bg-blue-50 border-blue-200' 
              : 'text-red-600 bg-red-50 border-red-200'
          }`}>
            {error}
          </div>
        )}
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading users...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">User</TableHead>
                <TableHead className="min-w-[120px]">Role</TableHead>
                <TableHead className="min-w-[150px]">Created</TableHead>
                <TableHead className="min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {formatRole(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          {user.id !== currentUser.id && (
                            <DropdownMenuItem
                              onClick={() => setDeleteUserId(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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
        )}
      </CardContent>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system with the specified role and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
                placeholder="user@example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Full name (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="col-span-3"
                placeholder="Enter password"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'admin' | 'leader' | 'asha' | 'public') => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public User</SelectItem>
                  <SelectItem value="asha">ASHA Worker</SelectItem>
                  <SelectItem value="leader">Local Leader</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Full name (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="col-span-3"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'admin' | 'leader' | 'asha' | 'public') => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public User</SelectItem>
                  <SelectItem value="asha">ASHA Worker</SelectItem>
                  <SelectItem value="leader">Local Leader</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteUserId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
