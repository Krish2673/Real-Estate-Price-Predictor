// Home.jsx
import { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [formData, setFormData] = useState({
    Size: '',
    No_of_BHK: '',
    is_RERA_registered: '1',
    is_ready_to_move: '1',
    is_commercial_Listing: '0',
    City_name: '',
    Property_type: '',
    is_furnished: 'Unfurnished',
    Property_status: 'Ready to move',
    Builder_name: '',
    Sub_urban_name: ''
  });

  const [options, setOptions] = useState({
    cities: [],
    types: [],
    builders: [],
    suburbs_by_city: {},
    statuses: [],
    furnishings: [],
    rera: ["1", "0"],
    ready: ["1", "0"],
    commercial: ["1", "0"]
  });

  const [filteredSuburbs, setFilteredSuburbs] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/form_options.json')
      .then(res => res.json())
      .then(data => {
        setOptions(data);
        const allSuburbs = Object.values(data.suburbs_by_city).flat();
        setFilteredSuburbs(allSuburbs);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'City_name') {
      const suburbs = options.suburbs_by_city[value] || [];
      setFilteredSuburbs(suburbs);
      setFormData(prev => ({ ...prev, [name]: value, Sub_urban_name: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictedPrice(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.predicted_price) {
        setPredictedPrice(data.predicted_price);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Unable to connect to the prediction server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h2>Real Estate Price Predictor 🏡</h2>
      <form className="predict-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>City:</label>
          <select name="City_name" value={formData.City_name} onChange={handleChange} required>
            <option value="">Select</option>
            {options.cities.map(city => <option key={city}>{city}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Sub Urban:</label>
          <select name="Sub_urban_name" value={formData.Sub_urban_name} onChange={handleChange} required>
            <option value="">Select</option>
            {filteredSuburbs.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Property Type:</label>
          <select name="Property_type" value={formData.Property_type} onChange={handleChange} required>
            <option value="">Select</option>
            {options.types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>BHK:</label>
          <input type="number" name="No_of_BHK" value={formData.No_of_BHK} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Size (sq ft):</label>
          <input type="number" name="Size" value={formData.Size} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Builder:</label>
          <select name="Builder_name" value={formData.Builder_name} onChange={handleChange} required>
            <option value="">Select</option>
            {options.builders.map(b => <option key={b}>{b}</option>)}
            <option value="Others">Others</option>
          </select>
        </div>

        <div className="form-row">
          <label>Furnishing:</label>
          <select name="is_furnished" value={formData.is_furnished} onChange={handleChange}>
            {options.furnishings.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Status:</label>
          <select name="Property_status" value={formData.Property_status} onChange={handleChange}>
            {options.statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </form>

      {predictedPrice && (
        <div className="prediction-result">
          <h3>Predicted Price: ₹ {predictedPrice.toLocaleString()}</h3>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default Home;