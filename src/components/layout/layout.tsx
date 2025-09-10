"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { useScrollBehavior } from "@/hooks/use-scroll-behavior"
import { PageTransition } from "@/components/animations/page-transition"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const scrollState = useScrollBehavior()

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          scrollState.isScrolling 
            ? 'shadow-lg' 
            : 'shadow-none'
        }`}
        style={{
          // Dynamic background based on scroll
          background: scrollState.isScrolling 
            ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
            : '#f9fafb'
        }}
      >
        <motion.div 
          className="h-full"
          animate={{
            scale: scrollState.isScrolling ? 0.998 : 1,
          }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <PageTransition>
            {children}
          </PageTransition>
        </motion.div>
      </main>
      
      {/* Enhanced scroll indicator with progress */}
      {scrollState.isScrolling && (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
                scrollState.scrollDirection === 'down' 
                  ? 'bg-blue-500' 
                  : 'bg-green-500'
              }`} />
              <div className="text-xs font-medium text-gray-600">
                {Math.round(scrollState.scrollProgress)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll progress bar at top */}
      {scrollState.isScrolling && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollState.scrollProgress}%` }}
          />
        </div>
      )}

      {/* Floating action button that appears when scrolling */}
      {scrollState.isScrolling && scrollState.scrollY > 200 && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        >
          <motion.svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            whileHover={{ y: -1 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </motion.svg>
        </motion.button>
      )}
    </div>
  )
}
