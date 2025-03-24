import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileImage, Calendar, Filter } from "lucide-react"
import ResultsTable from "@/components/results-table"
import ResultsChart from "@/components/results-chart"

export default function ResultsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analysis Results</h1>
          <p className="text-muted-foreground mt-2">View and manage your histopathological image analysis results</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Link href="/upload">
            <Button size="sm">
              <FileImage className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Your most recent histopathological image analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Statistics</CardTitle>
              <CardDescription>Summary of your analysis results over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResultsChart />
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <p>Data from your last 50 analyses</p>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

