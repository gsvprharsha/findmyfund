"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

const DIALOG_STORAGE_KEY = "welcome-dialog-closed-at"
const COOLDOWN_MINUTES = 30

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const lastClosedAt = localStorage.getItem(DIALOG_STORAGE_KEY)

    if (!lastClosedAt) {
      setIsOpen(true)
      return
    }

    const lastClosedTime = Number.parseInt(lastClosedAt, 10)
    const currentTime = Date.now()
    const timeDifference = currentTime - lastClosedTime
    const cooldownMs = COOLDOWN_MINUTES * 60 * 1000

    if (timeDifference >= cooldownMs) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(DIALOG_STORAGE_KEY, Date.now().toString())
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] font-[family-name:var(--font-geist-sans)]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to FindMyFund</DialogTitle>
          <DialogDescription className="text-base space-y-4 pt-2">
            <p>
              Discover and connect with top seed-stage venture capital firms across the world.
            </p>
            <p>
              Want to help us grow? If you know of a fund that should be listed or have suggestions, please contribute
              through our form.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto bg-transparent">
            Got it
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link
              href="https://forms.gle/NAMy4YpHJxM8p6eo9"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              Add a Fund
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
