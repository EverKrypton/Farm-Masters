"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { AnimatedCard } from "./animated-card"
import { useToast } from "@/hooks/use-toast"
import { useSound } from "./sound-manager"
import { motion } from "framer-motion"
import { Users, Crown, Shield, Trophy, Plus, Star, Target, MessageCircle, UserPlus } from "lucide-react"

interface Guild {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  level: number
  experience: number
  maxExperience: number
  leader: string
  emblem: string
  requirements: {
    minLevel: number
    minNFTs: number
  }
  perks: string[]
  activities: GuildActivity[]
}

interface GuildActivity {
  id: string
  name: string
  description: string
  reward: string
  progress: number
  target: number
  participants: number
  timeLeft: string
}

interface GuildMember {
  address: string
  name: string
  level: number
  contribution: number
  role: "Leader" | "Officer" | "Member"
  joinDate: string
}

const mockGuilds: Guild[] = [
  {
    id: "1",
    name: "Dragon Slayers",
    description: "Elite warriors dedicated to hunting the most powerful dragons in the realm.",
    memberCount: 45,
    maxMembers: 50,
    level: 15,
    experience: 8750,
    maxExperience: 10000,
    leader: "DragonMaster",
    emblem: "🐉",
    requirements: {
      minLevel: 20,
      minNFTs: 5,
    },
    perks: ["+20% Battle XP", "Exclusive Dragon NFTs", "Weekly Tournaments"],
    activities: [
      {
        id: "1",
        name: "Dragon Hunt",
        description: "Defeat 100 Fire Dragons as a guild",
        reward: "Legendary Dragon Egg NFT",
        progress: 67,
        target: 100,
        participants: 23,
        timeLeft: "2d 14h",
      },
    ],
  },
  {
    id: "2",
    name: "Crystal Miners",
    description: "Master resource gatherers focused on crystal mining and trading.",
    memberCount: 38,
    maxMembers: 40,
    level: 12,
    experience: 6200,
    maxExperience: 8000,
    leader: "CrystalKing",
    emblem: "💎",
    requirements: {
      minLevel: 15,
      minNFTs: 3,
    },
    perks: ["+30% Resource Yield", "Crystal Marketplace Access", "Mining Bonuses"],
    activities: [
      {
        id: "2",
        name: "Crystal Rush",
        description: "Collect 10,000 crystals collectively",
        reward: "Rare Crystal Tools",
        progress: 7500,
        target: 10000,
        participants: 31,
        timeLeft: "1d 8h",
      },
    ],
  },
  {
    id: "3",
    name: "Mystic Scholars",
    description: "Knowledge seekers exploring the mysteries of the magical realm.",
    memberCount: 25,
    maxMembers: 30,
    level: 18,
    experience: 9100,
    maxExperience: 10000,
    leader: "ArchMage",
    emblem: "🔮",
    requirements: {
      minLevel: 25,
      minNFTs: 8,
    },
    perks: ["+25% Quest XP", "Spell Research", "Ancient Knowledge Access"],
    activities: [
      {
        id: "3",
        name: "Ancient Ruins",
        description: "Explore 50 ancient ruins for artifacts",
        reward: "Mystic Tome Collection",
        progress: 32,
        target: 50,
        participants: 18,
        timeLeft: "3d 22h",
      },
    ],
  },
]

const mockGuildMembers: GuildMember[] = [
  {
    address: "0x742d35Cc...4d8b6",
    name: "DragonMaster",
    level: 45,
    contribution: 2500,
    role: "Leader",
    joinDate: "2023-01-15",
  },
  {
    address: "0x8ba1f109...3a9",
    name: "FireKnight",
    level: 38,
    contribution: 1800,
    role: "Officer",
    joinDate: "2023-02-20",
  },
  {
    address: "0x123abc45...def",
    name: "IceWarrior",
    level: 32,
    contribution: 1200,
    role: "Member",
    joinDate: "2023-03-10",
  },
]

export function GuildSystem() {
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null)
  const [userGuild, setUserGuild] = useState<Guild | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<"browse" | "my-guild" | "activities">("browse")

  const { toast } = useToast()
  const { playSound } = useSound()

  const joinGuild = async (guild: Guild) => {
    playSound("success")
    setUserGuild(guild)
    toast({
      title: "Guild Joined!",
      description: `Welcome to ${guild.name}! You are now a member.`,
    })
  }

  const leaveGuild = async () => {
    playSound("click")
    setUserGuild(null)
    toast({
      title: "Left Guild",
      description: "You have left your guild.",
    })
  }

  const createGuild = async (guildData: any) => {
    playSound("success")
    toast({
      title: "Guild Created!",
      description: "Your new guild has been established successfully.",
    })
    setShowCreateDialog(false)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Leader":
        return "bg-yellow-600"
      case "Officer":
        return "bg-purple-600"
      default:
        return "bg-blue-600"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Leader":
        return <Crown className="w-3 h-3" />
      case "Officer":
        return <Shield className="w-3 h-3" />
      default:
        return <Users className="w-3 h-3" />
    }
  }

  if (activeTab === "my-guild" && userGuild) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{userGuild.emblem}</span>
            {userGuild.name}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab("browse")}
              className="border-gray-600 text-white bg-transparent hover:bg-white/10"
            >
              Browse Guilds
            </Button>
            <Button variant="destructive" onClick={leaveGuild} className="bg-red-600 hover:bg-red-700">
              Leave Guild
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guild Info */}
          <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Guild Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{userGuild.emblem}</div>
                <h3 className="text-white font-bold text-lg">{userGuild.name}</h3>
                <p className="text-gray-400 text-sm">{userGuild.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-white">
                  <span>Level</span>
                  <span className="font-bold text-yellow-400">{userGuild.level}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-white">
                    <span>Experience</span>
                    <span>
                      {userGuild.experience} / {userGuild.maxExperience}
                    </span>
                  </div>
                  <Progress value={(userGuild.experience / userGuild.maxExperience) * 100} className="h-2" />
                </div>
                <div className="flex justify-between text-white">
                  <span>Members</span>
                  <span className="font-bold">
                    {userGuild.memberCount} / {userGuild.maxMembers}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Guild Perks</h4>
                <div className="space-y-1">
                  {userGuild.perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-green-400">
                      <Star className="w-3 h-3" />
                      {perk}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Guild Activities */}
          <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userGuild.activities.map((activity) => (
                <div key={activity.id} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{activity.name}</h4>
                    <Badge className="bg-blue-600 text-white text-xs">{activity.timeLeft}</Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{activity.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Progress</span>
                      <span className="text-blue-400">
                        {activity.progress} / {activity.target}
                      </span>
                    </div>
                    <Progress value={(activity.progress / activity.target) * 100} className="h-1" />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{activity.participants} participants</span>
                      <span className="text-yellow-400">{activity.reward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </AnimatedCard>

          {/* Guild Members */}
          <AnimatedCard className="bg-black/40 border-white/10" delay={400}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Members ({mockGuildMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockGuildMembers.map((member, index) => (
                <motion.div
                  key={member.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{member.name}</span>
                        <Badge className={`${getRoleColor(member.role)} text-white text-xs flex items-center gap-1`}>
                          {getRoleIcon(member.role)}
                          {member.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Lv.{member.level}</span>
                        <span>•</span>
                        <span>{member.contribution} pts</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                    <MessageCircle className="w-3 h-3" />
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </AnimatedCard>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Guild System</h2>
        <div className="flex gap-2">
          {userGuild && (
            <Button
              onClick={() => setActiveTab("my-guild")}
              className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              My Guild
            </Button>
          )}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Create Guild
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-md mx-4">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Guild</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guild-name" className="text-white">
                    Guild Name
                  </Label>
                  <Input
                    id="guild-name"
                    placeholder="Enter guild name"
                    className="bg-gray-800 border-gray-600 text-white mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="guild-emblem" className="text-white">
                    Emblem (Emoji)
                  </Label>
                  <Input id="guild-emblem" placeholder="🏰" className="bg-gray-800 border-gray-600 text-white mt-1" />
                </div>
                <div>
                  <Label htmlFor="guild-description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="guild-description"
                    placeholder="Describe your guild's purpose and goals"
                    className="bg-gray-800 border-gray-600 text-white mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min-level" className="text-white">
                      Min Level
                    </Label>
                    <Input
                      id="min-level"
                      type="number"
                      placeholder="1"
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-members" className="text-white">
                      Max Members
                    </Label>
                    <Input
                      id="max-members"
                      type="number"
                      placeholder="50"
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                    />
                  </div>
                </div>
                <Button onClick={() => createGuild({})} className="w-full bg-green-600 hover:bg-green-700">
                  Create Guild (0.05 ETH)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGuilds.map((guild, index) => (
          <AnimatedCard
            key={guild.id}
            className="bg-black/40 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
            delay={index * 100}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{guild.emblem}</div>
                  <div>
                    <CardTitle className="text-white text-lg">{guild.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-yellow-600 text-white text-xs">Lv.{guild.level}</Badge>
                      <span className="text-gray-400 text-sm">
                        {guild.memberCount}/{guild.maxMembers} members
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{guild.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-white">
                  <span>Guild XP</span>
                  <span>
                    {guild.experience} / {guild.maxExperience}
                  </span>
                </div>
                <Progress value={(guild.experience / guild.maxExperience) * 100} className="h-1" />
              </div>

              <div>
                <h4 className="text-white font-medium text-sm mb-2">Requirements</h4>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    Lv.{guild.requirements.minLevel}+
                  </Badge>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {guild.requirements.minNFTs}+ NFTs
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium text-sm mb-2">Perks</h4>
                <div className="space-y-1">
                  {guild.perks.slice(0, 2).map((perk, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-green-400">
                      <Star className="w-3 h-3" />
                      {perk}
                    </div>
                  ))}
                  {guild.perks.length > 2 && (
                    <div className="text-xs text-gray-400">+{guild.perks.length - 2} more perks</div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                {userGuild ? (
                  <Button disabled className="w-full bg-gray-600 text-gray-400">
                    Already in Guild
                  </Button>
                ) : (
                  <Button
                    onClick={() => joinGuild(guild)}
                    className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Guild
                  </Button>
                )}
              </div>
            </CardContent>
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}
