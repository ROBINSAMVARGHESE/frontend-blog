import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>BlogHub</h3>
            <p>BlogHub is a community-driven platform where writers, thinkers, and creators can share their ideas, experiences, and stories with a wide audience. Whether you're a seasoned blogger or just getting started, BlogHub provides the tools to express yourself and connect with others.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/blogs/create">Write</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/register">Sign Up</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
  <h4>Contact</h4>
  <p>Email: <a href="robinsamvarghese@gmail.com">robinsamvarghese@gmail.com</a></p>
  <p>Phone: <a href="tel:+91-12345678910">+91-12345678910</a></p>
</div>

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ROBIN SAM VARGHESE BlogHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

