

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import TrendingCard from "./TrendingCard"
import { fetchRecipes } from "../services/api"
import "../styles/TrendingStories.css"

const TrendingStories = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainer = React.useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadTrendingRecipes = async () => {
      try {
        setIsLoading(true)
        const data = await fetchRecipes({ limit: 10, sort: "likesCount", order: "DESC" })
        setTrendingRecipes(data)
      } catch (err) {
        console.error("Failed to load trending recipes:", err)
        setTrendingRecipes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadTrendingRecipes()
  }, [])

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

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  if (isLoading) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Trending Stories</h2>
        <div className="loading-state">Loading trending recipes...</div>
      </section>
    )
  }

  if (trendingRecipes.length === 0) {
    return null // Don't show section if no trending recipes
  }

  return (
    <section className="trending-section">
      <h2 className="section-title">Trending Stories</h2>

      <div className="carousel-container">
        <button className="carousel-btn carousel-btn-left" onClick={() => scroll("left")}>
          <ChevronLeft size={24} />
        </button>

        <div className="carousel" ref={scrollContainer}>
          {trendingRecipes.map((story) => (
            <TrendingCard key={story.id} story={story} onClick={() => handleRecipeClick(story)} />
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
