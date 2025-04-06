import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";

const RegionSelector: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("north");
  const [selectedTimeRange, setSelectedTimeRange] = useState("lastYear");

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Region Selection</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-green-200 hover:bg-green-50"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 text-green-700" />
              Hide Filters
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 text-green-700" />
              Show Filters
            </>
          )}
        </Button>
      </div>

      <Collapsible open={showFilters}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-green-700">Region</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedRegion === "north" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  selectedRegion === "north"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setSelectedRegion("north")}
              >
                North
              </Button>
              <Button
                variant={selectedRegion === "south" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  selectedRegion === "south"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setSelectedRegion("south")}
              >
                South
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-700">Time Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedTimeRange === "lastYear" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  selectedTimeRange === "lastYear"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setSelectedTimeRange("lastYear")}
              >
                Last Year
              </Button>
              <Button
                variant={selectedTimeRange === "last5Years" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  selectedTimeRange === "last5Years"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setSelectedTimeRange("last5Years")}
              >
                Last 5 Years
              </Button>
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  );
};

export default RegionSelector; 