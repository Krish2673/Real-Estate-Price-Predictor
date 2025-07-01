import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const createColoredIcon = (color) =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=home|${color}`,
    iconSize: [30, 50],
    iconAnchor: [15, 45],
    popupAnchor: [0, -40],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
  });

const FlyToCity = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 11, { duration: 1.2 });
    }
  }, [coords]);
  return null;
};

function MapEvents({ setMapBounds }) {
  const map = useMap();
  useEffect(() => {
    const onMoveEnd = () => {
      const bounds = map.getBounds();
      setMapBounds(bounds);
    };
    map.on('moveend', onMoveEnd);
    return () => map.off('moveend', onMoveEnd);
  }, []);
  return null;
}

function MapView() {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState([23.2599, 77.4126]);
  const [mapType, setMapType] = useState("street");
  const [mapBounds, setMapBounds] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [localitySearch, setLocalitySearch] = useState("");

  useEffect(() => {
    fetch('/map_data.json')
      .then(res => res.json())
      .then(data => {
        setAllProperties(data);
        setFilteredProperties(data);
      });
  }, []);

  const cityOptions = ["All", ...new Set(allProperties.map(p => p.City_name).filter(Boolean))];
  const typeOptions = ["All", ...new Set(allProperties.map(p => p.Property_type).filter(Boolean))];

  const cityCoordinates = {
    "Mumbai": [19.0760, 72.8777],
    "Bengaluru": [12.9716, 77.5946],
    "Delhi": [28.6139, 77.2090],
    "Pune": [18.5204, 73.8567],
    "Hyderabad": [17.3850, 78.4867],
    "Kolkata": [22.5726, 88.3639],
    "Ahmedabad": [23.0225, 72.5714],
    "Chennai": [13.0827, 80.2707]
  };

  const applyFilters = () => {
    let filtered = allProperties;

    if (selectedCity !== "All") {
      filtered = filtered.filter(p => p.City_name === selectedCity);
    }

    if (selectedType !== "All") {
      filtered = filtered.filter(p => p.Property_type === selectedType);
    }

    if (minPrice !== "") {
      filtered = filtered.filter(p => p.Price >= parseFloat(minPrice));
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(p => p.Price <= parseFloat(maxPrice));
    }

    if (localitySearch !== "") {
      filtered = filtered.filter(p =>
        p.Locality_Name?.toLowerCase().includes(localitySearch.toLowerCase())
      );
    }

    setFilteredProperties(filtered);

    if (selectedCity !== "All" && cityCoordinates[selectedCity]) {
      setMapCenter(cityCoordinates[selectedCity]);
    }
  };

  const resetFilters = () => {
    setSelectedCity("All");
    setSelectedType("All");
    setMinPrice("");
    setMaxPrice("");
    setLocalitySearch("");
    setFilteredProperties(allProperties);
    setMapCenter([23.2599, 77.4126]);
    setSelectedProperty(null);
  };

  const getMarkerIcon = (type, price) => {
    if (type === "Apartment") return createColoredIcon("blue");
    if (type === "Independent House") return createColoredIcon("green");
    if (price > 1e7) return createColoredIcon("red");
    return createColoredIcon("orange");
  };

  return (
    <div className="map-page">
      <div className="map-filters">
        <h3>Filter Properties</h3>

        <label>City:
          <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
            {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>

        <label>Type:
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
            {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>

        <label>Min Price:
          <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
        </label>

        <label>Max Price:
          <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
        </label>

        <label>Search Locality:
          <input type="text" value={localitySearch} onChange={e => setLocalitySearch(e.target.value)} />
        </label>

        <label>Map Type:
          <select value={mapType} onChange={e => setMapType(e.target.value)}>
            <option value="street">Street View</option>
            <option value="satellite">Satellite View</option>
          </select>
        </label>

        <button onClick={applyFilters}>Apply Filters</button>
        <button className="reset-btn" onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Sidebar */}
      {selectedProperty && (
        <div className="property-sidebar">
          <h3>{selectedProperty.Property_Name || "Unnamed Property"}</h3>
          <p><strong>Price:</strong> ₹{Number(selectedProperty.Price).toLocaleString()}</p>
          <p><strong>Type:</strong> {selectedProperty.Property_type}</p>
          <p><strong>City:</strong> {selectedProperty.City_name}</p>
          <p><strong>Locality:</strong> {selectedProperty.Locality_Name}</p>
          <button onClick={() => setSelectedProperty(null)}>Close</button>
        </div>
      )}

      <div className="map-container">
        <MapContainer center={mapCenter} zoom={5} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <FlyToCity coords={mapCenter} />
          <MapEvents setMapBounds={setMapBounds} />

          <TileLayer
            attribution='Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye'
            url={
              mapType === "satellite"
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />



          <MarkerClusterGroup chunkedLoading>
            {filteredProperties
              .filter(p => {
                if (!p.Latitude || !p.Longitude || !mapBounds) return false;
                const lat = parseFloat(p.Latitude);
                const lng = parseFloat(p.Longitude);
                return mapBounds.contains([lat, lng]);
              })
              .map((prop, index) => (
                <Marker
                  key={index}
                  position={[prop.Latitude, prop.Longitude]}
                  icon={getMarkerIcon(prop.Property_type, prop.Price)}
                  eventHandlers={{
                    click: () => setSelectedProperty(prop)
                  }}
                >
                  <Popup>
                    ₹{Number(prop.Price).toLocaleString()}<br />
                    {prop.Property_type}, {prop.City_name}<br />
                    {prop.Locality_Name}
                  </Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
