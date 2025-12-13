

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import TrendingCard from "./TrendingCard"
import "../styles/TrendingStories.css"

const TRENDING_DATA = [
  {
    id: 2,
    title: "Gourmet Risotto",
    author: "Chef Marco",
    emoji: "👨‍🍳",
    subtitle: "Authentic Italian risotto...",
    image: "/gourmet-fine-dining-dish.jpg",
    likes: 128,
    difficulty: "Medium",
    duration: "45 mins",
    description: "Authentic Italian risotto with truffle oil and fresh parmesan.",
    ingredients: [
      { name: "Arborio rice", amount: "2", unit: "cups" },
      { name: "Chicken broth", amount: "6", unit: "cups" },
      { name: "White wine", amount: "1", unit: "cup" },
      { name: "Parmesan cheese", amount: "1", unit: "cup" },
      { name: "Truffle oil", amount: "2", unit: "tbsp" },
    ],
    instructions: [
      "Heat the broth in a saucepan and keep warm.",
      "In a large pan, toast the rice for 2 minutes.",
      "Add wine and stir until absorbed.",
      "Add broth one ladle at a time, stirring continuously.",
      "When rice is al dente, stir in parmesan and truffle oil.",
    ],
  },
  {
    id: 3,
    title: "Plant-Based Bowl",
    author: "VeganLife",
    emoji: "🌱",
    subtitle: "Delicious Buddha Bowl...",
    image: "/vegan-plant-based-meal.jpg",
    likes: 92,
    difficulty: "Easy",
    duration: "15 mins",
    description: "Delicious plant-based protein bowl with quinoa and fresh vegetables.",
    ingredients: [
      { name: "Quinoa", amount: "1", unit: "cup" },
      { name: "Chickpeas", amount: "1", unit: "can" },
      { name: "Kale", amount: "2", unit: "cups" },
      { name: "Avocado", amount: "1", unit: "piece" },
      { name: "Tahini", amount: "3", unit: "tbsp" },
    ],
    instructions: [
      "Cook quinoa according to package instructions.",
      "Roast chickpeas with olive oil and spices.",
      "Massage kale with lemon juice.",
      "Assemble bowl with all ingredients.",
      "Drizzle with tahini dressing.",
    ],
  },
  {
    id: 1,
    title: "Pasta Carbonara",
    author: "You",
    emoji: "😋",
    subtitle: "Classic Carbonara...",
    image: "/pasta-carbonara.png",
    likes: 45,
    difficulty: "Easy",
    duration: "25 mins",
    description: "Family recipe passed down for generations with creamy egg sauce.",
    ingredients: [
      { name: "Spaghetti", amount: "400", unit: "g" },
      { name: "Eggs", amount: "4", unit: "pieces" },
      { name: "Pancetta", amount: "200", unit: "g" },
      { name: "Pecorino cheese", amount: "100", unit: "g" },
      { name: "Black pepper", amount: "1", unit: "tsp" },
    ],
    instructions: [
      "Cook pasta in salted boiling water.",
      "Fry pancetta until crispy.",
      "Beat eggs with cheese and pepper.",
      "Drain pasta and mix with pancetta.",
      "Remove from heat and stir in egg mixture quickly.",
    ],
  },
]

function TrendingStories() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainer = React.useRef(null)
  const navigate = useNavigate()

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

  return (
    <section className="trending-section">
      <h2 className="section-title">Trending Stories</h2>

      <div className="carousel-container">
        <button className="carousel-btn carousel-btn-left" onClick={() => scroll("left")}>
          <ChevronLeft size={24} />
        </button>

        <div className="carousel" ref={scrollContainer}>
          {TRENDING_DATA.map((story) => (
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
