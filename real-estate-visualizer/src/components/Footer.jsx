import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer upgraded-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} <strong>Real Estate Visualizer</strong></p>
        <div className="footer-links">
          <a href="https://github.com/Krish2673" target="_blank" rel="noreferrer">
            <FaGithub /> GitHub
          </a>
          <a href="www.linkedin.com/in/krish-pawar-2a7787285" target="_blank" rel="noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
