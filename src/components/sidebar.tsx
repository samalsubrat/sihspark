"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
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
  Menu,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Search", href: "/dashboard/search", icon: Search },
  { name: "Overview", href: "/dashboard", icon: BarChart3 },
  { name: "Waterbody Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Medical Tests", href: "/dashboard/medical-tests", icon: TestTube },
  { name: "Waterbody Tests", href: "/dashboard/water-tests", icon: Droplets },
  { name: "Predictions", href: "/dashboard/predictions", icon: TrendingUp },
  { name: "Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
  { name: "Hotspots", href: "/dashboard/hotspots", icon: MapPin },
]

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded")
    if (saved !== null) {
      setIsExpanded(JSON.parse(saved))
    }
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(isExpanded))
  }, [isExpanded])

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 flex flex-col",
        "sidebar-transition",
        isExpanded ? "sidebar-expanded" : "sidebar-collapsed",
      )}
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <motion.span
                className="font-semibold text-lg text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Spark
              </motion.span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="p-1 h-8 w-8">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-blue-50 hover:text-blue-700",
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-600",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <motion.span
                    className="ml-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Account Section */}
      <div className="p-2 border-t border-gray-200">
        <Link href="/account">
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "hover:bg-blue-50 hover:text-blue-700",
              pathname === "/account" ? "bg-blue-100 text-blue-700" : "text-gray-600",
            )}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <motion.span
                className="ml-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Account Settings
              </motion.span>
            )}
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
