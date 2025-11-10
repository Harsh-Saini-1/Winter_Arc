"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Coins, LogOut } from "lucide-react"
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
    <Card className="border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-slate-600 shadow-sm">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={profile?.display_name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold text-white">{profile?.display_name || "User"}</h2>
              <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 shadow-sm">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="text-white font-semibold">{profile?.total_coins || 0}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:border-slate-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
