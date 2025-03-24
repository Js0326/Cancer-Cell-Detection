"use client"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">How It Works</h1>
        <div className="prose prose-lg">
          <p className="text-xl text-muted-foreground mb-8">
            Our cancer cell detection system uses advanced AI technology to analyze histopathological images and provide accurate classifications.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Process</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Image Upload</strong>
              <p>Upload your histopathological image through our secure platform.</p>
                  </li>
                  <li>
              <strong>Preprocessing</strong>
              <p>The image is automatically preprocessed to optimize it for analysis.</p>
                  </li>
                  <li>
              <strong>AI Analysis</strong>
              <p>Our Swin Transformer model analyzes the image to detect and classify cancer cells.</p>
                  </li>
                  <li>
              <strong>Results</strong>
              <p>Receive detailed results including classification and confidence scores.</p>
                  </li>
                </ol>
                
          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>
                <ul className="list-disc pl-6 space-y-2">
            <li>Swin Transformer v2.3 for image analysis</li>
            <li>ONNX runtime for efficient model inference</li>
            <li>Next.js for the frontend interface</li>
            <li>Flask for the backend API</li>
                  </ul>
                </div>
      </div>
    </div>
  )
}

