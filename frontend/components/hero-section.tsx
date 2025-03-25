"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import CellVisualization from "@/components/cell-visualization"

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background z-10" />
        <div className="h-full w-full" ref={containerRef}>
          <CellVisualization />
        </div>
      </div>

      <div className="container relative z-20 mx-auto px-4 py-32 sm:py-48 lg:py-56">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">AI-Powered Cancer Cell Detection</h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-xl">
            Upload histopathological images and get real-time classification results using our advanced Swin
            Transformer-based model.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/upload">
              <Button size="lg" className="gap-2">
                Upload Image <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

