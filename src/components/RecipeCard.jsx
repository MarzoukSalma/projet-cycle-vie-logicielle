

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Share2, Bookmark, Send, ImageIcon, X } from "lucide-react"
import "../styles/RecipeCard.css"

function RecipeCard({ recipe, onToggleLike }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([
    { id: 1, author: "FoodLover", authorId: "food-lover", emoji: "😍", text: "This looks amazing!", image: null },
    { id: 2, author: "ChefJohn", authorId: "chef-john", emoji: "👨‍🍳", text: "Great technique!", image: null },
  ])
  const [newComment, setNewComment] = useState("")
  const [commentImage, setCommentImage] = useState(null)
  const [commentImagePreview, setCommentImagePreview] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCommentImage(file)
      setCommentImagePreview(URL.createObjectURL(file))
    }
  }

  const removeCommentImage = () => {
    setCommentImage(null)
    setCommentImagePreview(null)
  }

  const handleAddComment = () => {
    if (newComment.trim() || commentImage) {
      const comment = {
        id: Date.now(),
        author: "You",
        authorId: "current-user",
        emoji: "😊",
        text: newComment,
        image: commentImagePreview,
      }
      setComments([...comments, comment])
      setNewComment("")
      setCommentImage(null)
      setCommentImagePreview(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <Link to={`/profile/${recipe.authorId || recipe.id}`} className="author-info">
          <span className="author-emoji">{recipe.emoji}</span>
          <div className="author-details">
            <h3 className="author-name">{recipe.author}</h3>
            <p className="recipe-meta">
              {recipe.difficulty} • {recipe.duration}
            </p>
          </div>
        </Link>
      </div>

      <img src={recipe.image || "/placeholder.svg"} alt={recipe.title || "Recipe"} className="recipe-image" />

      <div className="recipe-actions">
        <button className={`action-btn ${recipe.liked ? "liked" : ""}`} onClick={() => onToggleLike(recipe.id)}>
          <Heart size={24} fill={recipe.liked ? "currentColor" : "none"} />
        </button>
        <button className={`action-btn ${showComments ? "active" : ""}`} onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={24} />
          <span className="comment-count">{comments.length}</span>
        </button>
        <button className="action-btn">
          <Share2 size={24} />
        </button>
        <button
          className={`action-btn bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark size={24} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="recipe-info">
        <p className="likes-count">{recipe.likes} likes</p>
        {recipe.title && <h4 className="recipe-title">{recipe.title}</h4>}
        <p className="recipe-description">{recipe.description}</p>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <Link to={`/profile/${comment.authorId}`} className="comment-author">
                  <span className="comment-emoji">{comment.emoji}</span>
                  <span className="comment-name">{comment.author}</span>
                </Link>
                {comment.text && <p className="comment-text">{comment.text}</p>}
                {comment.image && (
                  <img src={comment.image || "/placeholder.svg"} alt="Comment attachment" className="comment-image" />
                )}
              </div>
            ))}
          </div>

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
        </div>
      )}
    </div>
  )
}

export default RecipeCard
