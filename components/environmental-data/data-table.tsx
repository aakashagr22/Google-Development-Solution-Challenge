import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableCell, TableRow } from "@/components/ui/table";

const DataTable: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [dataType, setDataType] = useState("deforestation");
  const [timeRange, setTimeRange] = useState("lastYear");
  const [data, setData] = useState([
    { month: "January", value: 10, change: "+2%" },
    { month: "February", value: 12, change: "+3%" },
    { month: "March", value: 15, change: "+4%" },
    { month: "April", value: 18, change: "+5%" },
    { month: "May", value: 20, change: "+6%" },
    { month: "June", value: 22, change: "+7%" },
    { month: "July", value: 25, change: "+8%" },
    { month: "August", value: 28, change: "+9%" },
    { month: "September", value: 30, change: "+10%" },
    { month: "October", value: 32, change: "+11%" },
    { month: "November", value: 35, change: "+12%" },
    { month: "December", value: 38, change: "+13%" },
  ]);

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Data Table</h3>
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
            <Label className="text-green-700">Data Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={dataType === "deforestation" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  dataType === "deforestation"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setDataType("deforestation")}
              >
                Deforestation
              </Button>
              <Button
                variant={dataType === "carbon" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  dataType === "carbon"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setDataType("carbon")}
              >
                Carbon
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-700">Time Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={timeRange === "lastYear" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  timeRange === "lastYear"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setTimeRange("lastYear")}
              >
                Last Year
              </Button>
              <Button
                variant={timeRange === "last5Years" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  timeRange === "last5Years"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setTimeRange("last5Years")}
              >
                Last 5 Years
              </Button>
            </div>
          </div>
        </div>
      </Collapsible>

      <div className="rounded-lg border border-green-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50">
              <TableHead className="text-green-800">Month</TableHead>
              <TableHead className="text-green-800">Value</TableHead>
              <TableHead className="text-green-800">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.month} className="hover:bg-green-50">
                <TableCell className="text-green-700">{row.month}</TableCell>
                <TableCell className="text-green-700">{row.value}</TableCell>
                <TableCell className="text-green-700">{row.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable; 