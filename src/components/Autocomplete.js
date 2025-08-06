import React, { useState } from 'react';
import './Autocomplete.css';
import pecasData from '../data/pecas.json';

const modelos = Object.keys(pecasData);

// --- MULTIPLICADORES EDITÁVEIS ---
const MULTIPLICADOR_IMPOSTO = 1.35;
const MULTIPLICADOR_DISPLAY_MONTADO = 1.5;
const MULTIPLICADOR_OPEN_CELL = 1.9;
const MULTIPLICADOR_PLACA_FONTE = 2;
const MULTIPLICADOR_OUTROS = 3;
const MULTIPLICADOR_PLACA_DE_CIRCUITO_IMPRESSO = 1;
const MULTIPLICADOR_COMPONENTE_MECANICO = 3;
// ----------------------------------

function Autocomplete() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [detailedPrice, setDetailedPrice] = useState(null);

  const calculateFinalPrice = (part) => {
    // Adiciona verificação para garantir que 'part' e 'part.VALOR' existam
    if (!part || !part.VALOR) {
      return {
        finalValue: '0.00',
        basePrice: '0.00',
        taxAmount: '0.00',
        multiplierAmount: '0.00',
      };
    }
    
    let basePrice = parseFloat(part.VALOR.replace('R$ ', '').replace(',', '.'));
    
    let totalMultiplier = MULTIPLICADOR_IMPOSTO;
    let extraMultiplierValue = 0;

    switch (part.TIPO) {
      case 'DISPLAY MONTADO':
        totalMultiplier *= MULTIPLICADOR_DISPLAY_MONTADO;
        extraMultiplierValue = basePrice * (MULTIPLICADOR_DISPLAY_MONTADO - 1);
        break;
      case 'OPEN CELL':
        totalMultiplier *= MULTIPLICADOR_OPEN_CELL;
        extraMultiplierValue = basePrice * (MULTIPLICADOR_OPEN_CELL - 1);
        break;
      case 'PLACA FONTE':
        totalMultiplier *= MULTIPLICADOR_PLACA_FONTE;
        extraMultiplierValue = basePrice * (MULTIPLICADOR_PLACA_FONTE - 1);
        break;
      case 'OUTROS':
        totalMultiplier *= MULTIPLICADOR_OUTROS;
        extraMultiplierValue = basePrice * (MULTIPLICADOR_OUTROS - 1);
        break;
      case 'PLACA DE CIRCUITO IMPRESSO':
        totalMultiplier *= MULTIPLICADOR_PLACA_DE_CIRCUITO_IMPRESSO;
        extraMultiplierValue = basePrice * (MULTIPLICADOR_PLACA_DE_CIRCUITO_IMPRESSO - 1);
        break;
      case 'COMPONENTE MECÂNICO':
        totalMultiplier *= MULTIPLICADOR_COMPONENTE_MECANICO;
        extraMultiplierValue = basePrice * (MULTIPLICADOR_COMPONENTE_MECANICO - 1);
        break;
      default:
        break;
    }

    const finalValue = basePrice * totalMultiplier;
    const taxAmount = basePrice * (MULTIPLICADOR_IMPOSTO - 1);
    const multiplierAmount = finalValue - basePrice - taxAmount;

    return {
      finalValue: finalValue.toFixed(2),
      basePrice: basePrice.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      multiplierAmount: multiplierAmount.toFixed(2),
    };
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedModel(null);
    setCopiedCode(null);
    setDetailedPrice(null);
    setClickCount(0);

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
    setDetailedPrice(null);
    setClickCount(0);
  };
  
  const handleCopyClick = (e, part) => {
    // Agora copia o 'selectedModel' diretamente
    const codeToCopy = selectedModel;
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(codeToCopy);
    setClickCount(prevCount => prevCount + 1);

    if (clickCount >= 5) {
      const prices = calculateFinalPrice(part);
      setDetailedPrice({ ...prices, model: selectedModel });
      setClickCount(0);

      setTimeout(() => {
        setDetailedPrice(null);
      }, 5000);
    }
  };

  const selectedPartData = selectedModel ? pecasData[selectedModel] : null;

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

      {selectedPartData && (
        <div className="parts-display">
          <h2>Detalhes da Peça: <strong>{selectedModel}</strong></h2>
          <div className="parts-list">
            <div className="part-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span className="part-type">Tipo: {selectedPartData.TIPO}</span>
              <span className="part-final-price">Valor final: R$ {calculateFinalPrice(selectedPartData).finalValue}</span>
            </div>
            <div className="part-code-container" style={{ textAlign: 'center' }}>
              <button className="copy-button" onClick={(e) => handleCopyClick(e, selectedPartData)}>Detalhes</button>
            </div>
          </div>
        </div>
      )}

      {detailedPrice && (
        <div className="detailed-price-info">
          <h3>Detalhes de Preço para {detailedPrice.model}</h3>
          <p>Valor Original: R$ {detailedPrice.basePrice}</p>
          <p>Valor do Imposto (135%): R$ {detailedPrice.taxAmount}</p>
          <p>Valor dos Multiplicadores: R$ {detailedPrice.multiplierAmount}</p>
          <p>VALOR FINAL: R$ {detailedPrice.finalValue}</p>
        </div>
      )}
    </div>
  );
}

export default Autocomplete;