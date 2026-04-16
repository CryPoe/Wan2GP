"use client"

import { useState } from "react"
import { Wand2, Loader2, ChevronDown } from "lucide-react"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  negativePrompt: string
  onNegativePromptChange: (value: string) => void
}

export function PromptInput({ value, onChange, negativePrompt, onNegativePromptChange }: PromptInputProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showNegative, setShowNegative] = useState(false)

  const handleEnhance = async () => {
    if (!value.trim() || isEnhancing) return
    setIsEnhancing(true)
    // Simulate prompt enhancement
    await new Promise(resolve => setTimeout(resolve, 1500))
    onChange(`[VISUAL] ${value}. Cinematic lighting, 4K quality, professional cinematography, smooth motion, detailed textures. [SOUND] Ambient background sounds matching the scene.`)
    setIsEnhancing(false)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className="mb-2 block text-sm font-medium text-muted-foreground">Prompt</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the video you want to generate..."
          className="min-h-[120px] w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleEnhance}
          disabled={!value.trim() || isEnhancing}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEnhancing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Enhance
        </button>
      </div>
      
      <button
        onClick={() => setShowNegative(!showNegative)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${showNegative ? 'rotate-180' : ''}`} />
        Negative Prompt
      </button>
      
      {showNegative && (
        <div>
          <textarea
            value={negativePrompt}
            onChange={(e) => onNegativePromptChange(e.target.value)}
            placeholder="What to avoid in the generation..."
            className="min-h-[80px] w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </div>
  )
}
