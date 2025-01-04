'use client'
import { Sidebar } from "@/components/sidebar"
import "./globals.css"
// import type { Metadata } from "next"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/session-provider"

// export const metadata: Metadata = {
//   title: "FlowBack",
//   description: "Feedback and feature request management platform",
// }

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 bg-gray-50 min-h-screen">
                {children}
              </main>
            </div>
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
