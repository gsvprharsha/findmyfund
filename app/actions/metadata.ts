"use server"

import { cache } from "react"
import { prisma } from "@/app/lib/prisma"

export const getStatesCached = cache(async (): Promise<string[]> => {
  const states = await prisma.ventureFirm.findMany({
    distinct: ["state"],
    select: { state: true },
    orderBy: { state: "asc" },
  })
  return states.map((s: { state: string }) => s.state).filter(Boolean) as string[]
})

export const getCategoriesCached = cache(async (): Promise<string[]> => {
  const funds = await prisma.ventureFirm.findMany({ select: { categories: true } })

  const allCategories = new Set<string>()

  funds.forEach((fund: { categories: any }) => {
    try {
      let categories: any
      if (typeof fund.categories === "string") {
        categories = JSON.parse(fund.categories)
      } else {
        categories = fund.categories
      }

      if (Array.isArray(categories)) {
        categories.forEach((cat: string) => allCategories.add(cat))
      } else if (typeof categories === "object" && categories !== null) {
        Object.keys(categories).forEach((cat: string) => allCategories.add(cat))
      }
    } catch {
      // ignore invalid rows
    }
  })

  return Array.from(allCategories).sort()
})


