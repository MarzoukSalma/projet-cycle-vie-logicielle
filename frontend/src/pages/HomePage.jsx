import TrendingStories from "../components/TrendingStories"
import RecipeFeed from "../components/RecipeFeed"

console.log("[v0] HomePage component loaded")

function HomePage() {
  console.log("[v0] HomePage rendering")

  return (
    <>
      <TrendingStories />
      <RecipeFeed />
    </>
  )
}

export default HomePage
