// Sample data - in a real app, this would come from an API
const generateAQIForecastData = (scenario, year) => {
  const baseAQI = 65
  const years = [2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100]

  // Filter years up to the selected year
  const filteredYears = years.filter((y) => y <= year)

  // Different trajectories based on scenario
  const scenarioFactors = {
    optimistic: { multiplier: 0.7, offset: -15 },
    moderate: { multiplier: 1, offset: 0 },
    pessimistic: { multiplier: 1.5, offset: 20 },
  }

  const factor = scenarioFactors[scenario] || scenarioFactors.moderate

  return filteredYears.map((y) => {
    const yearFactor = (y - 2023) / 77 // Normalize year effect (2100 - 2023)
    const aqi = Math.round(baseAQI + yearFactor * factor.offset * factor.multiplier)

    return {
      year: y,
      aqi: Math.max(10, Math.min(300, aqi)),
    }
  })
}

