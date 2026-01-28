import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Compass, User, Plus, LogOut, Settings, ChevronDown, MessageCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Sidebar.css"

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleSignOut = () => {
    logout()
    setShowUserMenu(false)
    navigate("/")
  }

  const handleEditProfile = () => {
    setShowUserMenu(false)
    navigate("/edit-profile")
  }

  const handleGoHome = () => {
    setShowUserMenu(false)
    navigate("/")
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* ✅ Logo cliquable -> Home */}
        <button
          type="button"
          className="logo"
          onClick={handleGoHome}
          style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
          aria-label="Go to homepage"
        >
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">RecipeMine</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* ✅ Toujours visibles */}
        <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <Home size={24} />
          <span>Feed</span>
        </Link>

        <Link to="/discover" className={`nav-item ${isActive("/discover") ? "active" : ""}`}>
          <Compass size={24} />
          <span>Discover</span>
        </Link>

        {/* ✅ Visible seulement si connecté */}
        {user && (
          <>
            <Link to="/chat" className={`nav-item ${isActive("/chat") ? "active" : ""}`}>
              <MessageCircle size={24} />
              <span>Chat</span>
            </Link>

            <Link to="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
              <User size={24} />
              <span>Profile</span>
            </Link>
          </>
        )}
      </nav>

      {/* ✅ Partie “Create + menu user” seulement si connecté */}
      {user ? (
        <>
          <Link to="/create-recipe" className="create-recipe-btn">
            <Plus size={20} />
            <span>Create Recipe</span>
          </Link>

          <div className="sidebar-footer">
            <div className="user-menu-container">
              <button
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                type="button"
              >
                <div className="user-menu-info">
                  <img
                    src={user.avatarUrl || "/placeholder-avatar.svg"}
                    alt={user.username || user.name || "User avatar"}
                    className="user-avatar"
                  />
                  <span className="user-name">{user.username || user.name || "User"}</span>
                </div>
                <ChevronDown size={18} className={`chevron ${showUserMenu ? "open" : ""}`} />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <button className="dropdown-item" onClick={handleEditProfile} type="button">
                    <Settings size={18} />
                    <span>Edit Profile</span>
                  </button>

                  <button className="dropdown-item sign-out" onClick={handleSignOut} type="button">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </aside>
  )
}

export default Sidebar
