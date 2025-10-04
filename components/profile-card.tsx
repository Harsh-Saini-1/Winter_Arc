"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Coins, LogOut, Sparkles, Swords, Crown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ProfileCardProps {
  profile: {
    display_name: string
    avatar_url: string | null
    total_coins: number
  } | null
  user: {
    email?: string
  }
}

export function ProfileCard({ profile, user }: ProfileCardProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const initials =
    profile?.display_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const avatarUrl = profile?.avatar_url || ""

  return (
    <Card className="ornate-border bg-gradient-to-r from-black via-amber-950/30 to-black backdrop-blur-xl shadow-2xl hover:shadow-yellow-500/30 transition-all duration-700 overflow-hidden relative group power-pulse">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VhYjMwOCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      <div className="absolute top-4 left-4 text-yellow-500/20 text-6xl font-bold select-none">⚔</div>
      <div className="absolute bottom-4 right-4 text-yellow-500/20 text-6xl font-bold select-none">⚔</div>

      <CardContent className="p-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-full blur-2xl opacity-60 animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full animate-spin-slow opacity-50" />
              <Avatar className="h-20 w-20 border-4 border-yellow-500 ring-4 ring-yellow-500/30 relative z-10 shadow-2xl group-hover/avatar:scale-110 transition-transform duration-500">
                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={profile?.display_name || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 text-black text-2xl font-black">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full p-2 shadow-lg">
                <Crown className="h-4 w-4 text-black" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent tracking-tight runic-glow uppercase">
                {profile?.display_name || "User"}
              </h2>
              <p className="text-yellow-600 text-sm font-bold mt-2 flex items-center gap-2">
                <Swords className="h-4 w-4" />
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 via-amber-500/30 to-yellow-500/20 border-2 border-yellow-500/50 rounded-2xl px-6 py-4 shadow-2xl hover:scale-105 transition-all duration-300 power-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse relative z-10" />
              <Coins className="h-7 w-7 text-yellow-400 relative z-10" />
              <span className="text-yellow-300 font-black text-3xl relative z-10 tracking-wider">
                {profile?.total_coins || 0}
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="border-2 border-red-500/40 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 hover:border-red-500/60 font-black transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/30"
            >
              <LogOut className="h-5 w-5 mr-2" />
              SIGN OUT
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
