"use client"

import { useState } from "react"
import { ChevronDown, Info } from "lucide-react"

interface GenerationSettingsProps {
  resolution: string
  onResolutionChange: (value: string) => void
  frames: number
  onFramesChange: (value: number) => void
  steps: number
  onStepsChange: (value: number) => void
  guidance: number
  onGuidanceChange: (value: number) => void
  fps: number
  onFpsChange: (value: number) => void
  seed: number
  onSeedChange: (value: number) => void
}

const resolutions = [
  { value: "512x512", label: "512 x 512", aspect: "1:1" },
  { value: "768x512", label: "768 x 512", aspect: "3:2" },
  { value: "1024x576", label: "1024 x 576", aspect: "16:9" },
  { value: "1280x720", label: "1280 x 720", aspect: "16:9 HD" },
  { value: "1920x1080", label: "1920 x 1080", aspect: "16:9 FHD" },
  { value: "576x1024", label: "576 x 1024", aspect: "9:16" },
  { value: "720x1280", label: "720 x 1280", aspect: "9:16 HD" },
]

export function GenerationSettings({
  resolution,
  onResolutionChange,
  frames,
  onFramesChange,
  steps,
  onStepsChange,
  guidance,
  onGuidanceChange,
  fps,
  onFpsChange,
  seed,
  onSeedChange,
}: GenerationSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const selectedResolution = resolutions.find(r => r.value === resolution) || resolutions[3]
  const duration = (frames / fps).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Resolution */}
      <div>
        <label className="mb-2 block text-sm font-medium text-muted-foreground">Resolution</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {resolutions.map((res) => (
            <button
              key={res.value}
              onClick={() => onResolutionChange(res.value)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                resolution === res.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
              }`}
            >
              <div className="font-medium">{res.label}</div>
              <div className="text-xs opacity-70">{res.aspect}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration / Frames */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Video Length</label>
            <span className="text-sm text-foreground">{frames} frames ({duration}s)</span>
          </div>
          <input
            type="range"
            min={25}
            max={241}
            step={8}
            value={frames}
            onChange={(e) => onFramesChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>1s</span>
            <span>10s</span>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Inference Steps</label>
            <span className="text-sm text-foreground">{steps}</span>
          </div>
          <input
            type="range"
            min={4}
            max={50}
            step={1}
            value={steps}
            onChange={(e) => onStepsChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Fast</span>
            <span>Quality</span>
          </div>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        Advanced Settings
      </button>

      {showAdvanced && (
        <div className="space-y-6 rounded-lg border border-border bg-card/50 p-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  CFG Scale
                  <Info className="h-3 w-3 cursor-help" title="Controls how closely the generation follows your prompt" />
                </label>
                <span className="text-sm text-foreground">{guidance.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={guidance}
                onChange={(e) => onGuidanceChange(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground">FPS</label>
                <span className="text-sm text-foreground">{fps}</span>
              </div>
              <input
                type="range"
                min={8}
                max={30}
                step={1}
                value={fps}
                onChange={(e) => onFpsChange(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Seed</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={seed}
                onChange={(e) => onSeedChange(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => onSeedChange(Math.floor(Math.random() * 2147483647))}
                className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/80"
              >
                Random
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">-1 for random seed each generation</p>
          </div>
        </div>
      )}
    </div>
  )
}
