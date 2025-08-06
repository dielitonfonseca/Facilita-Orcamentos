import React from 'react';
import './App.css';
import Header from './components/Header';
import Autocomplete from './components/Autocomplete';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Autocomplete />
      </main>
    </div>
  );
}

export default App;