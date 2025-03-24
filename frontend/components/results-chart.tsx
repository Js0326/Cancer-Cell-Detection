"use client"

import { useState } from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
  ChartLegendItemLabel,
  ChartLegendItemValue,
  ChartLegendItemColor,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartLine,
  ChartArea,
  ChartBar,
} from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - in a real app, this would come from your database
const monthlyData = [
  { month: "Jan", benign: 12, malignant: 8, accuracy: 94 },
  { month: "Feb", benign: 15, malignant: 10, accuracy: 92 },
  { month: "Mar", benign: 18, malignant: 12, accuracy: 95 },
  { month: "Apr", benign: 14, malignant: 15, accuracy: 97 },
  { month: "May", benign: 16, malignant: 9, accuracy: 93 },
  { month: "Jun", benign: 19, malignant: 11, accuracy: 96 },
  { month: "Jul", benign: 21, malignant: 13, accuracy: 94 },
  { month: "Aug", benign: 17, malignant: 14, accuracy: 95 },
  { month: "Sep", benign: 20, malignant: 16, accuracy: 97 },
  { month: "Oct", benign: 22, malignant: 12, accuracy: 96 },
  { month: "Nov", benign: 18, malignant: 10, accuracy: 94 },
  { month: "Dec", benign: 24, malignant: 15, accuracy: 98 },
]

const confidenceData = [
  { range: "90-100%", count: 42 },
  { range: "80-90%", count: 28 },
  { range: "70-80%", count: 15 },
  { range: "60-70%", count: 8 },
  { range: "<60%", count: 3 },
]

export default function ResultsChart() {
  const [chartType, setChartType] = useState("distribution")

  return (
    <div className="w-full h-full">
      <Tabs defaultValue={chartType} onValueChange={setChartType} className="mb-4">
        <TabsList>
          <TabsTrigger value="distribution">Result Distribution</TabsTrigger>
          <TabsTrigger value="trend">Monthly Trend</TabsTrigger>
          <TabsTrigger value="confidence">Confidence Levels</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full h-[300px]">
        {chartType === "distribution" && (
          <ChartContainer
            className="h-full"
            series={[
              {
                name: "Benign",
                data: monthlyData.map((d) => d.benign),
                color: "hsl(var(--chart-1))",
              },
              {
                name: "Malignant",
                data: monthlyData.map((d) => d.malignant),
                color: "hsl(var(--chart-3))",
              },
            ]}
            categories={monthlyData.map((d) => d.month)}
          >
            <ChartLegend position="top" className="flex justify-center gap-8 mb-4">
              {({ series }) =>
                series.map((serie) => (
                  <ChartLegendItem key={serie.name}>
                    <ChartLegendItemColor className="h-3 w-3" />
                    <ChartLegendItemLabel>{serie.name}</ChartLegendItemLabel>
                    <ChartLegendItemValue>{serie.data.reduce((a, b) => a + b, 0)}</ChartLegendItemValue>
                  </ChartLegendItem>
                ))
              }
            </ChartLegend>
            <ChartGrid horizontal vertical />
            <ChartXAxis />
            <ChartYAxis />
            <ChartBar />
            <ChartTooltip>
              {({ series, itemIndex }) => (
                <ChartTooltipContent className="bg-background border shadow-md">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">{monthlyData[itemIndex].month}</div>
                    {series.map((serie) => (
                      <div key={serie.name} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.color }} />
                          <span className="text-xs text-muted-foreground">{serie.name}:</span>
                        </div>
                        <span className="text-xs font-medium">{serie.data[itemIndex]}</span>
                      </div>
                    ))}
                  </div>
                </ChartTooltipContent>
              )}
            </ChartTooltip>
          </ChartContainer>
        )}

        {chartType === "trend" && (
          <ChartContainer
            className="h-full"
            series={[
              {
                name: "Accuracy",
                data: monthlyData.map((d) => d.accuracy),
                color: "hsl(var(--chart-2))",
              },
            ]}
            categories={monthlyData.map((d) => d.month)}
            yAxis={{
              min: 80,
              max: 100,
              tickAmount: 5,
            }}
          >
            <ChartLegend position="top" className="flex justify-center gap-8 mb-4">
              {({ series }) =>
                series.map((serie) => (
                  <ChartLegendItem key={serie.name}>
                    <ChartLegendItemColor className="h-3 w-3" />
                    <ChartLegendItemLabel>{serie.name}</ChartLegendItemLabel>
                    <ChartLegendItemValue>
                      {Math.round(serie.data.reduce((a, b) => a + b, 0) / serie.data.length)}%
                    </ChartLegendItemValue>
                  </ChartLegendItem>
                ))
              }
            </ChartLegend>
            <ChartGrid horizontal vertical />
            <ChartXAxis />
            <ChartYAxis />
            <ChartLine />
            <ChartArea />
            <ChartTooltip>
              {({ series, itemIndex }) => (
                <ChartTooltipContent className="bg-background border shadow-md">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">{monthlyData[itemIndex].month}</div>
                    {series.map((serie) => (
                      <div key={serie.name} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.color }} />
                          <span className="text-xs text-muted-foreground">{serie.name}:</span>
                        </div>
                        <span className="text-xs font-medium">{serie.data[itemIndex]}%</span>
                      </div>
                    ))}
                  </div>
                </ChartTooltipContent>
              )}
            </ChartTooltip>
          </ChartContainer>
        )}

        {chartType === "confidence" && (
          <ChartContainer
            className="h-full"
            series={[
              {
                name: "Analyses",
                data: confidenceData.map((d) => d.count),
                color: "hsl(var(--chart-4))",
              },
            ]}
            categories={confidenceData.map((d) => d.range)}
          >
            <ChartLegend position="top" className="flex justify-center gap-8 mb-4">
              {({ series }) =>
                series.map((serie) => (
                  <ChartLegendItem key={serie.name}>
                    <ChartLegendItemColor className="h-3 w-3" />
                    <ChartLegendItemLabel>{serie.name}</ChartLegendItemLabel>
                    <ChartLegendItemValue>{serie.data.reduce((a, b) => a + b, 0)}</ChartLegendItemValue>
                  </ChartLegendItem>
                ))
              }
            </ChartLegend>
            <ChartGrid horizontal vertical />
            <ChartXAxis />
            <ChartYAxis />
            <ChartBar />
            <ChartTooltip>
              {({ series, itemIndex }) => (
                <ChartTooltipContent className="bg-background border shadow-md">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">{confidenceData[itemIndex].range}</div>
                    {series.map((serie) => (
                      <div key={serie.name} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.color }} />
                          <span className="text-xs text-muted-foreground">{serie.name}:</span>
                        </div>
                        <span className="text-xs font-medium">{serie.data[itemIndex]}</span>
                      </div>
                    ))}
                  </div>
                </ChartTooltipContent>
              )}
            </ChartTooltip>
          </ChartContainer>
        )}
      </div>
    </div>
  )
}

