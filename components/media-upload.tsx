"use client"

import { useState, useCallback } from "react"
import { Upload, X, Image as ImageIcon, Film } from "lucide-react"

interface MediaUploadProps {
  label: string
  accept?: string
  value: File | null
  onChange: (file: File | null) => void
  description?: string
}

export function MediaUpload({ label, accept = "image/*,video/*", value, onChange, description }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      onChange(file)
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file))
      }
    }
  }, [onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
      if (file.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(file))
      }
    }
  }

  const handleClear = () => {
    onChange(null)
    setPreview(null)
  }

  const isVideo = value?.type.startsWith("video/")

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted-foreground">{label}</label>
      {value ? (
        <div className="relative rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            {preview ? (
              <img src={preview} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                {isVideo ? <Film className="h-6 w-6 text-muted-foreground" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{value.name}</p>
              <p className="text-sm text-muted-foreground">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleClear}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/50"
          }`}
        >
          <Upload className={`mb-3 h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="mb-1 text-sm font-medium">
            <span className="text-primary">Click to upload</span> or drag and drop
          </p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  )
}
