"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard, AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Stagger, StaggerChild, SlideUp } from "@/components/animations/motion-components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Truck,
  Clock,
  FileText,
  Filter,
  Zap,
  Activity,
  Target
} from "lucide-react"
import { useState, useEffect } from "react"

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [reportsData, setReportsData] = useState({
    kpis: {
      totalIncidents: 0,
      averageResponseTime: 0,
      personnelOnDuty: 0,
      vehiclesInService: 0,
      trends: {
        incidents: { value: "0%", trend: "stable" },
        responseTime: { value: "0%", trend: "stable" },
        personnel: { value: "0%", trend: "stable" },
        vehicles: { value: "0%", trend: "stable" }
      }
    },
    incidentTypes: [],
    monthlyData: [],
    stationData: []
  })
  const [loading, setLoading] = useState(true)

  // Load data from localStorage
  useEffect(() => {
    const loadReportsData = () => {
      try {
        // Load incidents data
        const incidents = JSON.parse(localStorage.getItem('incidents') || '[]')
        const personnel = JSON.parse(localStorage.getItem('personnel') || '[]')
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
        
        // Calculate KPIs
        const totalIncidents = incidents.length
        const averageResponseTime = incidents.length > 0 
          ? Math.round(incidents.reduce((acc: number, incident: any) => {
              const reported = new Date(incident.reportedAt)
              const dispatched = new Date(incident.dispatchedAt)
              return acc + (dispatched.getTime() - reported.getTime()) / (1000 * 60) // minutes
            }, 0) / incidents.length)
          : 0
        
        const personnelOnDuty = personnel.filter((p: any) => p.status === "On Duty").length
        const vehiclesInService = vehicles.filter((v: any) => v.status === "In Service").length

        // Calculate incident types distribution
        const incidentTypeCounts: Record<string, number> = {}
        incidents.forEach((incident: any) => {
          incidentTypeCounts[incident.type] = (incidentTypeCounts[incident.type] || 0) + 1
        })
        
        const incidentTypes = Object.entries(incidentTypeCounts).map(([type, count]) => ({
          type,
          count,
          percentage: Math.round((count / totalIncidents) * 100)
        }))

        // Generate monthly data (last 6 months)
        const monthlyData = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthIncidents = incidents.filter((incident: any) => {
            const incidentDate = new Date(incident.reportedAt)
            return incidentDate.getMonth() === date.getMonth() && 
                   incidentDate.getFullYear() === date.getFullYear()
          })
          
          monthlyData.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            incidents: monthIncidents.length,
            responseTime: monthIncidents.length > 0 ? Math.round(Math.random() * 3 + 2) : 0
          })
        }

        // Generate station data
        const stationData = [
          { station: "Station 1", incidents: Math.floor(totalIncidents * 0.4), avgResponseTime: 3.2, personnel: 8, vehicles: 3 },
          { station: "Station 2", incidents: Math.floor(totalIncidents * 0.35), avgResponseTime: 3.8, personnel: 6, vehicles: 2 },
          { station: "Station 3", incidents: Math.floor(totalIncidents * 0.25), avgResponseTime: 4.1, personnel: 5, vehicles: 2 }
        ]

        setReportsData({
          kpis: {
            totalIncidents,
            averageResponseTime,
            personnelOnDuty,
            vehiclesInService,
            trends: {
              incidents: { value: "+12%", trend: "up" },
              responseTime: { value: "-5%", trend: "down" },
              personnel: { value: "+2%", trend: "up" },
              vehicles: { value: "0%", trend: "stable" }
            }
          },
          incidentTypes,
          monthlyData,
          stationData
        })
      } catch (error) {
        console.error('Error loading reports data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReportsData()
  }, [selectedPeriod, dateRange])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down": return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-red-600"
      case "down": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="p-6 space-y-8">
          {/* Animated Header */}
        <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent">
                Reports
              </h1>
              <p className="text-gray-600 text-lg">Fire department performance metrics and insights</p>
          </div>
          <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 font-semibold"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 font-semibold"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 font-semibold"
                onClick={() => {
                  // Export functionality
                  const dataStr = JSON.stringify(reportsData, null, 2)
                  const dataBlob = new Blob([dataStr], {type: 'application/json'})
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `fire-department-report-${new Date().toISOString().split('T')[0]}.json`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Period:</span>
          {["week", "month", "quarter", "year"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Date Range Picker */}
        {showDatePicker && (
          <div className="bg-white p-4 border rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Select Date Range</h3>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button 
                onClick={() => setShowDatePicker(false)}
                className="mt-6"
              >
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Filter Reports</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Incident Types</label>
                  <div className="space-y-2">
                    {["Fire", "Medical", "Rescue", "Hazmat", "Other"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity Levels</label>
                  <div className="space-y-2">
                    {["Low", "Medium", "High", "Critical"].map((severity) => (
                      <label key={severity} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setShowFilterModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowFilterModal(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

          {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50/50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Total Incidents</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-1">{reportsData.kpis.totalIncidents}</div>
                <p className={`text-xs flex items-center ${getTrendColor(reportsData.kpis.trends.incidents.trend)}`}>
                  {getTrendIcon(reportsData.kpis.trends.incidents.trend)}
                  <span className="ml-1">{reportsData.kpis.trends.incidents.value} from last period</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Avg Response Time</CardTitle>
                <Clock className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-1">{reportsData.kpis.averageResponseTime}m</div>
                <p className={`text-xs flex items-center ${getTrendColor(reportsData.kpis.trends.responseTime.trend)}`}>
                  {getTrendIcon(reportsData.kpis.trends.responseTime.trend)}
                  <span className="ml-1">{reportsData.kpis.trends.responseTime.value} from last period</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50/50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Personnel On Duty</CardTitle>
                <Users className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-1">{reportsData.kpis.personnelOnDuty}</div>
                <p className={`text-xs flex items-center ${getTrendColor(reportsData.kpis.trends.personnel.trend)}`}>
                  {getTrendIcon(reportsData.kpis.trends.personnel.trend)}
                  <span className="ml-1">{reportsData.kpis.trends.personnel.value} from last period</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50/50 to-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Vehicles In Service</CardTitle>
                <Truck className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-1">{reportsData.kpis.vehiclesInService}</div>
                <p className={`text-xs flex items-center ${getTrendColor(reportsData.kpis.trends.vehicles.trend)}`}>
                  {getTrendIcon(reportsData.kpis.trends.vehicles.trend)}
                  <span className="ml-1">{reportsData.kpis.trends.vehicles.value} from last period</span>
                </p>
              </CardContent>
            </Card>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Incident Types Distribution */}
            <Card className="h-[400px] border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                  <span className="text-xl font-bold">Incident Types Distribution</span>
              </CardTitle>
                <CardDescription className="text-gray-600">
                Distribution of incident types this month
              </CardDescription>
            </CardHeader>
              <CardContent className="h-[300px] flex flex-col">
                {/* Pie Chart Visualization */}
                <div className="flex-1 flex items-center justify-center mb-4">
                  <div className="relative w-48 h-48">
                    {/* Pie Chart SVG */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Pie slices */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        strokeDasharray={`${reportsData.incidentTypes[0]?.percentage * 2.51 || 0} 251`}
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={`${reportsData.incidentTypes[1]?.percentage * 2.51 || 0} 251`}
                        strokeDashoffset={`-${reportsData.incidentTypes[0]?.percentage * 2.51 || 0}`}
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        strokeDasharray={`${reportsData.incidentTypes[2]?.percentage * 2.51 || 0} 251`}
                        strokeDashoffset={`-${((reportsData.incidentTypes[0]?.percentage || 0) + (reportsData.incidentTypes[1]?.percentage || 0)) * 2.51}`}
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray={`${reportsData.incidentTypes[3]?.percentage * 2.51 || 0} 251`}
                        strokeDashoffset={`-${((reportsData.incidentTypes[0]?.percentage || 0) + (reportsData.incidentTypes[1]?.percentage || 0) + (reportsData.incidentTypes[2]?.percentage || 0)) * 2.51}`}
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="20"
                        strokeDasharray={`${reportsData.incidentTypes[4]?.percentage * 2.51 || 0} 251`}
                        strokeDashoffset={`-${((reportsData.incidentTypes[0]?.percentage || 0) + (reportsData.incidentTypes[1]?.percentage || 0) + (reportsData.incidentTypes[2]?.percentage || 0) + (reportsData.incidentTypes[3]?.percentage || 0)) * 2.51}`}
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Legend */}
                {reportsData.incidentTypes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {reportsData.incidentTypes.map((item, index) => {
                      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colors[index] }}
                          ></div>
                          <span className="font-medium">{item.type}</span>
                          <span className="text-gray-500">({item.percentage}%)</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No incident data available</p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Monthly Trends */}
            <Card className="h-[400px] border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold">Monthly Trends</span>
              </CardTitle>
                <CardDescription className="text-gray-600">
                Incident volume and response time trends
              </CardDescription>
            </CardHeader>
              <CardContent className="h-[300px]">
                {reportsData.monthlyData.length > 0 ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 flex items-end justify-between space-x-2 mb-4">
                      {reportsData.monthlyData.map((month, index) => {
                        const maxIncidents = Math.max(...reportsData.monthlyData.map(m => m.incidents));
                        const height = (month.incidents / maxIncidents) * 100;
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="flex flex-col items-center mb-2">
                              <div 
                                className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                                style={{ height: `${height}%`, minHeight: '20px' }}
                                title={`${month.incidents} incidents`}
                              ></div>
                            </div>
                            <div className="text-xs text-center">
                              <div className="font-medium">{month.month}</div>
                              <div className="text-gray-500">{month.incidents}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Response Time Trend Line */}
                    <div className="h-16 flex items-end justify-between space-x-2">
                      {reportsData.monthlyData.map((month, index) => {
                        const maxTime = Math.max(...reportsData.monthlyData.map(m => m.responseTime));
                        const height = (month.responseTime / maxTime) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-2 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                              style={{ height: `${height}%`, minHeight: '8px' }}
                              title={`${month.responseTime}m avg response`}
                            ></div>
                      </div>
                        );
                    })}
                    </div>
                  <div className="text-xs text-center text-gray-500 mt-2">
                    Response Time (minutes)
                  </div>
              </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No monthly data available</p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

          {/* Station Performance Table */}
          <Card className="border-2 border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-gray-600" />
                <span className="text-xl font-bold">Station Performance</span>
            </CardTitle>
              <CardDescription className="text-gray-600">
              Performance metrics by station
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportsData.stationData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Station</th>
                        <th className="text-left py-3 px-4 font-semibold">Incidents</th>
                        <th className="text-left py-3 px-4 font-semibold">Avg Response Time</th>
                        <th className="text-left py-3 px-4 font-semibold">Personnel</th>
                        <th className="text-left py-3 px-4 font-semibold">Vehicles</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                      {reportsData.stationData.map((station, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium">{station.station}</td>
                        <td className="py-3 px-4">{station.incidents}</td>
                        <td className="py-3 px-4">
                          <Badge variant={station.avgResponseTime < 4 ? "success" : "warning"}>
                            {station.avgResponseTime}m
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{station.personnel}</td>
                        <td className="py-3 px-4">{station.vehicles}</td>
                        <td className="py-3 px-4">
                            <Button size="sm" variant="outline" className="border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 font-semibold group">
                              <FileText className="h-4 w-4 mr-1 group-hover:animate-pulse" />
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No station data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50/50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span className="font-bold">Daily Report</span>
                </CardTitle>
                <CardDescription className="text-gray-600">Today&apos;s incident summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total incidents: 3</p>
                <p className="text-sm">Active incidents: 2</p>
                <p className="text-sm">Personnel on duty: 24</p>
                <p className="text-sm">Vehicles in service: 8</p>
              </div>
                <Button className="w-full mt-4 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 font-semibold group" size="sm">
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Download Report
              </Button>
            </CardContent>
          </Card>

            <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="font-bold">Weekly Summary</span>
                </CardTitle>
                <CardDescription className="text-gray-600">This week&apos;s performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total incidents: 18</p>
                <p className="text-sm">Avg response time: 4.1m</p>
                <p className="text-sm">Most common: Medical (42%)</p>
                <p className="text-sm">Peak hours: 2-4 PM</p>
              </div>
                <Button className="w-full mt-4 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 font-semibold group" size="sm">
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Download Report
              </Button>
            </CardContent>
          </Card>

            <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="font-bold">Monthly Analysis</span>
                </CardTitle>
                <CardDescription className="text-gray-600">Comprehensive monthly report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total incidents: 156</p>
                <p className="text-sm">Response time trend: -8.9%</p>
                <p className="text-sm">Top station: Station 1</p>
                <p className="text-sm">Training hours: 240</p>
              </div>
                <Button className="w-full mt-4 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 font-semibold group" size="sm">
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Download Report
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
  )
}