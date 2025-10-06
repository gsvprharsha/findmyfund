"use client"

import { useState, useMemo } from "react"
import { Banner } from "@/components/Banner"
import { Filters } from "@/components/Filters"
import { FundCard } from "@/components/FundCard"
import { Footer } from "@/components/Footer"
import { ThemeToggle } from "@/components/ThemeToggle"
import { WelcomeDialog } from "@/components/WelcomeDialog"
import { Button } from "@/components/ui/button"
import { funds, categories } from "@/data/funds"
import { ChevronLeft, ChevronRight, Linkedin, Plus, Star } from "lucide-react"
import Link from "next/link"

const ITEMS_PER_PAGE = 9

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStage, setSelectedStage] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredFunds = useMemo(() => {
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

      const matchesCategory = selectedCategory === "all" || fund.categories.some((cat) => cat.name === selectedCategory)

      return matchesSearch && matchesStage && matchesCategory
    })
  }, [searchQuery, selectedStage, selectedCategory])

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

  const handleFilterChange = (setter: (value: string) => void) => {
    return (value: string) => {
      setter(value)
      setCurrentPage(1)
    }
  }

  return (
    <>
      <Banner />
      <WelcomeDialog />
      <main className="min-h-screen pt-14">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              <h1 className="text-4xl font-semibold text-balance">Explore {funds.length}+ US Seed Funds</h1>
              <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                Discover and connect with top seed-stage venture capital firms across the United States. Filter by
                location, investment stage, and industry focus.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Button asChild variant="default" size="default" className="gap-2">
                  <Link href="https://forms.gle/your-google-form-id" target="_blank" rel="noopener noreferrer">
                    <Plus className="h-4 w-4" />
                    Help us add more funds
                  </Link>
                </Button>
                <Button asChild variant="outline" size="default" className="gap-2 bg-transparent">
                  <Link href="https://github.com/gsvprharsha" target="_blank" rel="noopener noreferrer">
                    <Star className="h-4 w-4" />
                    Star us on GitHub
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
                <Linkedin className="h-5 w-5" />
              </Link>
              <ThemeToggle />
            </div>
          </div>

          <Filters
            searchQuery={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value)
              setCurrentPage(1)
            }}
            selectedStage={selectedStage}
            onStageChange={handleFilterChange(setSelectedStage)}
            selectedCategory={selectedCategory}
            onCategoryChange={handleFilterChange(setSelectedCategory)}
            categories={categories}
          />

          <div className="text-sm text-muted-foreground">
            Showing {displayedFunds.length} of {filteredFunds.length} funds
          </div>

          {displayedFunds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedFunds.map((fund) => (
                <FundCard key={fund.firm} fund={fund} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <p className="text-xl font-medium">No matching funds found</p>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          )}

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
        <Footer />
      </main>
    </>
  )
}
