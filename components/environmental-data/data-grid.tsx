  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Data Grid</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 p-4 rounded-lg border border-green-100 bg-green-50"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-green-800">{item.title}</h4>
              <span className="text-xs text-green-600">{item.date}</span>
            </div>
            <p className="text-sm text-green-700">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600">{item.location}</span>
              <span className="text-xs text-green-600">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ); 