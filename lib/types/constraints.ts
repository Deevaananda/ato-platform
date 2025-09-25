export type ConstraintType =
  | "hard" // Must be satisfied (violations make schedule invalid)
  | "soft" // Should be satisfied (violations reduce schedule quality)

export type ConstraintCategory =
  | "instructor" // Faculty-related constraints
  | "room" // Room/resource constraints
  | "course" // Course-specific constraints
  | "time" // Time-based constraints
  | "student" // Student group constraints
  | "institutional" // Institution-wide policies

export interface BaseConstraint {
  id: string
  name: string
  description: string
  type: ConstraintType
  category: ConstraintCategory
  priority: number // 1-10, higher = more important
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Instructor Constraints
export interface InstructorConstraint extends BaseConstraint {
  category: "instructor"
  instructorId?: string // If null, applies to all instructors
  maxHoursPerDay?: number
  maxHoursPerWeek?: number
  maxConsecutiveHours?: number
  minBreakBetweenClasses?: number // minutes
  preferredTimeSlots?: string[] // time slot IDs
  unavailableTimeSlots?: string[] // time slot IDs
  maxCoursesPerDay?: number
  noBackToBackDifferentRooms?: boolean
}

// Room Constraints
export interface RoomConstraint extends BaseConstraint {
  category: "room"
  roomId?: string // If null, applies to all rooms
  maxCapacityUtilization?: number // percentage (0-100)
  requiredFacilities?: string[]
  maintenanceSlots?: string[] // time slot IDs when room is unavailable
  roomTypeRestrictions?: string[] // which course types can use this room
}

// Course Constraints
export interface CourseConstraint extends BaseConstraint {
  category: "course"
  courseId?: string // If null, applies to all courses
  requiredRoomType?: string
  requiredFacilities?: string[]
  preferredTimeSlots?: string[]
  blockedTimeSlots?: string[]
  minStudentsRequired?: number
  maxClassSize?: number
  requiresConsecutiveSlots?: boolean
  sessionsPerWeek?: number
}

// Time Constraints
export interface TimeConstraint extends BaseConstraint {
  category: "time"
  startTime?: string // HH:MM format
  endTime?: string // HH:MM format
  daysOfWeek?: number[] // 0=Sunday, 1=Monday, etc.
  noClassesBefore?: string // HH:MM
  noClassesAfter?: string // HH:MM
  lunchBreakStart?: string
  lunchBreakEnd?: string
  maxDailyHours?: number
}

// Student Group Constraints
export interface StudentConstraint extends BaseConstraint {
  category: "student"
  batchId?: string // If null, applies to all batches
  maxHoursPerDay?: number
  maxConsecutiveHours?: number
  minBreakBetweenClasses?: number
  noClassesDuring?: string[] // time slot IDs (lunch, prayer time, etc.)
  preferredStartTime?: string
  preferredEndTime?: string
}

// Institutional Constraints
export interface InstitutionalConstraint extends BaseConstraint {
  category: "institutional"
  workingDays?: number[] // days of week when classes can be scheduled
  holidayDates?: string[] // ISO date strings
  examPeriods?: Array<{
    startDate: string
    endDate: string
    description: string
  }>
  maxClassesPerTimeSlot?: number // across entire institution
  bufferTimeBetweenShifts?: number // minutes
}

export type Constraint =
  | InstructorConstraint
  | RoomConstraint
  | CourseConstraint
  | TimeConstraint
  | StudentConstraint
  | InstitutionalConstraint

export interface ConstraintViolation {
  id: string
  constraintId: string
  constraintName: string
  type: ConstraintType
  severity: "low" | "medium" | "high" | "critical"
  description: string
  affectedEntities: {
    instructorIds?: string[]
    roomIds?: string[]
    courseIds?: string[]
    timeSlotIds?: string[]
    batchIds?: string[]
  }
  suggestedFix?: string
  timestamp: Date
}

export interface ConstraintFormData {
  name: string
  description: string
  type: ConstraintType
  category: ConstraintCategory
  priority: number
  isActive: boolean
  // Dynamic fields based on category
  [key: string]: any
}

export interface ConstraintTemplate {
  id: string
  name: string
  description: string
  category: ConstraintCategory
  type: ConstraintType
  defaultPriority: number
  fields: Array<{
    key: string
    label: string
    type: "text" | "number" | "boolean" | "select" | "multiselect" | "time" | "date"
    required: boolean
    options?: string[]
    min?: number
    max?: number
    defaultValue?: any
  }>
}
