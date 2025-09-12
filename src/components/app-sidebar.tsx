"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  BarChart3,
  FileText,
  TestTube,
  Droplets,
  TrendingUp,
  AlertTriangle,
  MapPin,
  User,
  Zap,
  TestTubeDiagonal,
  Users,
  LogOut,
  Settings,
  ChevronUp,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navigationItems = [
  { name: "Search", href: "/dashboard/search", icon: Search },
  { name: "Overview", href: "/dashboard", icon: BarChart3 },
  { name: "Waterbody Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Medical Tests", href: "/dashboard/medical-tests", icon: TestTube },
  { name: "Waterbody Tests", href: "/dashboard/water-tests", icon: Droplets },
  { name: "Predictions", href: "/dashboard/predictions", icon: TrendingUp },
  { name: "Disease Predictor", href: "/dashboard/waterpredict", icon: TestTubeDiagonal },
  { name: "Role Management", href: "/dashboard/role-management", icon: Users },
  { name: "Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
  { name: "Hotspots", href: "/dashboard/hotspots", icon: MapPin },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-r border-gray-200 bg-white data-[variant=inset]:min-h-[calc(100vh-theme(spacing.4))] md:data-[variant=inset]:m-2 md:data-[variant=inset]:ml-0 md:data-[variant=inset]:rounded-xl md:data-[variant=inset]:shadow-md"
    >
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Spark</span>
          </div>
          <SidebarTrigger className="h-8 w-8 hover:bg-blue-50 transition-colors duration-200 -m-2 max-lg:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className="transition-all duration-200 hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span className="transition-opacity duration-200">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.role || 'Guest'}
                      </span>
                    </div>
                  </div>
                  <ChevronUp className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
