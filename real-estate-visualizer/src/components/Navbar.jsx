import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
      <Link to="/visualizations" style={{ margin: '0 10px' }}>Visualizations</Link>
      <Link to="/map" style={{ margin: '0 10px' }}>Map</Link>
      <Link to="/explorer" style={{ margin: '0 10px' }}>Dataset Explorer</Link>
      <Link to="/about" style={{ margin: '0 10px' }}>About</Link>
    </nav>
  );
}

export default Navbar;