import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Globe, Linkedin } from "lucide-react"
import type { Fund } from "@/data/funds"
import Link from "next/link"
import Image from "next/image"

interface FundCardProps {
  fund: Fund
}

const CATEGORY_COLORS = [
  "bg-[#E8DCC4] text-[#5C4A2F] border-[#D4C5A8]", // Beige/tan
  "bg-[#FF6B35] text-white border-[#E55A2B]", // Orange
  "bg-[#FF8B7B] text-white border-[#E67A6A]", // Coral/salmon
  "bg-[#4ECDC4] text-white border-[#3DB8AF]", // Teal/cyan
  "bg-[#C9A66B] text-white border-[#B89558]", // Tan/gold
  "bg-[#6C5CE7] text-white border-[#5B4CD3]", // Purple
  "bg-[#00B894] text-white border-[#00A383]", // Green
  "bg-[#FD79A8] text-white border-[#FC5C8D]", // Pink
  "bg-[#0984E3] text-white border-[#0770C9]", // Blue
  "bg-[#FDCB6E] text-[#5C4A2F] border-[#F4BC4E]", // Yellow
]

const getCategoryColor = (categoryName: string) => {
  const hash = categoryName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

export function FundCard({ fund }: FundCardProps) {
  const stages = []
  if (fund.seed) stages.push("Seed")
  if (fund.early) stages.push("Early")
  if (fund.late) stages.push("Late")

  return (
    <Card className="group hover:scale-[1.02] hover:shadow-lg transition-all duration-300 rounded-2xl">
      <CardHeader className="space-y-2">
        <h3 className="text-lg font-semibold text-balance leading-tight">{fund.firm}</h3>
        <p className="text-sm text-muted-foreground">
          {fund.city}, {fund.state}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {stages.map((stage) => (
            <Badge key={stage} variant="secondary" className="text-xs">
              {stage}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Top Categories</p>
          <div className="flex flex-wrap gap-1.5">
            {fund.categories.slice(0, 5).map((category) => (
              <Badge key={category.name} className={`text-xs font-medium ${getCategoryColor(category.name)}`}>
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3 pt-4 border-t">
        <Link
          href={fund.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>Website</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
        <Link
          href={fund.crunchbase}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image 
            src="/crunchbase.svg" 
            alt="Crunchbase" 
            width={16} 
            height={16} 
            className="h-4 w-4 dark:invert"
          />
          <span>Crunchbase</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
        <Link
          href={fund.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Image 
            src="/linkedin.svg" 
            alt="LinkedIn" 
            width={20} 
            height={20} 
            className="h-6 w-6 dark:invert"
          />
          <span>LinkedIn</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}
