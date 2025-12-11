"use client"

import React from "react"
import RecipeCard from "./RecipeCard"
import "../styles/RecipeFeed.css"

const RECIPES_DATA = [
  {
    id: 1,
    author: "You",
    emoji: "😋",
    difficulty: "Easy",
    duration: "25 mins",
    image: "/pasta-carbonara.png",
    description: "Family recipe passed down for generations.",
    likes: 45,
    liked: false,
  },
  {
    id: 2,
    author: "Chef Marco",
    emoji: "👨‍🍳",
    difficulty: "Medium",
    duration: "45 mins",
    image: "/gourmet-fine-dining-dish.jpg",
    description: "Authentic Italian risotto with truffle oil.",
    likes: 128,
    liked: false,
  },
  {
    id: 3,
    author: "VeganLife",
    emoji: "🌱",
    difficulty: "Easy",
    duration: "15 mins",
    image: "/vegan-plant-based-meal.jpg",
    description: "Delicious plant-based protein bowl.",
    likes: 92,
    liked: false,
  },
]

function RecipeFeed() {
  const [recipes, setRecipes] = React.useState(RECIPES_DATA)

  const toggleLike = (id) => {
    setRecipes(
      recipes.map((recipe) =>
        recipe.id === id
          ? {
              ...recipe,
              liked: !recipe.liked,
              likes: recipe.liked ? recipe.likes - 1 : recipe.likes + 1,
            }
          : recipe,
      ),
    )
  }

  return (
    <section className="recipe-feed">
      <h2 className="section-title">Latest Recipes</h2>
      <div className="recipes-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onToggleLike={toggleLike} />
        ))}
      </div>
    </section>
  )
}

export default RecipeFeed
