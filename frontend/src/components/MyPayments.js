import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myPayments, getCreatedPayments } from '../services/api';
import { toast } from 'react-toastify';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [createdPayments, setCreatedPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
    fetchCreatedPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await myPayments();
      setPayments(res.data);
    } catch (error) {
      console.error('Error fetching payments:', error.response?.data || error.message);
      setError('Error fetching payments. Please try again later.');
      toast.error('Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatedPayments = async () => {
    try {
      const res = await getCreatedPayments();
      setCreatedPayments(res.data);
    } catch (error) {
      console.error('Error fetching created payments:', error.response?.data || error.message);
      setError('Error fetching created payments. Please try again later.');
      toast.error('Error fetching created payments');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };

  const cardContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  const cardStyle = {
    width: 'calc(50% - 10px)',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
  };

  if (loading) {
    return <div style={containerStyle}><p>Loading...</p></div>;
  }

  if (error) {
    return <div style={containerStyle}><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>My Payments</h2>
      
      <h3>Payments Made</h3>
      <div style={cardContainerStyle}>
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment._id} style={cardStyle}>
              <h4>{payment.name}</h4>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Payment Code:</strong> {payment.paymentCode}</p>
              <p><strong>Status:</strong> {payment.status || 'Completed'}</p>
              <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No payments made yet.</p>
        )}
      </div>

      <h3>Payments Created</h3>
      <div style={cardContainerStyle}>
        {createdPayments.length > 0 ? (
          createdPayments.map((payment) => (
            <div key={payment._id} style={cardStyle}>
              <h4>{payment.name}</h4>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Payment Code:</strong> {payment.paymentCode}</p>
              <p><strong>Payments Received:</strong> {payment.paidUsers.length}</p>
              <p><strong>Date Created:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
              <button 
                style={buttonStyle} 
                onClick={() => navigate(`/payment-details/${payment.paymentCode}`)}
              >
                View Paid Users
              </button>
            </div>
          ))
        ) : (
          <p>No payments created yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPayments;
