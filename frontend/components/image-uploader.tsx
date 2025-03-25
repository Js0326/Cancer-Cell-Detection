"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileImage } from "lucide-react"

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void
}

export default function ImageUploader({ onFileChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      validateAndSetFile(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB")
      return
    }

    onFileChange(file)
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      } transition-colors duration-200 ease-in-out`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-primary/10 p-4">
          <FileImage className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">Drag and drop your image here</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />
        <Button onClick={handleButtonClick} variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Select Image
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, TIFF (Max size: 10MB)</p>
      </div>
    </div>
  )
}

