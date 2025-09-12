import type React from "react"
import ProtectedRoute from "@/components/protected-route"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['public']}>
      {children}
    </ProtectedRoute>
  )
}
