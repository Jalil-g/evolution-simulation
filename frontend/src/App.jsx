// src/App.jsx
import { useState } from 'react';
import Spline from '@splinetool/react-spline';
import './App.css';

export default function App() {
  const [generations, setGenerations] = useState(10);
  const [selection, setSelection] = useState('neutral');
  const [file, setFile] = useState(null);

  const handleRun = (e) => {
    e.preventDefault();
    // TODO: call your backend /simulate endpoint with FormData
    // const form = new FormData();
    // form.append('file', file);
    // form.append('generations', generations);
    // form.append('selection', selection);
    // await fetch('http://127.0.0.1:8000/simulate', { method: 'POST', body: form });
    alert('Simulation submitted (wire this to your backend)');
  };

  return (
    <>
      {/* FULLSCREEN, NON-INTERACTIVE 3D BACKGROUND */}
      <div className="spline-bg" aria-hidden="true">
        <Spline
          scene="https://prod.spline.design/bLeBntrIRFvpPDsE/scene.splinecode"
        />
      </div>

      {/* FOREGROUND UI */}
      <main className="hero">
        <header className="title">
          <h1>DNA Evolution Simulator</h1>
          <p>Explore how allele frequencies change across generations 🧬</p>
        </header>

        <form className="panel" onSubmit={handleRun}>
          <label className="field">
            <span>Upload VCF file</span>
            <input
              type="file"
              accept=".vcf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <label className="field">
            <span>Generations</span>
            <input
              type="number"
              min={1}
              max={5000}
              value={generations}
              onChange={(e) => setGenerations(Number(e.target.value))}
            />
          </label>

          <label className="field">
            <span>Selection type</span>
            <select
              value={selection}
              onChange={(e) => setSelection(e.target.value)}
            >
              <option value="neutral">Neutral</option>
              <option value="advantageous">SNP42 – Advantageous</option>
              <option value="deleterious">SNP42 – Deleterious</option>
            </select>
          </label>

          <button type="submit" className="btn-run">Run Simulation</button>
        </form>
      </main>
    </>
  );
}
