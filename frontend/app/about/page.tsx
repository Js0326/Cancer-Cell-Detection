"use client"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About CellDetect AI</h1>
        <div className="prose prose-lg">
          <p className="text-xl text-muted-foreground mb-8">
            CellDetect AI is an advanced medical imaging analysis platform that leverages artificial intelligence to assist in the detection and classification of cancer cells in histopathological images.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            Our mission is to provide healthcare professionals with powerful AI-driven tools to enhance their diagnostic capabilities and improve patient outcomes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology</h2>
          <p className="mb-6">
            We utilize state-of-the-art deep learning models, specifically the Swin Transformer architecture, to analyze histopathological images with high accuracy and efficiency.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
          <p className="mb-6">
            For more information or support, please contact us at support@celldetect.ai
          </p>
        </div>
      </div>
    </div>
  )
}

