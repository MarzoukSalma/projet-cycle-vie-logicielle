
import "../styles/TrendingCard.css"

function TrendingCard({ story, onClick }) {
  const imageUrl = story.imageUrl || story.image || "/placeholder.svg"

  return (
    <div className="trending-card" onClick={onClick}>
      <img src={imageUrl || "/placeholder.svg"} alt={story.title} className="card-image" />
      <div className="card-overlay">
        <h3 className="card-title">{story.title}</h3>
        <p className="card-subtitle">{story.subtitle || story.description}</p>
      </div>
    </div>
  )
}

export default TrendingCard
