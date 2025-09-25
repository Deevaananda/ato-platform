"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FlaskConical } from "lucide-react"

interface Laboratory {
  id: string
  name: string
  type: string
  capacity: number
  building: string
  floor: number
  equipment: string[]
  specialization: string
  status: "available" | "in_use" | "maintenance"
}

export function LaboratoryManager() {
  // TODO: Load laboratory data from database
  const [laboratories, setLaboratories] = useState<Laboratory[]>([])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laboratory Management</h1>
          <p className="text-muted-foreground">
            Manage laboratory resources, equipment, and scheduling
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Add Laboratory
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Laboratories</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage laboratory spaces and their equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="rounded-lg border-2 border-dashed border-border p-8">
              <FlaskConical className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Laboratories</h3>
              <p className="text-muted-foreground mb-4">
                Add laboratories to manage equipment and lab schedules.
              </p>
              <p className="text-sm text-muted-foreground">
                Connect to the database to load laboratory data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}