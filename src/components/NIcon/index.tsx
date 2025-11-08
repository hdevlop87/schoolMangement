import React from 'react'
import { ICONS } from './icons'
import { Icon as IconifyIcon } from '@iconify/react'
import * as LucideIcons from 'lucide-react'

export type IconComponentProps = {
  size?: string | number,
  icon: React.ComponentType<any> | string,
  color?: string,
  className?: string,
  strokeWidth?: number,
  stroke?: string,
  fill?: string,
  onClick?: any
   style?: any,
}

const NIcon = ({icon = 'dashboard',size = '24', onClick,...rest}: IconComponentProps) => {

  // If icon is a React component (passed directly)
  if (icon && typeof icon === 'object' || typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent size={size} onClick={onClick} {...rest} />;
  }

  if (typeof icon === 'string') {
    // 1. Check if it's in custom ICONS mapping
    if (ICONS[icon]) {
      const IconComponent = ICONS[icon]
      return (
        <IconComponent
          width={size}
          height={size}
          onClick={onClick}
          {...rest}
        />
      )
    }

    // 2. Check if it's a Lucide React icon (kebab-case or PascalCase)
    // Convert kebab-case to PascalCase (e.g., 'folder-cog' -> 'FolderCog')
    const pascalCaseIcon = icon
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    if (LucideIcons[pascalCaseIcon as keyof typeof LucideIcons]) {
      const LucideIcon = LucideIcons[pascalCaseIcon as keyof typeof LucideIcons] as React.ComponentType<any>
      return (
        <LucideIcon
          size={size}
          onClick={onClick}
          {...rest}
        />
      )
    }

    // 3. Fallback to Iconify
    return <IconifyIcon
      icon={icon}
      width={size}
      height={size}
      onClick={onClick}
      {...rest}
    />
  }

  return null;
}

export default NIcon