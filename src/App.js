import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import DesignTable from './components/DesignTable';
import Login from './components/login';
import Signup from './components/sign-up';
import Cart from './components/cart';
import DesignForm from './components/DesignForm';



const App = () => {
    return (
        <Router>
            <header>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/designs-table">Inventory</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/cart">Payment</Link></li>
                    <li><Link to="/DesignForm">Add Design</Link></li>  
                </ul>
            </nav>
            </header>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/designs-table" element={<DesignTable />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/DesignForm" element={<DesignForm />} /> 
            </Routes>
            <footer>
                <p> © Malea Made it</p>
            </footer>
        </Router>
    );
};

export default App;