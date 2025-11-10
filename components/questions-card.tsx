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
      <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur">
        <CardContent className="p-6">
          <p className="text-slate-400">Loading questions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-200 flex items-center gap-3 text-lg font-semibold">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-slate-100 uppercase tracking-wide">Daily Questions</span>
        </CardTitle>
        <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="w-full mt-4">
          <TabsList className="bg-slate-800/50 border border-slate-700 flex-wrap h-auto gap-2 p-2">
            {topics.map((topic) => (
              <TabsTrigger
                key={topic}
                value={topic}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-semibold text-slate-400 hover:text-slate-200 transition-colors rounded-md px-3 py-1 text-sm"
              >
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {Object.entries(questionsByDay).map(([day, dayQuestions]) => (
            <div key={day} className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-3">
                <div className="bg-slate-700 px-3 py-1 rounded-md">
                  <span className="text-slate-200 font-semibold">DAY {day}</span>
                </div>
                <div className="h-px flex-1 bg-slate-700" />
              </h3>
              {dayQuestions.map((question) => {
                const isCompleted = completedQuestions.has(question.id)
                const isDisabled = !isCompleted && todayCompleted >= 2
                const hasNote = notes[question.id]

                return (
                  <div
                    key={question.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-blue-500/10 border-blue-500/30 shadow-sm"
                        : isDisabled
                          ? "bg-slate-900/50 border-slate-700 opacity-50 cursor-not-allowed"
                          : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => handleQuestionComplete(question, checked as boolean)}
                        disabled={isDisabled}
                        className="border-2 border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-400 w-5 h-5 rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={question.question_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 hover:text-blue-400 transition-colors flex items-center gap-2 group mb-2"
                      >
                        <span className="truncate font-medium text-sm">{question.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-blue-400" />
                      </a>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`${getDifficultyColor(question.difficulty)} font-semibold uppercase text-xs px-2 py-1`}
                        >
                          {question.difficulty}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`${getConceptualDifficultyColor(question.conceptual_difficulty)} font-semibold text-xs px-2 py-1`}
                        >
                          <Brain className="h-3 w-3 mr-1" />
                          {question.conceptual_difficulty}
                        </Badge>
                        <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1 shadow-sm">
                          <Coins className="h-3 w-3 text-blue-400" />
                          <span className="text-blue-300 font-semibold text-xs">{question.coins}</span>
                        </div>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex-shrink-0 ${hasNote ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-slate-500 hover:bg-slate-700/50"} hover:text-blue-300 transition-all rounded-lg p-2 h-8 w-8`}
                          onClick={() => {
                            setSelectedQuestionId(question.id)
                            setCurrentNote(notes[question.id] || "")
                          }}
                        >
                          <StickyNote className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-slate-200 text-lg font-semibold flex items-center gap-2">
                            <StickyNote className="h-5 w-5 text-blue-400" />
                            Notes for {question.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            value={currentNote}
                            onChange={(e) => setCurrentNote(e.target.value)}
                            placeholder="Write your notes here..."
                            className="bg-slate-800 border-slate-700 text-slate-200 min-h-[200px] focus:border-blue-500 rounded-lg"
                          />
                          <Button
                            onClick={() => handleSaveNote(question.id)}
                            disabled={savingNote}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
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
