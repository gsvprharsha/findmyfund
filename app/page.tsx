import { Banner } from "@/components/Banner"
import { Footer } from "@/components/Footer"
import { HomeClient } from "@/components/HomeClient"
import { getFunds } from "@/app/actions/funds"
import { getCategoriesCached, getStatesCached } from "@/app/actions/metadata"

const ITEMS_PER_PAGE = 9

export default async function Home() {
  const [metadata, fundsResult] = await Promise.all([
    Promise.all([getCategoriesCached(), getStatesCached()]),
    getFunds(1, ITEMS_PER_PAGE, {}),
  ])

  const [categories, states] = metadata

  return (
    <>
      <Banner />
      <HomeClient
        initialFunds={fundsResult.funds}
        initialTotal={fundsResult.total}
        categories={categories}
        states={states}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <Footer />
    </>
  )
}