"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Play, X, Sparkles, Wind, Heart } from "lucide-react"
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

  const getPhaseColor = () => {
    switch (phase) {
      case "inhale":
        return "from-yellow-400 via-yellow-500 to-amber-500"
      case "hold":
        return "from-amber-500 via-orange-500 to-yellow-600"
      case "exhale":
        return "from-yellow-600 via-amber-600 to-yellow-700"
    }
  }

  const getPhaseIcon = () => {
    switch (phase) {
      case "inhale":
        return <Wind className="h-12 w-12 text-yellow-300 anime-float" />
      case "hold":
        return <Heart className="h-12 w-12 text-amber-300 animate-pulse" />
      case "exhale":
        return <Sparkles className="h-12 w-12 text-yellow-400 anime-sparkle" />
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "BREATHE IN"
      case "hold":
        return "HOLD"
      case "exhale":
        return "BREATHE OUT"
    }
  }

  const circleScale = phase === "inhale" ? "scale-150" : phase === "hold" ? "scale-125" : "scale-75"

  return (
    <>
      <Card className="border-yellow-500/30 bg-gradient-to-br from-black via-yellow-950/30 to-black backdrop-blur shadow-2xl overflow-hidden relative group hover:border-yellow-400/50 transition-all duration-500 flex flex-col aspect-square">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 animate-pulse" />

        {/* Anime speed lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
              style={{
                top: `${10 + i * 12}%`,
                left: "-100%",
                right: "100%",
                animation: `speedLine ${1 + Math.random()}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <CardHeader className="relative z-10 pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-xs font-bold">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg shadow-lg anime-pulse">
              <Brain className="h-4 w-4 text-black" />
            </div>
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent uppercase tracking-wide">
              Stress Relief
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10 flex-1 flex flex-col justify-between pb-4">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                <Brain className="h-12 w-12 text-yellow-400 relative z-10 anime-float" />
              </div>
              <p className="text-yellow-300 text-xs font-medium">Take a moment to breathe</p>
            </div>
          </div>

          <Button
            onClick={handleStart}
            className="w-full h-10 text-xs font-bold shadow-lg transition-all duration-300 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black anime-glow"
          >
            <Play className="h-3 w-3 mr-1" />
            START BREATHING
          </Button>
        </CardContent>
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center anime-fade-in">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Anime particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400/50 rounded-full anime-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 w-full max-w-2xl mx-4 anime-scale-in">
            <div className="bg-gradient-to-br from-black via-yellow-950/50 to-black border-2 border-yellow-500/30 rounded-3xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition-all duration-300 group"
              >
                <X className="h-6 w-6 text-red-400 group-hover:text-red-300" />
              </button>

              {/* Breathing circle */}
              <div className="flex items-center justify-center py-12">
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20 blur-3xl transition-all duration-1000 ${isActive ? circleScale : ""}`}
                  />

                  <div
                    className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl transition-all duration-1000 ease-in-out ${isActive ? circleScale : "scale-100"} flex items-center justify-center anime-glow`}
                  >
                    <div className="absolute inset-8 rounded-full bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      {getPhaseIcon()}
                      <div className="text-center">
                        <p className="text-yellow-200 text-sm font-bold tracking-widest mb-2">{getPhaseText()}</p>
                        <p className="text-7xl font-black text-white anime-pulse">{count}</p>
                      </div>
                    </div>
                  </div>

                  {/* Anime impact rings */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 animate-ping" />
                      <div className="absolute inset-8 rounded-full border-2 border-amber-400/20 animate-ping delay-100" />
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4 text-center anime-slide-up">
                  <p className="text-yellow-600 text-xs font-semibold uppercase tracking-wide">Cycles</p>
                  <p className="text-3xl font-black text-yellow-400 mt-2">{cycles}</p>
                </div>
                <div
                  className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4 text-center anime-slide-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <p className="text-yellow-600 text-xs font-semibold uppercase tracking-wide">Phase</p>
                  <p className="text-lg font-black text-yellow-400 mt-2 uppercase">{phase}</p>
                </div>
                <div
                  className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-4 text-center anime-slide-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <p className="text-yellow-600 text-xs font-semibold uppercase tracking-wide">Time</p>
                  <p className="text-3xl font-black text-yellow-400 mt-2">{Math.floor((cycles * 14) / 60)}'</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
