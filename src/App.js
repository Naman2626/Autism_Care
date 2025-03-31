import React, { useState } from 'react';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBehaviors, setSelectedBehaviors] = useState(new Array(31).fill(0));

  // Update the API URL constant
  const API_URL = 'https://autism-care.onrender.com/predict';

  const behaviors = [
    'Limited or Inconsistent Eye Contact',
    'Difficulty with Joint Attention',
    'Reduced Social Smiling',
    'Unusual Sensory Interests',
    'Delayed Speech/Babbling',
    'Difficulty with Peer Interaction',
    'Hypersensitivity to Sound',
    'Walking on Toes',
    'Monotone Voice',
    'Avoids Physical Contact',
    'Poor Response to Name',
    'Limited Imitation Skills',
    'Repetitive Movements',
    'Limited Use of Gestures',
    'Limited Pretend Play',
    'Strong Adherence to Routine',
    'Limited Facial Expressions',
    'Unusual Response to Pain',
    'Echolalia (Repeating Words/Phrases)',
    'Unusual Eating Habits',
    'Delayed Motor Skills',
    'Sensory Sensitivity',
    'Difficulty with Change',
    'Repetitive Play',
    'Language Delay',
    'Social Isolation',
    'Unusual Body Movements',
    'Difficulty with Transitions',
    'Limited Interest in Others',
    'Unusual Voice Pattern',
    'Resistance to Physical Contact'
  ];

  const handleCheckboxChange = (index) => {
    setSelectedBehaviors(prevBehaviors => {
      const newBehaviors = [...prevBehaviors];
      newBehaviors[index] = newBehaviors[index] === 1 ? 0 : 1;
      console.log('Updated behaviors:', newBehaviors);
      return newBehaviors;
    });
  };

  const handlePredict = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure we have exactly 31 features
      const features = selectedBehaviors.slice(0, 31);
      
      console.log('Making prediction request:', {
        url: API_URL,
        features: features
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add CORS headers
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          features: features
        })
      });

      // Log full response for debugging
      console.log('Full response:', response);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      if (data.prediction && data.autism_probability) {
        setPrediction(data.prediction);
        setProbability(data.autism_probability);
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Prediction error:', error);
      setError(`Failed to get prediction: ${error.message}`);
      setPrediction(null);
      setProbability(null);
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: new Array(31).fill(0)
        })
      });
      
      const data = await response.json();
      console.log('Test prediction response:', data);
      alert('API test successful: ' + JSON.stringify(data));
    } catch (error) {
      console.error('API test failed:', error);
      alert('API test failed: ' + error.message);
    }
  };

  // Add this new function for testing base API connection
  const testConnection = async () => {
    try {
      const response = await fetch('https://autism-care.onrender.com/');
      const data = await response.json();
      console.log('API connection test:', data);
      alert('API Connection successful: ' + JSON.stringify(data));
    } catch (error) {
      console.error('API connection failed:', error);
      alert('API Connection failed: ' + error.message);
    }
  };

  // Update the test function to include better error handling
  const testSimplePrediction = async () => {
    try {
      const testFeatures = new Array(31).fill(0);
      testFeatures[0] = 1;

      console.log('Testing prediction with features:', testFeatures);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          features: testFeatures
        })
      });

      console.log('Test response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Test failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Test successful:', data);
      alert(`Test prediction result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Test error:', error);
      alert(`Test failed: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Behavioral Assessment</h1>
      
      <div className="test-buttons">
        <button onClick={testConnection} className="test-button">
          Test API Connection
        </button>
        <button onClick={testSimplePrediction} className="test-button">
          Test Simple Prediction
        </button>
      </div>
      
      <div className="assessment-form">
        <p>Please check all behaviors that you have observed</p>
        
        <div className="behaviors-grid">
          {behaviors.map((behavior, index) => (
            <label key={index} className="behavior-item">
              <input
                type="checkbox"
                checked={selectedBehaviors[index] === 1}
                onChange={() => handleCheckboxChange(index)}
              />
              <span>{behavior}</span>
            </label>
          ))}
        </div>

        <button 
          onClick={handlePredict} 
          disabled={loading}
          className="predict-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Behaviors'}
        </button>
      </div>
      
      {loading && (
        <div className="loading">
          <p>Analyzing behaviors...</p>
        </div>
      )}
      
      {!loading && prediction && (
        <div className="result">
          <h2>Assessment Result:</h2>
          <p><strong>Prediction:</strong> {prediction}</p>
          <p><strong>Probability:</strong> {probability}</p>
        </div>
      )}
      
      {!loading && error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App; 