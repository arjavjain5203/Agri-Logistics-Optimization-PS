"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddCropDialog() {
  const [open, setOpen] = useState(false)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setOpen(false)
    toast.success("Crop added", {
      description: "Your new crop is now being monitored by the Crop Vulnerability Agent.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus data-icon="inline-start" />
        Add Crop
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add a new crop</DialogTitle>
          <DialogDescription>Track a new crop so AgriFlow AI can monitor its risk and market.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="crop-name">Crop name</FieldLabel>
              <Input id="crop-name" placeholder="e.g. Onion" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="crop-quantity">Quantity (kg)</FieldLabel>
              <Input id="crop-quantity" type="number" placeholder="e.g. 400" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="crop-harvest">Expected harvest date</FieldLabel>
              <Input id="crop-harvest" type="date" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="crop-field">Field location</FieldLabel>
              <Select defaultValue="north">
                <SelectTrigger id="crop-field">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="north">North Field</SelectItem>
                    <SelectItem value="south">South Field</SelectItem>
                    <SelectItem value="riverside">Riverside Plot</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="submit" className="w-full">
              Add Crop
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
