import React, { useState } from 'react';
import axios from 'axios';

const PayPayment = ({ user, showToast }) => {
    const [code, setCode] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/payments/pay/${code}`, { rollno: user.rollno, name: user.name });
            showToast('Payment Successful');
        } catch (err) {
            showToast('Payment Failed');
        }
    };

    return (
        <div className="container">
            <h2>Pay a Payment</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Payment Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Pay</button>
            </form>
        </div>
    );
};

export default PayPayment;
