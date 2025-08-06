import React, { useState } from 'react';
import './Autocomplete.css';
import pecasData from '../data/pecas.json';

const modelos = Object.keys(pecasData);

function Autocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedModel(null);
    setCopiedCode(null);

    if (value.length > 0) {
      const filteredSuggestions = modelos.filter(modelo =>
        modelo.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (modelo) => {
    setInputValue(modelo);
    setSelectedModel(modelo);
    setSuggestions([]);
  };



  const pecasDoModelo = selectedModel ? pecasData[selectedModel] : null;

  return (
    <div className="autocomplete-container">
      <div className="search-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digite o código"
          className="autocomplete-input"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((modelo, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(modelo)}
              >
                {modelo}
              </li>
            ))}
          </ul>
        )}
      </div>

      {pecasDoModelo && (
        <div className="parts-display">
          <h2>Peças para o modelo: <strong>{selectedModel}</strong></h2>
          <ul className="parts-list">
            {Object.entries(pecasDoModelo).map(([nomePeca, codigoPeca]) => (
              <li key={codigoPeca}>
                <span className="part-name">{nomePeca}</span>
                <div className="part-code-container">
                  <span className="part-code">{codigoPeca}</span>
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Autocomplete;