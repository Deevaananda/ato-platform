"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  Building,
  Calendar,
  Target,
  Zap,
  Brain,
  LineChart,
  Download,
  Filter,
  RefreshCw
} from "lucide-react"

export function AdvancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("semester")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange, selectedMetric])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      console.log("[Analytics] Loading analytics data for:", { timeRange, selectedMetric })
      
      // TODO: Load real analytics data from database using API endpoints
      const analyticsData = {
        kpis: {
          schedulingEfficiency: { value: 0, trend: 0, status: "good" },
          resourceUtilization: { value: 0, trend: 0, status: "warning" },
          conflictResolution: { value: 0, trend: 0, status: "excellent" },
          studentSatisfaction: { value: 0, trend: 0, status: "good" },
          facultySatisfaction: { value: 0, trend: 0, status: "good" },
          complianceRate: { value: 0, trend: 0, status: "excellent" }
        },
        predictions: {
          nextSemesterConflicts: { value: 0, confidence: 0 },
          resourceBottlenecks: [],
          enrollmentTrends: {
            increasing: [],
            decreasing: [],
            stable: []
          }
        },
        optimizations: {
          savedHours: 0,
          conflictsResolved: 0,
          efficiencyImprovement: 0,
          costSavings: 0
        },
        constraints: {
          total: 0,
          satisfied: 0,
          violated: 0,
          pending: 0,
          categories: {
            time: { total: 0, satisfied: 0, violated: 0, pending: 0 },
            room: { total: 0, satisfied: 0, violated: 0, pending: 0 },
            instructor: { total: 0, satisfied: 0, violated: 0, pending: 0 },
            student: { total: 0, satisfied: 0, violated: 0, pending: 0 }
          }
        },
        performance: {
          optimizationTime: 0,
          algorithmsUsed: [],
          convergenceRate: 0,
          solutionQuality: 0
        }
      }
      
      setAnalyticsData(analyticsData)
    } catch (error) {
      console.error("[Analytics] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-400" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Activity className="h-4 w-4 text-gray-400" />
  }

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: "text-green-400",
      good: "text-blue-400", 
      warning: "text-yellow-400",
      critical: "text-red-400"
    }
    return colors[status as keyof typeof colors] || colors.good
  }

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      excellent: "bg-green-500/20 text-green-400 border-green-500/30",
      good: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", 
      critical: "bg-red-500/20 text-red-400 border-red-500/30"
    }
    return colors[status as keyof typeof colors] || colors.good
  }

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Predictive insights and performance metrics for timetable optimization
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(analyticsData.kpis).map(([key, kpi]: [string, any]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </CardTitle>
              {getTrendIcon(kpi.trend)}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(kpi.status)}`}>
                {kpi.value}%
              </div>
              <p className="text-xs text-muted-foreground">
                {kpi.trend > 0 ? '+' : ''}{kpi.trend}% from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Efficiency Trends</CardTitle>
                <CardDescription>
                  Historical performance over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <LineChart className="mx-auto h-12 w-12 mb-4" />
                  <p>Time series chart showing efficiency trends</p>
                  <p className="text-sm">Integration with charting library required</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization Distribution</CardTitle>
                <CardDescription>
                  Breakdown by resource type and department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Classrooms</span>
                      <span>82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Laboratories</span>
                      <span>76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Auditoriums</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seminar Halls</span>
                      <span>58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Constraint Satisfaction</CardTitle>
                <CardDescription>
                  Current status of scheduling constraints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Satisfied</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="font-medium">{analyticsData.constraints.satisfied}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Violated</span>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="font-medium">{analyticsData.constraints.violated}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">{analyticsData.constraints.pending}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Satisfaction Rate</span>
                      <span className="text-green-400">
                        {Math.round((analyticsData.constraints.satisfied / analyticsData.constraints.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Impact</CardTitle>
                <CardDescription>
                  Quantified benefits from optimization algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Time Saved</span>
                    </div>
                    <span className="font-medium">{analyticsData.optimizations.savedHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm">Conflicts Resolved</span>
                    </div>
                    <span className="font-medium">{analyticsData.optimizations.conflictsResolved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">Efficiency Gain</span>
                    </div>
                    <span className="font-medium">{analyticsData.optimizations.efficiencyImprovement}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Cost Savings</span>
                    </div>
                    <span className="font-medium">₹{analyticsData.optimizations.costSavings.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Alerts</CardTitle>
                <CardDescription>
                  AI-powered predictions for next semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <div className="flex-1">
                      <div className="font-medium">Scheduling Conflicts Predicted</div>
                      <div className="text-sm text-muted-foreground">
                        {analyticsData.predictions.nextSemesterConflicts.value} potential conflicts with {analyticsData.predictions.nextSemesterConflicts.confidence}% confidence
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      Medium Risk
                    </Badge>
                  </div>

                  {analyticsData.predictions.resourceBottlenecks.map((bottleneck: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-400" />
                      <div className="flex-1">
                        <div className="font-medium">Resource Bottleneck</div>
                        <div className="text-sm text-muted-foreground">
                          {bottleneck.resource} - {bottleneck.probability}% probability during {bottleneck.timeframe}
                        </div>
                      </div>
                      <Badge className={
                        bottleneck.probability > 70 ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        bottleneck.probability > 50 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                        "bg-green-500/20 text-green-400 border-green-500/30"
                      }>
                        {bottleneck.probability > 70 ? "High" : bottleneck.probability > 50 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trend Analysis</CardTitle>
                <CardDescription>
                  Predicted changes in course popularity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-green-400">Increasing Demand</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analyticsData.predictions.enrollmentTrends.increasing.map((course: string) => (
                        <Badge key={course} className="bg-green-500/20 text-green-400 border-green-500/30">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <span className="font-medium text-red-400">Decreasing Demand</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analyticsData.predictions.enrollmentTrends.decreasing.map((course: string) => (
                        <Badge key={course} className="bg-red-500/20 text-red-400 border-red-500/30">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-400">Stable Demand</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {analyticsData.predictions.enrollmentTrends.stable.map((course: string) => (
                        <Badge key={course} className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Performance</CardTitle>
                <CardDescription>
                  Current optimization algorithm metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Optimization Time</span>
                    <span className="font-medium">{analyticsData.performance.optimizationTime}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Convergence Rate</span>
                    <span className="font-medium">{analyticsData.performance.convergenceRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Solution Quality</span>
                    <span className="font-medium">{analyticsData.performance.solutionQuality}%</span>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-2">Algorithms Used</div>
                    <div className="flex flex-wrap gap-1">
                      {analyticsData.performance.algorithmsUsed.map((algorithm: string) => (
                        <Badge key={algorithm} variant="secondary">
                          {algorithm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization History</CardTitle>
                <CardDescription>
                  Recent optimization runs and their effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                  <p>Optimization history chart</p>
                  <p className="text-sm">Shows improvement over time and algorithm comparison</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constraints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Constraint Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of constraint satisfaction by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Satisfied</TableHead>
                    <TableHead>Violated</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Success Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(analyticsData.constraints.categories).map(([category, data]: [string, any]) => (
                    <TableRow key={category}>
                      <TableCell className="capitalize font-medium">
                        {category}
                      </TableCell>
                      <TableCell>{data.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span>{data.satisfied}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <span>{data.violated}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-yellow-400" />
                          <span>{data.pending}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(data.satisfied / data.total) * 100} 
                            className="w-16 h-2" 
                          />
                          <span className="text-sm font-medium">
                            {Math.round((data.satisfied / data.total) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
                <CardDescription>
                  Technical performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Query Time</span>
                    <span className="font-medium">45ms avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Algorithm Execution</span>
                    <span className="font-medium">{analyticsData.performance.optimizationTime}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Memory Usage</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cache Hit Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Experience Metrics</CardTitle>
                <CardDescription>
                  User satisfaction and system usability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Page Load Time</span>
                    <span className="font-medium">1.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Satisfaction</span>
                    <span className="font-medium">91%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Error Rate</span>
                    <span className="font-medium">0.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session Duration</span>
                    <span className="font-medium">12m 34s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}