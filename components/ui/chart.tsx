"use client"

import * as React from "react"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  // Set CSS variables for chart colors
  React.useEffect(() => {
    const root = document.documentElement
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value.color)
    })

    return () => {
      Object.entries(config).forEach(([key]) => {
        root.style.removeProperty(`--color-${key}`)
      })
    }
  }, [config])

  return <div className="w-full h-full">{children}</div>
}

interface ChartTooltipProps {
  content: React.ReactNode
  [key: string]: any
}

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  return <div {...props}>{content}</div>
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      [key: string]: any
    }
  }>
  label?: string
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">{label}</div>
        </div>
        <div className="grid gap-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: `var(--color-${item.name})` }} />
                <span>{item.name}</span>
              </div>
              <div className="font-medium tabular-nums">
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

