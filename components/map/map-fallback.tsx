import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MapFallback() {
  return (
    <div className="relative h-full w-full">
      <Card className="absolute inset-0 flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-[300px] w-[500px] rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="text-sm text-muted-foreground">Loading map data...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

