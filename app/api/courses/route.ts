import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/database/database-service"
import { courseSchema } from "@/lib/utils/validation"

const formatCourse = (course: any) => ({
  id: course.id,
  code: course.code,
  name: course.name,
  departmentId: course.departmentId,
  departmentName: course.department?.name ?? null,
  credits: course.credits,
  semester: course.semester,
  year: course.year,
  type: course.type.toLowerCase(),
  description: course.description ?? "",
  prerequisites: course.prerequisites ? JSON.parse(course.prerequisites) : [],
  maxStudents: course.maxStudents ?? null,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
})

export async function GET(_: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ semester: "asc" }, { name: "asc" }],
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: courses.map(formatCourse) })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payload = courseSchema.parse({
      code: body.code,
      name: body.name,
      departmentId: body.departmentId,
      credits: body.credits !== undefined ? Number(body.credits) : body.credits,
      semester: body.semester !== undefined ? Number(body.semester) : body.semester,
      year: body.year !== undefined ? Number(body.year) : body.year,
      type: body.type,
      description: body.description,
      prerequisites: Array.isArray(body.prerequisites) ? body.prerequisites : [],
      maxStudents: body.maxStudents !== undefined && body.maxStudents !== null ? Number(body.maxStudents) : undefined,
    })

    const course = await prisma.course.create({
      data: {
        code: payload.code,
        name: payload.name,
        departmentId: payload.departmentId,
        credits: payload.credits,
        semester: payload.semester,
        year: payload.year,
        type: payload.type.toUpperCase() as any,
        description: payload.description,
        prerequisites: payload.prerequisites?.length ? JSON.stringify(payload.prerequisites) : null,
        maxStudents: payload.maxStudents ?? null,
      },
      include: {
        department: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: formatCourse(course),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating course:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Course code must be unique" }, { status: 409 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create course" }, { status: 500 })
  }
}
