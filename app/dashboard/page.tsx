import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileCard } from "@/components/profile-card"
import { StatsCards } from "@/components/stats-cards"
import { QuestionsCard } from "@/components/questions-card"
import { LeaderboardCard } from "@/components/leaderboard-card"
import { StressReliefCard } from "@/components/stress-relief-card"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch today's progress
  const today = new Date().toISOString().split("T")[0]
  const { data: dailyProgressData } = await supabase
    .from("daily_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)

  const dailyProgress = dailyProgressData && dailyProgressData.length > 0 ? dailyProgressData[0] : null

  const { count: completedCount } = await supabase
    .from("user_progress")
    .select("*", { count: "only", head: true })
    .eq("user_id", user.id)

  console.log("[v0] Dashboard - Total completed:", completedCount)
  console.log("[v0] Dashboard - Daily completed:", dailyProgress?.questions_completed || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 p-6 relative z-10">
        <div>
          <ProfileCard profile={profile} user={user} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCards
            totalCompleted={completedCount || 0}
            dailyCompleted={dailyProgress?.questions_completed || 0}
            currentStreak={profile?.current_streak || 0}
          />
          <StressReliefCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuestionsCard userId={user.id} dailyCompleted={dailyProgress?.questions_completed || 0} />
          </div>
          <div className="lg:col-span-1">
            <LeaderboardCard currentUserId={user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
