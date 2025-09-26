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

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            courses: true,
            instructors: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: departments.map(formatDepartment),
    })
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch departments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payload = departmentSchema.parse({
      name: body.name,
      code: body.code,
      head: body.head ?? body.headOfDepartment ?? undefined,
      description: body.description,
    })

    const department = await prisma.department.create({
      data: payload,
    })

    return NextResponse.json(
      {
        success: true,
        data: formatDepartment({ ...department, _count: { courses: 0, instructors: 0 } }),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating department:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Department code must be unique" }, { status: 409 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create department" }, { status: 500 })
  }
}