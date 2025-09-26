"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MapPin } from "lucide-react"

interface TimetableEntry {
  id: string
  time: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
}

export function TimetableViewer() {
  // TODO: Load timetable data from API
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([])
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState("Computer Science")

  const timetableConfig = {
    department: selectedDepartment,
    week: selectedWeek,
    timetable: timetableData,
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00", 
    "11:30-12:30",
    "12:30-13:30",
    "13:30-14:30"
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Timetable Viewer</h1>
          <p className="text-muted-foreground">
            View and manage class schedules and timetables
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            Generate Timetable
          </Button>
        </div>
      </div>

      {/* Timetable Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Timetable - {selectedDepartment}
          </CardTitle>
          <CardDescription>
            View the current week&rsquo;s class schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timetableData.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Timetable Data</h3>
              <p className="text-muted-foreground mb-4">
                Generate a timetable to view the weekly schedule.
              </p>
              <p className="text-sm text-muted-foreground">
                Connect to the database to load timetable data.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted font-semibold text-left">
                      Time
                    </th>
                    {days.map((day) => (
                      <th key={day} className="border border-border p-2 bg-muted font-semibold text-center min-w-[120px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetableData.map((entry) => (
                    <tr key={entry.id}>
                      <td className="border border-border p-2 font-medium bg-muted/50">
                        {entry.time}
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {entry.monday && (
                          <div className="bg-blue-100 p-2 rounded text-blue-800 whitespace-pre-line">
                            {entry.monday}
                          </div>
                        )}
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {entry.tuesday && (
                          <div className="bg-green-100 p-2 rounded text-green-800 whitespace-pre-line">
                            {entry.tuesday}
                          </div>
                        )}
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {entry.wednesday && (
                          <div className="bg-purple-100 p-2 rounded text-purple-800 whitespace-pre-line">
                            {entry.wednesday}
                          </div>
                        )}
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {entry.thursday && (
                          <div className="bg-orange-100 p-2 rounded text-orange-800 whitespace-pre-line">
                            {entry.thursday}
                          </div>
                        )}
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {entry.friday && (
                          <div className="bg-red-100 p-2 rounded text-red-800 whitespace-pre-line">
                            {entry.friday}
                          </div>
                        )}
                      </td>
                      <td className="border border-border p-2 text-sm">
                        {entry.saturday && (
                          <div className="bg-yellow-100 p-2 rounded text-yellow-800 whitespace-pre-line">
                            {entry.saturday}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}