import React, { useState } from 'react';
import axios from 'axios';
import "../login.css"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true); // Start loading

        if (!username || !password) {
            setErrorMessage('Please fill in all fields.');
            setLoading(false); // Stop loading
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });

            if (response.data.success) {
                const role = response.data.role;
                if (role === 'admin') {
                    window.location.href = '/DesignForm'; // Adjust path as needed
                } else if (role === 'customer') {
                    window.location.href = '/designs-table'; // Adjust path as needed
                } else {
                    setErrorMessage('Invalid role.');
                }
            } else {
                setErrorMessage(response.data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An unexpected error occurred.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSignUp = () => {
        window.location.href = '/signup'; // Adjust path as needed
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
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
                            placeholder="Enter your password"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-login">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" onClick={handleSignUp} className="btn-signup">
                        Sign Up
                    </button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default Login;