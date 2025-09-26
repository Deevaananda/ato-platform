import { NextRequest, NextResponse } from "next/server"

import { initializeDatabase, prisma } from "@/lib/database/database-service"

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

interface GeneratePayload {
  department?: string
  semester?: string
  constraints?: Array<{ name: string; description?: string; priority?: string }>
  preferences?: Record<string, unknown>
  optimizationGoals?: string[]
}

interface AiScheduleOption {
  id: string
  name: string
  score: number
  conflicts: number
  utilization: number
  facultyWorkload: number
  status: "optimal" | "good" | "acceptable" | "infeasible"
  summary?: string
  meetings: Array<{
    courseId: string
    instructorId: string
    roomId?: string
    timeSlotId?: string
    dayOfWeek: number | string
    startTime: string
    endTime: string
  }>
}

const sanitizeJson = (text: string) => {
  const codeBlockMatch = text.match(/```json[\s\S]*?```/i)
  const raw = codeBlockMatch ? codeBlockMatch[0] : text
  const cleaned = raw.replace(/```json/i, "").replace(/```/g, "").trim()
  return cleaned
}

const parseAiResponse = (text: string) => {
  const cleaned = sanitizeJson(text)
  try {
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) {
      return parsed
    }
    if (parsed && Array.isArray(parsed.options)) {
      return parsed.options
    }
    return []
  } catch (error) {
    console.error("[AI] Failed to parse Gemini JSON:", error)
    return []
  }
}

const buildPrompt = (context: {
  departmentName: string
  semester: string
  courses: Array<{ id: string; code: string; name: string; credits: number }>
  instructors: Array<{ id: string; name: string; maxHours: number; specializations: string[] }>
  rooms: Array<{ id: string; name: string; type: string; capacity: number }>
  timeSlots: Array<{ id: string; dayOfWeek: number; startTime: string; endTime: string }>
  constraintsText: string
  optimizationGoals: string[]
}) => `You are an academic scheduling assistant helping a university generate feasible timetables.

Return between one and three candidate schedules that balance room utilization, instructor workload, and avoid conflicts. Use the provided data only.

Department: ${context.departmentName}
Semester: ${context.semester}
Optimization goals: ${context.optimizationGoals.join(", ") || "maximize utilization and minimize conflicts"}
${context.constraintsText}

Courses:
${context.courses
  .map((course) => `- ${course.code} (${course.id}): ${course.name} | Credits: ${course.credits}`)
  .join("\n")}

Instructors:
${context.instructors
  .map(
    (instructor) =>
      `- ${instructor.name} (${instructor.id}): Max ${instructor.maxHours} hours/week | Specializations: ${
        instructor.specializations.join(", ") || "General"
      }`,
  )
  .join("\n")}

Rooms:
${context.rooms
  .map((room) => `- ${room.name} (${room.id}) | ${room.type} | Capacity ${room.capacity}`)
  .join("\n")}

Time slots:
${context.timeSlots
  .map((slot) => `- ${slot.id}: Day ${slot.dayOfWeek} ${slot.startTime}-${slot.endTime}`)
  .join("\n")}

Respond with JSON ONLY, no commentary. Format:
{
  "options": [
    {
      "id": "string",
      "name": "string",
      "score": number,
      "conflicts": number,
      "utilization": number,
      "facultyWorkload": number,
      "status": "optimal" | "good" | "acceptable" | "infeasible",
      "summary": "string",
      "meetings": [
        {
          "courseId": "string",
          "instructorId": "string",
          "roomId": "string",
          "dayOfWeek": number,
          "startTime": "HH:MM",
          "endTime": "HH:MM"
        }
      ]
    }
  ]
}
Ensure meetings reference IDs from the provided data.`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key is not configured." }, { status: 500 })
    }

    const body = (await request.json()) as GeneratePayload

    if (!body.department) {
      return NextResponse.json({ success: false, error: "Department is required." }, { status: 400 })
    }

    await initializeDatabase()

    const department = await prisma.department.findUnique({ where: { id: body.department } })
    if (!department) {
      return NextResponse.json({ success: false, error: "Department not found." }, { status: 404 })
    }

    const semesterNumber = body.semester ? Number.parseInt(body.semester, 10) : undefined

    const courses = await prisma.course.findMany({
      where: {
        departmentId: department.id,
        ...(semesterNumber ? { semester: semesterNumber } : {}),
      },
      take: 15,
      orderBy: [{ semester: "asc" }, { name: "asc" }],
    })

    const instructors = await prisma.instructor.findMany({
      where: { departmentId: department.id },
      take: 15,
      orderBy: { name: "asc" },
    })

    const rooms = await prisma.room.findMany({ where: { isActive: true }, take: 20 })

    const timeSlots = await prisma.timeSlot.findMany({ where: { isActive: true }, take: 20, orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] })

    if (courses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No courses available for the selected parameters. Please add courses first.",
        },
        { status: 400 },
      )
    }

    const constraintsText = Array.isArray(body.constraints) && body.constraints.length > 0
      ? `Hard and soft constraints to respect:\n${body.constraints
          .map((constraint) => `- ${constraint.name}${constraint.priority ? ` (${constraint.priority})` : ""}: ${constraint.description ?? "No description"}`)
          .join("\n")}`
      : ""

    const prompt = buildPrompt({
      departmentName: department.name,
      semester: body.semester ?? "Not specified",
      courses: courses.map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        credits: course.credits,
      })),
      instructors: instructors.map((instr) => ({
        id: instr.id,
        name: instr.name,
        maxHours: instr.maxHoursPerWeek,
        specializations: instr.specializations ? JSON.parse(instr.specializations) : [],
      })),
      rooms: rooms.map((room) => ({
        id: room.id,
        name: room.name,
        type: room.type,
        capacity: room.capacity,
      })),
      timeSlots: timeSlots.map((slot) => ({
        id: slot.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
      constraintsText,
      optimizationGoals: body.optimizationGoals ?? [],
    })

    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("[AI] Gemini error:", errorText)
      return NextResponse.json({ success: false, error: "Failed to generate timetable via Gemini." }, { status: 500 })
    }

    const result = await geminiResponse.json()
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const options = parseAiResponse(rawText)

    return NextResponse.json({
      success: true,
      data: options,
      meta: {
        rawText,
        promptLength: prompt.length,
        promptPreview: prompt.slice(0, 500),
      },
    })
  } catch (error) {
    console.error("Error generating timetable with Gemini:", error)
    return NextResponse.json({ success: false, error: "Unexpected error while generating timetable." }, { status: 500 })
  }
}
