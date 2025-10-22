// src/App.jsx
import { useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import './App.css';

export default function App() {
  const [generations, setGenerations] = useState(20);
  const [selection, setSelection] = useState('neutral');
  const [file, setFile] = useState(null);
  const dropRef = useRef(null);

  const handleFile = (f) => setFile(f);

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
    dropRef.current?.classList.remove('drop-hot');
  };
  const onDragOver = (e) => {
    e.preventDefault();
    dropRef.current?.classList.add('drop-hot');
  };
  const onDragLeave = () => {
    dropRef.current?.classList.remove('drop-hot');
  };

  const handleRun = (e) => {
    e.preventDefault();
    // TODO: hook to backend
    alert(`Run: gens=${generations}, sel=${selection}, file=${file?.name ?? 'none'}`);
  };

  return (
    <>
      {/* BACKGROUND 3D – fixed & non-interactive */}
      <div className="spline-bg" aria-hidden="true">
        <Spline scene="https://prod.spline.design/bLeBntrIRFvpPDsE/scene.splinecode" />
        <div className="bg-overlay" />
        <div className="bg-vignette" />
      </div>

      {/* CONTENT */}
      <main className="shell">
        <header className="hero-copy">
          <h1>
            DNA <span>Evolution</span> Simulator
          </h1>
          <p>Explore how allele frequencies drift, fix, or vanish across generations.</p>
        </header>

        <form className="panel" onSubmit={handleRun}>
          {/* Drag & drop */}
          <div
            ref={dropRef}
            className="dropzone"
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <div className="drop-contents">
              <div className="drop-icon">🧬</div>
              <div>
                <strong>Drop VCF here</strong> or click to browse
                <div className="muted">{file ? file.name : 'VCF / TXT up to ~10MB'}</div>
              </div>
            </div>
            <input
              type="file"
              accept=".vcf,.txt"
              onChange={(e) => handleFile(e.target.files?.[0])}
              aria-label="Upload VCF"
            />
          </div>

          {/* Controls */}
          <div className="grid">
            <label className="field">
              <span>Generations: <b>{generations}</b></span>
              <input
                type="range"
                min={1}
                max={2000}
                value={generations}
                onChange={(e) => setGenerations(Number(e.target.value))}
              />
            </label>

            <label className="field">
              <span>Selection model</span>
              <select
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
              >
                <option value="neutral">Neutral</option>
                <option value="advantageous">SNP42 – Advantageous</option>
                <option value="deleterious">SNP42 – Deleterious</option>
              </select>
            </label>
          </div>

          <button type="submit" className="btn-run">
            Run Simulation
          </button>

          <div className="tiny">
            Tip: Start with 10–50 generations to see drift; increase later for fixation/extinction.
          </div>
        </form>
      </main>
    </>
  );
}
