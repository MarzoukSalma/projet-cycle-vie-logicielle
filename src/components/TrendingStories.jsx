

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import TrendingCard from "./TrendingCard"
import "../styles/TrendingStories.css"

const TRENDING_DATA = [
  {
    id: 1,
    title: "Chef Maria",
    subtitle: "Classic Margherita...",
    image: "/pizza-margherita.png",
  },
  {
    id: 2,
    title: "BakingQueen",
    subtitle: "Fluffy Pancakes...",
    image: "/fluffy-pancakes.jpg",
  },
  {
    id: 3,
    title: "HealthyEats",
    subtitle: "Buddha Bowl...",
    image: "/healthy-buddha-bowl.jpg",
  },
]

function TrendingStories() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainer = React.useRef(null)

  const scroll = (direction) => {
    const container = scrollContainer.current
    const scrollAmount = 300

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount))
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setScrollPosition(scrollPosition + scrollAmount)
    }
  }

  return (
    <section className="trending-section">
      <h2 className="section-title">Trending Stories</h2>

      <div className="carousel-container">
        <button className="carousel-btn carousel-btn-left" onClick={() => scroll("left")}>
          <ChevronLeft size={24} />
        </button>

        <div className="carousel" ref={scrollContainer}>
          {TRENDING_DATA.map((story) => (
            <TrendingCard key={story.id} story={story} />
          ))}
        </div>

        <button className="carousel-btn carousel-btn-right" onClick={() => scroll("right")}>
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  )
}

export default TrendingStories
