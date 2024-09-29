import React, { useState, useEffect } from 'react';
import { myPayments } from '../services/api';
import { toast } from 'react-toastify';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await myPayments();
      console.log('Payments response:', res.data);
      setPayments(res.data);
    } catch (error) {
      console.error('Error fetching payments:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred');
      toast.error('Error fetching payments');
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

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>My Payments</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <div style={cardContainerStyle}>
        {payments.map((payment) => (
          <div key={payment._id} style={cardStyle}>
            <h3>{payment.name}</h3>
            <p><strong>Amount:</strong> ₹{payment.amount}</p>
            <p><strong>Payment Code:</strong> {payment.paymentCode}</p>
            <p><strong>Status:</strong> {payment.status || 'Completed'}</p>
            <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
        </div>
        {payments.length === 0 && !error && <p style={{ textAlign: 'center' }}>No payments found.</p>}
      </div>
    );
  };
  
  export default MyPayments;