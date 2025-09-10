"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ReactNode, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  pressEffect?: boolean
  hoverEffect?: boolean
  pulseEffect?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    children,
    className = "",
    variant = "default",
    size = "default",
    onClick,
    disabled = false,
    type = "button",
    pressEffect = true,
    hoverEffect = true,
    pulseEffect = false,
    ...props
  }, ref) => {
    const motionProps = {
      whileTap: pressEffect ? { scale: 0.95, transition: { duration: 0.1 } } : undefined,
      whileHover: hoverEffect ? { 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      } : undefined,
      animate: pulseEffect ? {
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      } : undefined,
    }

    return (
      <motion.div {...motionProps} className="inline-block">
        <Button
          ref={ref}
          variant={variant}
          size={size}
          onClick={onClick}
          disabled={disabled}
          type={type}
          className={cn(
            "transition-all duration-200 transform-gpu",
            "active:scale-95",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export function PulseButton({ children, className = "", ...props }: AnimatedButtonProps) {
  return (
    <AnimatedButton
      {...props}
      pulseEffect={true}
      className={cn("relative overflow-hidden", className)}
    >
      <motion.div
        className="absolute inset-0 bg-white/20 rounded"
        animate={{
          scale: [0, 2],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
      {children}
    </AnimatedButton>
  )
}

export function LoadingButton({ 
  children, 
  loading = false, 
  className = "", 
  ...props 
}: AnimatedButtonProps & { loading?: boolean }) {
  return (
    <AnimatedButton
      {...props}
      disabled={loading || props.disabled}
      className={cn("relative", className)}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatedButton>
  )
}