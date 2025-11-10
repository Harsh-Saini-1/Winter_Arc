"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Play, X, Wind, Heart } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function StressReliefCard() {
  const [isActive, setIsActive] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            if (phase === "inhale") {
              setPhase("hold")
              return 4
            } else if (phase === "hold") {
              setPhase("exhale")
              return 6
            } else {
              setPhase("inhale")
              setCycles((c) => c + 1)
              return 4
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, phase])

  const handleStart = () => {
    setIsFullscreen(true)
    setIsActive(true)
  }

  const handleClose = () => {
    setIsFullscreen(false)
    setIsActive(false)
    setPhase("inhale")
    setCount(4)
  }

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
    }
  }

  return (
    <>
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur shadow-sm overflow-hidden flex flex-col aspect-square">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-300 uppercase">Stress Relief</CardTitle>
          <Brain className="h-4 w-4 text-blue-400" />
        </CardHeader>

        <CardContent className="space-y-3 flex-1 flex flex-col justify-between pb-3">
          <div className="flex-1 flex items-center justify-center">
            <Brain className="h-10 w-10 text-blue-400" />
          </div>

          <Button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs transition-colors"
          >
            <Play className="h-3 w-3 mr-1" />
            Start
          </Button>
        </CardContent>
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-xl mx-4">
            <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors z-20"
              >
                <X className="h-5 w-5 text-slate-100" />
              </button>

              <CardContent className="p-8 flex flex-col items-center justify-center min-h-96">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      {phase === "inhale" && <Wind className="h-12 w-12 text-blue-400" />}
                      {phase === "hold" && <Heart className="h-12 w-12 text-slate-300" />}
                      {phase === "exhale" && <Wind className="h-12 w-12 text-blue-300" />}
                    </div>
                    <p className="text-slate-400 text-sm font-medium mb-4 uppercase">{getPhaseText()}</p>
                    <p className="text-6xl font-bold text-white">{count}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 w-full mt-6">
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-xs font-medium uppercase">Cycles</p>
                    <p className="text-white font-bold text-lg mt-1">{cycles}</p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-xs font-medium uppercase">Phase</p>
                    <p className="text-white font-bold text-sm mt-1 capitalize">{phase}</p>
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-xs font-medium uppercase">Time</p>
                    <p className="text-white font-bold text-lg mt-1">{Math.floor((cycles * 14) / 60)}'</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
