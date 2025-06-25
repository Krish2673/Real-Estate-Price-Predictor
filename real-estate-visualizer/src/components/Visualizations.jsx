import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';
import './Visualizations.css';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// -------------------------- PIE CHART --------------------------
function PropertyTypePie({ data }) {
  return (
    <div className="section">
      <h2>Average Price by Property Type</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="Price"
            nameKey="Property_type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// -------------------------- DYNAMIC COMPARISON CHART --------------------------
const availableX = [
  "Size",
  "No_of_BHK",
  "City_name",
  "Property_type",
  "Property_status",
  "is_furnished"
];

const availableY = [
  "Price",
  "Price_per_unit_area"
];

const categoricalFields = [
  "City_name",
  "Property_type",
  "Property_status",
  "is_furnished"
];

function CompareChart() {
  const [xParam, setXParam] = useState("Size");
  const [yParam, setYParam] = useState("Price");
  const [chartData, setChartData] = useState([]);

  const handleCompare = () => {
    fetch('/compare_data.json')
      .then(res => res.json())
      .then(json => {
        const grouped = {};

        json.forEach(item => {
          const key = item[xParam];
          const value = item[yParam];

          if (
            key !== undefined &&
            value !== undefined &&
            !isNaN(value) &&
            (categoricalFields.includes(xParam) || !isNaN(Number(key)))
          ) {
            const groupKey = categoricalFields.includes(xParam) ? String(key) : Number(key);
            if (!grouped[groupKey]) grouped[groupKey] = { total: 0, count: 0 };
            grouped[groupKey].total += value;
            grouped[groupKey].count += 1;
          }
        });

        const formatted = Object.keys(grouped).map(key => ({
          name: key,
          value: grouped[key].total / grouped[key].count
        }));

        if (!categoricalFields.includes(xParam)) {
          formatted.sort((a, b) => a.name - b.name);
        }

        setChartData(formatted.slice(0, 50));
      });
  };

  const isCategorical = categoricalFields.includes(xParam);

  return (
    <div className="section compare-highlight">
      <h2>Compare Parameters</h2>
      <div className="compare-controls">
        <label>Select X-Axis:</label>
        <select value={xParam} onChange={e => setXParam(e.target.value)}>
          {availableX.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <label>Select Y-Axis:</label>
        <select value={yParam} onChange={e => setYParam(e.target.value)}>
          {availableY.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <button onClick={handleCompare}>Compare</button>
      </div>

      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          {isCategorical ? (
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}

// -------------------------- MAIN VISUALIZATION COMPONENT --------------------------
function Visualizations() {
  const [builderData, setBuilderData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [sizePriceData, setSizePriceData] = useState([]);

  useEffect(() => {
    fetch('/top_builders.json')
      .then(res => res.json())
      .then(json => {
        const formatted = json.map(item => ({
          name: item.Builder_name,
          avgPrice: item.Price
        }));
        setBuilderData(formatted);
      });

    fetch('/price_by_type.json')
      .then(res => res.json())
      .then(json => setPropertyTypeData(json));

    fetch('/price_vs_size.json')
      .then(res => res.json())
      .then(json => {
        const formatted = json.map(item => ({
          size: Number(item.Size),
          avgPrice: item.Price
        }));
        setSizePriceData(formatted);
      });
  }, []);

  return (
    <div className="visualizations-container">
      <div className="section">
        <h2>Top 10 Builders by Average Price</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={builderData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgPrice" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <PropertyTypePie data={propertyTypeData} />

      <div className="section">
        <h2>Average Price vs Property Size</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={sizePriceData}>
            <XAxis dataKey="size" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avgPrice" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <CompareChart />
    </div>
  );
}

export default Visualizations;