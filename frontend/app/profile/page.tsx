"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, User, Shield, Key } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const { user, session } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Set email from user object
    setProfile((prev) => ({
      ...prev,
      email: user.email || "",
    }))

    // Fetch user profile data from Supabase
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single()

        if (error) throw error

        if (data) {
          setProfile((prev) => ({
            ...prev,
            firstName: data.first_name || "",
            lastName: data.last_name || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      if (!user) throw new Error("User not authenticated")

      // Update profile in Supabase
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: profile.firstName,
        last_name: profile.lastName,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setSuccess("Profile updated successfully")
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    // Password change functionality would go here
    // This would typically redirect to the reset password flow
    router.push("/auth/reset-password")
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>

              {error && (
                <CardContent className="pt-0 pb-0">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </CardContent>
              )}

              {success && (
                <CardContent className="pt-0 pb-0">
                  <Alert className="bg-primary/10 border-primary/20">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </CardContent>
              )}

              <form onSubmit={handleProfileUpdate}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={profile.email} disabled />
                    <p className="text-xs text-muted-foreground">
                      Your email address is used for login and cannot be changed here.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Change your password to keep your account secure</p>
                    </div>
                    <Button variant="outline" onClick={handlePasswordChange}>
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div>
                    <h3 className="text-lg font-medium">Account Information</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">User ID:</span> {user.id}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span> {user.email}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Last Sign In:</span>{" "}
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

