"use client"

import { useState } from "react"
import { MapPin, Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    // Simulate form submission
    setTimeout(() => {
      setFormState("success")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
                  <CardHeader>
                <CardTitle className="text-white">Send us a message</CardTitle>
                <CardDescription className="text-slate-400">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {formState === "success" ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-blue-500/10 p-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-blue-400" />
                        </div>
                    <h3 className="text-xl font-medium text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-slate-400 max-w-md">
                      Thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
                    </p>
                    <Button 
                      className="mt-6 bg-blue-500 hover:bg-blue-600 text-white" 
                      onClick={() => setFormState("idle")}
                    >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Your name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                          className="bg-slate-800/50 border-slate-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="Your email address"
                              value={formData.email}
                              onChange={handleChange}
                              required
                          className="bg-slate-800/50 border-slate-700 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Subject</Label>
                          <Select value={formData.subject} onValueChange={handleSelectChange}>
                        <SelectTrigger id="subject" className="bg-slate-800/50 border-slate-700 text-white">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder="Your message"
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        className="bg-slate-800/50 border-slate-700 text-white"
                          />
                        </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      disabled={formState === "submitting"}
                    >
                        {formState === "submitting" ? (
                        "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                  </form>
                )}
                  </CardContent>
                </Card>
          </div>

          {/* Contact Information */}
          <div>
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-slate-400">Ways to reach our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Main Office</h3>
                    <p className="text-slate-400">
                      1A-029, King's Palace-12<br />
                      Campus-8, KIIT Road, Patia<br />
                      Bhubaneswar, India<br />
                      751024
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-slate-400">General Inquiries:</p>
                        <a href="mailto:info@celldetect.ai" className="text-blue-400 hover:text-blue-300">
                        info@celldetect.ai
                      </a>
                      </div>
                      <div>
                        <p className="text-slate-400">Support:</p>
                        <a href="mailto:support@celldetect.ai" className="text-blue-400 hover:text-blue-300">
                        support@celldetect.ai
                      </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                    <p className="text-slate-400">
                      Main: +91 80628 38283<br />
                      Monday - Friday, 9:00 AM - 5:00 PM IST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

