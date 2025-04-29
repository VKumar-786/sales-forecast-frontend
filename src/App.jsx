import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [chart, setChart] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://your-api-url/upload-and-forecast", formData);
      setMetrics(res.data.metrics);
      setChart(res.data.chart_base64);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Sales Forecast Dashboard</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Forecast"}
      </button>
      {error && <p>{error}</p>}
      {metrics && (
        <div>
          {Object.entries(metrics).map(([model, vals]) => (
            <div key={model}>
              <h2>{model}</h2>
              <p>RMSE: {vals.RMSE.toFixed(2)}</p>
              <p>R²: {vals.R2.toFixed(2)}</p>
              <p>Accuracy: {vals.Accuracy.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      )}
      {chart && <img src={`data:image/png;base64,${chart}`} alt="Chart" />}
    </div>
  );
}