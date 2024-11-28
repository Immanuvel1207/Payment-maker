import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { myPayments, getCreatedPayments } from '../services/api';
import { toast } from 'react-toastify';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [createdPayments, setCreatedPayments] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
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
      setError(error.response?.data?.error || 'An unexpected error occurred');
      toast.error('Error fetching payments');
    }
  };

  const fetchCreatedPayments = async () => {
    try {
      const res = await getCreatedPayments();
      setCreatedPayments(res.data);
    } catch (error) {
      console.error('Error fetching created payments:', error.response?.data || error.message);
      toast.error('Error fetching created payments');
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

  const modalStyle = {
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
  };

  const modalContentStyle = {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
    maxWidth: '500px',
  };

  const closeButtonStyle = {
    color: '#aaa',
    float: 'right',
    fontSize: '28px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>My Payments</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <h3>Payments Made</h3>
      <div style={cardContainerStyle}>
        {payments.map((payment) => (
          <div key={payment._id} style={{...cardStyle, cursor: 'pointer'}} onClick={() => setSelectedPayment(payment)}>
            <h4>{payment.name}</h4>
          </div>
        ))}
      </div>
      {payments.length === 0 && <p style={{ textAlign: 'center' }}>No payments made.</p>}

      {selectedPayment && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <span style={closeButtonStyle} onClick={() => setSelectedPayment(null)}>&times;</span>
            <h2>{selectedPayment.name}</h2>
            <p><strong>Amount:</strong> ₹{selectedPayment.amount}</p>
            <p><strong>Payment Code:</strong> {selectedPayment.paymentCode}</p>
            <p><strong>Status:</strong> {selectedPayment.status || 'Completed'}</p>
            <p><strong>Date:</strong> {new Date(selectedPayment.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <h3>Payments Created</h3>
      <div style={cardContainerStyle}>
        {createdPayments.map((payment) => (
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
        ))}
      </div>
      {createdPayments.length === 0 && <p style={{ textAlign: 'center' }}>No payments created.</p>}
    </div>
  );
};

export default MyPayments;

