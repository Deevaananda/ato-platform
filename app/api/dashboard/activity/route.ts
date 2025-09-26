import { NextResponse } from "next/server"

import { prisma } from "@/lib/database/database-service"

type ActivityEvent = {
  id: string
  title: string
  description: string
  category: "timetable" | "course" | "instructor" | "room" | "schedule"
  status?: string
  timestamp: string
}

export async function GET() {
  try {
    const [generations, schedules, courses, instructors, rooms] = await Promise.all([
      prisma.timetableGeneration.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.schedule.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.course.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { department: true },
      }),
      prisma.instructor.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { department: true },
      }),
      prisma.room.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
      }),
    ])

    const events: ActivityEvent[] = [
      ...generations.map((generation) => ({
        id: `generation-${generation.id}`,
        title: `${generation.name} ${generation.status === "COMPLETED" ? "completed" : generation.status.toLowerCase()}`,
        description: `${generation.department} • Semester ${generation.semester}`,
        category: "timetable" as const,
        status: generation.status,
        timestamp: generation.updatedAt.toISOString(),
      })),
      ...schedules.map((schedule) => ({
        id: `schedule-${schedule.id}`,
        title: `${schedule.name} schedule ${schedule.status.toLowerCase()}`,
        description: `Academic Year ${schedule.academicYear}`,
        category: "schedule" as const,
        status: schedule.status,
        timestamp: schedule.updatedAt.toISOString(),
      })),
      ...courses.map((course) => ({
        id: `course-${course.id}`,
        title: `${course.name} updated`,
        description: `${course.department?.name ?? "Unassigned"} • Semester ${course.semester}`,
        category: "course" as const,
        timestamp: course.updatedAt.toISOString(),
      })),
      ...instructors.map((instructor) => ({
        id: `instructor-${instructor.id}`,
        title: `${instructor.name} profile updated`,
        description: `${instructor.department?.name ?? "Unassigned"} • ${instructor.designation.replace(/_/g, " ")}`,
        category: "instructor" as const,
        timestamp: instructor.updatedAt.toISOString(),
      })),
      ...rooms.map((room) => ({
        id: `room-${room.id}`,
        title: `${room.name} capacity ${room.isActive ? "reviewed" : "disabled"}`,
        description: `${room.building} • ${room.type}`,
        category: "room" as const,
        status: room.isActive ? "ACTIVE" : "INACTIVE",
        timestamp: room.updatedAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching dashboard activity:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard activity" }, { status: 500 })
  }
}
