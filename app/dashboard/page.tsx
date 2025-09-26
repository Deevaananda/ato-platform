"use client"

import { useEffect, useMemo, useState } from "react"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookOpen, Calendar, BarChart3, Settings, Users, Building, AlertTriangle } from "lucide-react"

type DashboardStats = {
  activeTimetables: number
  totalCourses: number
  totalInstructors: number
  totalRooms: number
  scheduledClasses: number
  unscheduledClasses: number
  activeConstraints: number
  roomUtilization: number
  instructorWorkload: number
}

type ActivityEvent = {
  id: string
  title: string
  description: string
  category: string
  status?: string
  timestamp: string
}

const formatDateDistance = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.max(0, now.getTime() - date.getTime())

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return "just now"
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }

  const days = Math.floor(diff / day)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/activity"),
        ])

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }

        if (!activityResponse.ok) {
          throw new Error("Failed to fetch dashboard activity")
        }

        const statsPayload: DashboardStats = await statsResponse.json()
        const activityPayload: { events: ActivityEvent[] } = await activityResponse.json()

        if (isMounted) {
          setStats(statsPayload)
          setActivity(activityPayload.events)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error loading dashboard data")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  const scheduleCoverage = useMemo(() => {
    if (!stats) return null

    const totalClasses = stats.scheduledClasses + stats.unscheduledClasses
    if (totalClasses === 0) return null

    return Math.round((stats.scheduledClasses / totalClasses) * 100)
  }, [stats])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Live view of your Adaptive Timetabling Optimizer environment</p>
        </div>

        {error && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to load dashboard data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active Timetables</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "…" : stats?.activeTimetables ?? "—"}
              </div>
              <p className="text-xs text-muted-foreground">Approved or published schedules currently in circulation</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Faculty Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "…" : stats?.totalInstructors ?? "—"}</div>
              <p className="text-xs text-muted-foreground">Across {loading ? "…" : stats?.totalCourses ?? "—"} courses</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active Classrooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "…" : stats?.totalRooms ?? "—"}</div>
              <p className="text-xs text-muted-foreground">
                {loading || stats === null ? "Calculating utilization…" : `${stats.roomUtilization}% utilization across available slots`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Classes Scheduled</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "…" : stats?.scheduledClasses ?? "—"}</div>
              <p className="text-xs text-muted-foreground">
                {scheduleCoverage !== null
                  ? `${scheduleCoverage}% of classes placed, ${stats?.unscheduledClasses ?? 0} pending`
                  : "No class records found yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Average Instructor Load</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading || stats === null ? "…" : `${stats.instructorWorkload.toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">Scheduled classes per instructor</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active Constraints</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{loading ? "…" : stats?.activeConstraints ?? "—"}</div>
              <p className="text-xs text-muted-foreground">Configured rules currently enforced</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">Jump right into the workflows you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => (window.location.href = "/dashboard/timetables")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Generate New Timetable
              </Button>
              <Button
                className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => (window.location.href = "/dashboard/resources")}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Resources
              </Button>
              <Button
                className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => (window.location.href = "/dashboard/reports")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button
                className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/80"
                onClick={() => (window.location.href = "/dashboard/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configure Constraints
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Latest updates across schedules and resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading activity…</div>
              ) : activity.length === 0 ? (
                <div className="text-sm text-muted-foreground">No activity recorded yet.</div>
              ) : (
                activity.slice(0, 6).map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDateDistance(event.timestamp)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
