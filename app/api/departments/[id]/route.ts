import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/database/database-service"
import { departmentSchema } from "@/lib/utils/validation"

const formatDepartment = (department: any) => ({
  id: department.id,
  name: department.name,
  code: department.code,
  description: department.description ?? "",
  head: department.head ?? "",
  headOfDepartment: department.head ?? "",
  totalCourses: department._count?.courses ?? 0,
  totalFaculty: department._count?.instructors ?? 0,
  createdAt: department.createdAt,
  updatedAt: department.updatedAt,
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const payload = departmentSchema.partial().parse({
      name: body.name,
      code: body.code,
      head: body.head ?? body.headOfDepartment ?? undefined,
      description: body.description,
    })

    const department = await prisma.department.update({
      where: { id: params.id },
      data: payload,
      include: {
        _count: { select: { courses: true, instructors: true } },
      },
    })

    return NextResponse.json({ success: true, data: formatDepartment(department) })
  } catch (error) {
    console.error("Error updating department:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ success: false, error: "Department code must be unique" }, { status: 409 })
      }

      if (error.code === "P2025") {
        return NextResponse.json({ success: false, error: "Department not found" }, { status: 404 })
      }
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update department" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.department.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Department deleted successfully" })
  } catch (error) {
    console.error("Error deleting department:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Department not found" }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: "Failed to delete department" }, { status: 500 })
  }
}
