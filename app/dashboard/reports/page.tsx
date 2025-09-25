"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertTriangle, TrendingUp, Users, MapPin, Download, Filter } from "lucide-react"
import { InfeasibilityAnalyzer } from "@/components/reports/infeasibility-analyzer"
import { PerformanceDashboard } from "@/components/reports/performance-dashboard"

const utilizationData = [
  { name: "Mon", classrooms: 85, labs: 72, faculty: 78 },
  { name: "Tue", classrooms: 92, labs: 68, faculty: 85 },
  { name: "Wed", classrooms: 78, labs: 85, faculty: 82 },
  { name: "Thu", classrooms: 88, labs: 79, faculty: 88 },
  { name: "Fri", classrooms: 95, labs: 82, faculty: 92 },
  { name: "Sat", classrooms: 45, labs: 35, faculty: 48 },
]

const conflictData = [
  { type: "Room Double Booking", count: 3, severity: "high" },
  { type: "Faculty Overload", count: 7, severity: "medium" },
  { type: "Time Preference Violation", count: 12, severity: "low" },
  { type: "Capacity Exceeded", count: 2, severity: "high" },
  { type: "Equipment Mismatch", count: 5, severity: "medium" },
]

const departmentUtilization = [
  { name: "Computer Science", value: 92, color: "#3b82f6" },
  { name: "Mathematics", value: 78, color: "#10b981" },
  { name: "Physics", value: 85, color: "#f59e0b" },
  { name: "Chemistry", value: 88, color: "#ef4444" },
  { name: "Biology", value: 82, color: "#8b5cf6" },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-week")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into timetable performance and optimization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">87.3%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
            <Progress value={87.3} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">29</div>
            <p className="text-xs text-muted-foreground">5 high priority</p>
            <div className="flex gap-1 mt-2">
              <Badge variant="destructive" className="text-xs">
                High: 5
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Med: 12
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Workload</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">18.2</div>
            <p className="text-xs text-muted-foreground">avg hours/week</p>
            <Progress value={76} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Efficiency</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">92.1%</div>
            <p className="text-xs text-muted-foreground">capacity utilization</p>
            <Progress value={92.1} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="utilization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="utilization">Utilization Analysis</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Reports</TabsTrigger>
          <TabsTrigger value="infeasibility">Infeasibility Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Resource Utilization</CardTitle>
                <CardDescription>Classroom, laboratory, and faculty utilization rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="classrooms" fill="#3b82f6" name="Classrooms" />
                    <Bar dataKey="labs" fill="#10b981" name="Labs" />
                    <Bar dataKey="faculty" fill="#f59e0b" name="Faculty" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Utilization</CardTitle>
                <CardDescription>Resource utilization by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentUtilization}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {departmentUtilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Conflicts</CardTitle>
              <CardDescription>Active scheduling conflicts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflictData.map((conflict, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          conflict.severity === "high"
                            ? "text-destructive"
                            : conflict.severity === "medium"
                              ? "text-yellow-500"
                              : "text-blue-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-foreground">{conflict.type}</p>
                        <p className="text-sm text-muted-foreground">{conflict.count} instances</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        conflict.severity === "high"
                          ? "destructive"
                          : conflict.severity === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {conflict.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infeasibility">
          <InfeasibilityAnalyzer />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
