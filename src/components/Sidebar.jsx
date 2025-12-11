import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Compass, User, Plus } from "lucide-react"
import "../styles/Sidebar.css"

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const handleSignOut = () => {
    navigate("/login")
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">RecipeMine</span>
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

      <Link to="/create-recipe" className="create-recipe-btn">
        <Plus size={20} />
        <span>Create Recipe</span>
      </Link>

      <div className="sidebar-footer">
        <button className="sign-out-btn" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
