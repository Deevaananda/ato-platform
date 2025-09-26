import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/database/database-service"
import { roomSchema } from "@/lib/utils/validation"

const formatRoom = (room: any) => ({
  id: room.id,
  number: room.number,
  name: room.name,
  building: room.building,
  capacity: room.capacity,
  type: room.type.toLowerCase(),
  facilities: room.facilities ? JSON.parse(room.facilities) : [],
  isAvailable: room.isActive,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const payload = roomSchema.partial().parse({
      number: body.number,
      name: body.name,
      building: body.building,
      capacity: body.capacity !== undefined ? Number(body.capacity) : undefined,
      type: body.type,
      facilities: Array.isArray(body.facilities) ? body.facilities : undefined,
    })

    const updateData: any = { ...payload }

    if (payload.type) {
      updateData.type = payload.type.toUpperCase()
    }

    if (payload.facilities) {
      updateData.facilities = payload.facilities.length ? JSON.stringify(payload.facilities) : null
    }

    const room = await prisma.room.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, data: formatRoom(room) })
  } catch (error) {
    console.error("Error updating room:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ success: false, error: "Room number must be unique" }, { status: 409 })
      }

      if (error.code === "P2025") {
        return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 })
      }
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.room.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true, message: "Room deleted successfully" })
  } catch (error) {
    console.error("Error deleting room:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ success: false, error: "Failed to delete room" }, { status: 500 })
  }
}
