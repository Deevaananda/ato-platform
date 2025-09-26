import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/database/database-service"
import { instructorSchema } from "@/lib/utils/validation"

const formatInstructor = (instructor: any) => ({
  id: instructor.id,
  employeeId: instructor.employeeId,
  name: instructor.name,
  email: instructor.email,
  departmentId: instructor.departmentId,
  departmentName: instructor.department?.name ?? null,
  designation: instructor.designation.toLowerCase(),
  specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
  maxHoursPerWeek: instructor.maxHoursPerWeek,
  preferredSlots: instructor.preferredSlots ? JSON.parse(instructor.preferredSlots) : [],
  unavailableSlots: instructor.unavailableSlots ? JSON.parse(instructor.unavailableSlots) : [],
  createdAt: instructor.createdAt,
  updatedAt: instructor.updatedAt,
})

export async function GET() {
  try {
    const instructors = await prisma.instructor.findMany({
      orderBy: { name: "asc" },
      include: {
        department: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({ success: true, data: instructors.map(formatInstructor) })
  } catch (error) {
    console.error("Error fetching instructors:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch instructors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payload = instructorSchema.parse({
      employeeId: body.employeeId,
      name: body.name,
      email: body.email,
      departmentId: body.departmentId,
      designation: body.designation,
      specializations: Array.isArray(body.specializations) ? body.specializations : [],
      maxHoursPerWeek: body.maxHoursPerWeek !== undefined ? Number(body.maxHoursPerWeek) : 20,
    })

    const instructor = await prisma.instructor.create({
      data: {
        employeeId: payload.employeeId,
        name: payload.name,
        email: payload.email,
        departmentId: payload.departmentId,
        designation: payload.designation.toUpperCase() as any,
        specializations: payload.specializations.length ? JSON.stringify(payload.specializations) : null,
        maxHoursPerWeek: payload.maxHoursPerWeek,
      },
      include: {
        department: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: formatInstructor(instructor),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating instructor:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const field = error.meta?.target instanceof Array ? error.meta.target[0] : "field"
      return NextResponse.json({ success: false, error: `${field} must be unique` }, { status: 409 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create instructor" }, { status: 500 })
  }
}