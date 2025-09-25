"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, Calendar, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Instructor, Department, InstructorFormData } from "@/lib/types/timetabling"

export function FacultyManager() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const { toast } = useToast()

  const [instructorForm, setInstructorForm] = useState<InstructorFormData>({
    employeeId: "",
    name: "",
    email: "",
    departmentId: "",
    designation: "lecturer",
    specializations: [],
    maxHoursPerWeek: 20,
  })

  useEffect(() => {
    const fetchData = async () => {
      console.log("[v0] Fetching instructors and departments from API...")
      setIsLoading(true)

      try {
        const [instructorResponse, deptResponse] = await Promise.all([
          fetch("/api/instructors"),
          fetch("/api/departments"),
        ])

        const instructorData = await instructorResponse.json()
        const deptData = await deptResponse.json()

        if (instructorData.success) {
          setInstructors(instructorData.data)
        }

        if (deptData.success) {
          setDepartments(deptData.data)
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
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleAddInstructor = async () => {
    console.log("[v0] Adding new instructor:", instructorForm)

    if (!instructorForm.name || !instructorForm.email || !instructorForm.departmentId || !instructorForm.employeeId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/instructors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instructorForm),
      })

      const data = await response.json()

      if (data.success) {
        setInstructors((prev) => [...prev, data.data])
        setInstructorForm({
          employeeId: "",
          name: "",
          email: "",
          departmentId: "",
          designation: "lecturer",
          specializations: [],
          maxHoursPerWeek: 20,
        })
        setIsAddDialogOpen(false)
        toast({
          title: "Instructor Added",
          description: `${data.data.name} has been added successfully.`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Error adding instructor:", error)
      toast({
        title: "Error",
        description: "Failed to add instructor. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || instructor.departmentId === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find((d) => d.id === departmentId)
    return dept ? dept.name : "Unknown Department"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading instructors...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Faculty Management</h2>
          <p className="text-muted-foreground">Manage faculty members and their teaching constraints</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Instructor</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the details for the new instructor
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-foreground">
                    Employee ID
                  </Label>
                  <Input
                    id="employeeId"
                    value={instructorForm.employeeId}
                    onChange={(e) => setInstructorForm({ ...instructorForm, employeeId: e.target.value })}
                    placeholder="EMP001"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={instructorForm.name}
                    onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                    placeholder="Dr. John Smith"
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={instructorForm.email}
                  onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                  placeholder="john.smith@university.edu"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-foreground">
                    Department
                  </Label>
                  <Select
                    value={instructorForm.departmentId}
                    onValueChange={(value) => setInstructorForm({ ...instructorForm, departmentId: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-foreground">
                    Designation
                  </Label>
                  <Select
                    value={instructorForm.designation}
                    onValueChange={(value: any) => setInstructorForm({ ...instructorForm, designation: value })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="associate_professor">Associate Professor</SelectItem>
                      <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
                      <SelectItem value="lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specializations" className="text-foreground">
                    Specializations (comma-separated)
                  </Label>
                  <Input
                    id="specializations"
                    value={instructorForm.specializations.join(", ")}
                    onChange={(e) =>
                      setInstructorForm({
                        ...instructorForm,
                        specializations: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s),
                      })
                    }
                    placeholder="Data Structures, Algorithms, Database Systems"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHoursPerWeek" className="text-foreground">
                    Max Hours/Week
                  </Label>
                  <Input
                    id="maxHoursPerWeek"
                    type="number"
                    min="1"
                    max="40"
                    value={instructorForm.maxHoursPerWeek}
                    onChange={(e) =>
                      setInstructorForm({ ...instructorForm, maxHoursPerWeek: Number.parseInt(e.target.value) })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddInstructor}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Instructor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instructors..."
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

      {instructors.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Instructors Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first instructor to the system.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Instructor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Instructors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{instructors.length}</div>
                <p className="text-xs text-muted-foreground">All departments</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Professors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {instructors.filter((i) => i.designation === "professor").length}
                </div>
                <p className="text-xs text-muted-foreground">Senior faculty</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Departments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{departments.length}</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Avg Workload</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {instructors.length > 0
                    ? Math.round(instructors.reduce((sum, i) => sum + i.maxHoursPerWeek, 0) / instructors.length)
                    : 0}
                  h
                </div>
                <p className="text-xs text-muted-foreground">Per week</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Instructor List</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage all instructors and their constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Name</TableHead>
                    <TableHead className="text-foreground">Employee ID</TableHead>
                    <TableHead className="text-foreground">Department</TableHead>
                    <TableHead className="text-foreground">Designation</TableHead>
                    <TableHead className="text-foreground">Specializations</TableHead>
                    <TableHead className="text-foreground">Max Hours</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInstructors.map((instructor) => (
                    <TableRow key={instructor.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        <div>
                          <div>{instructor.name}</div>
                          <div className="text-xs text-muted-foreground">{instructor.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{instructor.employeeId}</TableCell>
                      <TableCell className="text-foreground">{getDepartmentName(instructor.departmentId)}</TableCell>
                      <TableCell className="text-foreground">
                        <Badge variant="outline">{instructor.designation.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {instructor.specializations.slice(0, 2).map((spec, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-border text-muted-foreground"
                            >
                              {spec}
                            </Badge>
                          ))}
                          {instructor.specializations.length > 2 && (
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                              +{instructor.specializations.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{instructor.maxHoursPerWeek}h/week</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
