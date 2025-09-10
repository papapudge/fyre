"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface EnhancedCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverScale?: number
  hoverY?: number
  pressScale?: number
  disabled?: boolean
  glowColor?: string
}

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(({
  children,
  className = "",
  onClick,
  hoverScale = 1.02,
  hoverY = -4,
  pressScale = 0.98,
  disabled = false,
  glowColor = "rgba(59, 130, 246, 0.15)",
  ...props
}, ref) => {
  const isInteractive = !!onClick && !disabled

  return (
    <motion.div
      ref={ref}
      className={cn(
        "transform-gpu",
        isInteractive && "cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      whileHover={isInteractive ? { 
        y: hoverY,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 25,
        }
      } : {}}
      whileTap={{}}
      onClick={!disabled ? onClick : undefined}
      style={{}}
      onMouseEnter={() => {
        if (isInteractive) {
          document.body.style.setProperty('--card-glow', glowColor)
        }
      }}
      {...props}
    >
      <Card className={cn(
        "h-full relative overflow-hidden"
      )}>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
      </Card>
    </motion.div>
  )
})

EnhancedCard.displayName = "EnhancedCard"

// Specialized variants
export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  color = "blue",
  onClick,
  className = "",
}: {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'stable'
  }
  color?: 'red' | 'blue' | 'green' | 'orange' | 'purple'
  onClick?: () => void
  className?: string
}) {
  const colorClasses = {
    red: "bg-white",
    blue: "bg-white",
    green: "bg-white",
    orange: "bg-white",
    purple: "bg-white",
  }

  const iconColors = {
    red: "text-red-600",
    blue: "text-blue-600", 
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  }

  const valueColors = {
    red: "text-red-600",
    blue: "text-blue-600",
    green: "text-green-600", 
    orange: "text-orange-600",
    purple: "text-purple-600",
  }

  const glowColors = {
    red: "rgba(239, 68, 68, 0.15)",
    blue: "rgba(59, 130, 246, 0.15)",
    green: "rgba(16, 185, 129, 0.15)",
    orange: "rgba(245, 158, 11, 0.15)",
    purple: "rgba(139, 92, 246, 0.15)",
  }

  return (
    <EnhancedCard
      onClick={onClick}
      className={cn(colorClasses[color], className)}
      glowColor={glowColors[color]}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <motion.div
          className={iconColors[color]}
          whileHover={{ 
            rotate: [0, -5, 5, 0],
            scale: 1.1,
            transition: { duration: 0.4 }
          }}
        >
          {icon}
        </motion.div>
      </CardHeader>
      <CardContent>
        <div 
          className={cn("text-3xl font-bold mb-1", valueColors[color])}
        >
          {value}
        </div>
        {(description || trend) && (
          <p className="text-xs text-gray-500 flex items-center">
            {trend && (
              <motion.span
                className="mr-1"
                animate={{ 
                  y: trend.direction === 'up' ? [-1, 1, -1] : trend.direction === 'down' ? [1, -1, 1] : 0 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              </motion.span>
            )}
            {trend?.value && `${trend.value} from last period`}
            {!trend && description}
          </p>
        )}
      </CardContent>
    </EnhancedCard>
  )
}