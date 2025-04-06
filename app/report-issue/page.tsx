import DashboardHeader from "@/components/dashboard/dashboard-header"
import ReportIssueForm from "@/components/report/report-issue-form"
import { AuthProvider } from "@/components/auth/auth-context"

export default function ReportIssuePage() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Report Environmental Issue</h1>
            <p className="text-muted-foreground mb-6">
              Help us track and address environmental issues across India by reporting problems in your area. Your
              active participation helps create a cleaner, healthier environment for all.
            </p>

            <ReportIssueForm />
          </div>
        </main>
      </div>
    </AuthProvider>
  )
}

