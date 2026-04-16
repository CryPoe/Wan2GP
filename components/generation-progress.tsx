"use client"

import { Loader2, StopCircle, CheckCircle2 } from "lucide-react"

interface GenerationProgressProps {
  status: "idle" | "loading" | "generating" | "decoding" | "complete" | "error"
  progress: number
  currentStep?: number
  totalSteps?: number
  phase?: string
  onCancel?: () => void
  previewUrl?: string
}

export function GenerationProgress({
  status,
  progress,
  currentStep,
  totalSteps,
  phase,
  onCancel,
  previewUrl,
}: GenerationProgressProps) {
  if (status === "idle") return null

  const statusLabels = {
    idle: "Ready",
    loading: "Loading model...",
    generating: phase || "Generating...",
    decoding: "Decoding video...",
    complete: "Complete!",
    error: "Error occurred",
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === "complete" ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : status === "error" ? (
            <div className="h-5 w-5 rounded-full bg-destructive" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          )}
          <div>
            <p className="font-medium">{statusLabels[status]}</p>
            {currentStep !== undefined && totalSteps !== undefined && (
              <p className="text-sm text-muted-foreground">
                Step {currentStep} / {totalSteps}
              </p>
            )}
          </div>
        </div>
        {status !== "complete" && status !== "error" && onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            <StopCircle className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full transition-all duration-300 ${
            status === "complete" ? "bg-success" : status === "error" ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{progress.toFixed(0)}%</span>
        {status === "generating" && (
          <span className="animate-pulse">ETA: calculating...</span>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">Preview</p>
          <div className="overflow-hidden rounded-lg border border-border">
            <img src={previewUrl} alt="Generation preview" className="w-full" />
          </div>
        </div>
      )}
    </div>
  )
}
