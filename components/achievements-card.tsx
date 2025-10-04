"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Coins, Flame, Star, Zap, Crown, Target, Award } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Achievement {
  id: string
  achievement_type: string
  achievement_name: string
  earned_at: string
}

interface AchievementsCardProps {
  userId: string
}

const achievementIcons: Record<string, { icon: React.ReactNode; color: string; description: string }> = {
  coins_100: {
    icon: <Coins className="h-6 w-6" />,
    color: "from-amber-500 to-yellow-500",
    description: "Earned 100 coins",
  },
  coins_500: {
    icon: <Crown className="h-6 w-6" />,
    color: "from-yellow-500 to-amber-600",
    description: "Earned 500 coins",
  },
  coins_1000: {
    icon: <Trophy className="h-6 w-6" />,
    color: "from-yellow-400 to-yellow-600",
    description: "Earned 1000 coins",
  },
  streak_7: {
    icon: <Flame className="h-6 w-6" />,
    color: "from-orange-500 to-red-500",
    description: "7 day streak",
  },
  streak_30: {
    icon: <Zap className="h-6 w-6" />,
    color: "from-red-500 to-pink-500",
    description: "30 day streak",
  },
  streak_90: {
    icon: <Star className="h-6 w-6" />,
    color: "from-pink-500 to-purple-500",
    description: "90 day streak - Master!",
  },
  questions_50: {
    icon: <Target className="h-6 w-6" />,
    color: "from-amber-500 to-orange-500",
    description: "Completed 50 questions",
  },
  questions_100: {
    icon: <Award className="h-6 w-6" />,
    color: "from-orange-500 to-amber-600",
    description: "Completed 100 questions",
  },
}

export function AchievementsCard({ userId }: AchievementsCardProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadAchievements()

    const channel = supabase
      .channel("achievements-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "achievements", filter: `user_id=eq.${userId}` },
        () => {
          loadAchievements()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false })

      if (error) throw error

      setAchievements(data || [])
    } catch (error) {
      console.error("Error loading achievements:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-amber-500/20 bg-slate-900/50 backdrop-blur shadow-xl h-full">
        <CardContent className="p-6">
          <p className="text-slate-400">Loading achievements...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-500/20 bg-slate-900/50 backdrop-blur shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Achievements
          <Badge variant="outline" className="ml-auto bg-amber-500/10 text-amber-400 border-amber-500/20">
            {achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Complete challenges to earn achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const config = achievementIcons[achievement.achievement_type] || {
                icon: <Star className="h-6 w-6" />,
                color: "from-slate-500 to-slate-600",
                description: achievement.achievement_name,
              }

              return (
                <div key={achievement.id} className="relative group">
                  <div
                    className={`bg-gradient-to-br ${config.color} p-4 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    <div className="text-white flex flex-col items-center gap-2">
                      {config.icon}
                      <p className="text-xs font-semibold text-center">{achievement.achievement_name}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {config.description}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
