

import "../styles/TrendingCard.css"

function TrendingCard({ story, onClick }) {
  return (
    <div className="trending-card" onClick={onClick}>
      <img src={story.image || "/placeholder.svg"} alt={story.title} className="card-image" />
      <div className="card-overlay">
        <h3 className="card-title">{story.title}</h3>
        <p className="card-subtitle">{story.subtitle}</p>
      </div>
    </div>
  )
}

export default TrendingCard
