"use client"

import { useState } from "react"
import { AppShell } from "@/components/agriflow/app-shell"
import { PageHeader } from "@/components/agriflow/page-header"
import { VoiceMessage } from "@/components/agriflow/voice-message"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { voiceConversation, farmer } from "@/lib/mock-data"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

const languages = ["Hindi", "English", "Punjabi", "Marathi", "Tamil"]

export default function VoicePage() {
  const [language, setLanguage] = useState(farmer.language)
  const [recording, setRecording] = useState(false)

  return (
    <AppShell>
      <PageHeader
        title="Voice Assistant"
        description="Talk to your AI agent in your own language — no typing needed."
        actions={
          <Select value={language} onValueChange={(value) => value && setLanguage(value)}>
            <SelectTrigger size="sm" className="w-36 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {languages.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        }
      />

      <Card className="flex flex-col overflow-hidden rounded-2xl border-border/70">
        <div className="flex items-center gap-2.5 border-b border-border/70 bg-surface/40 px-5 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mic className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AgriFlow Voice Agent</p>
            <p className="text-xs text-muted-foreground">Speaking in {language}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4 py-6 sm:px-6">
          {voiceConversation.map((m) => (
            <VoiceMessage key={m.id} message={m} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-border/70 bg-surface/30 px-6 py-8">
          <button
            type="button"
            onClick={() => setRecording((r) => !r)}
            className={cn(
              "flex size-16 items-center justify-center rounded-full shadow-md transition-all",
              recording
                ? "scale-105 bg-critical text-critical-foreground"
                : "bg-primary text-primary-foreground hover:scale-105",
            )}
            aria-pressed={recording}
          >
            <Mic className="size-6" />
          </button>
          <p className="text-sm text-muted-foreground">
            {recording ? "Listening... tap to stop" : "Tap to speak"}
          </p>
        </div>
      </Card>
    </AppShell>
  )
}
