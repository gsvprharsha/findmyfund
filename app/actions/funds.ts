/* eslint-disable */

"use server"

import { prisma } from "@/app/lib/prisma"

export interface Fund {
  id: number
  firm: string
  city: string
  state: string
  country: string | null
  seed: boolean
  early: boolean
  late: boolean
  categories: Array<{ name: string; count: number }>
  website: string
  crunchbase: string
  linkedin: string
  type: string
}

export async function getFunds(
  page: number = 1,
  limit: number = 9,
  filters?: {
    search?: string
    stage?: string
    category?: string
    state?: string
    country?: string
    type?: string
  }
): Promise<{ funds: Fund[], total: number }> {
  try {
    const skip = (page - 1) * limit

    // Build where clause for filtering (including category for server-side filtering)
    const whereConditions: any[] = []

    if (filters?.search) {
      whereConditions.push({
        OR: [
          { firm: { contains: filters.search, mode: 'insensitive' } },
          { city: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    }

    if (filters?.stage && filters.stage !== 'all') {
      if (filters.stage === 'seed') {
        whereConditions.push({ seed: true })
      } else if (filters.stage === 'early') {
        whereConditions.push({ early: true })
      } else if (filters.stage === 'late') {
        whereConditions.push({ late: true })
      }
    }

    if (filters?.state && filters.state !== 'all') {
      whereConditions.push({ state: filters.state })
    }

    if (filters?.country && filters.country !== 'all') {
      whereConditions.push({ country: filters.country })
    }

    if (filters?.type && filters.type !== 'all') {
      whereConditions.push({ type: filters.type })
    }

    // For category filtering, we'll handle it server-side by fetching all and filtering
    // This is a temporary solution until we implement proper JSON array queries
    const where = whereConditions.length > 0 ? { AND: whereConditions } : {}

    const [funds, total] = await Promise.all([
      prisma.ventureFirm.findMany({
        where,
        select: {
          id: true,
          firm: true,
          city: true,
          state: true,
          country: true,
          seed: true,
          early: true,
          late: true,
          categories: true,
          website: true,
          crunchbase: true,
          linkedin: true,
          type: true,
        },
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.ventureFirm.count({ where })
    ])

    // Apply category filtering if specified
    let filteredFunds = funds
    let filteredTotal = total

    if (filters?.category && filters.category !== 'all') {
      // Fetch ALL funds (or funds matching other criteria) and filter by category
      let allFundsToFilter = funds

      if (whereConditions.length > 0) {
        // If there are other filters, fetch all funds matching those criteria
        allFundsToFilter = await prisma.ventureFirm.findMany({
          where,
          select: {
            id: true,
            firm: true,
            city: true,
            state: true,
            country: true,
            seed: true,
            early: true,
            late: true,
            categories: true,
            website: true,
            crunchbase: true,
            linkedin: true,
            type: true,
          },
          orderBy: { id: 'asc' },
        })
      } else {
        // If only category filter, fetch ALL funds
        allFundsToFilter = await prisma.ventureFirm.findMany({
          select: {
            id: true,
            firm: true,
            city: true,
            state: true,
            country: true,
            seed: true,
            early: true,
            late: true,
            categories: true,
            website: true,
            crunchbase: true,
            linkedin: true,
            type: true,
          },
          orderBy: { id: 'asc' },
        })
      }

      filteredFunds = allFundsToFilter.filter((fund: any) => {
        try {
          const categories = typeof fund.categories === 'string'
            ? JSON.parse(fund.categories)
            : fund.categories

          return Array.isArray(categories) && categories.includes(filters.category)
        } catch (error) {
          console.error(`Error parsing categories for fund ${fund.id}:`, error)
          return false
        }
      })

      filteredTotal = filteredFunds.length

      // Apply pagination to filtered results
      const startIndex = (page - 1) * limit
      filteredFunds = filteredFunds.slice(startIndex, startIndex + limit)
    }

    // Parse the categories from JSON string and convert to the expected format
    const parsedFunds = filteredFunds.map((fund: any) => {
      let categories: Array<{ name: string; count: number }> = [];

      try {
        // If categories is a string, parse it as JSON
        if (typeof fund.categories === 'string') {
          const parsed = JSON.parse(fund.categories);
          categories = Array.isArray(parsed)
            ? parsed.map((name: string) => ({ name, count: 0 }))
            : [];
        }
        // If it's already an array, use it directly
        else if (Array.isArray(fund.categories)) {
          categories = fund.categories.map((item: string | { name: string }) =>
            typeof item === 'string' ? { name: item, count: 0 } : item
          );
        }
      } catch (error) {
        console.error('Error parsing categories:', error);
      }

      return {
        ...fund,
        categories
      };
    })

    return { funds: parsedFunds, total: filteredTotal }
  } catch (error) {
    console.error("Error fetching funds:", error)
    return { funds: [], total: 0 }
  } finally {
    // keep connection open via singleton
  }
}

// Debug function to check categories in database
export async function debugCategories(): Promise<any> {
  try {
    const funds = await prisma.ventureFirm.findMany({
      select: { id: true, firm: true, categories: true },
      take: 50
    })

    const categoryStats: { [key: string]: number } = {}
    const sampleCategories: any[] = []

    funds.forEach((fund: any, index: number) => {
      try {
        const categories = typeof fund.categories === 'string'
          ? JSON.parse(fund.categories)
          : fund.categories

        if (Array.isArray(categories)) {
          categories.forEach((cat: string) => {
            categoryStats[cat] = (categoryStats[cat] || 0) + 1
          })

          if (index < 5) { // Store first 5 as samples
            sampleCategories.push({
              firm: fund.firm,
              categories: categories
            })
          }
        }
      } catch (error) {
        console.error(`Error parsing categories for fund ${fund.id}:`, error)
      }
    })

    return {
      totalFunds: funds.length,
      categoryStats,
      sampleCategories,
      uniqueCategories: Object.keys(categoryStats)
    }
  } catch (error: any) {
    console.error("Error in debugCategories:", error)
    return { error: error.message }
  } finally {
    // keep connection open via singleton
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const funds = await prisma.ventureFirm.findMany({
      select: { categories: true },
    })

    const allCategories = new Set<string>()

    funds.forEach((fund: { categories: any }) => {
      try {
        let categories: any

        // Handle different formats of categories
        if (typeof fund.categories === 'string') {
          // Parse JSON string
          categories = JSON.parse(fund.categories)
        } else {
          categories = fund.categories
        }

        if (Array.isArray(categories)) {
          categories.forEach((cat: string) => allCategories.add(cat))
        } else if (typeof categories === 'object' && categories !== null) {
          Object.keys(categories).forEach((cat: string) => allCategories.add(cat))
        }
      } catch (error) {
        console.error(`Error parsing categories for fund:`, error)
        // Continue to next fund instead of failing completely
      }
    })

    return Array.from(allCategories).sort()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  } finally {
    // keep connection open via singleton
  }
}

export async function getStates(): Promise<string[]> {
  try {
    const states = await prisma.ventureFirm.findMany({
      distinct: ['state'],
      select: { state: true },
      orderBy: { state: 'asc' },
    })
    return states.map((s: { state: string }) => s.state).filter(Boolean) as string[]
  } catch (error) {
    console.error("Error fetching states:", error)
    return []
  } finally {
    // keep connection open via singleton
  }
}

export async function getCountries(): Promise<string[]> {
  try {
    const countries = await prisma.ventureFirm.findMany({
      distinct: ['country'],
      select: { country: true },
      orderBy: { country: 'asc' },
    })
    return countries.map((c: { country: string | null }) => c.country).filter(Boolean) as string[]
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  } finally {
    // keep connection open via singleton
  }
}
