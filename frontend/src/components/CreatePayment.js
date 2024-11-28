import React, { useState } from 'react';
import { createPayment } from '../services/api';
import { toast } from 'react-toastify';

const CreatePayment = () => {
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentCode, setPaymentCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createPayment({ 
        name, 
        upiId, 
        amount: parseFloat(amount), 
        creatorId: localStorage.getItem('userId') 
      });
      setPaymentCode(res.data.paymentCode);
      toast.success('Payment Created Successfully');
      // Clear form fields after successful creation
      setName('');
      setUpiId('');
      setAmount('');
    } catch (error) {
      console.error('Error creating payment:', error.response?.data);
      toast.error(`Error creating payment: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentCode).then(() => {
      toast.success('Payment Code copied to clipboard');
    }, (err) => {
      toast.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="container">
      <h2>Create Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="UPI ID"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <button type="submit">Create Payment</button>
      </form>
      {paymentCode && (
        <div className="payment-code">
          <p>Payment Code: <span onClick={copyToClipboard} style={{cursor: 'pointer', textDecoration: 'underline'}}>{paymentCode}</span></p>
          <small>(Click to copy)</small>
        </div>
      )}
    </div>
  );
};

export default CreatePayment;
