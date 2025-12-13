

import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Clock, Send } from "lucide-react"
import { getRecipeById, likeRecipe, unlikeRecipe, getRecipeTries, createRecipeTry } from "../services/api"
import "../styles/RecipeDetail.css"

function RecipeDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { recipeId } = useParams()
  const commentInputRef = useRef(null)

  const [recipe, setRecipe] = useState(location.state?.recipe || null)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(!location.state?.recipe)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRecipe = async () => {
      if (recipe) {
        setIsLiked(recipe.isLiked || false)
        setLikes(recipe.likesCount || 0)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getRecipeById(recipeId)
        setRecipe(data)
        setIsLiked(data.isLiked || false)
        setLikes(data.likesCount || 0)
      } catch (err) {
        console.error("Failed to load recipe:", err)
        setError("Failed to load recipe")
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [recipeId, recipe])

  useEffect(() => {
    const loadComments = async () => {
      if (!showComments || !recipeId) return

      try {
        setIsLoadingComments(true)
        const tries = await getRecipeTries(recipeId)
        // Transform RecipeTries to comment format
        setComments(
          tries.map((tryItem) => ({
            id: tryItem.id,
            author: tryItem.User?.username || "Unknown",
            avatar: tryItem.User?.avatarUrl || "👤",
            text: tryItem.commentText,
            imageUrl: tryItem.imageUrl,
            timestamp: new Date(tryItem.createdAt).toLocaleDateString(),
            userId: tryItem.userId,
          })),
        )
      } catch (err) {
        console.error("Failed to load comments:", err)
      } finally {
        setIsLoadingComments(false)
      }
    }

    loadComments()
  }, [showComments, recipeId])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeRecipe(recipeId)
        setIsLiked(false)
        setLikes(likes - 1)
      } else {
        await likeRecipe(recipeId)
        setIsLiked(true)
        setLikes(likes + 1)
      }
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  const handleCommentClick = () => {
    setShowComments(true)
    setTimeout(() => {
      commentInputRef.current?.focus()
    }, 100)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const newTry = await createRecipeTry(recipeId, {
        commentText: newComment,
      })

      // Add to local state
      const comment = {
        id: newTry.id,
        author: newTry.User?.username || "You",
        avatar: newTry.User?.avatarUrl || "😋",
        text: newTry.commentText,
        imageUrl: newTry.imageUrl,
        timestamp: "Just now",
        userId: newTry.userId,
      }
      setComments([comment, ...comments])
      setNewComment("")
    } catch (err) {
      console.error("Failed to post comment:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="recipe-detail-page">
        <div className="loading-state">Loading recipe...</div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="error-state">{error || "Recipe not found"}</div>
      </div>
    )
  }

  let steps = []
  if (recipe.steps) {
    try {
      steps = JSON.parse(recipe.steps)
    } catch {
      // If not JSON, treat as plain text and split by newlines
      steps = recipe.steps.split("\n").filter((s) => s.trim())
    }
  }

  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)
  const duration =
    totalTime > 0 ? `${totalTime} mins` : recipe.totalTimeMinutes ? `${recipe.totalTimeMinutes} mins` : "N/A"

  return (
    <div className="recipe-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="recipe-detail-header">
        <img src={recipe.imageUrl || "/placeholder.svg"} alt={recipe.title} className="recipe-detail-image" />
        <div className="recipe-detail-overlay">
          <h1 className="recipe-detail-title">{recipe.title}</h1>
          <div className="recipe-detail-author">
            <span className="author-emoji-large">{recipe.User?.avatarUrl || "👤"}</span>
            <span className="author-name-large">{recipe.User?.username || "Unknown"}</span>
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
          {/* TODO: Add difficulty to database schema or remove */}
          <div className="meta-item">
            <Clock size={20} />
            <span>{duration}</span>
          </div>
        </div>

        <section className="recipe-section">
          <h2>Description</h2>
          <p className="recipe-full-description">{recipe.description}</p>
        </section>

        {recipe.RecipeIngredients && recipe.RecipeIngredients.length > 0 && (
          <section className="recipe-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.RecipeIngredients.map((ri) => (
                <li key={ri.id} className="ingredient-item">
                  {ri.quantity && <span className="ingredient-amount">{ri.quantity}</span>}
                  <span className="ingredient-name">{ri.Ingredient?.name || "Unknown"}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {steps.length > 0 && (
          <section className="recipe-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {steps.map((instruction, index) => (
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

            {isLoadingComments ? (
              <div className="loading-state">Loading comments...</div>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {comment.avatar.startsWith("http") ? (
                        <img src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                      ) : (
                        comment.avatar
                      )}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-timestamp">{comment.timestamp}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      {comment.imageUrl && (
                        <img src={comment.imageUrl || "/placeholder.svg"} alt="User's try" className="comment-image" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default RecipeDetailPage
