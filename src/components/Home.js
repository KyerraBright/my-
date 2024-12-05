import React from 'react';
import logo from "./images/logomalea.jpg"; //so we can see the logo
import '../App.css'; // so the styling works

const Home = () => { // this is what you see
    return (
        <div>
            <h1>Welcome to </h1>
            <img className='home' src={logo} alt="logo" style={{width:'500px'}}></img><br/><br/>
            <h1>Malea Made it!</h1>
        </div>
    );
};

export default Home;