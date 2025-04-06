"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Home, ShoppingBag, Leaf } from "lucide-react"

export default function EmissionsTracker() {
  const [transportation, setTransportation] = useState(5)
  const [energy, setEnergy] = useState(3)
  const [food, setFood] = useState(4)
  const [goods, setGoods] = useState(2)

  const totalEmissions = transportation * 0.5 + energy * 0.8 + food * 0.4 + goods * 0.3
  const treesNeeded = Math.round(totalEmissions / 0.06)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Personal Carbon Footprint Calculator</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Adjust the sliders to estimate your annual carbon emissions in tons of CO2 equivalent.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Transportation
            </Label>
            <span className="text-sm font-medium">{transportation} tons CO2e</span>
          </div>
          <Slider
            value={[transportation]}
            min={0}
            max={10}
            step={1}
            onValueChange={(value) => setTransportation(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home Energy
            </Label>
            <span className="text-sm font-medium">{energy} tons CO2e</span>
          </div>
          <Slider value={[energy]} min={0} max={10} step={1} onValueChange={(value) => setEnergy(value[0])} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Food & Diet
            </Label>
            <span className="text-sm font-medium">{food} tons CO2e</span>
          </div>
          <Slider value={[food]} min={0} max={10} step={1} onValueChange={(value) => setFood(value[0])} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Goods & Services
            </Label>
            <span className="text-sm font-medium">{goods} tons CO2e</span>
          </div>
          <Slider value={[goods]} min={0} max={10} step={1} onValueChange={(value) => setGoods(value[0])} />
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Carbon Footprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{totalEmissions.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">tons CO2e per year</p>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">{treesNeeded} trees</p>
                <p className="text-xs text-muted-foreground">needed to offset</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            The average person emits about 4-5 tons of CO2 per year. Reducing your carbon footprint helps mitigate
            climate change.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

