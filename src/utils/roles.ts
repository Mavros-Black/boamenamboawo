export type UserRole = 'admin' | 'user'

export interface Permission {
  resource: string
  actions: string[]
}

export const ROLES = {
  ADMIN: 'admin' as UserRole,
  USER: 'user' as UserRole,
} as const

export const PERMISSIONS = {
  // Admin permissions
  ADMIN: {
    DASHBOARD_ACCESS: ['admin-dashboard', 'user-dashboard'],
    SHOP_MANAGEMENT: ['view', 'create', 'edit', 'delete'],
    ANALYTICS: ['view', 'export'],
    FINANCE: ['view', 'manage'],
    ORDERS: ['view', 'manage', 'update-status'],
    DONATIONS: ['view', 'manage', 'verify'],
    PROGRAMS: ['view', 'create', 'edit', 'delete', 'manage-enrollments'],
    BLOG: ['view', 'create', 'edit', 'delete', 'publish'],
    USERS: ['view', 'create', 'edit', 'delete'],
    SETTINGS: ['view', 'edit'],
  },
  // User permissions
  USER: {
    DASHBOARD_ACCESS: ['user-dashboard'],
    SHOP: ['view', 'purchase'],
    DONATIONS: ['make-donation'],
    PROGRAMS: ['view', 'enroll'],
    BLOG: ['view'],
    PROFILE: ['view', 'edit'],
    ORDERS: ['view-own'],
    DONATIONS_HISTORY: ['view-own'],
  },
} as const

export const hasPermission = (userRole: UserRole, resource: string, action: string): boolean => {
  if (!userRole || !resource || !action) return false

  const rolePermissions = PERMISSIONS[userRole.toUpperCase() as keyof typeof PERMISSIONS]
  if (!rolePermissions) return false

  const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions] as readonly string[] | undefined
  if (!resourcePermissions) return false

  return resourcePermissions.includes(action)
}

export const canAccessPage = (userRole: UserRole, page: string): boolean => {
  const pagePermissions = {
    '/dashboard': true, // All authenticated users
    '/dashboard/user': true, // All authenticated users
    '/dashboard/shop': userRole === ROLES.ADMIN,
    '/dashboard/analytics': userRole === ROLES.ADMIN,
    '/dashboard/finance': userRole === ROLES.ADMIN,
    '/dashboard/orders': userRole === ROLES.ADMIN,
    '/dashboard/donations': userRole === ROLES.ADMIN,
    '/dashboard/events': userRole === ROLES.ADMIN, // Admin-only events management
    '/dashboard/programs': true, // All users can view programs
    '/dashboard/blog': true, // All users can view blog
    '/dashboard/donate': true, // All users can donate
    '/dashboard/reports': userRole === ROLES.ADMIN,
    '/dashboard/settings': userRole === ROLES.ADMIN,
  }

  return pagePermissions[page as keyof typeof pagePermissions] || false
}

export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.USER]: 'User',
  }
  return displayNames[role] || role
}

export const getRoleColor = (role: UserRole): string => {
  const colors = {
    [ROLES.ADMIN]: 'text-purple-600 bg-purple-100',
    [ROLES.USER]: 'text-blue-600 bg-blue-100',
  }
  return colors[role] || 'text-gray-600 bg-gray-100'
}

