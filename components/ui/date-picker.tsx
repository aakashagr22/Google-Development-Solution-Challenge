"use client"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate?: (date?: Date) => void
  selected?: Date
  onSelect?: (date?: Date) => void
  mode?: "single" | "range" | "multiple"
  initialFocus?: boolean
}

export function DatePicker({ date, setDate, selected, onSelect, mode = "single", initialFocus }: DatePickerProps) {
  // Use either the controlled or uncontrolled pattern
  const selectedDate = date || selected
  const handleSelect = setDate || onSelect

  // Format date as string without using date-fns
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString(undefined, options)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? formatDate(selectedDate) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode={mode} selected={selectedDate} onSelect={handleSelect} initialFocus={initialFocus} />
      </PopoverContent>
    </Popover>
  )
}

