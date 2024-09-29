import React, { useState } from 'react';
import { createPayment } from '../services/api';
import { toast } from 'react-toastify';

const CreatePayment = () => {
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createPayment({ name, upiId, amount, creatorId: localStorage.getItem('userId') });
      toast.success(`Payment Created with Code: ${res.data.paymentCode}`);
    } catch (error) {
      toast.error('Error creating payment');
    }
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
        />
        <button type="submit">Create Payment</button>
      </form>
    </div>
  );
};

export default CreatePayment;
