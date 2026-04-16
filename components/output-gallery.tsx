"use client"

import { useState } from "react"
import { Play, Download, Expand, Clock, Film, Trash2 } from "lucide-react"

interface OutputItem {
  id: string
  type: "video" | "image"
  url: string
  thumbnail: string
  duration?: string
  resolution: string
  createdAt: Date
  prompt: string
}

interface OutputGalleryProps {
  items: OutputItem[]
  onSelect?: (item: OutputItem) => void
  onDelete?: (id: string) => void
}

export function OutputGallery({ items, onSelect, onDelete }: OutputGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedItem = items.find(item => item.id === selectedId)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
        <Film className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-lg font-medium text-muted-foreground">No videos yet</p>
        <p className="text-sm text-muted-foreground">Your generated videos will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main viewer */}
      {selectedItem && (
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
          {selectedItem.type === "video" ? (
            <video
              src={selectedItem.url}
              controls
              autoPlay
              className="h-full w-full object-contain"
            />
          ) : (
            <img
              src={selectedItem.url}
              alt="Generated output"
              className="h-full w-full object-contain"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
            <div>
              <p className="text-sm text-white/80">{selectedItem.resolution}</p>
              {selectedItem.duration && (
                <p className="text-xs text-white/60">{selectedItem.duration}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="flex h-9 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <Download className="h-4 w-4" />
                Download
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <Expand className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt display */}
      {selectedItem && (
        <div className="rounded-lg border border-border bg-card p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prompt</p>
          <p className="mt-1 text-sm text-foreground">{selectedItem.prompt}</p>
        </div>
      )}

      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedId(item.id)
              onSelect?.(item)
            }}
            className={`group relative aspect-video overflow-hidden rounded-lg border transition-all ${
              selectedId === item.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-border hover:border-muted-foreground/50"
            }`}
          >
            <img
              src={item.thumbnail}
              alt="Output thumbnail"
              className="h-full w-full object-cover"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-8 w-8 text-white" />
              </div>
            )}
            {item.duration && (
              <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                <Clock className="h-3 w-3" />
                {item.duration}
              </div>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
