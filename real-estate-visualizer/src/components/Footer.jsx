import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Real Estate Visualizer • Made with ❤️ by Krish</p>
      <div className="footer-links">
        <a href="https://github.com/Krish2673/Real-Estate-Price-Predictor" target="_blank">GitHub</a>
        <span>•</span>
        <a href="mailto:your.email@example.com">Contact</a>
      </div>
    </footer>
  );
}

export default Footer;
