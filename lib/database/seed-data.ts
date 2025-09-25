// Seed data for development and testing
import { v4 as uuidv4 } from "uuid"
import type { Department, Room, TimeSlot, Constraint, AcademicCalendar } from "@/lib/types/timetabling"

export const seedDepartments: Omit<Department, "createdAt" | "updatedAt">[] = [
  {
    id: uuidv4(),
    name: "Computer Science and Engineering",
    code: "CSE",
    head: "Dr. Rajesh Kumar",
    description: "Department of Computer Science and Engineering",
  },
  {
    id: uuidv4(),
    name: "Electronics and Communication Engineering",
    code: "ECE",
    head: "Dr. Priya Sharma",
    description: "Department of Electronics and Communication Engineering",
  },
  {
    id: uuidv4(),
    name: "Mechanical Engineering",
    code: "ME",
    head: "Dr. Amit Singh",
    description: "Department of Mechanical Engineering",
  },
  {
    id: uuidv4(),
    name: "Mathematics",
    code: "MATH",
    head: "Dr. Sunita Verma",
    description: "Department of Mathematics",
  },
  {
    id: uuidv4(),
    name: "Physics",
    code: "PHY",
    head: "Dr. Vikram Gupta",
    description: "Department of Physics",
  },
]

export const seedTimeSlots: TimeSlot[] = [
  // Monday to Friday, 8 periods per day
  ...Array.from({ length: 5 }, (_, dayIndex) =>
    Array.from({ length: 8 }, (_, periodIndex) => ({
      id: uuidv4(),
      dayOfWeek: (dayIndex + 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      startTime: `${8 + periodIndex}:00`,
      endTime: `${9 + periodIndex}:00`,
      duration: 60,
      period: periodIndex + 1,
    })),
  ).flat(),
  // Saturday - 4 periods
  ...Array.from({ length: 4 }, (_, periodIndex) => ({
    id: uuidv4(),
    dayOfWeek: 6 as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    startTime: `${8 + periodIndex}:00`,
    endTime: `${9 + periodIndex}:00`,
    duration: 60,
    period: periodIndex + 1,
  })),
]

export const seedRooms: Omit<Room, "createdAt" | "updatedAt">[] = [
  // Classrooms
  ...Array.from({ length: 20 }, (_, index) => ({
    id: uuidv4(),
    number: `CR-${(index + 1).toString().padStart(3, "0")}`,
    name: `Classroom ${index + 1}`,
    building: index < 10 ? "Academic Block A" : "Academic Block B",
    capacity: 0, // To be configured
    type: "classroom" as const,
    facilities: ["Projector", "Whiteboard", "AC", "WiFi"],
    isAvailable: true,
  })),
  // Labs
  ...Array.from({ length: 10 }, (_, index) => ({
    id: uuidv4(),
    number: `LAB-${(index + 1).toString().padStart(2, "0")}`,
    name: `${index < 5 ? "Computer" : "Electronics"} Lab ${(index % 5) + 1}`,
    building: "Lab Block",
    capacity: 0, // To be configured
    type: "lab" as const,
    facilities: ["Computers", "Projector", "AC", "WiFi", "Lab Equipment"],
    isAvailable: true,
  })),
  // Auditoriums
  {
    id: uuidv4(),
    number: "AUD-001",
    name: "Main Auditorium",
    building: "Administrative Block",
    capacity: 0, // To be configured
    type: "auditorium",
    facilities: ["Sound System", "Projector", "Stage", "AC", "WiFi"],
    isAvailable: true,
  },
  {
    id: uuidv4(),
    number: "AUD-002",
    name: "Mini Auditorium",
    building: "Academic Block A",
    capacity: 0, // To be configured
    type: "auditorium",
    facilities: ["Sound System", "Projector", "AC", "WiFi"],
    isAvailable: true,
  },
]

export const seedConstraints: Omit<Constraint, "createdAt" | "updatedAt">[] = [
  {
    id: uuidv4(),
    name: "No Instructor Time Conflict",
    type: "no_instructor_conflict",
    priority: "hard",
    weight: 1.0,
    parameters: {},
    isActive: true,
    description: "An instructor cannot teach multiple classes at the same time",
  },
  {
    id: uuidv4(),
    name: "No Room Double Booking",
    type: "no_room_conflict",
    priority: "hard",
    weight: 1.0,
    parameters: {},
    isActive: true,
    description: "A room cannot be assigned to multiple classes at the same time",
  },
  {
    id: uuidv4(),
    name: "Room Capacity Check",
    type: "room_capacity",
    priority: "hard",
    weight: 1.0,
    parameters: { bufferPercentage: 10 },
    isActive: true,
    description: "Room capacity must accommodate enrolled students with 10% buffer",
  },
  {
    id: uuidv4(),
    name: "Instructor Availability",
    type: "instructor_availability",
    priority: "hard",
    weight: 1.0,
    parameters: {},
    isActive: true,
    description: "Classes must be scheduled only during instructor available hours",
  },
  {
    id: uuidv4(),
    name: "Lunch Break",
    type: "lunch_break",
    priority: "soft",
    weight: 0.8,
    parameters: { startTime: "12:00", endTime: "13:00" },
    isActive: true,
    description: "Prefer to keep lunch hour (12:00-13:00) free",
  },
  {
    id: uuidv4(),
    name: "Maximum 4 Consecutive Hours",
    type: "max_hours_per_day",
    priority: "soft",
    weight: 0.7,
    parameters: { maxConsecutiveHours: 4 },
    isActive: true,
    description: "Instructors should not teach more than 4 consecutive hours",
  },
  {
    id: uuidv4(),
    name: "Balanced Workload",
    type: "balanced_workload",
    priority: "soft",
    weight: 0.6,
    parameters: { maxHoursPerDay: 6 },
    isActive: true,
    description: "Distribute instructor workload evenly across days",
  },
  {
    id: uuidv4(),
    name: "Room Type Matching",
    type: "room_type_match",
    priority: "soft",
    weight: 0.9,
    parameters: {
      courseTypeRoomMapping: {
        lab: ["lab"],
        core: ["classroom", "auditorium"],
        elective: ["classroom"],
        project: ["classroom", "lab"],
      },
    },
    isActive: true,
    description: "Match course types with appropriate room types",
  },
]

export const seedAcademicCalendar: Omit<AcademicCalendar, "createdAt" | "updatedAt"> = {
  id: uuidv4(),
  year: 2024,
  semester: 1,
  startDate: new Date("2024-07-15"),
  endDate: new Date("2024-12-15"),
  holidays: [
    {
      id: uuidv4(),
      name: "Independence Day",
      date: new Date("2024-08-15"),
      type: "national",
    },
    {
      id: uuidv4(),
      name: "Gandhi Jayanti",
      date: new Date("2024-10-02"),
      type: "national",
    },
    {
      id: uuidv4(),
      name: "Diwali",
      date: new Date("2024-11-01"),
      type: "national",
    },
  ],
  examPeriods: [
    {
      id: uuidv4(),
      name: "Mid Term Examinations",
      startDate: new Date("2024-09-15"),
      endDate: new Date("2024-09-25"),
      type: "mid_term",
    },
    {
      id: uuidv4(),
      name: "Final Examinations",
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-15"),
      type: "final",
    },
  ],
  isActive: true,
}
