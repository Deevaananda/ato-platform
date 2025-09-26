import { NextResponse } from "next/server"

import { prisma } from "@/lib/database/database-service"

export async function GET() {
  try {
    const [
      totalCourses,
      totalInstructors,
      totalRooms,
      scheduledClasses,
      unscheduledClasses,
      totalTimeSlots,
      activeTimetables,
      activeConstraints,
    ] = await Promise.all([
      prisma.course.count(),
      prisma.instructor.count(),
      prisma.room.count({ where: { isActive: true } }),
      prisma.class.count({ where: { isScheduled: true } }),
      prisma.class.count({ where: { isScheduled: false } }),
      prisma.timeSlot.count({ where: { isActive: true } }),
      prisma.schedule.count({ where: { status: { in: ["APPROVED", "PUBLISHED"] } } }),
      prisma.constraint.count({ where: { isActive: true } }),
    ])

    const totalAvailableSlots = totalRooms * totalTimeSlots
    const roomUtilization = totalAvailableSlots > 0 ? Math.round((scheduledClasses / totalAvailableSlots) * 100) : 0
    const instructorWorkload =
      totalInstructors > 0 ? Math.round((scheduledClasses / totalInstructors) * 100) / 100 : 0

    return NextResponse.json({
      activeTimetables,
      totalCourses,
      totalInstructors,
      totalRooms,
      scheduledClasses,
      unscheduledClasses,
      activeConstraints,
      roomUtilization,
      instructorWorkload,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
