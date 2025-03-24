"use client"

import * as React from "react"
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

// Chart container component
export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  series: {
    name: string
    data: number[]
    color?: string
  }[]
  categories: string[]
  yAxis?: {
    min?: number
    max?: number
    tickAmount?: number
  }
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, series, categories, yAxis, children, ...props }, ref) => {
    // Create data array from series and categories
    const data = categories.map((category, index) => {
      const item: Record<string, any> = { category }
      series.forEach((serie) => {
        item[serie.name] = serie.data[index]
      })
      return item
    })

    // Create a context to share data with child components
    const chartContext = React.useMemo(
      () => ({
        data,
        series,
        categories,
        yAxis,
      }),
      [data, series, categories, yAxis],
    )

    return (
      <div ref={ref} className={cn("w-full h-full", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            {/* Render children with context */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  chartContext,
                })
              }
              return child
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

// Grid component
export const ChartGrid = React.forwardRef<
  React.ElementRef<typeof CartesianGrid>,
  React.ComponentPropsWithoutRef<typeof CartesianGrid> & {
    chartContext?: any
    horizontal?: boolean
    vertical?: boolean
  }
>(({ horizontal = true, vertical = true, ...props }, ref) => {
  return <CartesianGrid ref={ref} strokeDasharray="3 3" horizontal={horizontal} vertical={vertical} {...props} />
})
ChartGrid.displayName = "ChartGrid"

// X-Axis component
export const ChartXAxis = React.forwardRef<
  React.ElementRef<typeof XAxis>,
  React.ComponentPropsWithoutRef<typeof XAxis> & {
    chartContext?: any
  }
>(({ chartContext, ...props }, ref) => {
  return <XAxis ref={ref} dataKey="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} {...props} />
})
ChartXAxis.displayName = "ChartXAxis"

// Y-Axis component
export const ChartYAxis = React.forwardRef<
  React.ElementRef<typeof YAxis>,
  React.ComponentPropsWithoutRef<typeof YAxis> & {
    chartContext?: any
  }
>(({ chartContext, ...props }, ref) => {
  const yAxisProps = chartContext?.yAxis || {}

  return <YAxis ref={ref} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} {...yAxisProps} {...props} />
})
ChartYAxis.displayName = "ChartYAxis"

// Line component
export const ChartLine = React.forwardRef<
  React.ElementRef<typeof Line>,
  Omit<React.ComponentPropsWithoutRef<typeof Line>, "dataKey" | "stroke"> & {
    chartContext?: any
    serieIndex?: number
  }
>(({ chartContext, serieIndex = 0, ...props }, ref) => {
  const serie = chartContext?.series[serieIndex]
  if (!serie) return null

  return (
    <Line
      ref={ref}
      dataKey={serie.name}
      stroke={serie.color}
      strokeWidth={2}
      dot={{ r: 4, strokeWidth: 2 }}
      activeDot={{ r: 6, strokeWidth: 2 }}
      type="monotone"
      {...props}
    />
  )
})
ChartLine.displayName = "ChartLine"

// Area component
export const ChartArea = React.forwardRef<
  React.ElementRef<typeof Area>,
  Omit<React.ComponentPropsWithoutRef<typeof Area>, "dataKey" | "stroke" | "fill"> & {
    chartContext?: any
    serieIndex?: number
  }
>(({ chartContext, serieIndex = 0, ...props }, ref) => {
  const serie = chartContext?.series[serieIndex]
  if (!serie) return null

  return (
    <Area
      ref={ref}
      dataKey={serie.name}
      stroke={serie.color}
      fill={serie.color}
      fillOpacity={0.2}
      type="monotone"
      {...props}
    />
  )
})
ChartArea.displayName = "ChartArea"

// Bar component
export const ChartBar = React.forwardRef<
  React.ElementRef<typeof Bar>,
  Omit<React.ComponentPropsWithoutRef<typeof Bar>, "dataKey" | "fill"> & {
    chartContext?: any
    serieIndex?: number
  }
>(({ chartContext, serieIndex, ...props }, ref) => {
  // If serieIndex is provided, render a single bar
  if (serieIndex !== undefined) {
    const serie = chartContext?.series[serieIndex]
    if (!serie) return null

    return <Bar ref={ref} dataKey={serie.name} fill={serie.color} radius={[4, 4, 0, 0]} barSize={20} {...props} />
  }

  // Otherwise, render all series as bars
  return (
    <>
      {chartContext?.series.map((serie: any, index: number) => (
        <Bar key={serie.name} dataKey={serie.name} fill={serie.color} radius={[4, 4, 0, 0]} barSize={20} {...props} />
      ))}
    </>
  )
})
ChartBar.displayName = "ChartBar"

// Tooltip component
export const ChartTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  React.ComponentPropsWithoutRef<typeof Tooltip> & {
    chartContext?: any
    children?: React.ReactNode
  }
>(({ chartContext, children, ...props }, ref) => {
  return (
    <Tooltip
      ref={ref}
      content={({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null

        if (children) {
          return children({
            active,
            payload,
            label,
            series: chartContext?.series,
            itemIndex: chartContext?.categories.indexOf(label),
          })
        }

        return (
          <div className="rounded-lg border bg-background p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              {payload.map((entry: any) => (
                <div key={entry.name} className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs font-medium">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }}
      {...props}
    />
  )
})
ChartTooltip.displayName = "ChartTooltip"

// Tooltip content component
export const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// Legend component
export const ChartLegend = React.forwardRef<
  React.ElementRef<typeof Legend>,
  React.ComponentPropsWithoutRef<typeof Legend> & {
    chartContext?: any
    position?: "top" | "right" | "bottom" | "left"
    children?: (props: { series: any[] }) => React.ReactNode
  }
>(({ chartContext, position = "bottom", children, className, ...props }, ref) => {
  if (children) {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
        {children({ series: chartContext?.series || [] })}
      </div>
    )
  }

  return (
    <Legend
      ref={ref}
      verticalAlign={position === "top" || position === "bottom" ? position : "middle"}
      align={position === "left" || position === "right" ? position : "center"}
      height={36}
      {...props}
    />
  )
})
ChartLegend.displayName = "ChartLegend"

// Legend item component
export const ChartLegendItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
  },
)
ChartLegendItem.displayName = "ChartLegendItem"

// Legend item color component
export const ChartLegendItemColor = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("h-3 w-3 rounded-full", className)} {...props} />
  },
)
ChartLegendItemColor.displayName = "ChartLegendItemColor"

// Legend item label component
export const ChartLegendItemLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return <span ref={ref} className={cn("text-sm", className)} {...props} />
  },
)
ChartLegendItemLabel.displayName = "ChartLegendItemLabel"

// Legend item value component
export const ChartLegendItemValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return <span ref={ref} className={cn("text-sm font-medium", className)} {...props} />
  },
)
ChartLegendItemValue.displayName = "ChartLegendItemValue"

// Original Chart component (keeping for backward compatibility)
export interface ChartProps {
  data: any[]
  xAxisKey: string
  yAxisKey: string
  lineColor?: string
  areaColor?: string
  barColor?: string
}

export const Chart = React.forwardRef<
  React.ElementRef<typeof ComposedChart>,
  React.ComponentPropsWithoutRef<typeof ComposedChart> & ChartProps
>(({ className, data, xAxisKey, yAxisKey, lineColor, areaColor, barColor, ...props }, ref) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        ref={ref}
        className={className}
        {...props}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip content={<CustomTooltipContent />} />
        <Legend />
        {lineColor && <Line type="monotone" dataKey={yAxisKey} stroke={lineColor} />}
        {areaColor && <Area type="monotone" dataKey={yAxisKey} fill={areaColor} stroke={areaColor} />}
        {barColor && <Bar dataKey={yAxisKey} barSize={20} fill={barColor} />}
      </ComposedChart>
    </ResponsiveContainer>
  )
})
Chart.displayName = "Chart"

// Helper tooltip component for the original Chart
const CustomTooltipContent = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-xs text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

