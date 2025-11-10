"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting signup process for:", email)

      let retries = 3
      let lastError: Error | null = null

      while (retries > 0) {
        try {
          console.log("[v0] Signup attempt", 4 - retries)
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo:
                process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
              data: {
                display_name: displayName,
              },
            },
          })

          if (authError) throw authError
          if (!authData.user) throw new Error("User creation failed")

          console.log("[v0] Auth signup successful for user:", authData.user.id)

          let avatarUrl = null
          if (avatarFile) {
            try {
              const fileExt = avatarFile.name.split(".").pop()
              const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`

              const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile, {
                cacheControl: "3600",
                upsert: false,
              })

              if (!uploadError) {
                const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName)
                avatarUrl = urlData.publicUrl
              }
            } catch (avatarError) {
              console.log("[v0] Avatar upload skipped - bucket may not exist yet")
            }
          }

          if (avatarUrl) {
            await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", authData.user.id)
          }

          console.log("[v0] Redirecting to dashboard")
          await new Promise((resolve) => setTimeout(resolve, 500))
          window.location.href = "/dashboard"
          return // Success - exit the retry loop
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error))
          retries--
          if (retries > 0) {
            console.log("[v0] Retry", 4 - retries, "after error:", lastError.message)
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait before retry
          }
        }
      }

      // If we got here, all retries failed
      if (lastError) {
        throw lastError
      }
    } catch (error: unknown) {
      console.log("[v0] Signup error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred during signup"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">Winter Arc</h1>
            <p className="text-blue-200">Start Your 90-Day Journey</p>
          </div>
          <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Sign Up</CardTitle>
              <CardDescription className="text-slate-300">Create your account to begin the challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar
                      className="h-24 w-24 border-2 border-blue-500 cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <AvatarImage src={avatarPreview || ""} alt="Profile" />
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">{initials}</AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-blue-500/20 bg-slate-800 text-blue-400 hover:bg-slate-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo (Optional)
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="displayName" className="text-slate-200">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-slate-200">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-slate-300">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-blue-400 underline underline-offset-4 hover:text-blue-300">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
