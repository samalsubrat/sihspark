import type React from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-50`}>
      {children}
    </div>
  )
}
