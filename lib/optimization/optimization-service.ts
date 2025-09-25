/**
 * Optimization Service - Integration layer for genetic algorithm
 */

import { GeneticAlgorithmOptimizer, DEFAULT_GA_CONFIG, type TimetableSolution } from './genetic-algorithm'
import type { 
  Course, 
  Instructor, 
  Room, 
  TimeSlot, 
  Constraint 
} from '@/lib/types/timetabling'

export interface OptimizationRequest {
  department: string
  semester: string
  batchSize: number
  subjects: string[]
  optimizationGoals: string[]
  maxIterations: number
  timeLimit: number
}

export interface OptimizationResult {
  id: string
  name: string
  score: number
  conflicts: number
  utilization: number
  facultyWorkload: number
  status: "optimal" | "good" | "acceptable" | "infeasible"
  schedule: any[]
  violations: any[]
  generationDetails: {
    totalGenerations: number
    convergenceGeneration: number
    finalFitness: number
  }
}

export class OptimizationService {
  /**
   * Generate optimized timetables using genetic algorithm
   */
  public static async generateTimetables(
    config: OptimizationRequest,
    resources: {
      courses: Course[]
      instructors: Instructor[]
      rooms: Room[]
      timeSlots: TimeSlot[]
      constraints: Constraint[]
    },
    onProgress?: (progress: number, step: string) => void
  ): Promise<OptimizationResult[]> {
    
    console.log('[OptimizationService] Starting timetable generation...')
    onProgress?.(0, 'Initializing optimization engine...')
    
    // Configure genetic algorithm
    const gaConfig = {
      ...DEFAULT_GA_CONFIG,
      generations: config.maxIterations || 50, // Reduced default
      maxRuntime: (config.timeLimit || 180) * 1000, // Convert to milliseconds - reduced default
      populationSize: Math.min(30, Math.max(15, Math.floor(resources.courses.length / 3)))
    }
    
    // Filter resources based on department and semester
    const filteredResources = this.filterResources(resources, config.department, config.semester)
    
    onProgress?.(10, 'Filtering resources and constraints...')
    
    // Validate resources
    if (!this.validateResources(filteredResources)) {
      return [{
        id: 'infeasible-1',
        name: 'Infeasible Solution',
        score: 0,
        conflicts: Number.MAX_SAFE_INTEGER,
        utilization: 0,
        facultyWorkload: 0,
        status: 'infeasible',
        schedule: [],
        violations: [
          {
            type: 'resource_shortage',
            severity: 'hard',
            description: 'Insufficient resources to generate feasible timetable',
            penalty: Number.MAX_SAFE_INTEGER
          }
        ],
        generationDetails: {
          totalGenerations: 0,
          convergenceGeneration: 0,
          finalFitness: 0
        }
      }]
    }
    
    onProgress?.(20, 'Initializing genetic algorithm...')
    
    // Create and configure optimizer
    const optimizer = new GeneticAlgorithmOptimizer(gaConfig, filteredResources)
    
    // Track optimization progress
    let lastGeneration = 0
    const solutions = await optimizer.optimize((progress, generation, bestFitness) => {
      lastGeneration = generation
      const step = `Generation ${generation}: Best fitness ${(bestFitness * 100).toFixed(1)}%`
      onProgress?.(20 + (progress * 0.7), step) // 20-90% for optimization
    })
    
    onProgress?.(90, 'Processing results...')
    
    // Convert solutions to result format
    const results = solutions.map((solution, index) => 
      this.convertSolutionToResult(solution, index, lastGeneration)
    )
    
    onProgress?.(100, 'Optimization complete!')
    
    console.log(`[OptimizationService] Generated ${results.length} timetable options`)
    return results
  }
  
  /**
   * Filter resources based on department and semester
   */
  private static filterResources(
    resources: {
      courses: Course[]
      instructors: Instructor[]
      rooms: Room[]
      timeSlots: TimeSlot[]
      constraints: Constraint[]
    },
    department: string,
    semester: string
  ) {
    // Filter courses by department and semester
    const filteredCourses = resources.courses.filter(course => 
      course.departmentId === department && 
      course.semester === parseInt(semester)
    )
    
    // Filter instructors by department
    const filteredInstructors = resources.instructors.filter(instructor => 
      instructor.departmentId === department
    )
    
    // Use all available rooms and time slots
    return {
      courses: filteredCourses,
      instructors: filteredInstructors,
      rooms: resources.rooms,
      timeSlots: resources.timeSlots,
      constraints: resources.constraints
    }
  }
  
  /**
   * Validate that we have sufficient resources
   */
  private static validateResources(resources: any): boolean {
    return resources.courses.length > 0 && 
           resources.instructors.length > 0 && 
           resources.rooms.length > 0 && 
           resources.timeSlots.length > 0
  }
  
  /**
   * Convert genetic algorithm solution to result format
   */
  private static convertSolutionToResult(
    solution: TimetableSolution, 
    index: number,
    totalGenerations: number
  ): OptimizationResult {
    // Determine status based on score and conflicts
    let status: "optimal" | "good" | "acceptable" | "infeasible" = "infeasible"
    
    if (solution.score >= 85 && solution.conflicts === 0) {
      status = "optimal"
    } else if (solution.score >= 70 && solution.conflicts <= 3) {
      status = "good"  
    } else if (solution.score >= 55 && solution.conflicts <= 7) {
      status = "acceptable"
    }
    
    return {
      id: solution.id,
      name: `Optimized Timetable ${index + 1}`,
      score: solution.score,
      conflicts: solution.conflicts,
      utilization: solution.utilization,
      facultyWorkload: solution.facultyWorkload,
      status,
      schedule: solution.schedule,
      violations: solution.violations,
      generationDetails: {
        totalGenerations,
        convergenceGeneration: solution.generation,
        finalFitness: solution.fitness
      }
    }
  }
  
  /**
   * Generate default time slots
   */
  public static generateDefaultTimeSlots(): TimeSlot[] {
    const timeSlots: TimeSlot[] = []
    const days = [1, 2, 3, 4, 5] // Monday to Friday
    const periods = [
      { start: '09:00', end: '10:00', period: 1 },
      { start: '10:15', end: '11:15', period: 2 },
      { start: '11:30', end: '12:30', period: 3 },
      { start: '13:30', end: '14:30', period: 4 },
      { start: '14:45', end: '15:45', period: 5 },
      { start: '16:00', end: '17:00', period: 6 }
    ]
    
    days.forEach(day => {
      periods.forEach(period => {
        timeSlots.push({
          id: `slot-${day}-${period.period}`,
          dayOfWeek: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          startTime: period.start,
          endTime: period.end,
          duration: 60, // 60 minutes
          period: period.period
        })
      })
    })
    
    return timeSlots
  }
  
  /**
   * Validate optimization configuration
   */
  public static validateOptimizationConfig(config: OptimizationRequest): string[] {
    const errors: string[] = []
    
    if (!config.department) {
      errors.push('Department is required')
    }
    
    if (!config.semester) {
      errors.push('Semester is required')
    }
    
    if (config.batchSize <= 0) {
      errors.push('Batch size must be greater than 0')
    }
    
    if (config.maxIterations < 10 || config.maxIterations > 1000) {
      errors.push('Max iterations must be between 10 and 1000')
    }
    
    if (config.timeLimit < 30 || config.timeLimit > 1800) {
      errors.push('Time limit must be between 30 seconds and 30 minutes')
    }
    
    return errors
  }
}