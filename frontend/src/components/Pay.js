import React, { useState } from 'react';
import { pay, getPaymentDetails } from '../services/api';
import { toast } from 'react-toastify';

const Pay = () => {
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleFetchPayment = async () => {
    try {
      const res = await getPaymentDetails(paymentCode);
      setPaymentDetails(res.data);
      toast.success('Payment details fetched');
    } catch (error) {
      toast.error('Error fetching payment details');
    }
  };

  const handlePayment = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      await pay({ 
        paymentCode, 
        name: userData.name, 
        rollNumber: userData.rollNumber 
      });
      toast.success('Payment Completed!');
      handleFetchPayment();
    } catch (error) {
      console.error('Payment error:', error.response?.data);
      toast.error('Payment failed: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="container">
      <h2>Pay for Payment</h2>
      <input
        type="text"
        placeholder="Enter Payment Code"
        value={paymentCode}
        onChange={(e) => setPaymentCode(e.target.value)}
        required
      />
      <button onClick={handleFetchPayment}>Fetch Payment</button>

      {paymentDetails && (
        <div>
          <h3>Paying for {paymentDetails.name}</h3>
          <p>Amount: ₹{paymentDetails.amount}</p>
          <p>UPI ID: {paymentDetails.upiId}</p>
          <p>Payments Received: {paymentDetails.paidUsers.length}</p>
          <button onClick={handlePayment}>Pay</button>
        </div>
      )}
    </div>
  );
};

export default Pay;

