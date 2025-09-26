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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const payload = instructorSchema.partial().parse({
      employeeId: body.employeeId,
      name: body.name,
      email: body.email,
      departmentId: body.departmentId,
      designation: body.designation,
      specializations: Array.isArray(body.specializations) ? body.specializations : undefined,
      maxHoursPerWeek: body.maxHoursPerWeek !== undefined ? Number(body.maxHoursPerWeek) : undefined,
    })

    const updateData: any = { ...payload }

    if (payload.designation) {
      updateData.designation = payload.designation.toUpperCase()
    }

    if (payload.specializations) {
      updateData.specializations = payload.specializations.length ? JSON.stringify(payload.specializations) : null
    }

    const instructor = await prisma.instructor.update({
      where: { id: params.id },
      data: updateData,
      include: {
        department: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({ success: true, data: formatInstructor(instructor) })
  } catch (error) {
    console.error("Error updating instructor:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const field = error.meta?.target instanceof Array ? error.meta.target[0] : "field"
        return NextResponse.json({ success: false, error: `${field} must be unique` }, { status: 409 })
      }

      if (error.code === "P2025") {
        return NextResponse.json({ success: false, error: "Instructor not found" }, { status: 404 })
      }
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update instructor" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.instructor.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Instructor deleted successfully" })
  } catch (error) {
    console.error("Error deleting instructor:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Instructor not found" }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: "Failed to delete instructor" }, { status: 500 })
  }
}
