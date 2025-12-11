import { Link, useLocation } from "react-router-dom"
import { Home, Compass, User, Plus } from "lucide-react"
import "../styles/Sidebar.css"

function Sidebar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">RecipeShare</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
          <Home size={24} />
          <span>Feed</span>
        </Link>
        <Link to="/discover" className={`nav-item ${isActive("/discover") ? "active" : ""}`}>
          <Compass size={24} />
          <span>Discover</span>
        </Link>
        <Link to="/profile" className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
          <User size={24} />
          <span>Profile</span>
        </Link>
      </nav>

      <button className="create-recipe-btn">
        <Plus size={20} />
        <span>Create Recipe</span>
      </button>

      <div className="sidebar-footer">
        <button className="sign-out-btn">Sign Out</button>
      </div>
    </aside>
  )
}

export default Sidebar
