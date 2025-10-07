import Link from "next/link"

export function Banner() {
  return (
    <Link 
      href="https://app.flareb2b.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block fixed top-0 left-0 right-0 z-50 bg-[#d4ff00] border-b border-[#c0eb00] shadow-md animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)] hover:bg-[#c9f200] transition-colors"
    >
      <div className="flex items-center justify-center h-14 px-4">
        <p className="text-sm font-bold text-gray-900 text-center">
          <span className="mr-2 text-base animate-pulse">🧠</span>
          <span className="text-balance">D2C Founders: Let&apos;s boost your conversion rates → </span>
          <span className="font-extrabold underline underline-offset-4 hover:text-gray-700 transition-colors decoration-2">
            Try Free
          </span>
        </p>
      </div>
    </Link>
  )
}
