"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimetableGenerator } from "./timetable-generator"
import { TimetableViewer } from "./timetable-viewer"
import { TimetableComparison } from "./timetable-comparison"
import { Calendar, Zap, BarChart3 } from "lucide-react"

export function TimetableManager() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Timetables</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Optimization Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">87%</div>
            <p className="text-xs text-muted-foreground">Average efficiency</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Conflicts Resolved</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">156</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="generate" className="data-[state=active]:bg-background">
            Generate Timetable
          </TabsTrigger>
          <TabsTrigger value="view" className="data-[state=active]:bg-background">
            View Timetables
          </TabsTrigger>
          <TabsTrigger value="compare" className="data-[state=active]:bg-background">
            Compare Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <TimetableGenerator />
        </TabsContent>

        <TabsContent value="view">
          <TimetableViewer />
        </TabsContent>

        <TabsContent value="compare">
          <TimetableComparison />
        </TabsContent>
      </Tabs>
    </div>
  )
}
