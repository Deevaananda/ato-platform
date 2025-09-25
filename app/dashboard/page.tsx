"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Building, BookOpen, BarChart3, Settings } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Adaptive Timetabling Optimizer</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Active Timetables</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">+2 from last semester</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Faculty Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">156</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Classrooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">48</div>
              <p className="text-xs text-muted-foreground">85% utilization rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">Common timetabling tasks</CardDescription>
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
              <CardDescription className="text-muted-foreground">Latest system updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Timetable generated for CS Department</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">New faculty member added</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Classroom capacity updated</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
