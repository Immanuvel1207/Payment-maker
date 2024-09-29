import React, { useEffect, useState } from 'react';
import { myPayments } from '../services/api';
import { toast } from 'react-toastify';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);

  // Fetch the user's payments on component load
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await myPayments();
        setPayments(res.data);
      } catch (error) {
        toast.error('Error fetching payments');
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container">
      <h2>My Payments</h2>
      {payments.length > 0 ? (
        <div className="payment-list">
          {payments.map((payment) => (
            <div className="payment-card" key={payment._id}>
              <h3>{payment.name}</h3>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Status:</strong> {payment.isPaid ? 'Paid' : 'Unpaid'}</p>
              <p><strong>Payment Code:</strong> {payment.paymentCode}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default MyPayments;
