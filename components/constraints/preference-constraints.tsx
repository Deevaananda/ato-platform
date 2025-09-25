"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, UserCheck, Users, Plus, Settings } from "lucide-react"

interface Preference {
  id: string
  type: 'faculty' | 'student' | 'room'
  entity: string
  preferenceType: 'preferred' | 'avoid'
  timeSlots: string[]
  days: string[]
  priority: 'low' | 'medium' | 'high'
  reason: string
}

interface PreferenceConstraintsProps {
  onUpdate: () => void
}

export function PreferenceConstraints({ onUpdate }: PreferenceConstraintsProps) {
  // TODO: Load preference data from API
  const [preferences, setPreferences] = useState<Preference[]>([])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "faculty":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "student":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "room":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Preference Constraints</h2>
          <p className="text-muted-foreground">
            Manage faculty, student, and room scheduling preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Preference
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Preferences</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No faculty preferences set
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Preferences</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No student preferences set
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Critical preferences
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preferences List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduling Preferences</CardTitle>
          <CardDescription>
            View and manage all scheduling preferences and constraints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Preferences Set</h3>
            <p className="text-muted-foreground mb-4">
              Add preferences to optimize scheduling for faculty and students.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load preference data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}