import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { canAccessPage } from '@/utils/roles'

interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'user'
  iat: number
  exp: number
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7)
      const decoded = verifyToken(token)
      
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }

      // Add user info to request
      const requestWithUser = request.clone()
      ;(requestWithUser as any).user = decoded

      return handler(requestWithUser)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

export function requireRole(requiredRole: 'admin' | 'user', handler: Function) {
  return requireAuth(async (request: NextRequest) => {
    try {
      const user = (request as any).user as JWTPayload
      
      if (user.role !== requiredRole) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(request)
    } catch (error) {
      console.error('Role middleware error:', error)
      return NextResponse.json(
        { error: 'Authorization failed' },
        { status: 403 }
      )
    }
  })
}

export function requireAdmin(handler: Function) {
  return requireRole('admin', handler)
}

export function requireUser(handler: Function) {
  return requireRole('user', handler)
}

export function optionalAuth(handler: Function) {
  return async (request: NextRequest) => {
    try {
      const authHeader = request.headers.get('authorization')
      let user = null

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const decoded = verifyToken(token)
        if (decoded) {
          user = decoded
        }
      }

      // Add user info to request (might be null)
      const requestWithUser = request.clone()
      ;(requestWithUser as any).user = user

      return handler(requestWithUser)
    } catch (error) {
      console.error('Optional auth middleware error:', error)
      // Continue without authentication
      const requestWithUser = request.clone()
      ;(requestWithUser as any).user = null
      return handler(requestWithUser)
    }
  }
}

