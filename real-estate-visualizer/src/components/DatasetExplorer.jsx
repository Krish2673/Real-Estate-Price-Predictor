import { useEffect, useState } from 'react';
import './DatasetExplorer.css';

function DatasetExplorer() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    fetch('/explorer_data.json')
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch dataset");
        return res.json();
      })
      .then(json => {
        setData(json);
        console.log("Loaded dataset:", json);
      })
      .catch(err => console.error("Error loading dataset:", err));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const sortedData = [...data].filter((row) =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  return (
    <div className="explorer-page">
      <h2>Dataset Explorer</h2>

      <div className="explorer-controls">
        <input
          type="text"
          placeholder="Search dataset..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <a
          href="/explorer_data.csv"
          download="RealEstate_Dataset.csv"
          className="download-btn"
        >
          ⬇️ Download CSV
        </a>
      </div>

      <div className="table-wrapper">
        {columns.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col} onClick={() => handleSort(col)}>
                    {col}
                    {sortConfig.key === col && (
                      sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading dataset...</p>
        )}

        {data.length > 0 && sortedData.length === 0 && (
          <p>No matching results found.</p>
        )}
      </div>
    </div>
  );
}

export default DatasetExplorer;