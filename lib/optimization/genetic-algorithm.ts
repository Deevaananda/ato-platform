/**
 * Genetic Algorithm Implementation for Timetable Optimization
 * Based on evolutionary principles to find optimal timetable solutions
 */

import type { 
  Course, 
  Instructor, 
  Room, 
  TimeSlot, 
  Constraint,
  ScheduledClass 
} from "@/lib/types/timetabling"

export interface OptimizationConfig {
  populationSize: number
  generations: number
  crossoverRate: number
  mutationRate: number
  elitismRate: number
  maxRuntime: number // in milliseconds
  targetFitness?: number // Target fitness threshold for early termination
}

export interface TimetableSolution {
  id: string
  schedule: ScheduledClass[]
  fitness: number
  score: number
  conflicts: number
  utilization: number
  facultyWorkload: number
  violations: ConstraintViolation[]
  generation: number
}

export interface ConstraintViolation {
  type: string
  severity: 'hard' | 'soft'
  description: string
  penalty: number
}

export interface OptimizationResources {
  courses: Course[]
  instructors: Instructor[]
  rooms: Room[]
  timeSlots: TimeSlot[]
  constraints: Constraint[]
}

export class GeneticAlgorithmOptimizer {
  private config: OptimizationConfig
  private resources: OptimizationResources
  private population: TimetableSolution[] = []
  private generation = 0
  private startTime = 0

  constructor(config: OptimizationConfig, resources: OptimizationResources) {
    this.config = config
    this.resources = resources
  }

  /**
   * Main optimization function - returns multiple optimized solutions
   */
  public async optimize(
    onProgress?: (progress: number, generation: number, bestFitness: number) => void
  ): Promise<TimetableSolution[]> {
    console.log('[GA] Starting genetic algorithm optimization...')
    this.startTime = Date.now()
    
    // Initialize population
    this.initializePopulation()
    
    // Evolution loop
    for (this.generation = 0; this.generation < this.config.generations; this.generation++) {
      // Check runtime limit
      if (Date.now() - this.startTime > this.config.maxRuntime) {
        console.log(`[GA] Stopping due to time limit at generation ${this.generation}`)
        break
      }

      // Evaluate fitness for all individuals
      this.evaluateFitness()
      
      // Sort by fitness (higher is better)
      this.population.sort((a, b) => b.fitness - a.fitness)
      
      // Report progress
      const bestFitness = this.population[0].fitness
      const progress = (this.generation / this.config.generations) * 100
      onProgress?.(progress, this.generation, bestFitness)
      
      // Check for convergence
      if (bestFitness >= (this.config.targetFitness || 0.90)) { // Configurable fitness threshold
        console.log(`[GA] Converged at generation ${this.generation} with fitness ${bestFitness}`)
        break
      }
      
      // Create new generation
      const newPopulation = this.createNewGeneration()
      this.population = newPopulation
    }
    
    // Final evaluation
    this.evaluateFitness()
    this.population.sort((a, b) => b.fitness - a.fitness)
    
    // Return top solutions
    const topSolutions = this.population.slice(0, Math.min(5, this.population.length))
    console.log(`[GA] Optimization complete. Best fitness: ${topSolutions[0].fitness}`)
    
    return topSolutions
  }

  /**
   * Initialize random population
   */
  private initializePopulation(): void {
    console.log(`[GA] Initializing population of size ${this.config.populationSize}`)
    this.population = []
    
    for (let i = 0; i < this.config.populationSize; i++) {
      const solution = this.createRandomSolution()
      this.population.push(solution)
    }
  }

  /**
   * Create a random timetable solution
   */
  private createRandomSolution(): TimetableSolution {
    const schedule: ScheduledClass[] = []
    
    // Assign each course to random time slots and rooms
    this.resources.courses.forEach(course => {
      // Find suitable instructors for this course
      const suitableInstructors = this.resources.instructors.filter(
        instructor => instructor.departmentId === course.departmentId
      )
      
      if (suitableInstructors.length === 0) return
      
      // Assign sessions per week based on course credits
      const sessionsPerWeek = Math.min(course.credits, 5) // Max 5 sessions per week
      
      for (let session = 0; session < sessionsPerWeek; session++) {
        const randomInstructor = suitableInstructors[
          Math.floor(Math.random() * suitableInstructors.length)
        ]
        const randomRoom = this.resources.rooms[
          Math.floor(Math.random() * this.resources.rooms.length)
        ]
        const randomTimeSlot = this.resources.timeSlots[
          Math.floor(Math.random() * this.resources.timeSlots.length)
        ]
        
        const scheduledClass: ScheduledClass = {
          classId: `${course.id}-${session}`,
          courseId: course.id,
          instructorId: randomInstructor.id,
          roomId: randomRoom.id,
          timeSlotId: randomTimeSlot.id,
          dayOfWeek: randomTimeSlot.dayOfWeek,
          startTime: randomTimeSlot.startTime,
          endTime: randomTimeSlot.endTime,
          duration: randomTimeSlot.duration,
          enrolledStudents: course.maxStudents || 0,
          section: 'A'
        }
        
        schedule.push(scheduledClass)
      }
    })
    
    return {
      id: `solution-${Date.now()}-${Math.random()}`,
      schedule,
      fitness: 0,
      score: 0,
      conflicts: 0,
      utilization: 0,
      facultyWorkload: 0,
      violations: [],
      generation: this.generation
    }
  }

  /**
   * Evaluate fitness for all solutions in population
   */
  private evaluateFitness(): void {
    this.population.forEach(solution => {
      const evaluation = this.evaluateSolution(solution)
      solution.fitness = evaluation.fitness
      solution.score = evaluation.score
      solution.conflicts = evaluation.conflicts
      solution.utilization = evaluation.utilization
      solution.facultyWorkload = evaluation.facultyWorkload
      solution.violations = evaluation.violations
    })
  }

  /**
   * Evaluate a single solution
   */
  private evaluateSolution(solution: TimetableSolution): {
    fitness: number
    score: number
    conflicts: number
    utilization: number
    facultyWorkload: number
    violations: ConstraintViolation[]
  } {
    const violations: ConstraintViolation[] = []
    let totalPenalty = 0
    
    // Check for conflicts
    const conflicts = this.detectConflicts(solution.schedule)
    conflicts.forEach(conflict => {
      violations.push({
        type: 'conflict',
        severity: 'hard',
        description: conflict,
        penalty: 10
      })
      totalPenalty += 10
    })
    
    // Check instructor workload
    const workloadViolations = this.checkInstructorWorkload(solution.schedule)
    workloadViolations.forEach(violation => {
      violations.push(violation)
      totalPenalty += violation.penalty
    })
    
    // Check room capacity
    const capacityViolations = this.checkRoomCapacity(solution.schedule)
    capacityViolations.forEach(violation => {
      violations.push(violation)
      totalPenalty += violation.penalty
    })
    
    // Calculate metrics
    const utilization = this.calculateRoomUtilization(solution.schedule)
    const facultyWorkload = this.calculateFacultyWorkload(solution.schedule)
    
    // Calculate fitness (0-1 scale, higher is better)
    const maxPossiblePenalty = this.resources.courses.length * 10 // Base penalty per course
    const fitness = Math.max(0, 1 - (totalPenalty / maxPossiblePenalty))
    
    // Score as percentage
    const score = Math.round(fitness * 100)
    
    return {
      fitness,
      score,
      conflicts: conflicts.length,
      utilization,
      facultyWorkload,
      violations
    }
  }

  /**
   * Detect scheduling conflicts
   */
  private detectConflicts(schedule: ScheduledClass[]): string[] {
    const conflicts: string[] = []
    
    for (let i = 0; i < schedule.length; i++) {
      for (let j = i + 1; j < schedule.length; j++) {
        const class1 = schedule[i]
        const class2 = schedule[j]
        
        // Same time slot conflicts
        if (class1.timeSlotId === class2.timeSlotId && class1.dayOfWeek === class2.dayOfWeek) {
          // Room conflict
          if (class1.roomId === class2.roomId) {
            conflicts.push(`Room conflict: ${class1.roomId} at ${class1.startTime}`)
          }
          
          // Instructor conflict
          if (class1.instructorId === class2.instructorId) {
            conflicts.push(`Instructor conflict: ${class1.instructorId} at ${class1.startTime}`)
          }
        }
      }
    }
    
    return conflicts
  }

  /**
   * Check instructor workload constraints
   */
  private checkInstructorWorkload(schedule: ScheduledClass[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = []
    const instructorHours: { [key: string]: number } = {}
    
    // Calculate hours per instructor
    schedule.forEach(scheduledClass => {
      const hours = scheduledClass.duration / 60 // Convert minutes to hours
      instructorHours[scheduledClass.instructorId] = 
        (instructorHours[scheduledClass.instructorId] || 0) + hours
    })
    
    // Check against limits
    Object.entries(instructorHours).forEach(([instructorId, hours]) => {
      const instructor = this.resources.instructors.find(i => i.id === instructorId)
      if (instructor && hours > instructor.maxHoursPerWeek) {
        violations.push({
          type: 'workload',
          severity: 'hard',
          description: `Instructor ${instructor.name} exceeds max hours: ${hours}/${instructor.maxHoursPerWeek}`,
          penalty: Math.round((hours - instructor.maxHoursPerWeek) * 5)
        })
      }
    })
    
    return violations
  }

  /**
   * Check room capacity constraints
   */
  private checkRoomCapacity(schedule: ScheduledClass[]): ConstraintViolation[] {
    const violations: ConstraintViolation[] = []
    
    schedule.forEach(scheduledClass => {
      const room = this.resources.rooms.find(r => r.id === scheduledClass.roomId)
      if (room && scheduledClass.enrolledStudents > room.capacity) {
        violations.push({
          type: 'capacity',
          severity: 'hard',
          description: `Room ${room.name} overcapacity: ${scheduledClass.enrolledStudents}/${room.capacity}`,
          penalty: Math.round((scheduledClass.enrolledStudents - room.capacity) * 2)
        })
      }
    })
    
    return violations
  }

  /**
   * Calculate room utilization percentage
   */
  private calculateRoomUtilization(schedule: ScheduledClass[]): number {
    const totalAvailableSlots = this.resources.rooms.length * this.resources.timeSlots.length * 5 // 5 days
    const usedSlots = schedule.length
    return Math.round((usedSlots / totalAvailableSlots) * 100)
  }

  /**
   * Calculate average faculty workload percentage
   */
  private calculateFacultyWorkload(schedule: ScheduledClass[]): number {
    const instructorHours: { [key: string]: number } = {}
    
    schedule.forEach(scheduledClass => {
      const hours = scheduledClass.duration / 60
      instructorHours[scheduledClass.instructorId] = 
        (instructorHours[scheduledClass.instructorId] || 0) + hours
    })
    
    let totalWorkloadPercentage = 0
    let instructorCount = 0
    
    Object.entries(instructorHours).forEach(([instructorId, hours]) => {
      const instructor = this.resources.instructors.find(i => i.id === instructorId)
      if (instructor) {
        const workloadPercentage = (hours / instructor.maxHoursPerWeek) * 100
        totalWorkloadPercentage += workloadPercentage
        instructorCount++
      }
    })
    
    return instructorCount > 0 ? Math.round(totalWorkloadPercentage / instructorCount) : 0
  }

  /**
   * Create new generation through selection, crossover, and mutation
   */
  private createNewGeneration(): TimetableSolution[] {
    const newPopulation: TimetableSolution[] = []
    
    // Elitism - keep best solutions
    const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate)
    newPopulation.push(...this.population.slice(0, eliteCount))
    
    // Generate rest through crossover and mutation
    while (newPopulation.length < this.config.populationSize) {
      const parent1 = this.tournamentSelection()
      const parent2 = this.tournamentSelection()
      
      let offspring: TimetableSolution
      
      if (Math.random() < this.config.crossoverRate) {
        offspring = this.crossover(parent1, parent2)
      } else {
        offspring = JSON.parse(JSON.stringify(parent1)) // Deep copy
      }
      
      if (Math.random() < this.config.mutationRate) {
        offspring = this.mutate(offspring)
      }
      
      offspring.generation = this.generation + 1
      newPopulation.push(offspring)
    }
    
    return newPopulation
  }

  /**
   * Tournament selection for parent selection
   */
  private tournamentSelection(tournamentSize = 3): TimetableSolution {
    const tournament: TimetableSolution[] = []
    
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * this.population.length)
      tournament.push(this.population[randomIndex])
    }
    
    tournament.sort((a, b) => b.fitness - a.fitness)
    return tournament[0]
  }

  /**
   * Crossover operation - combine two parent solutions
   */
  private crossover(parent1: TimetableSolution, parent2: TimetableSolution): TimetableSolution {
    const offspring = JSON.parse(JSON.stringify(parent1)) // Start with parent1
    
    // Randomly swap some classes from parent2
    const swapCount = Math.floor(parent1.schedule.length * 0.3) // Swap 30% of classes
    
    for (let i = 0; i < swapCount; i++) {
      const randomIndex = Math.floor(Math.random() * parent1.schedule.length)
      if (parent2.schedule[randomIndex]) {
        offspring.schedule[randomIndex] = JSON.parse(JSON.stringify(parent2.schedule[randomIndex]))
      }
    }
    
    offspring.id = `solution-${Date.now()}-${Math.random()}`
    return offspring
  }

  /**
   * Mutation operation - make random changes
   */
  private mutate(solution: TimetableSolution): TimetableSolution {
    const mutated = JSON.parse(JSON.stringify(solution))
    
    // Randomly change time slots, rooms, or instructors for some classes
    const mutationCount = Math.floor(solution.schedule.length * 0.1) // Mutate 10% of classes
    
    for (let i = 0; i < mutationCount; i++) {
      const randomIndex = Math.floor(Math.random() * mutated.schedule.length)
      const scheduledClass = mutated.schedule[randomIndex]
      
      const mutationType = Math.floor(Math.random() * 3)
      
      switch (mutationType) {
        case 0: // Change time slot
          const newTimeSlot = this.resources.timeSlots[
            Math.floor(Math.random() * this.resources.timeSlots.length)
          ]
          scheduledClass.timeSlotId = newTimeSlot.id
          scheduledClass.dayOfWeek = newTimeSlot.dayOfWeek
          scheduledClass.startTime = newTimeSlot.startTime
          scheduledClass.endTime = newTimeSlot.endTime
          break
          
        case 1: // Change room
          const newRoom = this.resources.rooms[
            Math.floor(Math.random() * this.resources.rooms.length)
          ]
          scheduledClass.roomId = newRoom.id
          break
          
        case 2: // Change instructor (if suitable ones available)
          const course = this.resources.courses.find(c => c.id === scheduledClass.courseId)
          if (course) {
            const suitableInstructors = this.resources.instructors.filter(
              instructor => instructor.departmentId === course.departmentId
            )
            if (suitableInstructors.length > 0) {
              const newInstructor = suitableInstructors[
                Math.floor(Math.random() * suitableInstructors.length)
              ]
              scheduledClass.instructorId = newInstructor.id
            }
          }
          break
      }
    }
    
    mutated.id = `solution-${Date.now()}-${Math.random()}`
    return mutated
  }
}

/**
 * Default optimization configuration
 */
export const DEFAULT_GA_CONFIG: OptimizationConfig = {
  populationSize: 30, // Reduced for efficiency
  generations: 50, // Reduced for efficiency  
  crossoverRate: 0.8,
  mutationRate: 0.1,
  elitismRate: 0.1,
  maxRuntime: 180000, // 3 minutes - reduced for efficiency
  targetFitness: 0.85 // Target fitness threshold
}