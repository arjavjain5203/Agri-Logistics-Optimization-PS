"use client"

import { useState } from "react"
import { Pause, Play, Sparkles, User } from "lucide-react"
import type { VoiceMessage as VoiceMessageType } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function VoiceMessage({ message }: { message: VoiceMessageType }) {
  const [playing, setPlaying] = useState(false)
  const isAI = message.sender === "ai"

  return (
    <div className={cn("flex items-end gap-2.5", isAI ? "justify-start" : "justify-end")}>
      {isAI && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </div>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 shadow-sm sm:max-w-sm",
          isAI
            ? "rounded-bl-sm bg-card border border-border"
            : "rounded-br-sm bg-primary text-primary-foreground",
        )}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
              isAI ? "bg-primary/10 text-primary" : "bg-primary-foreground/15 text-primary-foreground",
            )}
            aria-label={playing ? "Pause voice message" : "Play voice message"}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <div className="flex flex-1 items-center gap-0.5">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "w-0.5 rounded-full",
                  isAI ? "bg-primary/30" : "bg-primary-foreground/35",
                  playing && i < 9 && (isAI ? "bg-primary" : "bg-primary-foreground"),
                )}
                style={{ height: `${6 + (i % 5) * 3}px` }}
              />
            ))}
          </div>
          <span
            className={cn(
              "shrink-0 text-[11px] tabular-nums",
              isAI ? "text-muted-foreground" : "text-primary-foreground/75",
            )}
          >
            {message.duration}
          </span>
        </div>
        <p
          className={cn(
            "text-sm leading-relaxed text-pretty",
            isAI ? "text-foreground/90" : "text-primary-foreground/95",
          )}
        >
          {message.textHi}
        </p>
      </div>
      {!isAI && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
          <User className="size-4" />
        </div>
      )}
    </div>
  )
}
