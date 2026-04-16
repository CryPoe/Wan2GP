"use client"

import { Play, Pause, X, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface QueueItem {
  id: string
  prompt: string
  model: string
  status: "pending" | "processing" | "complete" | "error"
  progress?: number
  resolution: string
  frames: number
}

interface GenerationQueueProps {
  items: QueueItem[]
  onRemove: (id: string) => void
  onPause?: () => void
  onResume?: () => void
  isPaused?: boolean
}

export function GenerationQueue({ items, onRemove, onPause, onResume, isPaused }: GenerationQueueProps) {
  const pendingCount = items.filter(i => i.status === "pending").length
  const processingItem = items.find(i => i.status === "processing")

  if (items.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Queue</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {pendingCount} pending
          </span>
        </div>
        {onPause && onResume && (
          <button
            onClick={isPaused ? onResume : onPause}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            )}
          </button>
        )}
      </div>

      <div className="max-h-64 divide-y divide-border overflow-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 ${
              item.status === "processing" ? "bg-primary/5" : ""
            }`}
          >
            {/* Status icon */}
            <div className="flex-shrink-0">
              {item.status === "processing" ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : item.status === "complete" ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : item.status === "error" ? (
                <AlertCircle className="h-5 w-5 text-destructive" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.prompt}</p>
              <p className="text-xs text-muted-foreground">
                {item.model} &bull; {item.resolution} &bull; {item.frames} frames
              </p>
              {item.status === "processing" && item.progress !== undefined && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            {item.status === "pending" && (
              <button
                onClick={() => onRemove(item.id)}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
