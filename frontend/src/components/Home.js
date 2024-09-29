import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const cardContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <h2>Welcome, {JSON.parse(localStorage.getItem('user')).name}</h2>
      <div style={cardContainerStyle}>
        <div 
          style={cardStyle} 
          onClick={() => navigate('/create-payment')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <h3>Create Payment</h3>
        </div>
        <div 
          style={cardStyle} 
          onClick={() => navigate('/pay')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <h3>Pay</h3>
        </div>
        <div 
          style={cardStyle} 
          onClick={() => navigate('/my-payments')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <h3>My Payments</h3>
        </div>
      </div>
    </div>
  );
};

export default Home;