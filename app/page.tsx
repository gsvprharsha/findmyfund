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
import { getFunds, getStates, getCategories, type Fund } from "./actions/funds"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [fundsData, categoriesData, statesData] = await Promise.all([
          getFunds(),
          getCategories(),
          getStates()
        ])
        setFunds(fundsData)
        setAllCategories(categoriesData)
        setAllStates(statesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredFunds = useMemo(() => {
    if (isLoading) return []
    
    return funds.filter((fund) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        fund.firm.toLowerCase().includes(searchLower) ||
        fund.city.toLowerCase().includes(searchLower) ||
        fund.categories.some((cat) => cat.name.toLowerCase().includes(searchLower))

      const matchesStage =
        selectedStage === "all" ||
        (selectedStage === "seed" && fund.seed) ||
        (selectedStage === "early" && fund.early) ||
        (selectedStage === "late" && fund.late)

      const matchesCategory = selectedCategory === "all" || 
        fund.categories.some((cat) => cat.name === selectedCategory)
        
      const matchesState = selectedState === "all" || 
        fund.state === selectedState

      return matchesSearch && matchesStage && matchesCategory && matchesState
    })
  }, [funds, searchQuery, selectedStage, selectedCategory, selectedState, isLoading])

  const totalPages = Math.ceil(filteredFunds.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const displayedFunds = filteredFunds.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFilterChange = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value)
      setCurrentPage(1)
    }
  }

  return (
    <>
      <Banner />
      <WelcomeDialog />
      <main className="min-h-screen pt-14 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl font-semibold text-balance">Explore {funds.length}+ Funds, Accelerators, and Incubators Worldwide</h1>
              <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
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
            <div className="flex items-center gap-2">
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
            Showing {displayedFunds.length} of {filteredFunds.length} funds
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
                Array(3).fill(0).map((_, i) => (
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

          {filteredFunds.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                size="lg"
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
                size="lg"
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