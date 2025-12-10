import BlogList from "../components/blogs/BlogList"
import "./Home.css"

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to BlogHub</h1>
        <p>Discover stories, thinking, and expertise from writers on any topic.</p>
      </div>

      <BlogList />
    </div>
  )
}

export default Home

