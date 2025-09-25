"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Settings, AlertTriangle, CheckCircle, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type {
  Constraint,
  ConstraintFormData,
  ConstraintTemplate,
  ConstraintViolation,
  ConstraintType,
  ConstraintCategory,
} from "@/lib/types/constraints"

export function ConstraintManager() {
  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [templates, setTemplates] = useState<ConstraintTemplate[]>([])
  const [violations, setViolations] = useState<ConstraintViolation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ConstraintTemplate | null>(null)
  const { toast } = useToast()

  const [constraintForm, setConstraintForm] = useState<ConstraintFormData>({
    name: "",
    description: "",
    type: "hard",
    category: "instructor",
    priority: 5,
    isActive: true,
  })

  useEffect(() => {
    const loadData = async () => {
      console.log("[v0] Loading constraints data...")
      setLoading(true)

      try {
        // Load constraint templates
        const templateData: ConstraintTemplate[] = [
          {
            id: "max-hours-per-day",
            name: "Maximum Hours Per Day",
            description: "Limit the maximum teaching hours per day for instructors",
            category: "instructor",
            type: "hard",
            defaultPriority: 8,
            fields: [
              { key: "instructorId", label: "Instructor", type: "select", required: false },
              {
                key: "maxHoursPerDay",
                label: "Max Hours",
                type: "number",
                required: true,
                min: 1,
                max: 12,
                defaultValue: 6,
              },
            ],
          },
          {
            id: "room-capacity",
            name: "Room Capacity Limit",
            description: "Ensure classes don't exceed room capacity",
            category: "room",
            type: "hard",
            defaultPriority: 10,
            fields: [
              { key: "roomId", label: "Room", type: "select", required: false },
              {
                key: "maxCapacityUtilization",
                label: "Max Utilization %",
                type: "number",
                required: true,
                min: 50,
                max: 100,
                defaultValue: 90,
              },
            ],
          },
          {
            id: "lunch-break",
            name: "Lunch Break",
            description: "Ensure lunch break time is protected",
            category: "time",
            type: "hard",
            defaultPriority: 9,
            fields: [
              { key: "lunchBreakStart", label: "Start Time", type: "time", required: true, defaultValue: "12:00" },
              { key: "lunchBreakEnd", label: "End Time", type: "time", required: true, defaultValue: "13:00" },
            ],
          },
          {
            id: "consecutive-classes",
            name: "Maximum Consecutive Classes",
            description: "Limit consecutive classes for students",
            category: "student",
            type: "soft",
            defaultPriority: 6,
            fields: [
              { key: "batchId", label: "Batch", type: "select", required: false },
              {
                key: "maxConsecutiveHours",
                label: "Max Consecutive Hours",
                type: "number",
                required: true,
                min: 1,
                max: 6,
                defaultValue: 3,
              },
            ],
          },
        ]
        setTemplates(templateData)

        // Simulate loading existing constraints
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setConstraints([])
        setViolations([])

        console.log("[v0] Constraints data loaded successfully")
      } catch (error) {
        console.error("[v0] Error loading constraints:", error)
        toast({
          title: "Error",
          description: "Failed to load constraints. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [toast])

  const handleAddConstraint = async () => {
    console.log("[v0] Adding new constraint:", constraintForm)

    if (!constraintForm.name || !constraintForm.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const newConstraint: Constraint = {
        id: Date.now().toString(),
        ...constraintForm,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Constraint

      setConstraints((prev) => [...prev, newConstraint])
      setConstraintForm({
        name: "",
        description: "",
        type: "hard",
        category: "instructor",
        priority: 5,
        isActive: true,
      })
      setIsAddDialogOpen(false)
      setSelectedTemplate(null)

      toast({
        title: "Constraint Added",
        description: `${newConstraint.name} has been added successfully.`,
      })
    } catch (error) {
      console.error("[v0] Error adding constraint:", error)
      toast({
        title: "Error",
        description: "Failed to add constraint. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTemplateSelect = (template: ConstraintTemplate) => {
    setSelectedTemplate(template)
    setConstraintForm({
      name: template.name,
      description: template.description,
      type: template.type,
      category: template.category,
      priority: template.defaultPriority,
      isActive: true,
      // Set default values from template
      ...template.fields.reduce((acc, field) => {
        if (field.defaultValue !== undefined) {
          acc[field.key] = field.defaultValue
        }
        return acc
      }, {} as any),
    })
  }

  const toggleConstraint = (id: string) => {
    setConstraints((prev) =>
      prev.map((constraint) =>
        constraint.id === id ? { ...constraint, isActive: !constraint.isActive, updatedAt: new Date() } : constraint,
      ),
    )
  }

  const filteredConstraints = constraints.filter((constraint) => {
    const matchesSearch =
      constraint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      constraint.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || constraint.category === selectedCategory
    const matchesType = selectedType === "all" || constraint.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const getConstraintTypeColor = (type: ConstraintType) => {
    return type === "hard"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  }

  const getCategoryColor = (category: ConstraintCategory) => {
    const colors = {
      instructor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      room: "bg-green-500/20 text-green-400 border-green-500/30",
      course: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      time: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      student: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      institutional: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[category] || colors.institutional
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
            <CardTitle className="text-sm font-medium">Total Constraints</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constraints.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constraints.filter((c) => c.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hard Constraints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constraints.filter((c) => c.type === "hard").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{violations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search constraints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
            <SelectItem value="room">Room</SelectItem>
            <SelectItem value="course">Course</SelectItem>
            <SelectItem value="time">Time</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="institutional">Institutional</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
            <SelectItem value="soft">Soft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="constraints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="constraints" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Constraint Rules</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Constraint
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Constraint</DialogTitle>
                  <DialogDescription>Create a new constraint rule for the timetabling system.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Constraint Name</Label>
                      <Input
                        id="name"
                        value={constraintForm.name}
                        onChange={(e) => setConstraintForm({ ...constraintForm, name: e.target.value })}
                        placeholder="e.g., Maximum Teaching Hours"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={constraintForm.priority}
                        onChange={(e) =>
                          setConstraintForm({ ...constraintForm, priority: Number.parseInt(e.target.value) })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Constraint Type</Label>
                      <Select
                        value={constraintForm.type}
                        onValueChange={(value: ConstraintType) => setConstraintForm({ ...constraintForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hard">Hard (Must satisfy)</SelectItem>
                          <SelectItem value="soft">Soft (Prefer to satisfy)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={constraintForm.category}
                        onValueChange={(value: ConstraintCategory) =>
                          setConstraintForm({ ...constraintForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="room">Room</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="time">Time</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="institutional">Institutional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={constraintForm.description}
                      onChange={(e) => setConstraintForm({ ...constraintForm, description: e.target.value })}
                      placeholder="Describe what this constraint does..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={constraintForm.isActive}
                      onCheckedChange={(checked) => setConstraintForm({ ...constraintForm, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  {/* Dynamic fields based on selected template */}
                  {selectedTemplate && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Template Fields</h4>
                      {selectedTemplate.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={field.key}>{field.label}</Label>
                          {field.type === "number" && (
                            <Input
                              id={field.key}
                              type="number"
                              min={field.min}
                              max={field.max}
                              value={constraintForm[field.key] || field.defaultValue || ""}
                              onChange={(e) =>
                                setConstraintForm({
                                  ...constraintForm,
                                  [field.key]: Number.parseInt(e.target.value),
                                })
                              }
                              required={field.required}
                            />
                          )}
                          {field.type === "time" && (
                            <Input
                              id={field.key}
                              type="time"
                              value={constraintForm[field.key] || field.defaultValue || ""}
                              onChange={(e) =>
                                setConstraintForm({
                                  ...constraintForm,
                                  [field.key]: e.target.value,
                                })
                              }
                              required={field.required}
                            />
                          )}
                          {field.type === "text" && (
                            <Input
                              id={field.key}
                              value={constraintForm[field.key] || field.defaultValue || ""}
                              onChange={(e) =>
                                setConstraintForm({
                                  ...constraintForm,
                                  [field.key]: e.target.value,
                                })
                              }
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddConstraint}>Add Constraint</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {constraints.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No constraints found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by adding your first constraint rule.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Constraint
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConstraints.map((constraint) => (
                    <TableRow key={constraint.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{constraint.name}</div>
                          <div className="text-sm text-muted-foreground">{constraint.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getConstraintTypeColor(constraint.type)}>{constraint.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(constraint.category)}>{constraint.category}</Badge>
                      </TableCell>
                      <TableCell>{constraint.priority}</TableCell>
                      <TableCell>
                        <Switch checked={constraint.isActive} onCheckedChange={() => toggleConstraint(constraint.id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getConstraintTypeColor(template.type)}>{template.type}</Badge>
                      <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      handleTemplateSelect(template)
                      setIsAddDialogOpen(true)
                    }}
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          {violations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No violations found</h3>
                <p className="text-muted-foreground text-center">All constraints are currently satisfied.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {violations.map((violation) => (
                <Card key={violation.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{violation.constraintName}</h4>
                        <p className="text-sm text-muted-foreground">{violation.description}</p>
                        {violation.suggestedFix && (
                          <p className="text-sm text-blue-600 mt-2">
                            <strong>Suggested fix:</strong> {violation.suggestedFix}
                          </p>
                        )}
                      </div>
                      <Badge variant={violation.severity === "critical" ? "destructive" : "secondary"}>
                        {violation.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
