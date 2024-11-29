import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import DesignTable from './components/DesignTable';
import Login from './components/login';
import Cart from './components/cart';
import DesignForm from './components/DesignForm';

const App = () => {
  return (
    <Router>
      {/* Navigation */}
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/designs-table">Inventory</Link></li>
            <li><Link to="/cart">Payment</Link></li>
          </ul>
        </nav>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designs-table" element={<DesignTable />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/DesignForm" element={<DesignForm />} />
      </Routes>

      {/* Clickable Footer */}
      <footer>
        <Link to="/Login" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p>© Malea Made It</p>
        </Link>
      </footer>
    </Router>
  );
};

export default App;
