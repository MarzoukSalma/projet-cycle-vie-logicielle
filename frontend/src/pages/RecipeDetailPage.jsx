
import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Clock, Send, ImageIcon, X, Trash2, Edit } from "lucide-react"
import { getRecipeById, likeRecipe, unlikeRecipe, getRecipeTries, createRecipeTry, deleteRecipe, deleteRecipeTry, updateRecipe } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "../styles/RecipeDetail.css"

function RecipeDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { recipeId } = useParams()
  const { user } = useAuth()

  const [recipe, setRecipe] = useState(null)  // ← Toujours null au départ
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)  // ← Toujours true au départ
  const [error, setError] = useState(null)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [commentImage, setCommentImage] = useState(null)
  const [commentImagePreview, setCommentImagePreview] = useState(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // ✅ SOLUTION: TOUJOURS charger les données complètes depuis l'API
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Toujours faire l'appel API pour avoir les données complètes
        const data = await getRecipeById(recipeId)
        
        setRecipe(data)
setIsLiked(data.likedByMe)
setLikes(data.likesCount)


      } catch (err) {
        console.error("❌ Failed to load recipe:", err)
        setError("Failed to load recipe")
      } finally {
        setIsLoading(false)
      }
    }

    if (recipeId) {
      loadRecipe()
    }
  }, [recipeId])  // ← Seulement recipeId dans les dépendances

  // Load comment count on component mount
  useEffect(() => {
    const loadCommentCount = async () => {
      if (recipeId) {
        try {
          const tries = await getRecipeTries(recipeId)
          setComments(tries)
        } catch (error) {
          console.error("Failed to load comment count:", error)
        }
      }
    }
    loadCommentCount()
  }, [recipeId])

  // Load full comments when user clicks to expand
  useEffect(() => {
    const loadFullComments = async () => {
      if (showComments && recipeId) {
        setIsLoadingComments(true)
        try {
          const tries = await getRecipeTries(recipeId)
          setComments(tries)
        } catch (error) {
          console.error("Failed to load comments:", error)
        } finally {
          setIsLoadingComments(false)
        }
      }
    }
    loadFullComments()
  }, [showComments, recipeId])

const handleLike = async () => {
  if (!user) {
    alert("Please log in to like recipes")
    return
  }

  try {
    if (isLiked) {
      const data = await unlikeRecipe(recipeId)

      if (!data.notLikedYet) {
        setIsLiked(false)
        setLikes(data.likesCount)
      }
    } else {
      const data = await likeRecipe(recipeId)

      if (!data.alreadyLiked) {
        setIsLiked(true)
        setLikes(data.likesCount)
      }
    }
  } catch (err) {
    console.error("Failed to toggle like:", err)
  }
}



  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const compressedImage = await compressImage(file)
        setCommentImage(compressedImage)
        setCommentImagePreview(compressedImage)
      } catch (error) {
        console.error("Error processing image:", error)
      }
    }
  }

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6)
          resolve(compressedBase64)
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const removeCommentImage = () => {
    setCommentImage(null)
    setCommentImagePreview(null)
  }

  const handleAddComment = async () => {
    if (!user) {
      alert("Please log in to comment")
      return
    }

    if (newComment.trim() || commentImage) {
      try {
        const commentData = {
          commentText: newComment.trim(),
          imageUrl: commentImage || null,
        }

        const newTry = await createRecipeTry(recipeId, commentData)
        setComments([newTry, ...comments])
        setNewComment("")
        setCommentImage(null)
        setCommentImagePreview(null)
      } catch (error) {
        console.error("Failed to post comment:", error)
        alert("Failed to post comment. Please try again.")
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const handleDelete = async () => {
    if (!user || recipe.userId !== user.id) {
      alert("You can only delete your own recipes")
      return
    }

    if (window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteRecipe(recipeId)
        navigate("/")
      } catch (err) {
        console.error("Failed to delete recipe:", err)
        alert("Failed to delete recipe. Please try again.")
        setIsDeleting(false)
      }
    }
  }

  const handleDeleteComment = async (tryId) => {
  if (!window.confirm("Are you sure you want to delete this comment?")) return

  try {
    await deleteRecipeTry(recipeId, tryId)

    // IMPORTANT: en Sequelize c'est souvent "id", pas "tryId"
    setComments((prev) => prev.filter((c) => c.id !== tryId))
  } catch (err) {
    console.error("Failed to delete comment:", err)
    alert("Failed to delete comment. Please try again.")
  }
  }



  const handleEditRecipe = () => {
    navigate(`/recipe/${recipeId}/edit`, { state: { recipe } })
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
  <img
    src={recipe.user?.avatarUrl || "/placeholder-avatar.svg"}
    alt={recipe.user?.username || "User avatar"}
    className="author-avatar-large"
  />
  <span className="author-name-large">{recipe.user?.username || "Unknown"}</span>
</div>

        </div>
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-detail-actions">
          <button className={`detail-action-btn ${isLiked ? "liked" : ""}`} onClick={handleLike}>
            <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            <span>{likes} likes</span>
          </button>
          <button
            className={`detail-action-btn ${showComments ? "active" : ""}`}
            onClick={() => setShowComments(!showComments)}
          >
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
          {user && recipe.userId === user.id && (
            <>
              <button
                className="detail-action-btn edit-btn"
                onClick={handleEditRecipe}
                title="Edit this recipe"
              >
                <Edit size={24} />
                <span>Edit</span>
              </button>
              <button
                className="detail-action-btn delete-btn"
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete this recipe"
              >
                <Trash2 size={24} />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </button>
            </>
          )}
        </div>

        <div className="recipe-meta-info">
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
              {recipe.RecipeIngredients.map((item, index) => (
                <li key={item.id || index} className="ingredient-item">
                  <span className="ingredient-amount">
                        {item.quantity || "N/A"}    
                  </span>
                  <span className="ingredient-name">
                    {item.Ingredient?.name || "Unknown"}
                 </span>
                   
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
          <div className="comments-section-detail">
            <h3>Comments</h3>
            <div className="comments-list">
              {isLoadingComments ? (
                <p className="loading-comments">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <Link to={`/profile/${comment.user?.id || comment.userId}`} className="comment-author">
                        <img
                          src={comment.user?.avatarUrl || "/placeholder-avatar.svg"}
                          alt={comment.user?.username || "User avatar"}
                          className="comment-avatar"
                        />
                        <span className="comment-name">{comment.user?.username || "Unknown"}</span>
                      </Link>
                      {user && user.id === comment.userId && (
                        <button
                          className="comment-delete-btn"
                          onClick={() => handleDeleteComment(comment.id)}
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {comment.commentText && <p className="comment-text">{comment.commentText}</p>}
                    {comment.imageUrl && (
                      <img
                        src={comment.imageUrl || "/placeholder.svg"}
                        alt="Comment attachment"
                        className="comment-image"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {user ? (
              <div className="add-comment">
                {commentImagePreview && (
                  <div className="comment-image-preview">
                    <img src={commentImagePreview || "/placeholder.svg"} alt="Preview" />
                    <button className="remove-image-btn" onClick={removeCommentImage}>
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="comment-input-row">
                  <label className="image-upload-btn">
                    <ImageIcon size={20} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  </label>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="comment-input"
                  />
                  <button
                    className="send-comment-btn"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() && !commentImage}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                <p>
                  <a href="/login" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                    Log in
                  </a>{" "}
                  to add a comment
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeDetailPage
