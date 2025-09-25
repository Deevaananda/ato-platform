"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Attempting login with:", { email })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] Login response:", data)

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      const { user } = data
      if (user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (user.role === "faculty") {
        router.push("/dashboard/faculty")
      } else if (user.role === "coordinator") {
        router.push("/dashboard")
      } else {
        router.push("/dashboard")
      }

      // Force a page refresh to update the session state
      router.refresh()
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-input border-border text-foreground"
        />
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
        <p className="font-medium mb-2">Demo Credentials:</p>
        <div className="space-y-1">
          <p>
            <strong>Admin:</strong> admin@university.edu / password
          </p>
          <p>
            <strong>Faculty:</strong> faculty@university.edu / password
          </p>
          <p>
            <strong>Coordinator:</strong> coordinator@university.edu / password
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
