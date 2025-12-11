import { Search, Bell, Bookmark } from "lucide-react"
import "../styles/Header.css"

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search recipes..." className="search-input" />
        </div>

        <div className="header-actions">
          <button className="icon-btn" title="Notifications">
            <Bell size={24} />
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-btn" title="Bookmarks">
            <Bookmark size={24} />
          </button>
          <button className="profile-btn">
            <img src="/placeholder-user.jpg" alt="Profile" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
