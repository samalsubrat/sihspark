import type React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
// import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ProtectedRoute allowedRoles={['asha', 'leader', 'admin']}>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="flex-1 min-h-screen bg-[#f7f9fb] overflow-auto">
          <div className="lg:hidden fixed top-4 right-4 z-50">
            <SidebarTrigger className="bg-white shadow-md border border-gray-200 hover:bg-gray-50" />
          </div>
          {children}
        </main>
      </SidebarProvider>
    // </ProtectedRoute>
  )
}
