import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For React Router v6

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // React Router v6 navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);

        if (!username || !password) {
            setErrorMessage('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });

            if (response.data.success) {
                const role = response.data.role;
                if (role === 'admin') {
                    navigate('/DesignForm'); // Redirect to DesignForm for admin
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
            setLoading(false);
        }
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
                    <div
                        className="btn-login"
                        onClick={handleSubmit}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleSubmit(e);
                            }
                        }}
                        style={{
                            cursor: 'pointer',
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '5px',
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default Login;
