"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface FiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  selectedStage: string
  onStageChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: string[]
  states?: string[]
  onStateChange?: (value: string) => void
  selectedState?: string
  countries?: string[]
  onCountryChange?: (value: string) => void
  selectedCountry?: string
}

export function Filters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStage,
  onStageChange,
  selectedCategory,
  onCategoryChange,
  categories,
  countries,
  selectedCountry,
  onCountryChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 sm:p-4 bg-card rounded-xl border shadow-sm">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search funds, cities, or categories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3">
        {countries && countries.length > 0 && onCountryChange && (
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="w-full sm:w-[140px] md:w-[180px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent className="font-[family-name:var(--font-geist-sans)]">
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[140px] md:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="font-[family-name:var(--font-geist-sans)]">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="vc">VC</SelectItem>
            <SelectItem value="accelerator">Accelerator</SelectItem>
            <SelectItem value="incubator">Incubator</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedStage} onValueChange={onStageChange}>
          <SelectTrigger className="w-full sm:w-[140px] md:w-[180px]">
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
          <SelectTrigger className="w-full sm:w-[160px] md:w-[200px]">
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
    </div>
  )
}
