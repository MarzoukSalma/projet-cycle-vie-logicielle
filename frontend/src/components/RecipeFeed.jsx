
import React from "react"
import RecipeCard from "./RecipeCard"
import "../styles/RecipeFeed.css"

const RECIPES_DATA = [
  {
    id: 2,
    author: "Chef Marco",
    authorId: "chef-marco",
    emoji: "👨‍🍳",
    difficulty: "Medium",
    duration: "45 mins",
    image: "/gourmet-fine-dining-dish.jpg",
    title: "Gourmet Risotto",
    description: "Authentic Italian risotto with truffle oil and fresh parmesan.",
    likes: 128,
    liked: false,
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
    author: "VeganLife",
    authorId: "vegan-life",
    emoji: "🌱",
    difficulty: "Easy",
    duration: "15 mins",
    image: "/vegan-plant-based-meal.jpg",
    title: "Plant-Based Bowl",
    description: "Delicious plant-based protein bowl with quinoa and fresh vegetables.",
    likes: 92,
    liked: false,
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
    author: "You",
    authorId: "current-user",
    emoji: "😋",
    difficulty: "Easy",
    duration: "25 mins",
    image: "/pasta-carbonara.png",
    title: "Pasta Carbonara",
    description: "Family recipe passed down for generations with creamy egg sauce.",
    likes: 45,
    liked: false,
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
