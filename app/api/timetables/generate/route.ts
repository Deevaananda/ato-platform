import { NextRequest, NextResponse } from "next/server"

import { initializeDatabase, prisma } from "@/lib/database/database-service"
import { OptimizationService } from "@/lib/optimization/optimization-service"
import type {
  Constraint as TimetableConstraint,
  Course as TimetableCourse,
  Instructor as TimetableInstructor,
  Room as TimetableRoom,
  TimeSlot as TimetableTimeSlot,
} from "@/lib/types/timetabling"

const safeParseJson = <T>(value: unknown, fallback: T): T => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const normalizeCourse = (course: any): TimetableCourse => ({
  id: course.id,
  code: course.code,
  name: course.name,
  departmentId: course.departmentId,
  credits: course.credits,
  semester: course.semester,
  year: course.year,
  type: course.type.toLowerCase(),
  description: course.description ?? "",
  prerequisites: safeParseJson<string[]>(course.prerequisites, []),
  maxStudents: course.maxStudents ?? 0,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
})

const normalizeInstructor = (instructor: any): TimetableInstructor => ({
  id: instructor.id,
  employeeId: instructor.employeeId,
  name: instructor.name,
  email: instructor.email,
  departmentId: instructor.departmentId,
  designation: instructor.designation.toLowerCase(),
  specializations: safeParseJson<string[]>(instructor.specializations, []),
  maxHoursPerWeek: instructor.maxHoursPerWeek ?? 0,
  preferredTimeSlots: [],
  unavailableSlots: [],
  createdAt: instructor.createdAt,
  updatedAt: instructor.updatedAt,
})

const normalizeRoom = (room: any): TimetableRoom => ({
  id: room.id,
  number: room.number,
  name: room.name,
  building: room.building,
  capacity: room.capacity ?? 0,
  type: room.type.toLowerCase(),
  facilities: safeParseJson<string[]>(room.facilities, []),
  isAvailable: room.isActive,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
})

const normalizeTimeSlot = (slot: any): TimetableTimeSlot => ({
  id: slot.id,
  dayOfWeek: slot.dayOfWeek,
  startTime: slot.startTime,
  endTime: slot.endTime,
  duration: slot.duration,
  period: slot.period,
})

const normalizeConstraint = (constraint: any): TimetableConstraint => ({
  id: constraint.id,
  name: constraint.name,
  type: "custom",
  priority: constraint.type === "HARD" ? "hard" : "soft",
  weight: constraint.priority ?? 5,
  parameters: safeParseJson<Record<string, unknown>>(constraint.parameters, {}),
  isActive: constraint.isActive,
  description: constraint.description ?? "",
  createdAt: constraint.createdAt,
  updatedAt: constraint.updatedAt,
})

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    const config = {
      department: String(payload.department ?? ""),
      semester: String(payload.semester ?? ""),
      batchSize: Number(payload.batchSize ?? 0),
      subjects: Array.isArray(payload.subjects) ? payload.subjects : [],
      optimizationGoals: Array.isArray(payload.optimizationGoals) ? payload.optimizationGoals : [],
      maxIterations: Number(payload.maxIterations ?? 50),
      timeLimit: Number(payload.timeLimit ?? 180),
    }

    const validationErrors = OptimizationService.validateOptimizationConfig(config)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid configuration",
          details: validationErrors,
        },
        { status: 400 },
      )
    }

  await initializeDatabase()

    let effectiveDepartment = config.department
    const requestedSemester = Number.parseInt(config.semester, 10)
    let effectiveSemester = Number.isNaN(requestedSemester) ? undefined : requestedSemester

    let coursesRaw = await prisma.course.findMany({
      where: {
        departmentId: effectiveDepartment,
        semester: effectiveSemester,
      },
    })

    if (coursesRaw.length === 0) {
      coursesRaw = await prisma.course.findMany({
        where: {
          departmentId: effectiveDepartment,
        },
      })

      if (coursesRaw.length > 0) {
        effectiveSemester = coursesRaw[0].semester
      }
    }

    if (coursesRaw.length === 0) {
      const fallbackCourse = await prisma.course.findFirst({ orderBy: { createdAt: "asc" } })
      if (fallbackCourse) {
        effectiveDepartment = fallbackCourse.departmentId
        effectiveSemester = fallbackCourse.semester
        coursesRaw = await prisma.course.findMany({
          where: {
            departmentId: effectiveDepartment,
            semester: effectiveSemester,
          },
        })
      }
    }

    const [instructorsRaw, roomsRaw, timeSlotsRaw, constraintsRaw] = await Promise.all([
      prisma.instructor.findMany({ where: { departmentId: effectiveDepartment } }),
      prisma.room.findMany({ where: { isActive: true } }),
      prisma.timeSlot.findMany({ where: { isActive: true } }),
      prisma.constraint.findMany({ where: { isActive: true } }),
    ])

    if (coursesRaw.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No courses available for timetable generation. Please ensure courses are defined.",
        },
        { status: 400 },
      )
    }

    if (instructorsRaw.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No instructors available for the selected department.",
        },
        { status: 400 },
      )
    }

    if (roomsRaw.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No rooms are currently marked as active.",
        },
        { status: 400 },
      )
    }

    if (timeSlotsRaw.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No time slots are configured. Please add time slots before generating timetables.",
        },
        { status: 400 },
      )
    }

    const resources = {
      courses: coursesRaw.map(normalizeCourse),
      instructors: instructorsRaw.map(normalizeInstructor),
      rooms: roomsRaw.map(normalizeRoom),
      timeSlots: timeSlotsRaw.map(normalizeTimeSlot),
      constraints: constraintsRaw.map(normalizeConstraint),
    }

    const optimizationConfig = {
      ...config,
      department: effectiveDepartment,
      semester: String(effectiveSemester ?? config.semester),
    }

    const progressLog: Array<{ progress: number; step: string }> = []

    const results = await OptimizationService.generateTimetables(optimizationConfig, resources, (progress, step) => {
      progressLog.push({ progress, step })
    })

    return NextResponse.json({
      success: true,
      data: results,
      progress: progressLog,
      meta: {
        requestedDepartment: config.department,
        requestedSemester: config.semester,
        effectiveDepartment,
        effectiveSemester: effectiveSemester ?? requestedSemester ?? null,
      },
    })
  } catch (error) {
    console.error("Error generating timetables:", error)
    const message = error instanceof Error ? error.message : "Failed to generate timetables"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
