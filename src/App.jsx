import React from 'react';
import './App.css';
import Header from './components/Header';
import PredictionBoard from './components/PredictionBoard';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <PredictionBoard />
      </main>
    </div>
  );
}

export default App;