"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, BookOpen, Network } from "lucide-react"

interface Department {
  id: string
  name: string
  code: string
  faculty: number
  courses: number
  students: number
}

interface SharedCourse {
  id: string
  code: string
  name: string
  departments: string[]
  enrollments: number
}

interface SharedResource {
  id: string
  type: 'laboratory' | 'classroom' | 'equipment'
  name: string
  departments: string[]
  utilization: number
}

interface Collaboration {
  id: string
  title: string
  departments: string[]
  type: 'research' | 'course' | 'event'
  status: 'active' | 'planned' | 'completed'
}

export function MultiDepartmentManager() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [sharedCourses, setSharedCourses] = useState<SharedCourse[]>([])
  const [sharedResources, setSharedResources] = useState<SharedResource[]>([])
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Multi-Department Management</h1>
          <p className="text-muted-foreground">
            Coordinate resources and collaborations across departments
          </p>
        </div>
        <Button>
          Add Department
        </Button>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department Overview
          </CardTitle>
          <CardDescription>
            Overview of all departments and their metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Departments</h3>
            <p className="text-muted-foreground mb-4">
              Add departments to start managing multi-department coordination.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load department data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Shared Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Shared Courses
          </CardTitle>
          <CardDescription>
            Courses shared across multiple departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Shared Courses</h3>
            <p className="text-muted-foreground mb-4">
              Interdisciplinary courses will appear here.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load shared course data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Shared Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Shared Resources
          </CardTitle>
          <CardDescription>
            Laboratories, equipment, and facilities shared across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Shared Resources</h3>
            <p className="text-muted-foreground mb-4">
              Shared resources and facilities will appear here.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load shared resource data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Collaborations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Department Collaborations
          </CardTitle>
          <CardDescription>
            Research and academic collaborations between departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Network className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Collaborations</h3>
            <p className="text-muted-foreground mb-4">
              Inter-departmental collaborations will appear here.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect to the database to load collaboration data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}