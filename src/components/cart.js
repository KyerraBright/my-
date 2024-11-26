import React, { useState, useEffect } from 'react';
import axios from 'axios';
import venmoLogo from '../components/images/venmo_logo.webp';  // Adjust the path to your Venmo logo image

const DesignTable = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/data')  // Backend API to fetch data
      .then((response) => {
        setDesigns(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading designs...</div>;
  if (error) return <div>Error loading designs!</div>;

  return (
    <div>
      <h1>Designs Gallery</h1>
      <div className="designs-grid">
        {designs.map((row) => (
          <div key={row._id} className="design-card">
            <img src={row.image} alt={row.design} />
            <h3>{row.design}</h3>
            <p>{row.color}</p>
            <p>{row.size}</p>
            <p>{row.price}</p>
          </div>
        ))}
      </div>

      {/* Venmo Link */}
      <div className="venmo-link">
        <a 
          href="https://account.venmo.com/u/MaleaMadeIt" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src={venmoLogo} 
            alt="Venmo logo" 
            style={{ width: '50px', height: 'auto', cursor: 'pointer' }} 
          />
        </a>
      </div>
    </div>
  );
};

export default DesignTable;
