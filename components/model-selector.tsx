"use client"

import { useState } from "react"
import { ChevronDown, Check, Sparkles, Zap, Image, Film, Music } from "lucide-react"

type ModelCategory = "text2video" | "image2video" | "video2video" | "audio"

interface Model {
  id: string
  name: string
  description: string
  category: ModelCategory
  downloaded: boolean
  vram: string
  tags?: string[]
}

const models: Model[] = [
  { id: "ltx2_22B_distilled", name: "LTX-2.3 Distilled 22B", description: "Fast generation with excellent quality", category: "text2video", downloaded: true, vram: "8GB+", tags: ["Audio", "Fast"] },
  { id: "t2v", name: "Wan2.1 Text2Video 14B", description: "The original Wan model for text to video", category: "text2video", downloaded: true, vram: "6GB+" },
  { id: "hunyuan", name: "Hunyuan Video 720p 13B", description: "High quality text to video generation", category: "text2video", downloaded: false, vram: "12GB+" },
  { id: "i2v", name: "Wan2.1 Image2Video 480p", description: "Animate images with AI", category: "image2video", downloaded: true, vram: "6GB+" },
  { id: "i2v_720p", name: "Wan2.1 Image2Video 720p", description: "Higher resolution image animation", category: "image2video", downloaded: false, vram: "10GB+" },
  { id: "vace_14B", name: "VACE 14B", description: "Video-to-video transformation", category: "video2video", downloaded: false, vram: "12GB+" },
  { id: "ltx2_22B", name: "LTX-2.3 Dev 22B", description: "Development model with more control", category: "text2video", downloaded: false, vram: "16GB+", tags: ["Pro"] },
  { id: "ace_step_v1_5", name: "Ace Step 1.5", description: "AI song generation from lyrics", category: "audio", downloaded: false, vram: "8GB+" },
]

const categoryIcons = {
  text2video: Film,
  image2video: Image,
  video2video: Sparkles,
  audio: Music,
}

const categoryLabels = {
  text2video: "Text to Video",
  image2video: "Image to Video",
  video2video: "Video to Video",
  audio: "Audio Generation",
}

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const selectedModel = models.find(m => m.id === value) || models[0]

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-muted-foreground">Model</label>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:border-muted-foreground/50"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedModel.downloaded ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {(() => {
              const Icon = categoryIcons[selectedModel.category]
              return <Icon className="h-4 w-4" />
            })()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{selectedModel.name}</span>
              {selectedModel.downloaded && (
                <span className="h-2 w-2 rounded-full bg-success" title="Downloaded" />
              )}
              {selectedModel.tags?.map(tag => (
                <span key={tag} className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{selectedModel.description}</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-lg border border-border bg-card shadow-xl">
            {(Object.keys(categoryLabels) as ModelCategory[]).map(category => {
              const categoryModels = models.filter(m => m.category === category)
              if (categoryModels.length === 0) return null
              
              const Icon = categoryIcons[category]
              
              return (
                <div key={category}>
                  <div className="sticky top-0 flex items-center gap-2 bg-card/95 px-4 py-2 backdrop-blur-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {categoryLabels[category]}
                    </span>
                  </div>
                  {categoryModels.map(model => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onChange(model.id)
                        setOpen(false)
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${
                          model.downloaded ? 'bg-success' : 'bg-muted'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{model.name}</span>
                            {model.tags?.map(tag => (
                              <span key={tag} className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{model.description}</span>
                            <span className="text-xs">({model.vram})</span>
                          </div>
                        </div>
                      </div>
                      {value === model.id && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
