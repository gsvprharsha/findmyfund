"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface Fund {
  id: number
  firm: string
  city: string
  state: string
  seed: boolean
  early: boolean
  late: boolean
  categories: Array<{ name: string; count: number }>
  website: string
  crunchbase: string
  linkedin: string
}

export async function getFunds(): Promise<Fund[]> {
  try {
    const funds = await prisma.ventureFirm.findMany({
      select: {
        id: true,
        firm: true,
        city: true,
        state: true,
        seed: true,
        early: true,
        late: true,
        categories: true,
        website: true,
        crunchbase: true,
        linkedin: true,
      },
    })

    // Parse the categories from JSON string and convert to the expected format
    return funds.map((fund: any) => {
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
  } catch (error) {
    console.error("Error fetching funds:", error)
    return []
  } finally {
    await prisma.$disconnect()
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
    await prisma.$disconnect()
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const funds = await prisma.ventureFirm.findMany({
      select: { categories: true },
    })

    const allCategories = new Set<string>()
    
    funds.forEach((fund: { categories: any }) => {
      if (Array.isArray(fund.categories)) {
        fund.categories.forEach((cat: string) => allCategories.add(cat))
      } else if (typeof fund.categories === 'object' && fund.categories !== null) {
        Object.keys(fund.categories).forEach((cat: string) => allCategories.add(cat))
      }
    })

    return Array.from(allCategories).sort()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}
