"use client"

import { useEffect, useMemo, useState } from "react"
import { Filters } from "@/components/Filters"
import { FundCard } from "@/components/FundCard"
import { ThemeToggle } from "@/components/ThemeToggle"
import { WelcomeDialog } from "@/components/WelcomeDialog"
import { NewsBanner } from "@/components/NewsBanner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Coffee, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getFunds, type Fund } from "@/app/actions/funds"

interface NewsItem {
  id: number
  title: string
  url: string
  imageUrl?: string | null
  source?: string | null
  createdAt: Date
}

interface HomeClientProps {
  initialFunds: Fund[]
  initialTotal: number
  categories: string[]
  states: string[]
  news: NewsItem[]
  itemsPerPage?: number
}

const DEFAULT_ITEMS_PER_PAGE = 9

export function HomeClient({
  initialFunds,
  initialTotal,
  categories,
  states,
  news,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: HomeClientProps) {
  const [funds, setFunds] = useState<Fund[]>(initialFunds)
  const [allCategories] = useState<string[]>(categories)
  const [allStates] = useState<string[]>(states)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalFunds, setTotalFunds] = useState(initialTotal)

  const totalPages = useMemo(() => Math.ceil(totalFunds / itemsPerPage), [totalFunds, itemsPerPage])

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery), 350)
    return () => clearTimeout(id)
  }, [searchQuery])

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handleFilterChange = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value)
      setCurrentPage(1)
    }
  }

  // Fetch when any filter/page changes (with debounced search)
  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const fundsResult = await getFunds(currentPage, itemsPerPage, {
          search: debouncedSearch || undefined,
          stage: selectedStage !== 'all' ? selectedStage : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          state: selectedState !== 'all' ? selectedState : undefined,
        })
        if (!cancelled) {
          setFunds(fundsResult.funds)
          setTotalFunds(fundsResult.total)
        }
      } catch {
        if (!cancelled) {
          setFunds([])
          setTotalFunds(0)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    // Skip fetch on first render if no filters changed and we already have initial data
    // Trigger fetch whenever dependencies change
    fetchData()
    return () => {
      cancelled = true
    }
  }, [currentPage, debouncedSearch, selectedStage, selectedCategory, selectedState, itemsPerPage])

  return (
    <>
    <WelcomeDialog />
    <main className="min-h-screen pt-14 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-balance leading-tight">Explore 700+ Funds, Accelerators, and Incubators Worldwide</h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl text-pretty">
              Discover and connect with top funds, accelerators, and incubators worldwide. Filter by location, type, and industry focus.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button asChild variant="default" size="default" className="gap-2">
                <Link href="https://forms.gle/NAMy4YpHJxM8p6eo9" target="_blank" rel="noopener noreferrer">
                  <Plus className="h-4 w-4" />
                  Help us add more funds
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="gap-2 bg-yellow-400 text-black hover:bg-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black">
                <Link href="https://buymeacoffee.com/gsvprharsha" target="_blank" rel="noopener noreferrer">
                  <Coffee className="h-4 w-4" />
                  Support my work
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start lg:self-center">
            <Link
              href="https://www.linkedin.com/in/gsvprharsha/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-accent transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Image src="/linkedin.svg" alt="LinkedIn" width={20} height={20} className="h-6 w-6 dark:invert" />
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <Filters
          searchQuery={searchQuery}
          onSearchChange={handleFilterChange(setSearchQuery)}
          selectedStage={selectedStage}
          onStageChange={handleFilterChange(setSelectedStage)}
          selectedCategory={selectedCategory}
          onCategoryChange={handleFilterChange(setSelectedCategory)}
          categories={allCategories}
          states={allStates}
          selectedState={selectedState}
          onStateChange={handleFilterChange(setSelectedState)}
        />

        <NewsBanner initialNews={news} />

        <div className="text-sm text-muted-foreground">
          Showing {funds.length} of {totalFunds} funds
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(9).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-4/6 rounded-md" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : funds.length > 0 ? (
            funds.map((fund) => (
              <FundCard
                key={fund.id || fund.firm}
                fund={{
                  ...fund,
                  numFunds: 0,
                  totalRaised: "0",
                  investments: 0,
                  exits: 0,
                }}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-lg text-muted-foreground">No funds found matching your criteria.</p>
            </div>
          )}
        </div>

        {funds.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
    </>
  )
}


