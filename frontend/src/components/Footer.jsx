export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-top">
        <div>
          <div className="site-footer-brand">CINEMIFY</div>
          <p className="site-footer-tagline">
            Movies and series, streamed simply. No subscriptions, no paywalls.
          </p>
        </div>
        <div className="site-footer-columns">
          <div className="site-footer-column">
            <h3>Browse</h3>
            <a href="/browse?type=movie">Movies</a>
            <a href="/browse?type=series">Series</a>
            <a href="/my-list">My List</a>
          </div>
          <div className="site-footer-column">
            <h3>Account</h3>
            <a href="/profiles">Profiles</a>
            <a href="/login">Sign In</a>
          </div>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© {year} Cinemify.</span>
        <span>Built for demonstration purposes.</span>
      </div>
    </footer>
  );
}
