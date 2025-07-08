"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AnimatedCard } from "./animated-card"
import { motion } from "framer-motion"
import { Gem, Clock } from "lucide-react"

interface Resource {
  id: string
  name: string
  amount: number
  icon: string
  harvestRate: number
  lastHarvest: number
}

interface ResourceManagerProps {
  resources: Resource[]
  onHarvest: () => void
}

export function ResourceManager({ resources, onHarvest }: ResourceManagerProps) {
  const getHarvestProgress = (resource: Resource) => {
    const timeSinceLastHarvest = Date.now() - resource.lastHarvest
    const hoursElapsed = timeSinceLastHarvest / (1000 * 60 * 60)
    const progress = Math.min(100, (hoursElapsed / 1) * 100) // 1 hour cycle
    return progress
  }

  const getTimeUntilNextHarvest = (resource: Resource) => {
    const timeSinceLastHarvest = Date.now() - resource.lastHarvest
    const timeUntilNext = Math.max(0, 1000 * 60 * 60 - timeSinceLastHarvest) // 1 hour
    const minutes = Math.floor(timeUntilNext / (1000 * 60))
    return minutes
  }

  return (
    <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
          <Gem className="w-4 md:w-5 h-4 md:h-5 text-green-400 animate-pulse" />
          Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{resource.icon}</span>
                <div>
                  <span className="text-white font-medium text-sm">{resource.name}</span>
                  <div className="text-xs text-gray-400">{resource.amount} owned</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 text-sm font-bold">+{resource.harvestRate}/hr</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeUntilNextHarvest(resource)}m
                </div>
              </div>
            </div>
            <Progress value={getHarvestProgress(resource)} className="h-1" />
          </motion.div>
        ))}

        <Button
          onClick={onHarvest}
          className="w-full bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300 text-sm"
        >
          <Gem className="w-4 h-4 mr-2" />
          Harvest All (-10 Energy)
        </Button>
      </CardContent>
    </AnimatedCard>
  )
}
