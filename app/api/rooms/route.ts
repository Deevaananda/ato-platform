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

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: [{ building: "asc" }, { number: "asc" }],
    })

    return NextResponse.json({ success: true, data: rooms.map(formatRoom) })
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const payload = roomSchema.parse({
      number: body.number,
      name: body.name,
      building: body.building,
      capacity: body.capacity !== undefined ? Number(body.capacity) : body.capacity,
      type: body.type,
      facilities: Array.isArray(body.facilities) ? body.facilities : [],
    })

    const room = await prisma.room.create({
      data: {
        number: payload.number,
        name: payload.name,
        building: payload.building,
        capacity: payload.capacity,
        type: payload.type.toUpperCase() as any,
        facilities: payload.facilities.length ? JSON.stringify(payload.facilities) : null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: formatRoom(room),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating room:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ success: false, error: "Room number must be unique" }, { status: 409 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create room" }, { status: 500 })
  }
}