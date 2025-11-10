"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Calendar, Flame } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsCardsProps {
  totalCompleted: number
  dailyCompleted: number
  currentStreak: number
}

export function StatsCards({ totalCompleted, dailyCompleted, currentStreak }: StatsCardsProps) {
  const [displayedTotal, setDisplayedTotal] = useState(totalCompleted)
  const [displayedDaily, setDisplayedDaily] = useState(dailyCompleted)

  useEffect(() => {
    setDisplayedTotal(totalCompleted)
    setDisplayedDaily(dailyCompleted)
  }, [totalCompleted, dailyCompleted])

  const overallProgress = (displayedTotal / 180) * 100
  const dailyProgress = (displayedDaily / 2) * 100

  const getCircularProgress = (percentage: number) => {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference
    return { circumference, offset }
  }

  const overallCircular = getCircularProgress(overallProgress)
  const dailyCircular = getCircularProgress(dailyProgress)

  return (
    <>
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur shadow-sm overflow-hidden flex flex-col aspect-square">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase">Overall Progress</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>

        <CardContent className="flex flex-col flex-1 pb-3">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="url(#gradient1)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={overallCircular.circumference}
                  strokeDashoffset={overallCircular.offset}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{displayedTotal}</span>
                <span className="text-xs text-slate-400">/ 180</span>
              </div>
            </div>
          </div>

          <Button className="w-full h-8 mt-auto bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs transition-colors">
            {overallProgress.toFixed(1)}% Complete
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur shadow-sm overflow-hidden flex flex-col aspect-square">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase">Today's Progress</CardTitle>
          <Calendar className="h-4 w-4 text-blue-400" />
        </CardHeader>

        <CardContent className="flex flex-col flex-1 pb-3">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="url(#gradient2)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={dailyCircular.circumference}
                  strokeDashoffset={dailyCircular.offset}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">{displayedDaily}</span>
                <span className="text-xs text-slate-400">/ 2</span>
              </div>
            </div>
          </div>

          <Button className="w-full h-8 mt-auto bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs transition-colors">
            {displayedDaily === 2 ? "Goal Achieved!" : `${2 - displayedDaily} Remaining`}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur shadow-sm overflow-hidden flex flex-col aspect-square">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>

        <CardContent className="flex flex-col flex-1 pb-3">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-white mb-2">{currentStreak}</div>
            <div className="text-xs font-medium text-slate-400 uppercase">days</div>
          </div>

          <Button className="w-full h-8 mt-auto bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs transition-colors">
            {currentStreak === 0 ? "Start Today" : currentStreak >= 7 ? "On Fire!" : "Keep Going!"}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
