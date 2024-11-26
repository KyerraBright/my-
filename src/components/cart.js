import React, { useEffect, useState } from 'react';
import axios from 'axios';
import venmoLogo from './images/venmo_logo.webp'; // Import the Venmo logo image

const DesignsTable = () => {
    const [designs, setDesigns] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:80/data'); // Update the URL if needed
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
            <h2>We use Venmo for payment. When paying, please add the design, color, size, and address to the description.</h2>

            {/* Container for the grid of cards */}
            <div className="designs-grid">
                {designs.map((row) => (
                    <div key={row.design} className="design-card">
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DesignsTable;