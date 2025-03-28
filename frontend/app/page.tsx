"use client"

import CellVisualization from "@/components/cell-visualization"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0">
        <CellVisualization />
      </div>
      
      {/* Dark gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-4xl">
          <h1 className="text-7xl font-bold text-primary-foreground mb-6 tracking-tight leading-tight drop-shadow-lg">
            AI-Powered Cancer Cell
            <br />
            Detection
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl drop-shadow-md">
            Upload histopathological images and get real-time classification results using our advanced Swin Transformer-based model.
          </p>
        </div>
      </div>
    </div>
  )
}

