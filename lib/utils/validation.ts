// Validation utilities for timetabling data
import { z } from "zod"

// Department validation schema
export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(255),
  code: z.string().min(1, "Department code is required").max(10),
  head: z.string().optional(),
  description: z.string().optional(),
})

// Course validation schema
export const courseSchema = z.object({
  code: z.string().min(1, "Course code is required").max(20),
  name: z.string().min(1, "Course name is required").max(255),
  departmentId: z.string().uuid("Invalid department ID"),
  credits: z.number().min(1, "Credits must be at least 1").max(10),
  semester: z.number().min(1, "Semester must be at least 1").max(8),
  year: z.number().min(1, "Year must be at least 1").max(4),
  type: z.enum(["core", "elective", "lab", "project"]),
  description: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
  maxStudents: z.number().min(1).optional(),
})

// Instructor validation schema
export const instructorSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required").max(20),
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  departmentId: z.string().uuid("Invalid department ID"),
  designation: z.enum(["professor", "associate_professor", "assistant_professor", "lecturer"]),
  specializations: z.array(z.string()).min(1, "At least one specialization is required"),
  maxHoursPerWeek: z.number().min(1, "Max hours must be at least 1").max(40),
})

// Room validation schema
export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required").max(20),
  name: z.string().min(1, "Room name is required").max(255),
  building: z.string().min(1, "Building is required").max(100),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  type: z.enum(["classroom", "lab", "auditorium", "seminar_hall"]),
  facilities: z.array(z.string()),
})

// Time slot validation schema
export const timeSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  duration: z.number().min(30, "Duration must be at least 30 minutes"),
  period: z.number().min(1),
})

// Constraint validation schema
export const constraintSchema = z.object({
  name: z.string().min(1, "Constraint name is required").max(255),
  type: z.string().min(1, "Constraint type is required"),
  priority: z.enum(["hard", "soft"]),
  weight: z.number().min(0).max(1),
  parameters: z.record(z.any()),
  description: z.string().optional(),
})

// Class validation schema
export const classSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  instructorId: z.string().uuid("Invalid instructor ID"),
  section: z.string().min(1, "Section is required").max(10),
  maxStudents: z.number().min(1, "Max students must be at least 1"),
  semester: z.number().min(1).max(8),
  year: z.number().min(1).max(4),
})

// Schedule validation schema
export const scheduleSchema = z.object({
  name: z.string().min(1, "Schedule name is required").max(255),
  semester: z.number().min(1).max(8),
  year: z.number().min(1).max(4),
  status: z.enum(["draft", "published", "archived"]).optional(),
})

// Validation helper functions
export function validateTimeSlotOverlap(
  slot1: { startTime: string; endTime: string },
  slot2: { startTime: string; endTime: string },
): boolean {
  const start1 = new Date(`2000-01-01T${slot1.startTime}:00`)
  const end1 = new Date(`2000-01-01T${slot1.endTime}:00`)
  const start2 = new Date(`2000-01-01T${slot2.startTime}:00`)
  const end2 = new Date(`2000-01-01T${slot2.endTime}:00`)

  return start1 < end2 && start2 < end1
}

export function validateWorkingHours(startTime: string, endTime: string): boolean {
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)

  return start < end && start.getHours() >= 6 && end.getHours() <= 22
}

export function validateRoomCapacity(roomCapacity: number, enrolledStudents: number, bufferPercentage = 10): boolean {
  const requiredCapacity = enrolledStudents * (1 + bufferPercentage / 100)
  return roomCapacity >= requiredCapacity
}

export function validateInstructorWorkload(assignedHours: number, maxHoursPerWeek: number): boolean {
  return assignedHours <= maxHoursPerWeek
}
