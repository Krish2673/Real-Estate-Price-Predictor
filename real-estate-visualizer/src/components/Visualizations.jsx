import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Builder A', avgPrice: 8500 },
  { name: 'Builder B', avgPrice: 7400 },
  { name: 'Builder C', avgPrice: 6900 },
  { name: 'Builder D', avgPrice: 6700 },
  { name: 'Builder E', avgPrice: 6100 },
];

function Visualizations() {
  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      <h2>Top Builders by Average Price</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={sampleData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgPrice" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Visualizations;
