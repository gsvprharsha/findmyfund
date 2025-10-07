"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedStage: string
  onStageChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: string[]
  states?: string[]
  onStateChange?: (value: string) => void
  selectedState?: string
}

export function Filters({
  searchQuery,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedCategory,
  onCategoryChange,
  categories,
  states = [],
  selectedState = 'all',
  onStateChange = () => {},
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card rounded-xl border shadow-sm">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search funds, cities, or categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={selectedStage} onValueChange={onStageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Investment Stage" />
        </SelectTrigger>
        <SelectContent className="font-[family-name:var(--font-geist-sans)]">
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="seed">Seed</SelectItem>
          <SelectItem value="early">Early</SelectItem>
          <SelectItem value="late">Late</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Top Category" />
        </SelectTrigger>
        <SelectContent className="font-[family-name:var(--font-geist-sans)]">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
