"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Settings, Save, Mail, Phone, MapPin, LogOut } from "lucide-react"

export function AccountSettings() {
  const [profile, setProfile] = useState({
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@health.gov",
    phone: "+256 700 123 456",
    organization: "Ministry of Health",
    role: "Senior Epidemiologist",
    location: "Kampala, Uganda",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    criticalAlerts: true,
    systemUpdates: false,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    sessionTimeout: "30",
    loginNotifications: true,
  })

  const handleProfileUpdate = () => {
    // Handle profile update
    console.log("Profile updated:", profile)
  }

  const handleNotificationUpdate = () => {
    // Handle notification settings update
    console.log("Notifications updated:", notifications)
  }

  const handleSecurityUpdate = () => {
    // Handle security settings update
    console.log("Security updated:", security)
  }

  const handleSignOut = () => {
    localStorage.removeItem("authToken")
    sessionStorage.clear()
    window.location.href = "/"
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and professional details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={profile.organization}
                onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleProfileUpdate} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Configure how you want to receive alerts and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Alerts</Label>
                <p className="text-sm text-gray-500">Receive critical alerts via email</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, emailAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
              </div>
              <Switch
                checked={notifications.smsAlerts}
                onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, smsAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Browser push notifications</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, pushNotifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-gray-500">Summary reports every week</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, weeklyReports: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  Critical Alerts
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                </Label>
                <p className="text-sm text-gray-500">Cannot be disabled for safety</p>
              </div>
              <Switch checked={notifications.criticalAlerts} disabled />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Updates</Label>
                <p className="text-sm text-gray-500">Platform updates and maintenance</p>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, systemUpdates: checked })}
              />
            </div>
          </div>

          <Button onClick={handleNotificationUpdate} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <Switch
              checked={security.twoFactorAuth}
              onCheckedChange={(checked: boolean) => setSecurity({ ...security, twoFactorAuth: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Select
              value={security.sessionTimeout}
              onValueChange={(value: string) => setSecurity({ ...security, sessionTimeout: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Notifications</Label>
              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
            </div>
            <Switch
              checked={security.loginNotifications}
              onCheckedChange={(checked: boolean) => setSecurity({ ...security, loginNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Button variant="outline" className="w-full bg-transparent">
              Change Password
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Download Account Data
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>

          <Button onClick={handleSecurityUpdate} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Preferences
          </CardTitle>
          <CardDescription>Customize your dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Dashboard View</Label>
              <Select defaultValue="overview">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="alerts">Alerts</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="predictions">Predictions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Select defaultValue="eat">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select defaultValue="dd/mm/yyyy">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                  <SelectItem value="lg">Luganda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
