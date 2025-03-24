"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileImage, Trash2, AlertCircle } from "lucide-react"
import ImageUploader from "@/components/image-uploader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UploadPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setError(null)
    setFile(selectedFile)

    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Show upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      clearInterval(interval)
      setUploadProgress(100)

      // Redirect to results page with the actual result ID
      setTimeout(() => {
        router.push(`/results/${result.id}`)
      }, 500)
    } catch (err) {
      clearInterval(interval)
      setError("An error occurred while uploading the image. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
      console.error("Upload error:", err)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setError(null)
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload Histopathological Image</h1>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Histopathological Image</CardTitle>
                <CardDescription>
                  Upload a histopathological image for cancer cell detection analysis. Supported formats: JPG, PNG,
                  TIFF.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  {!preview ? (
                    <ImageUploader onFileChange={handleFileChange} />
                  ) : (
                    <div className="relative rounded-lg overflow-hidden border aspect-square flex items-center justify-center bg-muted/50">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleClear}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleClear} disabled={!file || isUploading}>
                  Clear
                </Button>
                <Button onClick={handleUpload} disabled={!file || isUploading}>
                  {isUploading ? "Processing..." : "Analyze Image"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="url" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Image URL</CardTitle>
                <CardDescription>Provide a URL to a publicly accessible histopathological image.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button>
                    <FileImage className="mr-2 h-4 w-4" />
                    Fetch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

