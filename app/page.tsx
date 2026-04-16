"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ModelSelector } from "@/components/model-selector"
import { PromptInput } from "@/components/prompt-input"
import { GenerationSettings } from "@/components/generation-settings"
import { MediaUpload } from "@/components/media-upload"
import { GenerationProgress } from "@/components/generation-progress"
import { OutputGallery } from "@/components/output-gallery"
import { GenerationQueue } from "@/components/generation-queue"
import { Play, Plus, Sparkles, Zap, HardDrive, Cpu } from "lucide-react"

// Demo output items
const demoOutputs = [
  {
    id: "1",
    type: "video" as const,
    url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
    duration: "4.0s",
    resolution: "1280x720",
    createdAt: new Date(),
    prompt: "A cinematic shot of a neon-lit cityscape at night with rain falling",
  },
  {
    id: "2",
    type: "video" as const,
    url: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400",
    duration: "2.5s",
    resolution: "1024x576",
    createdAt: new Date(),
    prompt: "Abstract flowing particles in deep space with nebula colors",
  },
  {
    id: "3",
    type: "video" as const,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    duration: "3.0s",
    resolution: "1280x720",
    createdAt: new Date(),
    prompt: "Majestic mountain landscape with clouds rolling through the peaks",
  },
]

export default function Home() {
  const [model, setModel] = useState("ltx2_22B_distilled")
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [resolution, setResolution] = useState("1280x720")
  const [frames, setFrames] = useState(97)
  const [steps, setSteps] = useState(8)
  const [guidance, setGuidance] = useState(3.0)
  const [fps, setFps] = useState(24)
  const [seed, setSeed] = useState(-1)
  const [startImage, setStartImage] = useState<File | null>(null)
  const [endImage, setEndImage] = useState<File | null>(null)
  
  const [status, setStatus] = useState<"idle" | "loading" | "generating" | "decoding" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [outputs, setOutputs] = useState(demoOutputs)
  const [queue, setQueue] = useState<Array<{
    id: string
    prompt: string
    model: string
    status: "pending" | "processing" | "complete" | "error"
    progress?: number
    resolution: string
    frames: number
  }>>([])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setStatus("loading")
    setProgress(0)
    
    // Simulate loading model
    await new Promise(resolve => setTimeout(resolve, 1000))
    setStatus("generating")
    
    // Simulate generation progress
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setCurrentStep(i)
      setProgress(Math.min(90, (i / steps) * 90))
    }
    
    // Simulate decoding
    setStatus("decoding")
    await new Promise(resolve => setTimeout(resolve, 500))
    setProgress(100)
    
    setStatus("complete")
    
    // Add to outputs
    const newOutput = {
      id: Date.now().toString(),
      type: "video" as const,
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
      duration: `${(frames / fps).toFixed(1)}s`,
      resolution,
      createdAt: new Date(),
      prompt,
    }
    setOutputs(prev => [newOutput, ...prev])
    
    // Reset after delay
    setTimeout(() => setStatus("idle"), 2000)
  }

  const handleAddToQueue = () => {
    if (!prompt.trim()) return
    
    const newItem = {
      id: Date.now().toString(),
      prompt,
      model,
      status: "pending" as const,
      resolution,
      frames,
    }
    setQueue(prev => [...prev, newItem])
  }

  const handleRemoveFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id))
  }

  // Determine if current model supports images
  const supportsImages = model.includes("i2v") || model.includes("vace")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Stats bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">GPU:</span>
              <span className="text-sm font-medium">RTX 4090</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">VRAM:</span>
              <span className="text-sm font-medium">8.2 / 24 GB</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">Mode:</span>
              <span className="text-sm font-medium">Profile 4 (SDPA)</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Model loaded:</span>
              <span className="text-sm font-medium text-primary">LTX-2.3 Distilled</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
            {/* Left column - Controls */}
            <div className="space-y-6">
              {/* Model selection */}
              <div className="rounded-lg border border-border bg-card p-6">
                <ModelSelector value={model} onChange={setModel} />
              </div>

              {/* Prompt */}
              <div className="rounded-lg border border-border bg-card p-6">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  negativePrompt={negativePrompt}
                  onNegativePromptChange={setNegativePrompt}
                />
              </div>

              {/* Image inputs (conditional) */}
              {supportsImages && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">Input Media</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <MediaUpload
                      label="Start Image"
                      accept="image/*"
                      value={startImage}
                      onChange={setStartImage}
                      description="First frame of the video"
                    />
                    <MediaUpload
                      label="End Image (optional)"
                      accept="image/*"
                      value={endImage}
                      onChange={setEndImage}
                      description="Last frame of the video"
                    />
                  </div>
                </div>
              )}

              {/* Generation settings */}
              <div className="rounded-lg border border-border bg-card p-6">
                <GenerationSettings
                  resolution={resolution}
                  onResolutionChange={setResolution}
                  frames={frames}
                  onFramesChange={setFrames}
                  steps={steps}
                  onStepsChange={setSteps}
                  guidance={guidance}
                  onGuidanceChange={setGuidance}
                  fps={fps}
                  onFpsChange={setFps}
                  seed={seed}
                  onSeedChange={setSeed}
                />
              </div>

              {/* Generate buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || status !== "idle"}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play className="h-5 w-5" />
                  Generate Video
                </button>
                <button
                  onClick={handleAddToQueue}
                  disabled={!prompt.trim()}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" />
                  Add to Queue
                </button>
              </div>

              {/* Progress */}
              {status !== "idle" && (
                <GenerationProgress
                  status={status}
                  progress={progress}
                  currentStep={currentStep}
                  totalSteps={steps}
                  phase={status === "generating" ? "Denoising" : undefined}
                  onCancel={() => setStatus("idle")}
                />
              )}

              {/* Queue */}
              {queue.length > 0 && (
                <GenerationQueue
                  items={queue}
                  onRemove={handleRemoveFromQueue}
                />
              )}
            </div>

            {/* Right column - Output */}
            <div className="lg:sticky lg:top-20 lg:h-fit">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Output Gallery</h2>
                <OutputGallery
                  items={outputs}
                  onDelete={(id) => setOutputs(prev => prev.filter(item => item.id !== id))}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            WanGP by DeepBeepMeep &bull; Open Source Video Generation
          </p>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/g7efUW9jGV" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Discord
            </a>
            <a href="https://x.com/deepbeepmeep" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </a>
            <a href="https://github.com/deepbeepmeep/Wan2GP" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
