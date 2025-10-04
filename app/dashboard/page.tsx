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
    <div className="min-h-screen bg-gradient-to-br from-black via-amber-950/20 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Anime floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/50 rounded-full anime-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto space-y-6 p-6 relative z-10">
        <div className="epic-slide-in">
          <ProfileCard profile={profile} user={user} />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 epic-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <StatsCards
            totalCompleted={completedCount || 0}
            dailyCompleted={dailyProgress?.questions_completed || 0}
            currentStreak={profile?.current_streak || 0}
          />
          <StressReliefCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 epic-fade-in" style={{ animationDelay: "0.4s" }}>
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
