import React, { useState } from 'react';
import { pay } from '../services/api';
import { toast } from 'react-toastify';

const Pay = () => {
  const [paymentCode, setPaymentCode] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleFetchPayment = async () => {
    try {
      const res = await pay({ paymentCode });
      setPaymentDetails(res.data);
      toast.success('Payment details fetched');
    } catch (error) {
      toast.error('Error fetching payment details');
    }
  };

  const handlePayment = async () => {
    // Razorpay Payment integration would go here
    // For now, assuming it's successful
    toast.success('Payment Completed!');
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
          <button onClick={handlePayment}>Pay</button>
        </div>
      )}
    </div>
  );
};

export default Pay;
