import './About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-left">
        <h1>Real Estate Price Visualizer</h1>
        <p className="subtitle">An AI-powered web application for property insights</p>

        <p className="description">
          This project leverages machine learning and interactive visualizations to provide insights into real estate listings across multiple Indian cities. Users can explore pricing trends, compare parameters, and view properties on an interactive map.
        </p>

        <h3>🚀 Tech Stack</h3>
        <ul>
          <li>React.js (Vite + React Router)</li>
          <li>Recharts, Leaflet.js</li>
          <li>Python (Pandas, Scikit-learn, XGBoost)</li>
          <li>Data from Makaan.com via Kaggle</li>
        </ul>

        <h3>🔑 Key Features</h3>
        <ul>
          <li>Interactive visualizations by city, builder, type</li>
          <li>Dynamic parameter comparison</li>
          <li>Live map with filters, clustering, and previews</li>
          <li>Searchable, sortable dataset explorer</li>
        </ul>

        <h3>📎 Credits</h3>
        <ul>
          <li>Dataset: <a href="https://www.kaggle.com/" target="_blank">Kaggle</a></li>
          <li>Icons & map: Leaflet.js, Recharts</li>
        </ul>

        <div className="links">
          <a href="https://github.com/Krish2673/Real-Estate-Price-Predictor" target="_blank">🔗 GitHub</a>
        </div>
      </div>

      <div className="about-right">
        <img src="/house_searching.png" alt="About Illustration" />
      </div>
    </div>
  );
}

export default About;

