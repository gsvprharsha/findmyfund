"use client"

import { useState, useMemo, useEffect } from "react"
import { Banner } from "@/components/Banner"
import { Filters } from "@/components/Filters"
import { FundCard } from "@/components/FundCard"
import { Footer } from "@/components/Footer"
import { ThemeToggle } from "@/components/ThemeToggle"
import { WelcomeDialog } from "@/components/WelcomeDialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Coffee, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getFunds, getStates, getCategories, type Fund, debugCategories } from "./actions/funds"
import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 9

export default function Home() {
  const [funds, setFunds] = useState<Fund[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [allStates, setAllStates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalFunds, setTotalFunds] = useState(0)
  const [loadedPages, setLoadedPages] = useState<number[]>([1])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)

        const [categoriesData, statesData] = await Promise.all([
          getCategories(),
          getStates()
        ])
        setAllCategories(categoriesData)
        setAllStates(statesData)

        // Fetch first page of funds with current filters
        const fundsResult = await getFunds(1, ITEMS_PER_PAGE, {
          search: searchQuery || undefined,
          stage: selectedStage !== 'all' ? selectedStage : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          state: selectedState !== 'all' ? selectedState : undefined,
        })
        setFunds(fundsResult.funds)
        setTotalFunds(fundsResult.total)
        setLoadedPages([1])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const totalPages = Math.ceil(totalFunds / ITEMS_PER_PAGE)
  const displayedFunds = funds // The API already returns the correct page

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleFilterChange = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value)
      setCurrentPage(1)
      setLoadedPages([1])
    }
  }

  // Effect to handle data fetching (both filters and pagination)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const fundsResult = await getFunds(currentPage, ITEMS_PER_PAGE, {
          search: searchQuery || undefined,
          stage: selectedStage !== 'all' ? selectedStage : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          state: selectedState !== 'all' ? selectedState : undefined,
        })

        setFunds(fundsResult.funds)
        setTotalFunds(fundsResult.total)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if we're past the initial load
    if (allCategories.length > 0) {
      fetchData()
    }
  }, [currentPage, searchQuery, selectedStage, selectedCategory, selectedState, allCategories.length])

  // Show loading state immediately when filters change (before API call)
  useEffect(() => {
    if (allCategories.length > 0) { // Only after initial load
      setIsLoading(true)
    }
  }, [searchQuery, selectedStage, selectedCategory, selectedState])

  return (
    <>
      <Banner />
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
              ) : displayedFunds.length > 0 ? (
                displayedFunds.map((fund) => (
                  <FundCard 
                    key={fund.id || fund.firm} 
                    fund={{
                      ...fund,
                      // Add any missing properties with default values
                      numFunds: 0,
                      totalRaised: "0",
                      investments: 0,
                      exits: 0
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
                className="gap-2 bg-transparent"
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
                className="gap-2 bg-transparent"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}