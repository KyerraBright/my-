import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const DesignTable = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/data')  // to fetch the data from the database
      .then((response) => {
        setDesigns(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading designs...</div>; // when loading the data
  if (error) return <div>Error loading designs!</div>; // if an error occures

  return (
    <div>
      <h1>Designs Gallery</h1>
      <div className="designs-grid">
        {designs.map((row) => (
          <Link 
            key={row._id}  // Unique key for each design card
            to={`/cart`} // Navigate to the cart page when clicked
            className="design-card-link" 
          >
            <div className="design-card">
              <div className="card-image">
                {/* to show the different designs on the card */}
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DesignTable;
