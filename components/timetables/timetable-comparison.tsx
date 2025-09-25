"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users, Building, Clock, AlertTriangle, Loader2 } from "lucide-react"

interface TimetableOption {
  id: string
  name: string
  overallScore: number
  utilization: number
  facultyWorkload: number
  conflicts: number
  preferences: number
  efficiency: number
  status: "optimal" | "good" | "acceptable"
}

export function TimetableComparison() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [timetableOptions, setTimetableOptions] = useState<TimetableOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTimetableOptions = async () => {
      setLoading(true)
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLoading(false)
    }

    loadTimetableOptions()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "acceptable":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-blue-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading timetable options...</span>
      </div>
    )
  }

  if (timetableOptions.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Timetable Options Available</h3>
          <p className="text-muted-foreground text-center mb-4">
            Generate timetable options first to compare different scheduling approaches.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Generate Timetables</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <BarChart3 className="mr-2 h-5 w-5" />
            Timetable Comparison
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Compare multiple timetable options across different metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-foreground">Select Options to Compare</label>
            <Select>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Choose timetable options" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Options</SelectItem>
                <SelectItem value="top3">Top 3 Options</SelectItem>
                <SelectItem value="custom">Custom Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {timetableOptions.map((option) => (
          <Card key={option.id} className="border-border">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-foreground">{option.name}</CardTitle>
                  <Badge className={getStatusColor(option.status)}>{option.status}</Badge>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(option.overallScore)}`}>
                    {option.overallScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Room Utilization</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{option.utilization}%</span>
                </div>
                <Progress value={option.utilization} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Faculty Workload</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{option.facultyWorkload}%</span>
                </div>
                <Progress value={option.facultyWorkload} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Efficiency</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{option.efficiency}%</span>
                </div>
                <Progress value={option.efficiency} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Preferences Met</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{option.preferences}%</span>
                </div>
                <Progress value={option.preferences} className="h-2" />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Conflicts</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{option.conflicts}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
                >
                  View Details
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Select</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {timetableOptions.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Detailed Comparison Matrix</CardTitle>
            <CardDescription className="text-muted-foreground">Side-by-side comparison of key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-foreground font-medium">Metric</th>
                    {timetableOptions.map((option, index) => (
                      <th key={option.id} className="text-center py-3 px-4 text-foreground font-medium">
                        Option {String.fromCharCode(65 + index)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Overall Score</td>
                    {timetableOptions.map((option) => (
                      <td key={option.id} className="text-center py-3 px-4">
                        <span className={`font-semibold ${getScoreColor(option.overallScore)}`}>
                          {option.overallScore}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Room Utilization</td>
                    {timetableOptions.map((option) => (
                      <td key={option.id} className="text-center py-3 px-4 text-foreground">
                        {option.utilization}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Faculty Workload Balance</td>
                    {timetableOptions.map((option) => (
                      <td key={option.id} className="text-center py-3 px-4 text-foreground">
                        {option.facultyWorkload}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Scheduling Conflicts</td>
                    {timetableOptions.map((option) => (
                      <td key={option.id} className="text-center py-3 px-4 text-foreground">
                        {option.conflicts}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">Preferences Satisfied</td>
                    {timetableOptions.map((option) => (
                      <td key={option.id} className="text-center py-3 px-4 text-foreground">
                        {option.preferences}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-foreground">Efficiency Rating</td>
                    {timetableOptions.map((option) => (
                      <td key={option.id} className="text-center py-3 px-4 text-foreground">
                        {option.efficiency}%
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
