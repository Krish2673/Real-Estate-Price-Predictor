import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🏠 Real Estate Visualizer</div>

      <ul className="navbar-links fancy-menu">
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/visualizations">Visualizations</NavLink></li>
        <li><NavLink to="/map">Map View</NavLink></li>
        <li><NavLink to="/explorer">Explorer</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;