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
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50 animate-pulse" />
            <Crown className="h-7 w-7 text-blue-500 relative z-10 drop-shadow-lg" />
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
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-30" />
            <Award className="h-6 w-6 text-blue-600 relative z-10" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 font-bold text-sm">{rank}</span>
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
      <Card className="border-slate-700/20 bg-slate-900/50 backdrop-blur">
        <CardContent className="p-6">
          <p className="text-slate-400">Loading leaderboard...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-200 flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Trophy className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-slate-100 uppercase tracking-wide">Leaderboard</span>
        </CardTitle>
        {currentUserRank && (
          <p className="text-xs text-slate-400 font-medium mt-2">
            Your rank: <span className="text-blue-400 font-semibold">#{currentUserRank}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
        {leaderboard.map((entry, index) => {
          const rank = index + 1
          const isCurrentUser = entry.id === currentUserId

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-sm ${
                isCurrentUser
                  ? "bg-blue-500/10 border-blue-500/30 shadow-sm"
                  : rank <= 3
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-center w-8">{getRankIcon(rank)}</div>
              <Avatar className="h-9 w-9 border border-slate-700 ring-1 ring-slate-600/50">
                <AvatarImage src={entry.avatar_url || ""} alt={entry.display_name} />
                <AvatarFallback className="bg-blue-600/20 text-blue-300 text-xs font-semibold">
                  {getInitials(entry.display_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate text-sm ${isCurrentUser ? "text-blue-300" : "text-slate-200"}`}>
                  {entry.display_name}
                  {isCurrentUser && <span className="text-xs ml-2 text-blue-400">(You)</span>}
                </p>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <div className="flex items-center gap-1 text-blue-400 font-semibold">
                    <Coins className="h-3 w-3" />
                    <span>{entry.total_coins}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
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
