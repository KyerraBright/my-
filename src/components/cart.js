import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import venmoLogo from '../components/images/venmo_logo.webp';  // venmo link

const DesignTable = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/data')  // get data from the database
      .then((response) => {
        setDesigns(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading designs...</div>; // for when the design is loading
  if (error) return <div>Error loading designs!</div>; // for when there is an error loading design

  return (
    <div>
      <h1>Designs Gallery</h1>
      <div className="designs-grid">
        {/* Iterate over the designs array to create design cards */}
        {designs.map((row) => (
          <div key={row._id} className="design-card">
            <Link 
              to={`/cart`} // Navigate to the cart page when clicked
              className="design-card-link" // Optional: Add a class for styling the link
            >
              <div className="card-image">
                {/* Ensure image source is valid */}
                <img 
                  src={`http://localhost:5000${row.image}`} 
                  alt={row.design} 
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                />
              </div>
              <div className="card-details">
                <h3>{row.design}</h3>
                <p><strong>Color:</strong> {row.color}</p>
                <p><strong>Size:</strong> {row.size}</p>
                <p><strong>Price:</strong> ${row.price}</p>
              </div>
            </Link>

            {/* Venmo Button for each card */}
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
        ))}
      </div>
    </div>
  );
};

export default DesignTable;
