import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TrendingCard from "./TrendingCard";
import { fetchTopRecipeStories } from "../services/api";
import "../styles/TrendingStories.css";

const TrendingStories = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTrendingRecipes = async () => {
      try {
        setIsLoading(true);

        // ✅ Backend returns top liked recipes already sorted DESC
        const data = await fetchTopRecipeStories();

        // ✅ keep only 10 for the carousel (optional)
        setTrendingRecipes(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (err) {
        console.error("Failed to load trending recipes:", err);
        setTrendingRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingRecipes();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const left = direction === "left" ? -scrollAmount : scrollAmount;
    container.scrollBy({ left, behavior: "smooth" });
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  if (isLoading) {
    return (
      <section className="trending-section">
        <h2 className="section-title">Trending Stories</h2>
        <div className="loading-state">Loading trending recipes...</div>
      </section>
    );
  }

  if (!trendingRecipes || trendingRecipes.length === 0) {
    return null;
  }

  return (
    <section className="trending-section">
      <h2 className="section-title">Trending Stories</h2>

      <div className="carousel-container">
        <button
          type="button"
          className="carousel-btn carousel-btn-left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="carousel" ref={scrollContainerRef}>
          {trendingRecipes.map((story) => (
            <TrendingCard
              key={story.id}
              story={story}
              onClick={() => handleRecipeClick(story)}
            />
          ))}
        </div>

        <button
          type="button"
          className="carousel-btn carousel-btn-right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default TrendingStories;
