"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlobalConstraints } from "./global-constraints"
import { TimeSlotConstraints } from "./time-slot-constraints"
import { PreferenceConstraints } from "./preference-constraints"
import { Save, RefreshCw, AlertTriangle } from "lucide-react"

export function ConstraintConfiguration() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleSave = () => {
    console.log("[v0] Saving constraint configuration")
    // Simulate saving constraints
    setHasUnsavedChanges(false)
    console.log("[v0] Configuration saved successfully")
    alert("Constraint configuration saved successfully!")
  }

  const handleReset = () => {
    console.log("[v0] Resetting constraints to default")
    // Reset to default values
    setHasUnsavedChanges(false)
    console.log("[v0] Configuration reset to defaults")
    alert("Configuration reset to default values!")
  }

  return (
    <div className="space-y-6">
      {hasUnsavedChanges && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                You have unsaved changes. Save your configuration to apply them.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-border text-foreground hover:bg-accent bg-transparent"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="global" className="data-[state=active]:bg-background">
            Global Constraints
          </TabsTrigger>
          <TabsTrigger value="timeslots" className="data-[state=active]:bg-background">
            Time Slots
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-background">
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <GlobalConstraints onUpdate={() => setHasUnsavedChanges(true)} />
        </TabsContent>

        <TabsContent value="timeslots">
          <TimeSlotConstraints onUpdate={() => setHasUnsavedChanges(true)} />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferenceConstraints onUpdate={() => setHasUnsavedChanges(true)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
