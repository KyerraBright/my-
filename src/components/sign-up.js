import React, { useState } from 'react';
import axios from 'axios';
import '../login.css'; // Same CSS file for consistent styling

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for the button

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the form is being submitted

        try {
            const response = await axios.post('http://localhost:80/sign-up', {
                username, password, isAdmin: false // Default user role as false
            });
            setMessage(response.data.message);  // Display success message

        } catch (error) {
            console.error('Signup failed:', error.response?.data.message);
            setMessage('Signup failed. Please try again.');  // Display error message
        } finally {
            setLoading(false); // Set loading to false after request finishes
        }
    };

    return (
        <div className="login-page-container"> {/* Consistent with login page */}
            <div className="login-form-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter a username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter a password"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-login">
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                {message && <div className="error-message">{message}</div>}
            </div>
        </div>
    );
};

export default Signup;
