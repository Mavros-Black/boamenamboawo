import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface UserInput {
  email: string
  password: string
  name: string
  role?: 'admin' | 'user'
}

// In-memory storage for demo (replace with database in production)
const users: User[] = []
const sessions: Record<string, { userId: string; expires: Date }> = {}

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: UserInput): Promise<User> {
  const existingUser = users.find(u => u.email === userData.email)
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(userData.password)
  const user: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role || 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  users.push(user)
  return user
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = users.find(u => u.email === email)
  if (!user) return null

  // For demo purposes, we'll use a simple password check
  // In production, you'd store hashed passwords
  if (password === 'password123') {
    return user
  }

  return null
}

export function getUserById(userId: string): User | null {
  return users.find(u => u.id === userId) || null
}

export function createSession(userId: string): string {
  const token = generateToken(userId)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  sessions[token] = { userId, expires }
  return token
}

export function getSession(token: string): { userId: string } | null {
  const session = sessions[token]
  if (!session || session.expires < new Date()) {
    delete sessions[token]
    return null
  }
  return { userId: session.userId }
}

export function deleteSession(token: string): void {
  delete sessions[token]
}

// Initialize with a default admin user
export function initializeDefaultUsers() {
  if (users.length === 0) {
    users.push({
      id: '1',
      email: 'admin@boame.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}
