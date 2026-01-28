import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Heart, MessageCircle, Share2, Bookmark, Send, ImageIcon, X, Trash2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { getRecipeTries, createRecipeTry, deleteRecipeTry, likeRecipe, unlikeRecipe } from "../services/api"

import "../styles/RecipeCard.css"

function RecipeCard({ recipe, onToggleLike }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [commentImage, setCommentImage] = useState(null)
  const [commentImagePreview, setCommentImagePreview] = useState(null)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const [isLikedLocal, setIsLikedLocal] = useState(recipe.likedByMe || false)
  const [likesLocal, setLikesLocal] = useState(recipe.likesCount || 0)

useEffect(() => {
  setIsLikedLocal(recipe.likedByMe || false)
  setLikesLocal(recipe.likesCount || 0)
}, [recipe.likedByMe, recipe.likesCount])


  // Load comment count on component mount
  useEffect(() => {
    const loadCommentCount = async () => {
      if (recipe.id) {
        try {
          const tries = await getRecipeTries(recipe.id)
          setComments(tries)
        } catch (error) {
          console.error("Failed to load comment count:", error)
        }
      }
    }
    loadCommentCount()
  }, [recipe.id])

  // Load full comments when user clicks to expand
  useEffect(() => {
    const loadFullComments = async () => {
      if (showComments && recipe.id) {
        setIsLoadingComments(true)
        try {
          const tries = await getRecipeTries(recipe.id)
          setComments(tries)
        } catch (error) {
          console.error("Failed to load comments:", error)
        } finally {
          setIsLoadingComments(false)
        }
      }
    }
    loadFullComments()
  }, [showComments, recipe.id])
  
  useEffect(() => {
  if (!user) {
    setIsLikedLocal(false)
  }
}, [user])


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

        const newTry = await createRecipeTry(recipe.id, commentData)
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

  const handleDeleteComment = async (tryId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

    try {
      await deleteRecipeTry(recipe.id, tryId)
      setComments((prev) => prev.filter((c) => c.id !== tryId))
    } catch (err) {
      console.error("Failed to delete comment:", err)
      alert("Failed to delete comment. Please try again.")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } })
  }

  const handleProfileClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const userId = recipe.userId || recipe.user?.id || recipe.author?.id
    if (userId) {
      navigate(`/profile/${userId}`)
    }
  }

  // Get user info from either 'user' or 'author' field (handles both API responses)
  const getRecipeUser = () => {
    return recipe.user || recipe.author || {}
  }

  const handleLike = async (e) => {
  e.preventDefault()
  e.stopPropagation()

  if (!user) {
    alert("Please log in to like recipes")
    return
  }

  // ✅ optimistic UI (rouge direct)
  const prevLiked = isLikedLocal
  const prevLikes = likesLocal

  setIsLikedLocal(!prevLiked)
  setLikesLocal(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1)

  try {
    if (prevLiked) {
      const data = await unlikeRecipe(recipe.id)
      // si ton backend renvoie likesCount / likedByMe, synchronise:
      if (typeof data.likesCount === "number") setLikesLocal(data.likesCount)
      if (typeof data.likedByMe === "boolean") setIsLikedLocal(data.likedByMe)
    } else {
      const data = await likeRecipe(recipe.id)
      if (typeof data.likesCount === "number") setLikesLocal(data.likesCount)
      if (typeof data.likedByMe === "boolean") setIsLikedLocal(data.likedByMe)
    }

    // Optionnel: prévenir le parent pour mettre à jour la liste globale
    if (onToggleLike) onToggleLike(recipe.id)
  } catch (err) {
    // rollback si erreur
    setIsLikedLocal(prevLiked)
    setLikesLocal(prevLikes)
    console.error("Failed to toggle like:", err)
  }
}


  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)
  const duration =
    totalTime > 0 ? `${totalTime} mins` : recipe.totalTimeMinutes ? `${recipe.totalTimeMinutes} mins` : "N/A"
  const isLikedDisplayed = user ? isLikedLocal : false

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <div onClick={handleProfileClick} className="author-info" style={{ cursor: "pointer" }}>
          <img
            src={getRecipeUser().avatarUrl || "/placeholder-avatar.svg"}
            alt={getRecipeUser().username || "User avatar"}
            className="author-avatar"
          />
          <div className="author-details">
            <h3 className="author-name">{getRecipeUser().username || "Unknown"}</h3>
            <p className="recipe-meta">
              {recipe.difficulty || "Medium"} • {duration}
            </p>
          </div>
        </div>
      </div>

      <img
        src={recipe.imageUrl || recipe.image || "/placeholder.svg"}
        alt={recipe.title || "Recipe"}
        className="recipe-image"
        onClick={handleRecipeClick}
        style={{ cursor: "pointer" }}
      />

      <div className="recipe-actions">
        <button className={`action-btn ${isLikedDisplayed ? "liked" : ""}`} onClick={handleLike}>
          <Heart size={24} fill={isLikedDisplayed ? "currentColor" : "none"} />
        </button>

        <button className={`action-btn ${showComments ? "active" : ""}`} onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={24} />
          {comments.length > 0 && <span className="comment-count">{comments.length}</span>}
        </button>
        <button className="action-btn">
          <Share2 size={24} />
        </button>
        <button
          className={`action-btn bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsBookmarked(!isBookmarked)
          }}
        >
          <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="recipe-info">
        <p className="likes-count">
            {likesLocal} {likesLocal === 1 ? "like" : "likes"}
        </p>
        {recipe.title && (
          <h4 className="recipe-title" onClick={handleRecipeClick} style={{ cursor: "pointer" }}>
            {recipe.title}
          </h4>
        )}
        <p className="recipe-description">{recipe.description}</p>
      </div>

      {showComments && (
        <div className="comments-section">
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
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeleteComment(comment.id)
                        }}
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
  )
}

export default RecipeCard
