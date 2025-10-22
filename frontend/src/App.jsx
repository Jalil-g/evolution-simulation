import Spline from '@splinetool/react-spline';
import './App.css';

function App() {
  return (
    <main style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* 3D DNA background */}
      <Spline
        scene="https://prod.spline.design/bLeBntrIRFvpPDsE/scene.splinecode"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Overlay text or simulator */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          zIndex: 1,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: '2rem',
          borderRadius: '1rem',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          DNA Evolution Simulator
        </h1>
        <p>Explore the evolution of alleles across generations 🧬</p>
        <button
          style={{
            marginTop: '1rem',
            background: 'linear-gradient(90deg,#ff00cc,#3333ff)',
            color: 'white',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Start Simulation
        </button>
      </div>
    </main>
  );
}

export default App;
