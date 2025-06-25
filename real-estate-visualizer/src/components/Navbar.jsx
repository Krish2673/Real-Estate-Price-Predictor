import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <Link to="/visualizations">Visualizations</Link>
      <Link to="/map">Map</Link>
      <Link to="/explorer">Dataset Explorer</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

export default Navbar;
