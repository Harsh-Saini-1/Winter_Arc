"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Calendar, Flame, TrendingUp, Zap, Sparkles } from "lucide-react"
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
      <Card className="border-yellow-500/30 bg-gradient-to-br from-black via-yellow-950/30 to-black backdrop-blur shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden relative group flex flex-col aspect-square">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 animate-pulse" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full"
              style={{
                top: `${30 + i * 20}%`,
                animationName: "speedLine",
                animationDuration: `${1.5 + i * 0.3}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs font-bold text-yellow-300 uppercase tracking-wide">Overall Progress</CardTitle>
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg shadow-lg anime-pulse">
            <Target className="h-4 w-4 text-black" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 relative z-10 pb-4">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 mb-2">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-xl opacity-20 animate-pulse" />
              <svg className="transform -rotate-90 w-28 h-28 relative z-10">
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-yellow-900/30"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="url(#gradient1)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={overallCircular.circumference}
                  strokeDashoffset={overallCircular.offset}
                  className="transition-all duration-500 drop-shadow-lg"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-400 mb-1 anime-float" />
                <span className="text-2xl font-black text-yellow-300">{displayedTotal}</span>
                <span className="text-xs text-yellow-600 font-bold">/ 180</span>
              </div>
            </div>
          </div>

          <Button className="w-full h-10 mt-auto bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400/50 font-bold transition-all duration-300 anime-glow text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {overallProgress.toFixed(1)}% Complete
          </Button>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/30 bg-gradient-to-br from-black via-yellow-950/30 to-black backdrop-blur shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden relative group flex flex-col aspect-square">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 animate-pulse" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full"
              style={{
                top: `${30 + i * 20}%`,
                animationName: "speedLine",
                animationDuration: `${1.5 + i * 0.3}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs font-bold text-yellow-300 uppercase tracking-wide">Today's Progress</CardTitle>
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg shadow-lg anime-pulse">
            <Calendar className="h-4 w-4 text-black" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 relative z-10 pb-4">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 mb-2">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full blur-xl opacity-20 animate-pulse" />
              <svg className="transform -rotate-90 w-28 h-28 relative z-10">
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-yellow-900/30"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="40"
                  stroke="url(#gradient2)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={dailyCircular.circumference}
                  strokeDashoffset={dailyCircular.offset}
                  className="transition-all duration-500 drop-shadow-lg"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap className="h-4 w-4 text-yellow-400 mb-1 anime-sparkle" />
                <span className="text-2xl font-black text-yellow-300">{displayedDaily}</span>
                <span className="text-xs text-yellow-600 font-bold">/ 2</span>
              </div>
            </div>
          </div>

          <Button className="w-full h-10 mt-auto bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400/50 font-bold transition-all duration-300 anime-glow text-xs">
            {displayedDaily === 2 ? (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Goal Achieved!
              </>
            ) : (
              <>
                <Zap className="h-3 w-3 mr-1" />
                {2 - displayedDaily} Remaining
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/30 bg-gradient-to-br from-black via-yellow-950/30 to-black backdrop-blur shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden relative group flex flex-col aspect-square">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 animate-pulse" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-full"
              style={{
                top: `${30 + i * 20}%`,
                animationName: "speedLine",
                animationDuration: `${1.5 + i * 0.3}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-xs font-bold text-yellow-300 uppercase tracking-wide">Current Streak</CardTitle>
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg shadow-lg anime-pulse">
            <Flame className="h-4 w-4 text-black animate-pulse" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 relative z-10 pb-4">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-full blur-2xl opacity-30 animate-pulse" />
              <Flame className="h-12 w-12 text-yellow-400 relative z-10 drop-shadow-2xl animate-pulse" />
            </div>
            <div className="text-4xl font-black text-yellow-300 mb-1">{currentStreak}</div>
            <div className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Days</div>
          </div>

          <Button className="w-full h-10 mt-auto bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30 hover:border-yellow-400/50 font-bold transition-all duration-300 anime-glow text-xs">
            <Flame className="h-3 w-3 mr-1" />
            {currentStreak === 0 ? "Start Today!" : currentStreak >= 7 ? "On Fire!" : "Keep Going!"}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
