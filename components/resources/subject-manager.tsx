"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, BookOpen, Clock, Edit, Trash2, Search, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Course, Department, CourseFormData } from "@/lib/types/timetabling"

export function SubjectManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const { toast } = useToast()

  const [courseForm, setCourseForm] = useState<CourseFormData>({
    code: "",
    name: "",
    departmentId: "",
    credits: 3,
    semester: 1,
    year: 1,
    type: "core",
    description: "",
    prerequisites: [],
    maxStudents: 60,
  })

  useEffect(() => {
    const loadData = async () => {
      console.log("[v0] Loading courses and departments data...")
      setLoading(true)

      try {
        const [deptResponse, courseResponse] = await Promise.all([fetch("/api/departments"), fetch("/api/courses")])

        const deptData = await deptResponse.json()
        const courseData = await courseResponse.json()

        if (deptData.success) {
          setDepartments(deptData.data)
        }

        if (courseData.success) {
          setCourses(courseData.data)
        }

        console.log("[v0] Data loaded successfully")
      } catch (error) {
        console.error("[v0] Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [toast])

  const handleAddCourse = async () => {
    console.log("[v0] Adding new course:", courseForm)

    if (!courseForm.code || !courseForm.name || !courseForm.departmentId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseForm),
      })

      const data = await response.json()

      if (data.success) {
        setCourses((prev) => [...prev, data.data])
        setCourseForm({
          code: "",
          name: "",
          departmentId: "",
          credits: 3,
          semester: 1,
          year: 1,
          type: "core",
          description: "",
          prerequisites: [],
          maxStudents: 60,
        })
        setIsAddCourseOpen(false)
        toast({
          title: "Course Added",
          description: `${data.data.name} has been added successfully.`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Error adding course:", error)
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || course.departmentId === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find((d) => d.id === departmentId)
    return dept ? dept.name : "Unknown Department"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.credits, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.filter((c) => c.type === "core").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Course Management */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Course Management</h3>
        <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Enter the details for the new course.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    placeholder="e.g., CSE101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                    placeholder="e.g., Data Structures"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="6"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: Number.parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={courseForm.semester.toString()}
                    onValueChange={(value) => setCourseForm({ ...courseForm, semester: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={courseForm.year.toString()}
                    onValueChange={(value) => setCourseForm({ ...courseForm, year: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Course Type</Label>
                  <Select
                    value={courseForm.type}
                    onValueChange={(value: any) => setCourseForm({ ...courseForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="elective">Elective</SelectItem>
                      <SelectItem value="lab">Lab</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={courseForm.departmentId}
                    onValueChange={(value) => setCourseForm({ ...courseForm, departmentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Maximum Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  value={courseForm.maxStudents}
                  onChange={(e) => setCourseForm({ ...courseForm, maxStudents: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course description..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddCourseOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCourse}>Add Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first course to the system.
            </p>
            <Button onClick={() => setIsAddCourseOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Max Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.type === "core" ? "default" : course.type === "elective" ? "secondary" : "outline"
                      }
                    >
                      {course.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    Sem {course.semester}, Year {course.year}
                  </TableCell>
                  <TableCell>{getDepartmentName(course.departmentId)}</TableCell>
                  <TableCell>{course.maxStudents}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
