import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Visualizations from './components/Visualizations';
import MapView from './components/MapView';
import DatasetExplorer from './components/DatasetExplorer';
import About from './components/About';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizations" element={<Visualizations />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/explorer" element={<DatasetExplorer />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;