import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft, BarChart } from "lucide-react"

export default function ReportSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Report Submitted Successfully</CardTitle>
          <CardDescription className="text-lg">
            Thank you for contributing to a cleaner environment in India!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>Our team will verify the details of your report within 48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>The issue will be added to our environmental monitoring system</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>Local authorities will be notified if immediate action is required</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-primary/20 text-primary rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <span>You'll receive updates (if you provided contact information)</span>
              </li>
            </ol>
          </div>

          <div className="text-center space-y-3">
            <p className="text-muted-foreground">Your contribution helps build a more sustainable future for India</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="flex items-center gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex items-center gap-2">
                <Link href="/analytics">
                  <BarChart className="h-4 w-4" />
                  View Environmental Analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

