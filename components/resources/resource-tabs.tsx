"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassroomManager } from "./classroom-manager"
import { LaboratoryManager } from "./laboratory-manager"
import { FacultyManager } from "./faculty-manager"

export function ResourceTabs() {
  return (
    <Tabs defaultValue="classrooms" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-muted">
        <TabsTrigger value="classrooms" className="data-[state=active]:bg-background">
          Classrooms
        </TabsTrigger>
        <TabsTrigger value="laboratories" className="data-[state=active]:bg-background">
          Laboratories
        </TabsTrigger>
        <TabsTrigger value="faculty" className="data-[state=active]:bg-background">
          Faculty
        </TabsTrigger>
      </TabsList>

      <TabsContent value="classrooms">
        <ClassroomManager />
      </TabsContent>

      <TabsContent value="laboratories">
        <LaboratoryManager />
      </TabsContent>

      <TabsContent value="faculty">
        <FacultyManager />
      </TabsContent>
    </Tabs>
  )
}
