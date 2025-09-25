import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  email: string
  role: "admin" | "faculty" | "coordinator" | "viewer"
  name: string
  department?: string
}

// Mock user database - in production, this would be a real database
const users: Array<User & { password: string }> = []

export async function initializeDemoUsers() {
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash("password", 10)
    users.push(
      {
        id: "1",
        email: "admin@university.edu",
        password: hashedPassword,
        role: "admin",
        name: "System Administrator",
        department: "IT",
      },
      {
        id: "2",
        email: "faculty@university.edu",
        password: hashedPassword,
        role: "faculty",
        name: "Dr. John Smith",
        department: "Computer Science",
      },
      {
        id: "3",
        email: "coordinator@university.edu",
        password: hashedPassword,
        role: "coordinator",
        name: "Prof. Jane Doe",
        department: "Mathematics",
      },
    )
  }
}

export async function validateCredentials(email: string, password: string): Promise<User | null> {
  await initializeDemoUsers()

  const user = users.find((u) => u.email === email)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function createSession(user: User): Promise<string> {
  // In production, use a proper JWT library or session store
  const sessionData = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    department: user.department,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }

  // Simple base64 encoding - in production, use proper JWT signing
  return Buffer.from(JSON.stringify(sessionData)).toString("base64")
}

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) return null

    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

    // Check if session is expired
    if (Date.now() > sessionData.exp) {
      return null
    }

    return {
      id: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role,
      name: sessionData.name,
      department: sessionData.department,
    }
  } catch {
    return null
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete("session")
}
