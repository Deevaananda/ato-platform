"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepartmentManager } from "./department-manager"
import { SubjectManager } from "./subject-manager"
import { ClassroomManager } from "./classroom-manager"
import { LaboratoryManager } from "./laboratory-manager"
import { FacultyManager } from "./faculty-manager"

export function ResourceTabs() {
  return (
    <Tabs defaultValue="departments" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 bg-muted">
        <TabsTrigger value="departments" className="data-[state=active]:bg-background">
          Departments
        </TabsTrigger>
        <TabsTrigger value="subjects" className="data-[state=active]:bg-background">
          Subjects
        </TabsTrigger>
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

      <TabsContent value="departments">
        <DepartmentManager />
      </TabsContent>

      <TabsContent value="subjects">
        <SubjectManager />
      </TabsContent>

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
