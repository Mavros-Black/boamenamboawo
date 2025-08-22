'use client'

import { getRoleDisplayName, getRoleColor, UserRole } from '@/utils/roles'
import { Shield, User } from 'lucide-react'

interface RoleBadgeProps {
  role: UserRole
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export default function RoleBadge({ 
  role, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  const getIcon = () => {
    if (!showIcon) return null
    
    return role === 'admin' ? (
      <Shield className={`${iconSize[size]} mr-1.5`} />
    ) : (
      <User className={`${iconSize[size]} mr-1.5`} />
    )
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${getRoleColor(role)}
      ${sizeClasses[size]}
      ${className}
    `}>
      {getIcon()}
      {getRoleDisplayName(role)}
    </span>
  )
}

