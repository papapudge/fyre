"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  delay?: number
  hoverScale?: number
  tapScale?: number
}

export function AnimatedCard({
  children,
  className = "",
  onClick,
  delay = 0,
  hoverScale = 1.02,
  tapScale = 0.98,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
      }}
      whileHover={{ 
        scale: hoverScale,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: tapScale }}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
        {children}
      </Card>
    </motion.div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'stable'
  }
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple'
  onClick?: () => void
  delay?: number
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color,
  onClick,
  delay = 0,
}: StatCardProps) {
  const colorClasses = {
    red: "border-red-200 bg-gradient-to-br from-red-50/50 to-white text-red-600",
    blue: "border-blue-200 bg-gradient-to-br from-blue-50/50 to-white text-blue-600",
    green: "border-green-200 bg-gradient-to-br from-green-50/50 to-white text-green-600",
    orange: "border-orange-200 bg-gradient-to-br from-orange-50/50 to-white text-orange-600",
    purple: "border-purple-200 bg-gradient-to-br from-purple-50/50 to-white text-purple-600",
  }

  const hoverClasses = {
    red: "hover:border-red-400 hover:shadow-red-100",
    blue: "hover:border-blue-400 hover:shadow-blue-100",
    green: "hover:border-green-400 hover:shadow-green-100",
    orange: "hover:border-orange-400 hover:shadow-orange-100",
    purple: "hover:border-purple-400 hover:shadow-purple-100",
  }

  return (
    <AnimatedCard
      delay={delay}
      onClick={onClick}
      className={`border-2 ${colorClasses[color]} ${hoverClasses[color]} transition-all duration-300`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className={`text-3xl font-bold mb-1`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: delay + 0.2 }}
        >
          {value}
        </motion.div>
        {(description || trend) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="text-xs text-gray-500 flex items-center"
          >
            {trend && (
              <motion.span
                animate={{ 
                  y: trend.direction === 'up' ? [-1, 1] : trend.direction === 'down' ? [1, -1] : 0 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
                className="mr-1"
              >
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
              </motion.span>
            )}
            {trend?.value && `${trend.value} from last period`}
            {!trend && description}
          </motion.p>
        )}
      </CardContent>
    </AnimatedCard>
  )
}