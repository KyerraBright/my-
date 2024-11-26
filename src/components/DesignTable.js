import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const DesignsTable = () => {
    const [designs, setDesigns] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:80/data', {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`, // or sessionStorage, depending on your setup
                    }
                  });
                  
                // Update the URL if needed
                setDesigns(response.data);
            } catch (err) {
                setError(err);
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading designs...</div>;
    if (error) return <div>Error loading designs!</div>;

    return (
        <div>
            <h1>Designs Gallery</h1>

            {/* Container for the grid of cards */}
            <div className="designs-grid">
                {designs.map((row) => (
                    <Link 
                        key={row.design} 
                        to={`/cart`} // Navigate to the cart page when clicked
                        className="design-card-link" // Optional: Add a class for styling the link
                    >
                        <div className="design-card">
                            <div className="card-image">
                                <img 
                                    src={row.image} 
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

export default DesignsTable;