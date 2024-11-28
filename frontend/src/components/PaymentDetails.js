import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaymentDetails } from '../services/api';
import { toast } from 'react-toastify';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thTdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
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

const PaymentDetails = () => {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const { paymentCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaymentDetails();
  }, [paymentCode]);

  const fetchPaymentDetails = async () => {
    try {
      const res = await getPaymentDetails(paymentCode);
      setPayment(res.data);
    } catch (error) {
      console.error('Error fetching payment details:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'An unexpected error occurred');
      toast.error('Error fetching payment details');
    }
  };

  if (error) {
    return <div style={containerStyle}><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;
  }

  if (!payment) {
    return <div style={containerStyle}><p>Loading...</p></div>;
  }

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => navigate('/my-payments')}>Back to My Payments</button>
      <h2>{payment.name} - Payment Details</h2>
      <p><strong>Amount:</strong> ₹{payment.amount}</p>
      <p><strong>Payment Code:</strong> {payment.paymentCode}</p>
      <p><strong>Total Payments Received:</strong> {payment.paidUsers.length}</p>
      <h3>Paid Users</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Name</th>
            <th style={thTdStyle}>Roll Number</th>
            <th style={thTdStyle}>Amount</th>
            <th style={thTdStyle}>Time</th>
          </tr>
        </thead>
        <tbody>
          {payment.paidUsers.map((user, index) => (
            <tr key={index}>
              <td style={thTdStyle}>{user.name}</td>
              <td style={thTdStyle}>{user.rollNumber}</td>
              <td style={thTdStyle}>₹{user.amount}</td>
              <td style={thTdStyle}>{new Date(user.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentDetails;

