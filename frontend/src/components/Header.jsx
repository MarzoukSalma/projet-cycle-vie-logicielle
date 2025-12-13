
import { Bell, Bookmark } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/Header.css"

function Header() {
  const { user } = useAuth()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-actions">
          {user ? (
            <>
              <button className="icon-btn" title="Notifications">
                <Bell size={24} />
                <span className="notification-badge">3</span>
              </button>
              <button className="icon-btn" title="Bookmarks">
                <Bookmark size={24} />
              </button>
              <Link to="/profile" className="profile-btn">
                <img src="/diverse-user-avatars.png" alt="Profile" />
              </Link>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="header-link">
                Login
              </Link>
              <Link to="/register" className="header-register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
