import { Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t mt-16 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <p className="text-balance">Built with passion for the startup ecosystem</p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Created by</p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/gsvprharsha"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="https://www.linkedin.com/in/gsvprharsha/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
