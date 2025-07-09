"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface GenerationInterfaceProps {
  onGenerate: (prompt: string, negative_prompt: string, steps: number, cfg_scale: number, seed: number) => void
  isGenerating: boolean
}

const GenerationInterface: React.FC<GenerationInterfaceProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState<string>("")
  const [negativePrompt, setNegativePrompt] = useState<string>("")
  const [steps, setSteps] = useState<number>(20)
  const [cfgScale, setCfgScale] = useState<number>(7)
  const [seed, setSeed] = useState<number>(54321)
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt.",
      })
      return
    }
    onGenerate(prompt, negativePrompt, steps, cfgScale, seed)
  }

  return (
    <Tabs defaultValue="prompt" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="prompt">Prompt</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="prompt">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="negative_prompt">Negative Prompt</Label>
            <Textarea
              id="negative_prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Enter your negative prompt here."
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </TabsContent>
      <TabsContent value="settings">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="steps">Steps</Label>
            <Slider
              id="steps"
              defaultValue={[steps]}
              max={100}
              min={1}
              step={1}
              onValueChange={(value) => setSteps(value[0])}
            />
            <Input type="number" value={steps} onChange={(e) => setSteps(Number.parseInt(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cfg_scale">CFG Scale</Label>
            <Slider
              id="cfg_scale"
              defaultValue={[cfgScale]}
              max={20}
              min={1}
              step={0.5}
              onValueChange={(value) => setCfgScale(value[0])}
            />
            <Input type="number" value={cfgScale} onChange={(e) => setCfgScale(Number.parseInt(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="seed">Seed</Label>
            <Input type="number" id="seed" value={seed} onChange={(e) => setSeed(Number.parseInt(e.target.value))} />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default GenerationInterface
