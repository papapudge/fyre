"use client"

import { useCallback, useRef, useEffect } from "react"

interface SmoothScrollOptions {
  duration?: number
  easing?: (t: number) => number
}

// Easing functions
const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const easeInOutQuart = (t: number): number =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

export function useSmoothScroll(options: SmoothScrollOptions = {}) {
  const { duration = 800, easing = easeInOutCubic } = options
  const animationRef = useRef<number | null>(null)

  const scrollTo = useCallback((target: number | HTMLElement) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const targetY = typeof target === 'number' 
      ? target 
      : target.offsetTop

    const startY = window.pageYOffset
    const distance = targetY - startY
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      
      window.scrollTo(0, startY + distance * easedProgress)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [duration, easing])

  const scrollToTop = useCallback(() => {
    scrollTo(0)
  }, [scrollTo])

  const scrollToElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      scrollTo(element)
    }
  }, [scrollTo])

  const scrollIntoView = useCallback((element: HTMLElement, offset = 0) => {
    const rect = element.getBoundingClientRect()
    const targetY = window.pageYOffset + rect.top - offset
    scrollTo(targetY)
  }, [scrollTo])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
    scrollIntoView,
  }
}

export function useMomentumScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const velocityRef = useRef(0)
  const lastYRef = useRef(0)
  const isScrollingRef = useRef(false)
  const animationRef = useRef<number | null>(null)

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!containerRef.current) return

    e.preventDefault()
    
    const delta = e.deltaY * 0.5
    velocityRef.current += delta
    
    if (!isScrollingRef.current) {
      isScrollingRef.current = true
      animate()
    }
  }, [])

  const animate = useCallback(() => {
    if (!containerRef.current) return

    velocityRef.current *= 0.95 // Damping factor
    
    const currentScroll = containerRef.current.scrollTop
    const newScroll = currentScroll + velocityRef.current
    
    containerRef.current.scrollTop = Math.max(0, Math.min(
      newScroll,
      containerRef.current.scrollHeight - containerRef.current.clientHeight
    ))

    if (Math.abs(velocityRef.current) > 0.5) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      isScrollingRef.current = false
      velocityRef.current = 0
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleWheel])

  return containerRef
}