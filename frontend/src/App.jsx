import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [generations, setGenerations] = useState(10);
  const [selection, setSelection] = useState("neutral");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a VCF file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("generations", generations);
    formData.append("selection", selection);

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/simulate_file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Simulation failed!");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🧬 DNA Evolution Simulator</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div>
          <label>Upload VCF File:</label><br />
          <input type="file" accept=".vcf" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Generations:</label><br />
          <input
            type="number"
            value={generations}
            onChange={(e) => setGenerations(e.target.value)}
            min="1"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Selection Type:</label><br />
          <select value={selection} onChange={(e) => setSelection(e.target.value)}>
            <option value="neutral">Neutral</option>
            <option value="beneficial">Beneficial</option>
            <option value="deleterious">Deleterious</option>
          </select>
        </div>

        <button
          type="submit"
          style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          {loading ? "Simulating..." : "Run Simulation"}
        </button>
      </form>

      {result && (
        <div>
          <h2>Simulation Results</h2>
          <p><strong>File:</strong> {result.file}</p>
          <p><strong>Model:</strong> {result.selection_model}</p>
          <p><strong>Generations:</strong> {result.generations}</p>
          <p><strong>Mean Allele Frequency:</strong> {result.mean_frequency.toFixed(4)}</p>

          <h3>Allele Frequencies:</h3>
          <pre style={{
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "6px",
            maxHeight: "200px",
            overflowY: "scroll"
          }}>
            {JSON.stringify(result.final_frequencies, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
