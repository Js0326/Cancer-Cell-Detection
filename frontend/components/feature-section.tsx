import { Upload, BarChart3, Microscope, Shield, History, Smartphone } from "lucide-react"

const features = [
  {
    name: "Easy Image Upload",
    description: "Upload histopathological images in various formats for instant analysis.",
    icon: Upload,
  },
  {
    name: "Advanced AI Analysis",
    description: "Powered by Swin Transformer models trained on the BreaKHis_v1 dataset.",
    icon: Microscope,
  },
  {
    name: "Detailed Results",
    description: "Get comprehensive classification results with confidence scores.",
    icon: BarChart3,
  },
  {
    name: "Secure & Private",
    description: "Your medical data is encrypted and handled with the highest security standards.",
    icon: Shield,
  },
  {
    name: "History Tracking",
    description: "Access your previous analyses and track changes over time.",
    icon: History,
  },
  {
    name: "Mobile Friendly",
    description: "Use the application on any device with our responsive design.",
    icon: Smartphone,
  },
]

export default function FeatureSection() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.name} className="relative p-6 rounded-lg border bg-card text-card-foreground shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{feature.name}</h3>
          </div>
          <p className="mt-4 text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

