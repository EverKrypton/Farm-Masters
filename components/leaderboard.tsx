"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardProps {
  userId: string
}

interface LeaderboardUser {
  id: string
  displayName: string
  total_points: number
  rank: number
}

export default function Leaderboard({ userId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [userId])

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/leaderboard?userId=${userId}`)
      const data = await response.json()

      if (data.leaderboard) {
        setLeaderboard(data.leaderboard || [])
        setUserRank(data.userRank)
      } else {
        console.error("Failed to fetch leaderboard:", data.error)
      }
    } catch (error) {
      console.error("Leaderboard fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-white/70 font-bold text-sm">#{rank}</span>
    }
  }

  if (loading) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-4 text-center text-white">Loading leaderboard...</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {leaderboard.length === 0 ? (
            <p className="text-white/70 text-center">No users on the leaderboard yet.</p>
          ) : (
            leaderboard.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.id === userId ? "bg-blue-500/20 border border-blue-500/30" : "bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(user.rank)}
                  <div>
                    <div className="text-white font-medium">
                      {user.displayName}
                      {user.id === userId && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold">{user.total_points.toLocaleString()}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {userRank &&
        userRank > 100 && ( // Only show if user is not in top 100
          <Card className="bg-blue-500/20 border-blue-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-white">
                <div className="text-lg font-bold">Your Rank: #{userRank}</div>
                <div className="text-sm text-white/70">Keep playing to climb higher!</div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}
