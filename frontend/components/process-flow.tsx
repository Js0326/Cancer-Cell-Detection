"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Microscope, Brain, BarChart3, ArrowRight } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Upload Image",
    icon: Upload,
    description: "Upload a histopathological image for analysis",
  },
  {
    id: 2,
    title: "Preprocessing",
    icon: Microscope,
    description: "Image is normalized, enhanced, and prepared for AI analysis",
  },
  {
    id: 3,
    title: "AI Analysis",
    icon: Brain,
    description: "Swin Transformer model analyzes cellular patterns and features",
  },
  {
    id: 4,
    title: "Results",
    icon: BarChart3,
    description: "Get classification results with confidence scores and visualizations",
  },
]

export default function ProcessFlow() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 flex-col items-center">
            <div 
              className={`relative flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${
                step.id === activeStep 
                  ? "bg-primary text-primary-foreground" 
                  : step.id < activeStep 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setActiveStep(step.id)}
              onMouseEnter={() => setActiveStep(step.id)}
            >
              <step.icon className="h-8 w-8" />
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute left-full w-full items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                  <div className={`h-0.5 flex-1 ${
                    step.id < activeStep ? "bg-primary" : "bg-muted-foreground/30"
                  }`} />
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium text-center">{step.title}</h3>
          </div>
        ))}
      </div>
      
      <motion.div 
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-card border rounded-lg p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {steps[activeStep - 1].icon && (\
              <steps[activeStep - 1].icon className="h-6 w-6 text-primary" />
            )}
          </div>
          <h3 className="text-xl font-medium">
            Step {activeStep}: {steps[activeStep - 1].title}
          </h3>
        </div>
        
        <div className="pl-16">
          <p className="text-muted-foreground mb-4">
            {steps[activeStep - 1].description}
          </p>
          
          {activeStep === 1 && (
            <div className="space-y-4">
              <p>
                The process begins when you upload a histopathological image through our secure interface. 
                You can upload images directly from your device or provide a URL to an online image.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Supported formats: JPG, PNG, TIFF</li>
                <li>Recommended resolution: 1024×1024 pixels or higher</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          )}
          
          {activeStep === 2 && (
            <div className="space-y-4">
              <p>
                Before AI analysis, the uploaded image undergoes several preprocessing steps to ensure optimal results:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Color normalization to standardize staining variations</li>
                <li>Noise reduction and artifact removal</li>
                <li>Contrast enhancement to improve feature visibility</li>
                <li>Tissue segmentation to focus on relevant areas</li>
                <li>Resizing to the input dimensions required by the AI model</li>
              </ul>
            </div>
          )}
          
          {activeStep === 3 && (
            <div className="space-y-4">
              <p>
                Our advanced Swin Transformer model analyzes the preprocessed image to detect cancer cells:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hierarchical feature extraction at multiple scales</li>
                <li>Shifted window self-attention mechanism focuses on relevant tissue regions</li>
                <li>Pattern recognition identifies cellular structures and morphological features</li>
                <li>Deep learning algorithms compare patterns with thousands of known samples</li>
                <li>Real-time inference optimized for web application performance</li>
              </ul>
            </div>
          )}
          
          {activeStep === 4 && (
            <div className="space-y-4">
              <p>
                After analysis, you receive comprehensive results to aid in diagnosis:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Binary classification: benign or malignant</li>
                <li>Confidence score indicating the model's certainty</li>
                <li>Attention heatmap highlighting regions of interest</li>
                <li>Feature importance breakdown</li>
                <li>Option to save, download, or share results securely</li>
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

