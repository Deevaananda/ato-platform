"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Settings, AlertTriangle, CheckCircle, Clock, Users, Building } from "lucide-react"

interface GenerationConfig {
  department: string
  semester: string
  batchSize: number
  subjects: string[]
  optimizationGoals: string[]
  maxIterations: number
  timeLimit: number
}

interface GenerationResult {
  id: string
  name: string
  score: number
  conflicts: number
  utilization: number
  facultyWorkload: number
  status: "optimal" | "good" | "acceptable" | "infeasible"
}

interface Department {
  id: string
  name: string
}

export function TimetableGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [generatedOptions, setGeneratedOptions] = useState<GenerationResult[]>([])
  const [showInfeasibilityReport, setShowInfeasibilityReport] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [config, setConfig] = useState<GenerationConfig>({
    department: "",
    semester: "",
    batchSize: 0, // To be configured by user
    subjects: [],
    optimizationGoals: ["maximize_utilization", "minimize_conflicts"],
    maxIterations: 50, // Reduced default for efficiency
    timeLimit: 180, // Reduced default for efficiency (3 minutes)
  })

  useEffect(() => {
    const loadDepartments = async () => {
      setIsLoading(true)
      try {
        const { DepartmentService, initializeDatabase } = await import("@/lib/database/database-service")
        
        // Initialize database if needed
        await initializeDatabase()
        
        // Load departments
        const depts = await DepartmentService.getAll()
        setDepartments(depts)
      } catch (error) {
        console.error("Failed to load departments:", error)
        setDepartments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDepartments()
  }, [])

  const handleGenerate = async () => {
    console.log("[v0] Starting timetable generation with config:", config)

    if (!config.department || !config.semester) {
      console.log("[v0] Missing required configuration")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedOptions([])
    setShowInfeasibilityReport(false)

    try {
      // Import optimization service
      const { OptimizationService } = await import("@/lib/optimization/optimization-service")
      const { 
        DepartmentService, 
        CourseService, 
        InstructorService, 
        RoomService, 
        TimeSlotService 
      } = await import("@/lib/database/database-service")
      
      // Load resources from database
      const [departments, courses, instructors, rooms, timeSlots] = await Promise.all([
        DepartmentService.getAll(),
        CourseService.getAll(),
        InstructorService.getAll(), 
        RoomService.getAll(),
        TimeSlotService.getAll()
      ])
      
      // Prepare optimization request
      const optimizationRequest = {
        department: config.department,
        semester: config.semester,
        batchSize: config.batchSize,
        subjects: config.subjects,
        optimizationGoals: config.optimizationGoals,
        maxIterations: config.maxIterations,
        timeLimit: config.timeLimit
      }
      
      // Run optimization
      const results = await OptimizationService.generateTimetables(
        optimizationRequest,
        {
          courses,
          instructors,
          rooms,
          timeSlots,
          constraints: [] // TODO: Load constraints from database
        },
        (progress, step) => {
          setGenerationProgress(progress)
          setCurrentStep(step)
        }
      )
      
      // Convert results to expected format
      const formattedOptions = results.map(result => ({
        id: result.id,
        name: result.name,
        score: result.score,
        conflicts: result.conflicts,
        utilization: result.utilization,
        facultyWorkload: result.facultyWorkload,
        status: result.status as "optimal" | "good" | "acceptable" | "infeasible"
      }))
      
      setGeneratedOptions(formattedOptions)
      
      // Show infeasibility report if needed
      if (results.some(r => r.status === 'infeasible')) {
        setShowInfeasibilityReport(true)
      }
      
    } catch (error) {
      console.error("[v0] Error during optimization:", error)
      setShowInfeasibilityReport(true)
    } finally {
      setIsGenerating(false)
      setCurrentStep("Generation completed!")
      console.log("[v0] Timetable generation completed")
    }
  }

  const handleSelectOption = (optionId: string) => {
    console.log("[v0] Selected timetable option:", optionId)
    const selectedOption = generatedOptions.find((opt) => opt.id === optionId)
    if (selectedOption) {
      console.log("[v0] Selected option details:", selectedOption)
      // In a real implementation, this would save the selected timetable
      alert(
        `Selected: ${selectedOption.name}\nScore: ${selectedOption.score}%\nThis timetable will be saved for review.`,
      )
    }
  }

  const handleViewDetails = (optionId: string) => {
    console.log("[v0] Viewing details for option:", optionId)
    const option = generatedOptions.find((opt) => opt.id === optionId)
    if (option) {
      console.log("[v0] Option details:", option)
      // In a real implementation, this would open a detailed view
      alert(
        `Viewing details for: ${option.name}\n\nMetrics:\n- Score: ${option.score}%\n- Conflicts: ${option.conflicts}\n- Utilization: ${option.utilization}%\n- Faculty Workload: ${option.facultyWorkload}%`,
      )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "acceptable":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "infeasible":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading departments...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Settings className="mr-2 h-5 w-5" />
            Generation Configuration
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure parameters for timetable generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-foreground">
                Department
              </Label>
              <Select value={config.department} onValueChange={(value) => setConfig({ ...config, department: value })}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {departments.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No departments available. Please add departments first.
                    </div>
                  ) : (
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester" className="text-foreground">
                Semester
              </Label>
              <Select value={config.semester} onValueChange={(value) => setConfig({ ...config, semester: value })}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Array.from({ length: 8 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Semester {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchSize" className="text-foreground">
              Batch Size
            </Label>
            <Input
              id="batchSize"
              type="number"
              value={config.batchSize}
              onChange={(e) => setConfig({ ...config, batchSize: Number.parseInt(e.target.value) })}
              className="bg-input border-border text-foreground"
              placeholder="Enter batch size"
            />
          </div>

          <Separator className="bg-border" />

          <div className="space-y-3">
            <Label className="text-foreground">Optimization Goals</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maximize_utilization"
                  checked={config.optimizationGoals.includes("maximize_utilization")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setConfig({
                        ...config,
                        optimizationGoals: [...config.optimizationGoals, "maximize_utilization"],
                      })
                    } else {
                      setConfig({
                        ...config,
                        optimizationGoals: config.optimizationGoals.filter((goal) => goal !== "maximize_utilization"),
                      })
                    }
                  }}
                />
                <Label htmlFor="maximize_utilization" className="text-sm text-foreground">
                  Maximize Room Utilization
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="minimize_conflicts"
                  checked={config.optimizationGoals.includes("minimize_conflicts")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setConfig({
                        ...config,
                        optimizationGoals: [...config.optimizationGoals, "minimize_conflicts"],
                      })
                    } else {
                      setConfig({
                        ...config,
                        optimizationGoals: config.optimizationGoals.filter((goal) => goal !== "minimize_conflicts"),
                      })
                    }
                  }}
                />
                <Label htmlFor="minimize_conflicts" className="text-sm text-foreground">
                  Minimize Conflicts
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="balance_workload"
                  checked={config.optimizationGoals.includes("balance_workload")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setConfig({
                        ...config,
                        optimizationGoals: [...config.optimizationGoals, "balance_workload"],
                      })
                    } else {
                      setConfig({
                        ...config,
                        optimizationGoals: config.optimizationGoals.filter((goal) => goal !== "balance_workload"),
                      })
                    }
                  }}
                />
                <Label htmlFor="balance_workload" className="text-sm text-foreground">
                  Balance Faculty Workload
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="respect_preferences"
                  checked={config.optimizationGoals.includes("respect_preferences")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setConfig({
                        ...config,
                        optimizationGoals: [...config.optimizationGoals, "respect_preferences"],
                      })
                    } else {
                      setConfig({
                        ...config,
                        optimizationGoals: config.optimizationGoals.filter((goal) => goal !== "respect_preferences"),
                      })
                    }
                  }}
                />
                <Label htmlFor="respect_preferences" className="text-sm text-foreground">
                  Respect Preferences
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxIterations" className="text-foreground">
                Max Iterations
              </Label>
              <Input
                id="maxIterations"
                type="number"
                value={config.maxIterations}
                onChange={(e) => setConfig({ ...config, maxIterations: Number.parseInt(e.target.value) })}
                className="bg-input border-border text-foreground"
                placeholder="Enter max iterations"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeLimit" className="text-foreground">
                Time Limit (seconds)
              </Label>
              <Input
                id="timeLimit"
                type="number"
                value={config.timeLimit}
                onChange={(e) => setConfig({ ...config, timeLimit: Number.parseInt(e.target.value) })}
                className="bg-input border-border text-foreground"
                placeholder="Enter time limit"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !config.department || !config.semester || departments.length === 0}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Zap className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Timetable Options"}
          </Button>

          {departments.length === 0 && (
            <Alert className="border-yellow-500/30 bg-yellow-500/5">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400">
                No departments found. Please add departments in the Resources section before generating timetables.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isGenerating && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Clock className="mr-2 h-5 w-5" />
              Generation Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{currentStep}</span>
                <span className="text-muted-foreground">{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {generatedOptions.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <CheckCircle className="mr-2 h-5 w-5" />
              Generated Timetable Options
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Multiple optimized timetables based on your constraints
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedOptions.map((option) => (
              <Card key={option.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{option.name}</h3>
                      <Badge className={getStatusColor(option.status)}>{option.status}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{option.score}%</div>
                      <div className="text-sm text-muted-foreground">Overall Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">Conflicts</span>
                      </div>
                      <div className="text-xl font-semibold text-foreground">{option.conflicts}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Building className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">Utilization</span>
                      </div>
                      <div className="text-xl font-semibold text-foreground">{option.utilization}%</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm text-muted-foreground">Faculty Load</span>
                      </div>
                      <div className="text-xl font-semibold text-foreground">{option.facultyWorkload}%</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
                      onClick={() => handleViewDetails(option.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleSelectOption(option.id)}
                    >
                      Select This Option
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {generatedOptions.length === 0 && !isGenerating && (
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Timetables Generated</h3>
              <p className="text-muted-foreground">
                Configure your parameters and click "Generate Timetable Options" to create optimized timetables.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {showInfeasibilityReport && (
        <Alert className="border-yellow-500/30 bg-yellow-500/5">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-400">
            <strong>Infeasibility Detected:</strong> Some constraints cannot be satisfied with current resources.
            Consider adjusting room capacity, faculty availability, or relaxing time constraints.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
