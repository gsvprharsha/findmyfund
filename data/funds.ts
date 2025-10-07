export interface Fund {
    firm: string
    city: string
    state: string
    seed: boolean
    early: boolean
    late: boolean
    numFunds: number
    totalRaised: string
    investments: number
    exits: number
    categories: Array<{ name: string; count: number }>
    website: string
    crunchbase: string
    linkedin: string
  }
  
  export const funds: Fund[] = []
  
  // Get unique states for filter
  export const states = Array.from(new Set(funds.map((f) => f.state))).sort()
  
  // Get unique categories for filter
  export const categories = Array.from(new Set(funds.flatMap((f) => f.categories.map((c) => c.name)))).sort()  