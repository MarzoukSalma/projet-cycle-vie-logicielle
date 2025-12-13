

import { useState, useRef } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Clock, Users, ChefHat, Send } from "lucide-react"
import "../styles/RecipeDetail.css"

function RecipeDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { recipeId } = useParams()
  const commentInputRef = useRef(null)

  // Get recipe from location state or use default data
  const recipe = location.state?.recipe || {
    id: recipeId,
    title: "Recipe Not Found",
    description: "This recipe could not be loaded.",
    author: "Unknown",
    emoji: "🍽️",
    likes: 0,
    difficulty: "Unknown",
    duration: "N/A",
    image: "/placeholder.svg",
    ingredients: [],
    instructions: [],
  }

  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(recipe.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Sarah Miller",
      avatar: "👩‍🍳",
      text: "This looks absolutely delicious! Can't wait to try it.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      author: "Mike Johnson",
      avatar: "👨‍🍳",
      text: "I made this last night and it was amazing! My family loved it.",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      author: "Emily Chen",
      avatar: "😊",
      text: "Great recipe! I added some extra garlic and it turned out perfect.",
      timestamp: "1 day ago",
    },
  ])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleCommentClick = () => {
    setShowComments(true)
    setTimeout(() => {
      commentInputRef.current?.focus()
    }, 100)
  }

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "John Doe",
        avatar: "😋",
        text: newComment,
        timestamp: "Just now",
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  return (
    <div className="recipe-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="recipe-detail-header">
        <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="recipe-detail-image" />
        <div className="recipe-detail-overlay">
          <h1 className="recipe-detail-title">{recipe.title}</h1>
          <div className="recipe-detail-author">
            <span className="author-emoji-large">{recipe.emoji}</span>
            <span className="author-name-large">{recipe.author}</span>
          </div>
        </div>
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-detail-actions">
          <button className={`detail-action-btn ${isLiked ? "liked" : ""}`} onClick={handleLike}>
            <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            <span>{likes} likes</span>
          </button>
          <button className="detail-action-btn" onClick={handleCommentClick}>
            <MessageCircle size={24} />
            <span>
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </button>
          <button className="detail-action-btn">
            <Share2 size={24} />
            <span>Share</span>
          </button>
          <button
            className={`detail-action-btn ${isBookmarked ? "bookmarked" : ""}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
            <span>Save</span>
          </button>
        </div>

        <div className="recipe-meta-info">
          <div className="meta-item">
            <ChefHat size={20} />
            <span>{recipe.difficulty}</span>
          </div>
          <div className="meta-item">
            <Clock size={20} />
            <span>{recipe.duration}</span>
          </div>
          {recipe.servings && (
            <div className="meta-item">
              <Users size={20} />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>

        <section className="recipe-section">
          <h2>Description</h2>
          <p className="recipe-full-description">{recipe.description}</p>
        </section>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="recipe-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-amount">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                  <span className="ingredient-name">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.instructions && recipe.instructions.length > 0 && (
          <section className="recipe-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="instruction-item">
                  <span className="instruction-number">{index + 1}</span>
                  <p className="instruction-text">{instruction}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {showComments && (
          <section className="recipe-section comments-section">
            <h2>Comments ({comments.length})</h2>

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <input
                ref={commentInputRef}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comment-input"
              />
              <button type="submit" className="comment-submit-btn" disabled={!newComment.trim()}>
                <Send size={20} />
              </button>
            </form>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">{comment.avatar}</div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-timestamp">{comment.timestamp}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default RecipeDetailPage
