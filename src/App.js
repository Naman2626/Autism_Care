import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValues, setInputValues] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Replace this URL with your deployed API URL
  const API_URL = 'https://your-api-domain.onrender.com/predict';

  const handlePredict = async () => {
    try {
      setLoading(true);
      console.log('Starting prediction...');

      const values = inputValues.split(',').map(val => parseFloat(val.trim()));
      console.log('Parsed values:', values);
      
      if (values.length !== 31) {
        throw new Error('Please enter exactly 31 values (0s and 1s)');
      }

      if (!values.every(val => val === 0 || val === 1)) {
        throw new Error('Please enter only 0s and 1s');
      }
      
      const requestBody = { features: values };
      console.log('Sending request:', requestBody);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const data = await response.json();
      console.log('Received data:', data);

      setPrediction(data.prediction);
      setProbability(data.autism_probability);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error making prediction. Please check your input format and try again.');
      setPrediction(null);
      setProbability(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Autism Prediction</h1>
      <div className="input-container">
        <textarea
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          placeholder="Enter 31 values (0s and 1s) separated by commas&#13;&#10;Example: 1,0,1,1,0,0,0,0,0,0,1,0,1,1,1,0,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0"
          rows={4}
        />
        <button 
          onClick={handlePredict} 
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </div>
      
      {prediction && (
        <div className="result">
          <h2>Prediction Result:</h2>
          <p>Result: {prediction}</p>
          <p>Probability: {probability}</p>
        </div>
      )}
      
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App; 