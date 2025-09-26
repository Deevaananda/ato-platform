/**
 * Database service using Prisma ORM
 */

import { PrismaClient, CourseType } from '@prisma/client'

// Singleton Prisma client
let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

export { prisma }

// Simple type definitions
export type DatabaseDepartment = any
export type DatabaseCourse = any
export type DatabaseInstructor = any  
export type DatabaseRoom = any
export type DatabaseTimeSlot = any

type SeedCourseDefinition = {
  code: string
  name: string
  credits: number
  semester: number
  year: number
  type: CourseType
  description: string
  maxStudents: number
  prerequisites?: string[]
}

/**
 * Department operations
 */
export class DepartmentService {
  static async getAll(): Promise<DatabaseDepartment[]> {
    return prisma.department.findMany({
      orderBy: { name: 'asc' }
    })
  }

  static async getById(id: string): Promise<DatabaseDepartment | null> {
    return prisma.department.findUnique({
      where: { id }
    })
  }

  static async create(data: Omit<DatabaseDepartment, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseDepartment> {
    return prisma.department.create({
      data: {
        name: data.name,
        code: data.code,
        ...data
      }
    })
  }

  static async update(id: string, data: Partial<DatabaseDepartment>): Promise<DatabaseDepartment> {
    return prisma.department.update({
      where: { id },
      data
    })
  }

  static async delete(id: string): Promise<void> {
    await prisma.department.delete({
      where: { id }
    })
  }

  static async initializeDefaultData(): Promise<void> {
    const existingCount = await prisma.department.count()
    
    if (existingCount === 0) {
      await prisma.department.createMany({
        data: [
          {
            name: "Computer Science and Engineering",
            code: "CSE",
            head: "Dr. Rajesh Kumar",
            description: "Department of Computer Science and Engineering",
          },
          {
            name: "Electronics and Communication Engineering", 
            code: "ECE",
            head: "Dr. Priya Sharma",
            description: "Department of Electronics and Communication Engineering",
          },
          {
            name: "Mechanical Engineering",
            code: "ME", 
            head: "Dr. Amit Singh",
            description: "Department of Mechanical Engineering",
          },
          {
            name: "Mathematics",
            code: "MATH",
            head: "Dr. Sunita Verma",
            description: "Department of Mathematics",
          }
        ]
      })
    }
  }
}

/**
 * Course operations  
 */
export class CourseService {
  static async getAll(): Promise<DatabaseCourse[]> {
    const courses = await prisma.course.findMany({
      include: { department: true },
      orderBy: [{ departmentId: 'asc' }, { semester: 'asc' }, { name: 'asc' }]
    })
    
    return courses.map(course => ({
      ...course,
      prerequisites: course.prerequisites ? JSON.parse(course.prerequisites) : []
    }))
  }

  static async getByDepartment(departmentId: string): Promise<DatabaseCourse[]> {
    const courses = await prisma.course.findMany({
      where: { departmentId },
      include: { department: true },
      orderBy: [{ semester: 'asc' }, { name: 'asc' }]
    })
    
    return courses.map(course => ({
      ...course,
      prerequisites: course.prerequisites ? JSON.parse(course.prerequisites) : []
    }))
  }

  static async create(data: Omit<DatabaseCourse, 'id' | 'createdAt' | 'updatedAt' | 'department'>): Promise<DatabaseCourse> {
    const { prerequisites, ...courseData } = data
    
    return prisma.course.create({
      data: {
        ...(courseData as any),
        prerequisites: prerequisites ? JSON.stringify(prerequisites) : null
      },
      include: { department: true }
    }).then(course => ({
      ...course,
      prerequisites: course.prerequisites ? JSON.parse(course.prerequisites) : []
    }))
  }

  static async initializeDefaultData(): Promise<void> {
    const departments = await prisma.department.findMany()
    if (departments.length === 0) {
      return
    }

    const defaultCoursesByDept: Record<string, SeedCourseDefinition[]> = {
      CSE: [
        {
          code: "CSE101",
          name: "Introduction to Programming",
          credits: 4,
          semester: 1,
          year: 1,
          type: CourseType.CORE,
          description: "Fundamentals of programming using C++ and problem-solving basics.",
          maxStudents: 60,
        },
        {
          code: "CSE201",
          name: "Data Structures and Algorithms",
          credits: 4,
          semester: 3,
          year: 2,
          type: CourseType.CORE,
          description: "Core data structures, algorithm analysis, and implementation patterns.",
          maxStudents: 60,
          prerequisites: ["CSE101"],
        },
        {
          code: "CSE305",
          name: "Database Management Systems",
          credits: 3,
          semester: 5,
          year: 3,
          type: CourseType.CORE,
          description: "Relational databases, SQL, normalization, and transaction management.",
          maxStudents: 55,
          prerequisites: ["CSE201"],
        },
      ],
      ECE: [
        {
          code: "ECE101",
          name: "Circuit Analysis",
          credits: 3,
          semester: 1,
          year: 1,
          type: CourseType.CORE,
          description: "Principles of electric circuits, Kirchhoff laws, and transient analysis.",
          maxStudents: 60,
        },
        {
          code: "ECE210",
          name: "Signals and Systems",
          credits: 4,
          semester: 4,
          year: 2,
          type: CourseType.CORE,
          description: "Continuous and discrete-time signals, Fourier analysis, and system modeling.",
          maxStudents: 55,
          prerequisites: ["ECE101"],
        },
      ],
      ME: [
        {
          code: "ME101",
          name: "Engineering Mechanics",
          credits: 4,
          semester: 1,
          year: 1,
          type: CourseType.CORE,
          description: "Statics and dynamics fundamentals for mechanical systems.",
          maxStudents: 60,
        },
        {
          code: "ME220",
          name: "Thermodynamics",
          credits: 4,
          semester: 3,
          year: 2,
          type: CourseType.CORE,
          description: "Laws of thermodynamics, pure substances, and power cycles.",
          maxStudents: 55,
        },
      ],
      MATH: [
        {
          code: "MATH101",
          name: "Calculus I",
          credits: 4,
          semester: 1,
          year: 1,
          type: CourseType.CORE,
          description: "Differentiation, integration, and applications for single-variable calculus.",
          maxStudents: 60,
        },
        {
          code: "MATH205",
          name: "Linear Algebra",
          credits: 3,
          semester: 3,
          year: 2,
          type: "CORE",
          description: "Vector spaces, matrices, eigenvalues, and linear transformations.",
          maxStudents: 55,
        },
      ],
    }

    for (const department of departments) {
      const seedCourses = defaultCoursesByDept[department.code]
      if (!seedCourses || seedCourses.length === 0) {
        continue
      }

      const existingForDepartment = await prisma.course.count({ where: { departmentId: department.id } })
      if (existingForDepartment > 0) {
        continue
      }

      await prisma.course.createMany({
        data: seedCourses.map((course) => ({
          departmentId: department.id,
          code: course.code,
          name: course.name,
          credits: course.credits,
          semester: course.semester,
          year: course.year,
          type: course.type,
          description: course.description,
          maxStudents: course.maxStudents,
          prerequisites: course.prerequisites ? JSON.stringify(course.prerequisites) : null,
        })),
      })
    }
  }
}

/**
 * Instructor operations
 */
export class InstructorService {
  static async getAll(): Promise<DatabaseInstructor[]> {
    const instructors = await prisma.instructor.findMany({
      include: { department: true },
      orderBy: [{ departmentId: 'asc' }, { name: 'asc' }]
    })
    
    return instructors.map(instructor => ({
      ...instructor,
      specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
      preferredTimeSlots: [],
      unavailableTimeSlots: []
    }))
  }

  static async getByDepartment(departmentId: string): Promise<DatabaseInstructor[]> {
    const instructors = await prisma.instructor.findMany({
      where: { departmentId },
      include: { department: true },
      orderBy: { name: 'asc' }
    })
    
    return instructors.map(instructor => ({
      ...instructor,
      specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
      preferredTimeSlots: [],
      unavailableTimeSlots: []
    }))
  }

  static async create(data: Omit<DatabaseInstructor, 'id' | 'createdAt' | 'updatedAt' | 'department' | 'preferredTimeSlots' | 'unavailableTimeSlots'>): Promise<DatabaseInstructor> {
    const { specializations, ...instructorData } = data
    
    return prisma.instructor.create({
      data: {
        ...(instructorData as any),
        specializations: specializations ? JSON.stringify(specializations) : null
      },
      include: { department: true }
    }).then(instructor => ({
      ...instructor,
      specializations: instructor.specializations ? JSON.parse(instructor.specializations) : [],
      preferredTimeSlots: [],
      unavailableTimeSlots: []
    }))
  }

  static async initializeDefaultData(): Promise<void> {
    const existingCount = await prisma.instructor.count()
    
    if (existingCount === 0) {
      const departments = await prisma.department.findMany()
      const cseDept = departments.find(d => d.code === 'CSE')
      const eceDept = departments.find(d => d.code === 'ECE')
      const mathDept = departments.find(d => d.code === 'MATH')
      
      if (cseDept && eceDept && mathDept) {
        await prisma.instructor.createMany({
          data: [
            {
              employeeId: "CSE001",
              name: "Dr. Rajesh Kumar",
              email: "rajesh.kumar@university.edu",
              departmentId: cseDept.id,
              designation: "PROFESSOR",
              specializations: JSON.stringify(["Programming", "Software Engineering", "Database Systems"]),
              maxHoursPerWeek: 20,
            },
            {
              employeeId: "CSE002",
              name: "Dr. Anita Sharma", 
              email: "anita.sharma@university.edu",
              departmentId: cseDept.id,
              designation: "ASSOCIATE_PROFESSOR",
              specializations: JSON.stringify(["Data Structures", "Algorithms", "Machine Learning"]),
              maxHoursPerWeek: 18,
            },
            {
              employeeId: "ECE001",
              name: "Dr. Priya Sharma",
              email: "priya.sharma@university.edu", 
              departmentId: eceDept.id,
              designation: "PROFESSOR",
              specializations: JSON.stringify(["Circuit Analysis", "Electronics", "Signal Processing"]),
              maxHoursPerWeek: 20,
            },
            {
              employeeId: "MATH001",
              name: "Dr. Sunita Verma",
              email: "sunita.verma@university.edu",
              departmentId: mathDept.id,
              designation: "PROFESSOR", 
              specializations: JSON.stringify(["Calculus", "Linear Algebra", "Statistics"]),
              maxHoursPerWeek: 22,
            }
          ]
        })
      }
    }
  }
}

/**
 * Room operations
 */
export class RoomService {
  static async getAll(): Promise<DatabaseRoom[]> {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: [{ building: 'asc' }, { number: 'asc' }]
    })
    
    return rooms.map(room => ({
      ...room,
      facilities: room.facilities ? JSON.parse(room.facilities) : []
    }))
  }

  static async create(data: Omit<DatabaseRoom, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseRoom> {
    const { facilities, ...roomData } = data
    
    return prisma.room.create({
      data: {
        ...(roomData as any),
        facilities: facilities ? JSON.stringify(facilities) : null
      }
    }).then(room => ({
      ...room,
      facilities: room.facilities ? JSON.parse(room.facilities) : []
    }))
  }

  static async initializeDefaultData(): Promise<void> {
    const existingCount = await prisma.room.count()
    
    if (existingCount === 0) {
      await prisma.room.createMany({
        data: [
          {
            number: "CR-101",
            name: "Classroom 101",
            building: "Academic Block A",
            capacity: 0, // To be configured per room
            type: "CLASSROOM",
            facilities: JSON.stringify(["Projector", "Whiteboard", "AC", "WiFi"]),
          },
          {
            number: "CR-102",
            name: "Classroom 102", 
            building: "Academic Block A",
            capacity: 0, // To be configured per room
            type: "CLASSROOM",
            facilities: JSON.stringify(["Projector", "Whiteboard", "AC", "WiFi"]),
          },
          {
            number: "LAB-01",
            name: "Computer Lab 1",
            building: "Academic Block B", 
            capacity: 0, // To be configured per room
            type: "LAB",
            facilities: JSON.stringify(["Computers", "Projector", "AC", "WiFi"]),
          },
          {
            number: "AUD-01",
            name: "Main Auditorium",
            building: "Administrative Block",
            capacity: 0, // To be configured per room
            type: "AUDITORIUM", 
            facilities: JSON.stringify(["Audio System", "Projector", "AC", "Stage"]),
          }
        ]
      })
    }
  }
}

/**
 * TimeSlot operations
 */
export class TimeSlotService {
  static async getAll(): Promise<DatabaseTimeSlot[]> {
    return prisma.timeSlot.findMany({
      where: { isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { period: 'asc' }]
    })
  }

  static async initializeDefaultData(): Promise<void> {
    const existingCount = await prisma.timeSlot.count()
    
    if (existingCount === 0) {
      const timeSlots = []
      const days = [1, 2, 3, 4, 5] // Monday to Friday
      const periods = [
        { start: '09:00', end: '10:00', period: 1 },
        { start: '10:15', end: '11:15', period: 2 },
        { start: '11:30', end: '12:30', period: 3 },
        { start: '13:30', end: '14:30', period: 4 },
        { start: '14:45', end: '15:45', period: 5 },
        { start: '16:00', end: '17:00', period: 6 }
      ]
      
      for (const day of days) {
        for (const period of periods) {
          timeSlots.push({
            dayOfWeek: day,
            startTime: period.start,
            endTime: period.end,
            duration: 60,
            period: period.period
          })
        }
      }
      
      await prisma.timeSlot.createMany({ data: timeSlots })
    }
  }
}

/**
 * Initialize all default data
 */
export async function initializeDatabase(): Promise<void> {
  console.log('[Database] Initializing default data...')
  
  await DepartmentService.initializeDefaultData()
  await CourseService.initializeDefaultData()
  await InstructorService.initializeDefaultData()
  await RoomService.initializeDefaultData()
  await TimeSlotService.initializeDefaultData()
  
  console.log('[Database] Default data initialized successfully')
}