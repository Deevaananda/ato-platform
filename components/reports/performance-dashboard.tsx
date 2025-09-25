"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Clock, Cpu, Database, Zap, TrendingUp, TrendingDown } from "lucide-react"

const performanceData = [
  { time: "00:00", cpu: 15, memory: 45, response: 120, throughput: 850 },
  { time: "04:00", cpu: 12, memory: 42, response: 110, throughput: 920 },
  { time: "08:00", cpu: 35, memory: 68, response: 180, throughput: 1200 },
  { time: "12:00", cpu: 45, memory: 72, response: 220, throughput: 1450 },
  { time: "16:00", cpu: 38, memory: 65, response: 195, throughput: 1320 },
  { time: "20:00", cpu: 25, memory: 55, response: 150, throughput: 1100 },
]

const optimizationMetrics = [
  { date: "2024-01-01", generationTime: 45, conflicts: 32, satisfaction: 78 },
  { date: "2024-01-02", generationTime: 38, conflicts: 28, satisfaction: 82 },
  { date: "2024-01-03", generationTime: 42, conflicts: 25, satisfaction: 85 },
  { date: "2024-01-04", generationTime: 35, conflicts: 29, satisfaction: 80 },
  { date: "2024-01-05", generationTime: 33, conflicts: 22, satisfaction: 88 },
  { date: "2024-01-06", generationTime: 30, conflicts: 18, satisfaction: 92 },
  { date: "2024-01-07", generationTime: 28, conflicts: 15, satisfaction: 94 },
]

export function PerformanceDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>
        <p className="text-muted-foreground">System performance and optimization metrics</p>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              -5% from yesterday
            </p>
            <Progress value={23} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">67%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-yellow-500" />
              +3% from yesterday
            </p>
            <Progress value={67} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">120ms</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-green-500" />
              -15ms from yesterday
            </p>
            <Progress value={12} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1.2k</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              requests/min
            </p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance (24h)</CardTitle>
            <CardDescription>CPU and memory usage throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="CPU %"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Memory %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Optimization Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Performance</CardTitle>
            <CardDescription>Algorithm efficiency over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={optimizationMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                <Line type="monotone" dataKey="generationTime" stroke="#3b82f6" name="Generation Time (min)" />
                <Line type="monotone" dataKey="conflicts" stroke="#ef4444" name="Conflicts" />
                <Line type="monotone" dataKey="satisfaction" stroke="#10b981" name="Satisfaction %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Efficiency</CardTitle>
            <CardDescription>Optimization algorithm performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Average Generation Time</span>
              <Badge variant="secondary">32 minutes</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Success Rate</span>
              <Badge variant="default">94.2%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Constraint Satisfaction</span>
              <Badge variant="default">88.5%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Resource Utilization</span>
              <Badge variant="default">87.3%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Performance</CardTitle>
            <CardDescription>Database query and transaction metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Query Response Time</span>
              <Badge variant="secondary">45ms</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Connection Pool Usage</span>
              <Badge variant="secondary">23%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cache Hit Rate</span>
              <Badge variant="default">92.1%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Connections</span>
              <Badge variant="secondary">12/50</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Platform usage and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Users (24h)</span>
              <Badge variant="default">47</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Timetables Generated</span>
              <Badge variant="secondary">23</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Approvals Processed</span>
              <Badge variant="secondary">15</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">System Uptime</span>
              <Badge variant="default">99.8%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
