"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Coins, Crown, Flame } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface LeaderboardEntry {
  id: string
  display_name: string
  avatar_url: string | null
  total_coins: number
  current_streak: number
}

interface LeaderboardCardProps {
  currentUserId: string
}

export function LeaderboardCard({ currentUserId }: LeaderboardCardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadLeaderboard()

    const channel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadLeaderboard()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, total_coins, current_streak")
        .order("total_coins", { ascending: false })
        .limit(10)

      if (error) throw error

      setLeaderboard(data || [])

      const userIndex = data?.findIndex((entry) => entry.id === currentUserId)
      if (userIndex !== undefined && userIndex !== -1) {
        setCurrentUserRank(userIndex + 1)
      } else {
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gt("total_coins", data?.[0]?.total_coins || 0)

        setCurrentUserRank((count || 0) + 1)
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 animate-pulse" />
            <Crown className="h-7 w-7 text-yellow-400 relative z-10 drop-shadow-lg" />
          </div>
        )
      case 2:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-slate-300 rounded-full blur-md opacity-30" />
            <Medal className="h-6 w-6 text-slate-300 relative z-10" />
          </div>
        )
      case 3:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-amber-600 rounded-full blur-md opacity-30" />
            <Award className="h-6 w-6 text-amber-600 relative z-10" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-sm">{rank}</span>
          </div>
        )
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur">
        <CardContent className="p-6">
          <p className="text-slate-400">Loading leaderboard...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-500/30 bg-gradient-to-br from-black via-yellow-950/30 to-black backdrop-blur shadow-2xl hover:border-yellow-400/50 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3 text-xl font-bold">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg shadow-lg">
            <Trophy className="h-5 w-5 text-black" />
          </div>
          <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
            LEADERBOARD
          </span>
        </CardTitle>
        {currentUserRank && (
          <p className="text-sm text-yellow-600 font-medium">
            Your rank: <span className="text-yellow-400 font-bold">#{currentUserRank}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {leaderboard.map((entry, index) => {
          const rank = index + 1
          const isCurrentUser = entry.id === currentUserId

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                isCurrentUser
                  ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                  : rank <= 3
                    ? "bg-gradient-to-r from-yellow-950/50 to-black border-yellow-500/20"
                    : "bg-black/50 border-yellow-500/10 hover:border-yellow-500/30"
              }`}
            >
              <div className="flex items-center justify-center w-12">{getRankIcon(rank)}</div>
              <Avatar className="h-11 w-11 border-2 border-yellow-500/30 ring-2 ring-yellow-500/10 shadow-lg">
                <AvatarImage src={entry.avatar_url || ""} alt={entry.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-yellow-600 to-amber-700 text-black text-sm font-bold">
                  {getInitials(entry.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${isCurrentUser ? "text-yellow-300" : "text-white"}`}>
                  {entry.display_name}
                  {isCurrentUser && <span className="text-xs ml-2 text-yellow-500">(You)</span>}
                </p>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <div className="flex items-center gap-1 text-yellow-400 font-bold">
                    <Coins className="h-3 w-3" />
                    <span>{entry.total_coins}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Flame className="h-3 w-3" />
                    <span>{entry.current_streak}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
