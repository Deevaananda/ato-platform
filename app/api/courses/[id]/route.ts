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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const payload = courseSchema.partial().parse({
      code: body.code,
      name: body.name,
      departmentId: body.departmentId,
      credits: body.credits !== undefined ? Number(body.credits) : undefined,
      semester: body.semester !== undefined ? Number(body.semester) : undefined,
      year: body.year !== undefined ? Number(body.year) : undefined,
      type: body.type,
      description: body.description,
      prerequisites: Array.isArray(body.prerequisites) ? body.prerequisites : undefined,
      maxStudents: body.maxStudents !== undefined && body.maxStudents !== null ? Number(body.maxStudents) : undefined,
    })

    const updateData: any = { ...payload }

    if (payload.type) {
      updateData.type = payload.type.toUpperCase()
    }

    if (payload.prerequisites) {
      updateData.prerequisites = payload.prerequisites.length ? JSON.stringify(payload.prerequisites) : null
    }

    const course = await prisma.course.update({
      where: { id: params.id },
      data: updateData,
      include: {
        department: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({ success: true, data: formatCourse(course) })
  } catch (error) {
    console.error("Error updating course:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ success: false, error: "Course code must be unique" }, { status: 409 })
      }

      if (error.code === "P2025") {
        return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
      }
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update course" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.course.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: "Failed to delete course" }, { status: 500 })
  }
}
