"use server"

import { cache } from "react"
import { prisma } from "@/app/lib/prisma"

export const getStatesCached = cache(async (): Promise<string[]> => {
  const states = await prisma.ventureFirm.findMany({
    distinct: ["state"],
    select: { state: true },
    orderBy: { state: "asc" },
  })
  return states.map((s: { state: string }) => s.state).filter((state): state is string => Boolean(state && state.trim())) as string[]
})

export const getCategoriesCached = cache(async (): Promise<string[]> => {
  const funds = await prisma.ventureFirm.findMany({ select: { categories: true } })

  const allCategories = new Set<string>()

  funds.forEach((fund: { categories: unknown }) => {
    try {
      let categories: unknown
      if (typeof fund.categories === "string") {
        categories = JSON.parse(fund.categories)
      } else {
        categories = fund.categories
      }

      if (Array.isArray(categories)) {
        categories.forEach((cat) => {
          if (typeof cat === "string") allCategories.add(cat)
        })
      } else if (typeof categories === "object" && categories !== null) {
        Object.keys(categories as Record<string, unknown>).forEach((cat) => allCategories.add(cat))
      }
    } catch {
      // ignore invalid rows
    }
  })

  return Array.from(allCategories).sort()
})

export const getCountriesCached = cache(async (): Promise<string[]> => {
  const countries = await prisma.ventureFirm.findMany({
    distinct: ["country"],
    select: { country: true },
    orderBy: { country: "asc" },
  })
  
  // Filter out null, undefined, and empty strings
  const filteredCountries = countries
    .map((c: { country: string | null }) => c.country)
    .filter((country): country is string => Boolean(country && country.trim()))
    .sort()
  
  return filteredCountries
})

