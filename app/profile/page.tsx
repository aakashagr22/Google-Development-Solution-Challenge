import UserProfile from "@/components/user/user-profile"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { AuthProvider } from "@/components/auth/auth-context"

export default function ProfilePage() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <UserProfile />
      </div>
    </AuthProvider>
  )
}

