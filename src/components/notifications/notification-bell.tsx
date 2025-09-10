"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Eye, EyeOff, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { notificationApi, type Notification as ApiNotification } from "@/lib/api"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "incident" | "assignment" | "alert" | "info"
}

// Mock notifications will be replaced with real API data

export function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load notifications from API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true)
        const response = await notificationApi.getAll({ limit: 50 })
        // Convert API notifications to component format
        const convertedNotifications: Notification[] = response.notifications.map(apiNotif => ({
          id: apiNotif.id,
          title: apiNotif.title,
          message: apiNotif.message,
          time: new Date(apiNotif.createdAt).toLocaleString(),
          read: apiNotif.isRead,
          type: apiNotif.type.toLowerCase().replace('_', '') as "incident" | "assignment" | "alert" | "info"
        }))
        setNotifications(convertedNotifications)
      } catch (error) {
        console.error('Failed to load notifications:', error)
        // Keep empty array on error
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      // In a real app, you'd get the current user ID
      await notificationApi.markAllAsRead('current-user-id')
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "incident": return "bg-red-100 text-red-800"
      case "assignment": return "bg-blue-100 text-blue-800" 
      case "alert": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewAll = () => {
    setOpen(false)
    router.push('/notifications')
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2"
          onClick={() => setOpen(true)}
        >
          <motion.div
            animate={unreadCount > 0 ? { 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            } : {}}
            transition={{
              duration: 2,
              repeat: unreadCount > 0 ? Infinity : 0,
              repeatDelay: 3,
            }}
          >
            <Bell className="h-4 w-4" />
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -bottom-1 -right-1"
              >
                <Badge 
                  variant="secondary" 
                  className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-black text-white"
                >
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                  >
                    {unreadCount}
                  </motion.span>
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Backdrop and Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
              className="fixed top-20 right-6 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[calc(100vh-6rem)] flex flex-col overflow-hidden"
            >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs text-gray-600 hover:text-gray-900"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="p-1 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.slice(0, 8).map((notification, index) => (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={cn(
                    "p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors",
                    !notification.read && "bg-red-50 border-l-4 border-l-red-500"
                  )}
                  onClick={() => markAsRead(notification.id)}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          getTypeColor(notification.type)
                        )}>
                          {notification.type}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Footer */}
            {notifications.length > 8 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleViewAll}
                >
                  View All {notifications.length} Notifications
                </Button>
              </div>
            )}
            
            {notifications.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm font-medium mb-1">No notifications</p>
                <p className="text-xs text-gray-400">You're all caught up!</p>
              </div>
            )}
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  )
}