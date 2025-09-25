"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, Building } from "lucide-react"

interface GlobalConstraintsProps {
  onUpdate: () => void
}

export function GlobalConstraints({ onUpdate }: GlobalConstraintsProps) {
  const [constraints, setConstraints] = useState({
    maxClassesPerDay: 8,
    maxConsecutiveClasses: 3,
    minBreakBetweenClasses: 15,
    maxWorkingHoursPerDay: 8,
    enableLunchBreak: true,
    lunchBreakDuration: 60,
    lunchBreakStartTime: "12:00",
    maxStudentsPerClassroom: 100,
    allowRoomOverflow: false,
    overflowPercentage: 10,
    enableMultiShift: false,
    shiftGap: 30,
  })

  const updateConstraint = (key: string, value: any) => {
    setConstraints((prev) => ({ ...prev, [key]: value }))
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Clock className="mr-2 h-5 w-5" />
            Time Constraints
          </CardTitle>
          <CardDescription className="text-muted-foreground">Configure daily and hourly limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxClassesPerDay" className="text-foreground">
                Maximum Classes Per Day
              </Label>
              <Input
                id="maxClassesPerDay"
                type="number"
                value={constraints.maxClassesPerDay}
                onChange={(e) => updateConstraint("maxClassesPerDay", Number.parseInt(e.target.value))}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxConsecutiveClasses" className="text-foreground">
                Maximum Consecutive Classes
              </Label>
              <Input
                id="maxConsecutiveClasses"
                type="number"
                value={constraints.maxConsecutiveClasses}
                onChange={(e) => updateConstraint("maxConsecutiveClasses", Number.parseInt(e.target.value))}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBreakBetweenClasses" className="text-foreground">
                Minimum Break Between Classes (minutes)
              </Label>
              <Input
                id="minBreakBetweenClasses"
                type="number"
                value={constraints.minBreakBetweenClasses}
                onChange={(e) => updateConstraint("minBreakBetweenClasses", Number.parseInt(e.target.value))}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxWorkingHoursPerDay" className="text-foreground">
                Maximum Working Hours Per Day
              </Label>
              <Input
                id="maxWorkingHoursPerDay"
                type="number"
                value={constraints.maxWorkingHoursPerDay}
                onChange={(e) => updateConstraint("maxWorkingHoursPerDay", Number.parseInt(e.target.value))}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Enable Lunch Break</Label>
                <p className="text-sm text-muted-foreground">Enforce mandatory lunch break for all schedules</p>
              </div>
              <Switch
                checked={constraints.enableLunchBreak}
                onCheckedChange={(checked) => updateConstraint("enableLunchBreak", checked)}
              />
            </div>

            {constraints.enableLunchBreak && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="lunchBreakDuration" className="text-foreground">
                    Lunch Break Duration (minutes)
                  </Label>
                  <Input
                    id="lunchBreakDuration"
                    type="number"
                    value={constraints.lunchBreakDuration}
                    onChange={(e) => updateConstraint("lunchBreakDuration", Number.parseInt(e.target.value))}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lunchBreakStartTime" className="text-foreground">
                    Lunch Break Start Time
                  </Label>
                  <Input
                    id="lunchBreakStartTime"
                    type="time"
                    value={constraints.lunchBreakStartTime}
                    onChange={(e) => updateConstraint("lunchBreakStartTime", e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Building className="mr-2 h-5 w-5" />
            Room Capacity Constraints
          </CardTitle>
          <CardDescription className="text-muted-foreground">Configure classroom capacity limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxStudentsPerClassroom" className="text-foreground">
              Maximum Students Per Classroom
            </Label>
            <Input
              id="maxStudentsPerClassroom"
              type="number"
              value={constraints.maxStudentsPerClassroom}
              onChange={(e) => updateConstraint("maxStudentsPerClassroom", Number.parseInt(e.target.value))}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Allow Room Overflow</Label>
              <p className="text-sm text-muted-foreground">
                Allow exceeding room capacity by a small percentage in critical situations
              </p>
            </div>
            <Switch
              checked={constraints.allowRoomOverflow}
              onCheckedChange={(checked) => updateConstraint("allowRoomOverflow", checked)}
            />
          </div>

          {constraints.allowRoomOverflow && (
            <div className="ml-6">
              <div className="space-y-2">
                <Label htmlFor="overflowPercentage" className="text-foreground">
                  Maximum Overflow Percentage
                </Label>
                <Input
                  id="overflowPercentage"
                  type="number"
                  value={constraints.overflowPercentage}
                  onChange={(e) => updateConstraint("overflowPercentage", Number.parseInt(e.target.value))}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Users className="mr-2 h-5 w-5" />
            Multi-Shift Configuration
          </CardTitle>
          <CardDescription className="text-muted-foreground">Configure multiple shift scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Enable Multi-Shift Scheduling</Label>
              <p className="text-sm text-muted-foreground">Allow scheduling across morning and evening shifts</p>
            </div>
            <Switch
              checked={constraints.enableMultiShift}
              onCheckedChange={(checked) => updateConstraint("enableMultiShift", checked)}
            />
          </div>

          {constraints.enableMultiShift && (
            <div className="ml-6">
              <div className="space-y-2">
                <Label htmlFor="shiftGap" className="text-foreground">
                  Gap Between Shifts (minutes)
                </Label>
                <Input
                  id="shiftGap"
                  type="number"
                  value={constraints.shiftGap}
                  onChange={(e) => updateConstraint("shiftGap", Number.parseInt(e.target.value))}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
