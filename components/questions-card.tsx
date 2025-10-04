"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Coins, ExternalLink, StickyNote, Sparkles, Brain } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Question {
  id: string
  title: string
  question_url: string
  difficulty: "easy" | "medium" | "hard"
  coins: number
  topic: string
  day_number: number
  question_order: number
  conceptual_difficulty: "beginner" | "intermediate" | "advanced"
}

interface QuestionsCardProps {
  userId: string
  dailyCompleted: number
}

export function QuestionsCard({ userId, dailyCompleted: initialDailyCompleted }: QuestionsCardProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set())
  const [todayCompleted, setTodayCompleted] = useState(initialDailyCompleted)
  const [loading, setLoading] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [currentNote, setCurrentNote] = useState("")
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [savingNote, setSavingNote] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadQuestions()
    loadNotes()
  }, [])

  const loadQuestions = async () => {
    try {
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .order("day_number", { ascending: true })
        .order("question_order", { ascending: true })

      if (questionsError) throw questionsError

      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("question_id")
        .eq("user_id", userId)

      if (progressError) throw progressError

      setQuestions(questionsData || [])
      setCompletedQuestions(new Set(progressData?.map((p) => p.question_id) || []))
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("question_notes")
        .select("question_id, note_content")
        .eq("user_id", userId)

      if (error) throw error

      const notesMap: Record<string, string> = {}
      data?.forEach((note) => {
        notesMap[note.question_id] = note.note_content
      })
      setNotes(notesMap)
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }

  const handleSaveNote = async (questionId: string) => {
    setSavingNote(true)
    try {
      const { error } = await supabase.from("question_notes").upsert({
        user_id: userId,
        question_id: questionId,
        note_content: currentNote,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setNotes({ ...notes, [questionId]: currentNote })
      setSelectedQuestionId(null)
      setCurrentNote("")
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setSavingNote(false)
    }
  }

  const handleQuestionComplete = useCallback(
    async (question: Question, checked: boolean) => {
      if (checked && todayCompleted >= 2) {
        return
      }

      try {
        if (checked) {
          setCompletedQuestions(new Set([...completedQuestions, question.id]))
          setTodayCompleted(todayCompleted + 1)

          console.log("[v0] Marking question as complete:", question.id)

          const { error: progressError } = await supabase.from("user_progress").insert({
            user_id: userId,
            question_id: question.id,
            coins_earned: question.coins,
          })

          if (progressError) {
            console.error("[v0] Error inserting progress:", progressError)
            throw progressError
          }

          // Update daily progress
          const today = new Date().toISOString().split("T")[0]
          const { data: dailyDataArray } = await supabase
            .from("daily_progress")
            .select("*")
            .eq("user_id", userId)
            .eq("date", today)

          const dailyData = dailyDataArray && dailyDataArray.length > 0 ? dailyDataArray[0] : null

          if (dailyData) {
            await supabase
              .from("daily_progress")
              .update({ questions_completed: dailyData.questions_completed + 1 })
              .eq("id", dailyData.id)
          } else {
            await supabase.from("daily_progress").insert({
              user_id: userId,
              date: today,
              questions_completed: 1,
            })
          }

          // Update profile coins and streak
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

          if (profile) {
            const newTotalCoins = profile.total_coins + question.coins
            const lastActivity = profile.last_activity_date
            let newStreak = profile.current_streak

            if (!lastActivity) {
              newStreak = 1
            } else {
              const lastDate = new Date(lastActivity)
              const todayDate = new Date(today)
              const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

              if (diffDays === 1 && todayCompleted + 1 === 2) {
                newStreak = profile.current_streak + 1
              } else if (diffDays > 1) {
                newStreak = 1
              }
            }

            await supabase
              .from("profiles")
              .update({
                total_coins: newTotalCoins,
                current_streak: newStreak,
                last_activity_date: today,
              })
              .eq("id", userId)

            checkAchievements(newTotalCoins, newStreak)
          }

          console.log("[v0] Question marked complete, refreshing...")
          router.refresh()
        } else {
          console.log("[v0] Unmarking question:", question.id)

          await supabase.from("user_progress").delete().eq("user_id", userId).eq("question_id", question.id)

          const newCompleted = new Set(completedQuestions)
          newCompleted.delete(question.id)
          setCompletedQuestions(newCompleted)

          router.refresh()
        }
      } catch (error) {
        console.error("[v0] Error updating progress:", error)
        // Revert optimistic update on error
        if (checked) {
          const newCompleted = new Set(completedQuestions)
          newCompleted.delete(question.id)
          setCompletedQuestions(newCompleted)
          setTodayCompleted(todayCompleted)
        }
      }
    },
    [completedQuestions, todayCompleted, userId, supabase, router],
  )

  const checkAchievements = async (coins: number, streak: number) => {
    const achievements = []

    if (coins >= 100) achievements.push({ type: "coins_100", name: "Century Club" })
    if (coins >= 500) achievements.push({ type: "coins_500", name: "Coin Master" })
    if (streak >= 7) achievements.push({ type: "streak_7", name: "Week Warrior" })
    if (streak >= 30) achievements.push({ type: "streak_30", name: "Monthly Master" })

    for (const achievement of achievements) {
      try {
        await supabase.from("achievements").insert({
          user_id: userId,
          achievement_type: achievement.type,
          achievement_name: achievement.name,
        })
      } catch (error) {
        // Achievement already exists, ignore
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getConceptualDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "intermediate":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "advanced":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const topics = ["all", ...Array.from(new Set(questions.map((q) => q.topic)))]
  const filteredQuestions = selectedTopic === "all" ? questions : questions.filter((q) => q.topic === selectedTopic)

  const questionsByDay = filteredQuestions.reduce(
    (acc, question) => {
      if (!acc[question.day_number]) {
        acc[question.day_number] = []
      }
      acc[question.day_number].push(question)
      return acc
    },
    {} as Record<number, Question[]>,
  )

  if (loading) {
    return (
      <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur">
        <CardContent className="p-6">
          <p className="text-slate-400">Loading questions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-yellow-500/30 bg-gradient-to-br from-black via-yellow-950/30 to-black backdrop-blur shadow-2xl hover:border-yellow-400/50 transition-all duration-500 overflow-hidden relative group">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-amber-500/5 animate-pulse" />

      <CardHeader className="relative z-10">
        <CardTitle className="text-white flex items-center gap-3 text-2xl font-bold">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
          <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
            DAILY QUESTIONS
          </span>
        </CardTitle>
        <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="w-full mt-4">
          <TabsList className="bg-black/50 border border-yellow-500/20 flex-wrap h-auto gap-2 p-2">
            {topics.map((topic) => (
              <TabsTrigger
                key={topic}
                value={topic}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-600 data-[state=active]:text-black data-[state=active]:font-bold text-yellow-400 hover:text-yellow-300 transition-all duration-300 rounded-lg px-4 py-2"
              >
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto custom-scrollbar relative z-10">
        <div className="space-y-6">
          {Object.entries(questionsByDay).map(([day, dayQuestions]) => (
            <div key={day} className="space-y-3">
              <h3 className="text-lg font-black text-yellow-300 mb-3 flex items-center gap-3">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 rounded-xl shadow-lg">
                  <span className="text-black font-black">DAY {day}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent" />
              </h3>
              {dayQuestions.map((question) => {
                const isCompleted = completedQuestions.has(question.id)
                const isDisabled = !isCompleted && todayCompleted >= 2
                const hasNote = notes[question.id]

                return (
                  <div
                    key={question.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                      isCompleted
                        ? "bg-gradient-to-r from-yellow-500/20 via-green-500/20 to-yellow-500/20 border-yellow-500/50 shadow-xl shadow-yellow-500/10"
                        : isDisabled
                          ? "bg-black/50 border-yellow-700/30 opacity-50 cursor-not-allowed"
                          : "bg-gradient-to-r from-black/80 to-yellow-950/50 border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-500/10"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleQuestionComplete(question, checked as boolean)}
                        disabled={isDisabled}
                        className="border-2 border-yellow-500 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-yellow-500 data-[state=checked]:to-amber-600 data-[state=checked]:border-yellow-400 w-6 h-6 rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={question.question_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-100 hover:text-yellow-300 transition-colors flex items-center gap-2 group mb-2"
                      >
                        <span className="truncate font-bold text-base">{question.title}</span>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-yellow-400" />
                      </a>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`${getDifficultyColor(question.difficulty)} font-bold uppercase text-xs px-3 py-1`}
                        >
                          {question.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getConceptualDifficultyColor(question.conceptual_difficulty)} font-semibold text-xs px-3 py-1`}
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          {question.conceptual_difficulty}
                        </Badge>
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg px-3 py-1 shadow-md">
                          <Coins className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-300 font-bold text-sm">{question.coins}</span>
                        </div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-shrink-0 ${hasNote ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" : "text-yellow-600 hover:bg-yellow-500/10"} hover:text-yellow-300 transition-all duration-300 rounded-lg p-2`}
                          onClick={() => {
                            setSelectedQuestionId(question.id)
                            setCurrentNote(notes[question.id] || "")
                          }}
                        >
                          <StickyNote className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gradient-to-br from-black via-yellow-950 to-black border-2 border-yellow-500/30">
                        <DialogHeader>
                          <DialogTitle className="text-yellow-100 text-xl font-bold flex items-center gap-2">
                            <StickyNote className="h-5 w-5 text-yellow-400" />
                            Notes for {question.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            placeholder="Write your notes here..."
                            className="bg-black/50 border-2 border-yellow-500/30 text-yellow-100 min-h-[200px] focus:border-yellow-400/50 rounded-lg"
                          />
                          <Button
                            onClick={() => handleSaveNote(question.id)}
                            disabled={savingNote}
                            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold text-base py-6 rounded-lg shadow-lg"
                          >
                            {savingNote ? "Saving..." : "Save Note"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
