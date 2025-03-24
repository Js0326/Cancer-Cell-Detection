"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react"

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const fetchResult = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`http://localhost:5000/results/${resolvedParams.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Result not found. The analysis result may have expired or been deleted.")
        }
        throw new Error(`Failed to fetch result. Please try again later. (Status: ${response.status})`)
      }
      
      const data = await response.json()
      setResult(data)
      
      // Create a blob URL for the image if it exists in the result
      if (data.image_data) {
        const blob = new Blob([data.image_data], { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
      }
      
      setError(null)
    } catch (error) {
      console.error('Error fetching result:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Fetch result from backend when component mounts
  useEffect(() => {
    fetchResult()
    
    // Cleanup function to revoke blob URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [resolvedParams.id])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchResult()
  }

  if (isLoading) return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Loading Results</h1>
        <p className="text-muted-foreground">Please wait while we fetch your analysis results...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="mb-6 text-muted-foreground">{error}</p>
        <Button asChild>
          <Link href="/upload">Try Another Upload</Link>
        </Button>
      </div>
    </div>
  )

  if (!result) return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p>Please wait while we fetch your results.</p>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/results">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analysis Result</h1>
            <p className="text-muted-foreground mt-1">
              {result.filename} • {result.timestamp}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square relative rounded-lg overflow-hidden border">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Histopathological image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Classification</h3>
                      <Badge
                        variant={result.prediction === "Malignant" ? "destructive" : "outline"}
                        className="text-sm px-3 py-1"
                      >
                        {result.prediction}
                      </Badge>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Confidence Score</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${result.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{result.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Details</CardTitle>
              <CardDescription>Technical information about this analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Analysis ID</h3>
                  <p className="text-sm">{result.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h3>
                  <p className="text-sm">{result.timestamp}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Model Version</h3>
                  <p className="text-sm">Swin Transformer v2.3</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Processing Time</h3>
                  <p className="text-sm">{result.processing_time} seconds</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Image Metadata</h3>
                  <div className="text-sm space-y-1">
                    <p>Resolution: {result.image_metadata?.resolution} pixels</p>
                    <p>Format: {result.image_metadata?.format}</p>
                    <p>Size: {result.image_metadata?.size}</p>
                    <p>Color Space: {result.image_metadata?.color_space}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

