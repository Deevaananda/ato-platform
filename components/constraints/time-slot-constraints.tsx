"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Plus, Settings } from "lucide-react"

interface TimeSlot {
  id: string
  name: string
  startTime: string
  endTime: string
  duration: number
  type: 'regular' | 'lab' | 'break'
  daysOfWeek: string[]
}

interface FixedSlot {
  id: string
  subject: string
  faculty: string
  room: string
  timeSlot: string
  dayOfWeek: string
  batch: string
}

interface TimeSlotConstraintsProps {
  onUpdate: () => void
}

export function TimeSlotConstraints({ onUpdate }: TimeSlotConstraintsProps) {
  // TODO: Load time slot data from API
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [fixedSlots, setFixedSlots] = useState<FixedSlot[]>([])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Time Slot Constraints</h2>
          <p className="text-muted-foreground">
            Configure time slots, breaks, and fixed scheduling constraints
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Time Slot
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Slots
          </CardTitle>
          <CardDescription>
            Define available time periods for scheduling classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Time Slots</h3>
            <p className="text-muted-foreground mb-4">
              Add time slots to define when classes can be scheduled.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load time slot configurations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Fixed Slots
          </CardTitle>
          <CardDescription>
            Non-negotiable time slots that cannot be moved or changed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Fixed Slots</h3>
            <p className="text-muted-foreground mb-4">
              Add fixed slots for assemblies, breaks, or permanent bookings.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load fixed slot data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}