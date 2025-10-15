import { Banner } from "@/components/Banner"
import { Footer } from "@/components/Footer"
import { HomeClient } from "@/components/HomeClient"
import { getFunds } from "@/app/actions/funds"
import { getCategoriesCached, getStatesCached } from "@/app/actions/metadata"
import { getNews } from "@/app/actions/news"

const ITEMS_PER_PAGE = 9

export default async function Home() {
  const [metadata, fundsResult, news] = await Promise.all([
    Promise.all([getCategoriesCached(), getStatesCached()]),
    getFunds(1, ITEMS_PER_PAGE, {}),
    getNews(),
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
        news={news}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <Footer />
    </>
  )
}