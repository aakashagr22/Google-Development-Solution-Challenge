import { DashboardProvider } from "@/components/dashboard/dashboard-context"
import DashboardView from "@/components/dashboard/dashboard-view"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { AuthProvider } from "@/components/auth/auth-context"

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <div className="flex flex-col min-h-screen bg-[hsl(var(--background))]">
          <DashboardHeader />
          <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6">Environmental Dashboard</h1>
            <DashboardView />
          </main>
        </div>
      </DashboardProvider>
    </AuthProvider>
  )
}

