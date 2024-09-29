import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Welcome, {localStorage.getItem('name')}</h2>
      <div className="card-container">
        <div className="card" onClick={() => navigate('/create-payment')}>
          <h3>Create Payment</h3>
        </div>
        <div className="card" onClick={() => navigate('/pay')}>
          <h3>Pay</h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
