// Core data models for the Adaptive Timetabling Optimizer

export interface Department {
  id: string
  name: string
  code: string
  head?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  code: string
  name: string
  departmentId: string
  credits: number
  semester: number
  year: number
  type: "core" | "elective" | "lab" | "project"
  description?: string
  prerequisites?: string[]
  maxStudents?: number
  createdAt: Date
  updatedAt: Date
}

export interface Instructor {
  id: string
  employeeId: string
  name: string
  email: string
  departmentId: string
  designation: "professor" | "associate_professor" | "assistant_professor" | "lecturer"
  specializations: string[]
  maxHoursPerWeek: number
  preferredTimeSlots?: TimeSlot[]
  unavailableSlots?: TimeSlot[]
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  id: string
  number: string
  name: string
  building: string
  capacity: number
  type: "classroom" | "lab" | "auditorium" | "seminar_hall"
  facilities: string[]
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TimeSlot {
  id: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday, etc.
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  duration: number // in minutes
  period: number // period number (1, 2, 3, etc.)
}

export interface Class {
  id: string
  courseId: string
  instructorId: string
  roomId?: string
  timeSlotId?: string
  section: string
  enrolledStudents: number
  maxStudents: number
  semester: number
  year: number
  isScheduled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Schedule {
  id: string
  name: string
  semester: number
  year: number
  status: "draft" | "published" | "archived"
  classes: ScheduledClass[]
  constraints: Constraint[]
  optimizationScore?: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ScheduledClass {
  classId: string
  courseId: string
  instructorId: string
  roomId: string
  timeSlotId: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  startTime: string
  endTime: string
  duration: number
  section: string
  enrolledStudents: number
}

export interface Constraint {
  id: string
  name: string
  type: ConstraintType
  priority: "hard" | "soft"
  weight: number
  parameters: Record<string, any>
  isActive: boolean
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type ConstraintType =
  | "instructor_availability"
  | "room_capacity"
  | "room_type_match"
  | "no_instructor_conflict"
  | "no_room_conflict"
  | "no_student_conflict"
  | "preferred_time_slots"
  | "max_hours_per_day"
  | "lunch_break"
  | "consecutive_classes"
  | "balanced_workload"
  | "room_utilization"
  | "custom"

export interface OptimizationResult {
  id: string
  scheduleId: string
  algorithm: "genetic" | "simulated_annealing" | "constraint_satisfaction" | "hybrid"
  score: number
  violations: ConstraintViolation[]
  executionTime: number
  iterations: number
  parameters: Record<string, any>
  createdAt: Date
}

export interface ConstraintViolation {
  constraintId: string
  constraintName: string
  severity: "critical" | "major" | "minor"
  affectedClasses: string[]
  description: string
  suggestedFix?: string
}

export interface TimetablePreferences {
  userId: string
  workingDays: number[]
  workingHours: {
    start: string
    end: string
  }
  lunchBreak: {
    start: string
    end: string
  }
  maxConsecutiveHours: number
  preferredRooms?: string[]
  avoidTimeSlots?: TimeSlot[]
  createdAt: Date
  updatedAt: Date
}

export interface AcademicCalendar {
  id: string
  year: number
  semester: number
  startDate: Date
  endDate: Date
  holidays: Holiday[]
  examPeriods: ExamPeriod[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Holiday {
  id: string
  name: string
  date: Date
  type: "national" | "university" | "department"
}

export interface ExamPeriod {
  id: string
  name: string
  startDate: Date
  endDate: Date
  type: "mid_term" | "final" | "supplementary"
}

// Utility types for API responses
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types for UI components
export interface CourseFormData {
  code: string
  name: string
  departmentId: string
  credits: number
  semester: number
  year: number
  type: Course["type"]
  description?: string
  prerequisites?: string[]
  maxStudents?: number
}

export interface InstructorFormData {
  employeeId: string
  name: string
  email: string
  departmentId: string
  designation: Instructor["designation"]
  specializations: string[]
  maxHoursPerWeek: number
}

export interface RoomFormData {
  number: string
  name: string
  building: string
  capacity: number
  type: Room["type"]
  facilities: string[]
}

export interface ConstraintFormData {
  name: string
  type: ConstraintType
  priority: "hard" | "soft"
  weight: number
  parameters: Record<string, any>
  description?: string
}

// Dashboard statistics types
export interface DashboardStats {
  totalCourses: number
  totalInstructors: number
  totalRooms: number
  scheduledClasses: number
  unscheduledClasses: number
  constraintViolations: number
  roomUtilization: number
  instructorWorkload: number
}

export interface ScheduleAnalytics {
  utilizationByRoom: Record<string, number>
  workloadByInstructor: Record<string, number>
  classDistributionByTime: Record<string, number>
  constraintViolationsByType: Record<string, number>
  optimizationHistory: OptimizationResult[]
}
