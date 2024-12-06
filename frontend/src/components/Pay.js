import React, { useState } from 'react';
import { pay, getPaymentDetails, verifyPayment } from '../services/api';
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
      console.error('Error fetching payment details:', error);
      toast.error('Error fetching payment details: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handlePayment = async () => {
    try {
      const res = await pay({ paymentCode });
      
      const options = {
        key: res.data.razorpayKeyId,
        amount: res.data.amount,
        currency: "INR",
        name: "Payment System",
        description: "Payment for " + paymentDetails.name,
        order_id: res.data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              ...response,
              paymentCode,
            });
            toast.success(verifyRes.data.message);
            handleFetchPayment(); // Refresh payment details
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed: ' + (error.response?.data?.error || 'Unknown error'));
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem('user')).name,
          email: JSON.parse(localStorage.getItem('user')).email,
        },
        notes: {
          address: paymentDetails.upiId
        },
        theme: {
          color: "#3399cc"
        }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed: ' + (error.response?.data?.error || 'Unknown error'));
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
          <button onClick={handlePayment}>Pay with Razorpay</button>
        </div>
      )}
    </div>
  );
};

export default Pay;

