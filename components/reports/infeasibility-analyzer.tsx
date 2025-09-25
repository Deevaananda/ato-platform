"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Users, MapPin } from "lucide-react"

interface InfeasibilityIssue {
  id: string
  type: 'room_conflict' | 'instructor_conflict' | 'capacity_exceeded' | 'prerequisite_violation' | 'resource_unavailable'
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  affectedCourses: string[]
  affectedRooms: string[]
  affectedInstructors: string[]
  suggestedSolution: string
  status: 'unresolved' | 'in_progress' | 'resolved'
  detectedAt: string
  priority: number
}

export function InfeasibilityAnalyzer() {
  // TODO: Load infeasibility issues from API
  const [issues, setIssues] = useState<InfeasibilityIssue[]>([])
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "unresolved":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Infeasibility Analyzer</h1>
          <p className="text-muted-foreground">
            Detect and resolve timetable conflicts and constraints
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Run Analysis
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No conflicts detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Critical issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Being resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Successfully fixed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Issues</CardTitle>
          <CardDescription>
            Review and resolve timetable conflicts and constraint violations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Issues Detected</h3>
            <p className="text-muted-foreground mb-4">
              All timetable constraints are satisfied. No conflicts found.
            </p>
            <p className="text-sm text-muted-foreground">
              Run analysis on generated timetables to detect issues.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}